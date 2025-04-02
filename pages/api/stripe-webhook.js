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
    
    console.log('Received Stripe webhook with signature:', signature ? 'present' : 'missing');
    
    // Verify the event came from Stripe
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody.toString(),
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log('Webhook signature verified successfully for event type:', event.type);
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Processing checkout.session.completed event:', event.data.object.id);
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'payment_intent.succeeded':
        console.log('Processing payment_intent.succeeded event:', event.data.object.id);
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        console.log('Processing payment_intent.payment_failed event:', event.data.object.id);
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
    console.log('=== HANDLING CHECKOUT SESSION COMPLETED ===');
    console.log('Session ID:', session.id);
    console.log('Payment status:', session.payment_status);
    console.log('Customer email:', session.customer_details?.email);
    console.log('Amount total:', session.amount_total);
    console.log('Client reference ID:', session.client_reference_id);
    console.log('Metadata:', JSON.stringify(session.metadata || {}));
    
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
        // First, try to find a user with the customer's email
        console.log(`Looking for user with email: ${customerEmail}`);
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, auth_user_id')
          .eq('email', customerEmail)
          .maybeSingle();
        
        // Get auth_user_id from user data if available
        const auth_user_id = userData?.auth_user_id || null;
        
        if (userError) {
          console.error('Error finding user by email:', userError);
          // Continue without user ID
        } else if (userData) {
          console.log(`Found user with email ${customerEmail}, auth_user_id: ${auth_user_id}`);
        } else {
          console.log(`No user found with email ${customerEmail}`);
        }
        
        console.log('Attempting to insert registration with data:', {
          event_id: eventId,
          name: customerName || 'Unknown',
          email: customerEmail,
          auth_user_id: auth_user_id,
          stripe_session_id: session.id,
          stripe_payment_id: session.payment_intent,
          amount_paid: session.amount_total / 100,
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
        const { data, error } = await supabase
          .from('registrations')
          .insert([{
            event_id: eventId,
            name: customerName || 'Unknown',
            email: customerEmail,
            auth_user_id: auth_user_id, // Include auth_user_id if found
            stripe_session_id: session.id,
            stripe_payment_id: session.payment_intent,
            amount_paid: session.amount_total / 100, // Convert from cents to dollars
            payment_status: 'paid',
            paid_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select();
        
        if (error) {
          console.error('Error creating registration:', error);
          console.error('Error details:', JSON.stringify(error));
          throw error;
        }
        
        if (data && data.length > 0) {
          registrationId = data[0].id;
          console.log(`Created new registration ${registrationId} for session ${session.id}`);
        } else {
          console.log('Registration insert succeeded but no data returned');
        }
      } catch (insertError) {
        console.error('Exception during registration insert:', insertError);
        console.error('Failed to create registration record');
      }
    } else {
      // Update the existing registration with the payment information
      await updateRegistration(registrationId, {
        stripe_session_id: session.id,
        stripe_payment_id: session.payment_intent,
        amount_paid: session.amount_total / 100, // Convert from cents to dollars
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
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
      payment_status: 'paid',
      paid_at: new Date().toISOString(),
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
  try {
    console.log(`Updating registration ${registrationId} with data:`, updateData);
    
    // Update the registration
    const { data: regData, error: regError } = await supabase
      .from('registrations')
      .update(updateData)
      .eq('id', registrationId)
      .select();
    
    if (regError) {
      console.error('Error updating registration:', regError);
      console.error('Error details:', JSON.stringify(regError));
      throw regError;
    }
    
    if (regData && regData.length > 0) {
      console.log(`Successfully updated registration ${registrationId}`);
      return regData[0];
    } else {
      console.log(`No registration found with ID ${registrationId}`);
      return null;
    }
  } catch (error) {
    console.error('Error in updateRegistration:', error);
    throw error;
  }
}