import Stripe from 'stripe';
import { supabase } from '../../lib/supabase';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { eventId, registrationId, amount, email } = req.body;

    if (!eventId || !registrationId || !amount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Get the current user's ID if available
    let userId = null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
      console.log(`User ID for checkout: ${userId || 'Not available'}`);
    } catch (authError) {
      console.error('Error getting user for checkout:', authError);
    }

    // Get the app URL from environment variables or use a default
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product: process.env.STRIPE_PRODUCT_ID, // Use the product ID from environment variables
            unit_amount: Math.round(amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        registrationId,
        eventId,
        userId: userId || '', // Include userId in metadata
      },
      customer_email: email,
      client_reference_id: registrationId,
      mode: 'payment',
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&eventId=${eventId}${userId ? `&userId=${userId}` : ''}`,
      cancel_url: `${appUrl}/payment/cancel?registration_id=${registrationId}`,
    });

    // Update the registration with the session ID
    try {
      const { error } = await supabase
        .from('registrations')
        .update({
          stripe_session_id: session.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', registrationId);
      
      if (error) {
        console.error('Error updating registration with session ID:', error);
        // Continue even if there's an error updating the registration
      }
    } catch (error) {
      console.error('Error updating registration with session ID:', error);
      // Continue even if there's an error updating the registration
    }

    // Return the session URL for client-side redirect
    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
}