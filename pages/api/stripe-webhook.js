import { buffer } from 'micro';
import Stripe from 'stripe';
import { supabase } from '../../lib/supabase';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Disable body parsing, we need the raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // Get the raw body for Stripe signature verification
    const rawBody = await buffer(req);
    const signature = req.headers['stripe-signature'];
    
    // Verify the event came from Stripe
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody.toString(),
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
}

/**
 * Handle checkout session completed event
 * @param {Object} session - Stripe checkout session object
 */
async function handleCheckoutSessionCompleted(session) {
  try {
    // Get the registration ID from the client_reference_id
    let registrationId = session.client_reference_id;
    
    // For Stripe Buy Button, we might not have a registration ID yet
    if (!registrationId) {
      console.log('No registration ID in session, creating new registration record');
      
      // Get customer information from the session
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name;
      
      if (!customerEmail) {
        console.error('No customer email in session');
        return;
      }
      
      // Try to get event ID from various sources
      let eventId;
      
      // First check client_reference_id (this is where we pass the event ID)
      if (session.client_reference_id) {
        eventId = session.client_reference_id;
        console.log(`Found event ID ${eventId} in client_reference_id`);
      }
      // Then check metadata as fallback
      else if (session.metadata?.event_id) {
        eventId = session.metadata.event_id;
        console.log(`Found event ID ${eventId} in metadata`);
      }
      
      if (!eventId) {
        console.warn('No event ID found in session, using default event ID 1');
        eventId = 1; // Default fallback
      }
      
      // Create a new registration record
      try {
        const { data, error } = await supabase
          .from('registrations')
          .insert([{
            event_id: eventId,
            name: customerName || 'Unknown',
            email: customerEmail,
            stripe_session_id: session.id,
            stripe_payment_id: session.payment_intent,
            amount_paid: session.amount_total / 100, // Convert from cents to dollars
            payment_status: 'completed',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select();
        
        if (error) {
          console.error('Error creating registration:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          registrationId = data[0].id;
          console.log(`Created new registration ${registrationId} for session ${session.id}`);
        }
      } catch {
        // Try event_registrations table as fallback
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('event_registrations')
          .insert([{
            event_id: eventId,
            name: customerName || 'Unknown',
            email: customerEmail,
            stripe_session_id: session.id,
            stripe_payment_id: session.payment_intent,
            amount_paid: session.amount_total / 100,
            payment_status: 'completed',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select();
        
        if (fallbackError) {
          console.error('Error creating event_registration:', fallbackError);
          throw fallbackError;
        }
        
        if (fallbackData && fallbackData.length > 0) {
          registrationId = fallbackData[0].id;
          console.log(`Created new event_registration ${registrationId} for session ${session.id}`);
        }
      }
    } else {
      // Update the existing registration with the payment information
      await updateRegistration(registrationId, {
        stripe_session_id: session.id,
        stripe_payment_id: session.payment_intent,
        amount_paid: session.amount_total / 100, // Convert from cents to dollars
        payment_status: 'completed',
        updated_at: new Date().toISOString()
      });
      
      console.log(`Updated registration ${registrationId} for session ${session.id}`);
    }
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

/**
 * Handle payment intent succeeded event
 * @param {Object} paymentIntent - Stripe payment intent object
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    const { metadata } = paymentIntent;
    
    if (!metadata || !metadata.registrationId) {
      console.error('No registration ID in payment intent metadata');
      return;
    }

    const registrationId = metadata.registrationId;
    
    // Update the registration with the payment information
    await updateRegistration(registrationId, {
      stripe_payment_id: paymentIntent.id,
      amount_paid: paymentIntent.amount / 100, // Convert from cents to dollars
      payment_status: 'completed',
      updated_at: new Date().toISOString()
    });
    
    console.log(`Payment intent ${paymentIntent.id} succeeded for registration ${registrationId}`);
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

/**
 * Handle payment intent failed event
 * @param {Object} paymentIntent - Stripe payment intent object
 */
async function handlePaymentIntentFailed(paymentIntent) {
  try {
    const { metadata } = paymentIntent;
    
    if (!metadata || !metadata.registrationId) {
      console.error('No registration ID in payment intent metadata');
      return;
    }

    const registrationId = metadata.registrationId;
    
    // Update the registration with the payment failure information
    await updateRegistration(registrationId, {
      stripe_payment_id: paymentIntent.id,
      payment_status: 'failed',
      payment_error: paymentIntent.last_payment_error?.message || 'Payment failed',
      updated_at: new Date().toISOString()
    });
    
    console.log(`Payment intent ${paymentIntent.id} failed for registration ${registrationId}`);
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}

/**
 * Update a registration with the given data
 * @param {string} registrationId - The registration ID
 * @param {Object} updateData - The data to update
 */
async function updateRegistration(registrationId, updateData) {
  // Try to update in registrations table first
  try {
    const { error } = await supabase
      .from('registrations')
      .update(updateData)
      .eq('id', registrationId);
    
    if (error) {
      if (error.code === '42P01') {
        // Table doesn't exist, try event_registrations
        throw error;
      } else {
        console.error('Error updating registration:', error);
        throw error;
      }
    }
  } catch {
    // Fallback to event_registrations table
    try {
      const { error: fallbackError } = await supabase
        .from('event_registrations')
        .update(updateData)
        .eq('id', registrationId);
      
      if (fallbackError) {
        console.error('Error updating event_registration:', fallbackError);
        throw fallbackError;
      }
    } catch (fallbackError) {
      console.error('Error in fallback update:', fallbackError);
      throw fallbackError;
    }
  }
}