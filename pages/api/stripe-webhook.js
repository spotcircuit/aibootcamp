import { buffer } from 'micro';
import Stripe from 'stripe';
import { supabase } from '../../lib/supabase';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Disable body parsing for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Determine the appropriate app URL based on environment
const getAppUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment 
    ? process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_PRODUCTION_URL || 'https://aibootcamp.lexduo.ai';
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const appUrl = getAppUrl();
  console.log(`Stripe webhook called in ${process.env.NODE_ENV} environment. Using app URL: ${appUrl}`);

  try {
    // Get the raw request body
    const rawBody = await buffer(req);
    const signature = req.headers['stripe-signature'];

    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    console.log(`Webhook event received: ${event.type}`);

    // Handle the event based on its type
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

    // Return a response to acknowledge receipt of the event
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error(`Error handling webhook: ${error.message}`);
    return res.status(500).json({ error: 'Error handling webhook' });
  }
}

/**
 * Handle a checkout.session.completed event
 * @param {Object} session - The Stripe checkout session
 */
async function handleCheckoutSessionCompleted(session) {
  console.log('Handling checkout.session.completed event');
  console.log('Session data:', JSON.stringify(session, null, 2));

  // Extract customer information from the session
  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name;
  
  // Extract metadata
  const { registrationId, eventId, userId: metadataUserId } = session.metadata || {};
  
  console.log(`Session metadata: registrationId=${registrationId}, eventId=${eventId}, userId=${metadataUserId || 'not provided'}`);
  
  // If we have a registrationId, update the existing registration
  if (registrationId) {
    console.log(`Looking for existing registration with ID: ${registrationId}`);
    
    // Check if the registration already exists
    const { data: existingReg, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', registrationId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching existing registration:', fetchError);
    }
    
    if (existingReg) {
      console.log(`Found existing registration ${registrationId}, updating with payment info`);
      
      // Update the registration with payment information
      const { error: updateError } = await supabase
        .from('registrations')
        .update({
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
          stripe_payment_id: session.payment_intent
        })
        .eq('id', registrationId);
      
      if (updateError) {
        console.error('Error updating registration:', updateError);
        console.error('Error details:', JSON.stringify(updateError));
        throw updateError;
      }
      
      console.log(`Successfully updated registration ${registrationId}`);
      
      // Send confirmation email now that payment is complete
      try {
        // Get the event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();
        
        if (eventError) {
          console.error('Error fetching event details for email:', eventError);
          return;
        }
        
        console.log('Sending registration confirmation email after payment...');
        const emailResponse = await fetch(`${getAppUrl()}/api/sendRegistrationEmail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Include authorization header for server-to-server requests
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
          },
          body: JSON.stringify({
            registrationId: registrationId,
            eventId: eventId,
            eventTitle: eventData.name,
            eventDate: eventData.start_date,
            name: existingReg.name,
            email: existingReg.email
          }),
        });
        
        if (emailResponse.ok) {
          const emailResult = await emailResponse.json();
          console.log('Registration confirmation email sent successfully after payment:', emailResult);
          
          // Update the registration to mark email as sent
          await supabase
            .from('registrations')
            .update({ email_sent: true })
            .eq('id', registrationId);
        } else {
          console.error('Failed to send registration email after payment:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('Error sending registration email after payment:', emailError);
      }
      
      return;
    } else {
      console.log(`No existing registration found with ID ${registrationId}`);
    }
  }
  
  // If we don't have a registrationId or couldn't find the registration,
  // create a new registration record
  if (customerEmail && eventId) {
    console.log(`Creating new registration for email: ${customerEmail}, event: ${eventId}`);
    
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
        created_at: new Date().toISOString()
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
          created_at: new Date().toISOString()
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
        
        // Send confirmation email for the new registration
        try {
          // Get the event details
          const { data: eventData, error: eventError } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single();
          
          if (eventError) {
            console.error('Error fetching event details for email:', eventError);
            return;
          }
          
          console.log('Sending registration confirmation email for new registration...');
          const emailResponse = await fetch(`${getAppUrl()}/api/sendRegistrationEmail`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Include authorization header for server-to-server requests
              'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({
              registrationId: registrationId,
              eventId: eventId,
              eventTitle: eventData.name,
              eventDate: eventData.start_date,
              name: customerName || 'Customer',
              email: customerEmail
            }),
          });
          
          if (emailResponse.ok) {
            const emailResult = await emailResponse.json();
            console.log('Registration confirmation email sent successfully for new registration:', emailResult);
            
            // Update the registration to mark email as sent
            await supabase
              .from('registrations')
              .update({ email_sent: true })
              .eq('id', registrationId);
          } else {
            console.error('Failed to send registration email for new registration:', await emailResponse.text());
          }
        } catch (emailError) {
          console.error('Error sending registration email for new registration:', emailError);
        }
      } else {
        console.log('Registration insert succeeded but no data returned');
      }
    } catch (insertError) {
      console.error('Exception during registration insert:', insertError);
      console.error('Failed to create registration record');
    }
  } else {
    // Update the existing registration with the payment information
    console.log('Missing customer email or event ID, cannot create registration');
  }
}

/**
 * Handle a payment_intent.succeeded event
 * @param {Object} paymentIntent - The Stripe payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log('Handling payment_intent.succeeded event');
  console.log('Payment intent data:', JSON.stringify(paymentIntent, null, 2));
  
  // Find the registration associated with this payment intent
  const { data: registrations, error } = await supabase
    .from('registrations')
    .select('id')
    .eq('stripe_payment_id', paymentIntent.id);
  
  if (error) {
    console.error('Error finding registration by payment ID:', error);
    return;
  }
  
  if (!registrations || registrations.length === 0) {
    console.log(`No registration found for payment intent ${paymentIntent.id}`);
    return;
  }
  
  const registrationId = registrations[0].id;
  console.log(`Found registration ${registrationId} for payment intent ${paymentIntent.id}`);
  
  // Update the registration with the payment information
  const { error: updateError } = await supabase
    .from('registrations')
    .update({
      payment_status: 'paid',
      paid_at: new Date().toISOString(),
      stripe_payment_id: paymentIntent.id
    })
    .eq('id', registrationId);
  
  if (updateError) {
    console.error('Error updating registration:', updateError);
    console.error('Error details:', JSON.stringify(updateError));
    throw updateError;
  }
  
  console.log(`Updated registration ${registrationId} with payment information`);
}

/**
 * Handle a payment_intent.payment_failed event
 * @param {Object} paymentIntent - The Stripe payment intent
 */
async function handlePaymentIntentFailed(paymentIntent) {
  console.log('Handling payment_intent.payment_failed event');
  console.log('Payment intent data:', JSON.stringify(paymentIntent, null, 2));
  
  // Find the registration associated with this payment intent
  const { data: registrations, error } = await supabase
    .from('registrations')
    .select('id')
    .eq('stripe_payment_id', paymentIntent.id);
  
  if (error) {
    console.error('Error finding registration by payment ID:', error);
    return;
  }
  
  if (!registrations || registrations.length === 0) {
    console.log(`No registration found for payment intent ${paymentIntent.id}`);
    return;
  }
  
  const registrationId = registrations[0].id;
  console.log(`Found registration ${registrationId} for payment intent ${paymentIntent.id}`);
  
  // Update the registration with the payment failure information
  const { error: updateError } = await supabase
    .from('registrations')
    .update({
      payment_status: 'failed',
      payment_error: paymentIntent.last_payment_error?.message || 'Payment failed'
    })
    .eq('id', registrationId);
  
  if (updateError) {
    console.error('Error updating registration:', updateError);
    console.error('Error details:', JSON.stringify(updateError));
    throw updateError;
  }
  
  console.log(`Updated registration ${registrationId} with payment failure information`);
}

/**
 * Update a registration with the given data
 * @param {string} registrationId - The registration ID
 * @param {Object} updateData - The data to update
 */
/* Currently unused - keeping for future use
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
*/