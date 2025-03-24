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
      },
      customer_email: email,
      client_reference_id: registrationId,
      mode: 'payment',
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&registration_id=${registrationId}`,
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
      
      if (error && error.code === '42P01') {
        // Try event_registrations table
        await supabase
          .from('event_registrations')
          .update({
            stripe_session_id: session.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', registrationId);
      }
    } catch (error) {
      console.error('Error updating registration with session ID:', error);
      // Continue even if there's an error updating the registration
    }

    return res.status(200).json({
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}