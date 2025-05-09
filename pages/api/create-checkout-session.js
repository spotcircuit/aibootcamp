import Stripe from 'stripe';
import { supabase } from '../../lib/supabase';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Determine the appropriate app URL based on environment
const getAppUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment 
    ? process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_PRODUCTION_URL || 'https://aibootcamp.lexduo.ai';
};

export default async function handler(req, res) {
  console.log('Create checkout session API called');
  console.log('Environment:', process.env.NODE_ENV);
  
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Request body:', JSON.stringify(req.body));
    const { eventId, registrationId, amount, email, userId, eventName } = req.body;

    if (!eventId || !registrationId || !amount) {
      console.log('Missing required parameters:', { eventId, registrationId, amount });
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Log the user ID from the request
    console.log(`User ID from request: ${userId || 'Not provided'}`);
    
    // Get the app URL based on environment
    const appUrl = getAppUrl();
    console.log('App URL for callbacks:', appUrl);
    
    console.log('Stripe secret key available:', !!process.env.STRIPE_SECRET_KEY);
    console.log('Stripe product ID:', process.env.STRIPE_PRODUCT_ID);
    
    // Get the event image from Supabase or use a default based on event name
    const getEventImage = async (eventId, eventName) => {
      const baseUrl = appUrl;
      let imageName;
      
      try {
        // Try to get the image_name from Supabase
        const { data, error } = await supabase
          .from('events')
          .select('image_name')
          .eq('id', eventId)
          .single();
        
        if (error) throw error;
        
        // Use the image_name from the database if available
        imageName = data.image_name;
        
        // If no image_name is set, generate one from the event name
        if (!imageName && eventName) {
          imageName = eventName
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase() + '.png';
        }
      } catch (error) {
        console.error('Error fetching event image:', error);
        // Fallback to a default image name based on event name
        if (eventName) {
          imageName = eventName
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase() + '.png';
        } else {
          imageName = 'default-event.png';
        }
      }
      
      // The image path will be in the public directory
      return `${baseUrl}/${imageName}`;
    };
    
    // Get the image URL for this event
    const eventImageUrl = await getEventImage(eventId, eventName);

    // Create a Stripe checkout session
    console.log('Creating Stripe checkout session with params:', {
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product: process.env.STRIPE_PRODUCT_ID,
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      metadata: {
        registrationId,
        eventId,
        userId: userId || '',
      },
      customer_email: email,
      mode: 'payment',
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&eventId=${eventId}&userId=${userId || ''}&registrationId=${registrationId}`,
      cancel_url: `${appUrl}/payment/cancel?registration_id=${registrationId}`,
    });
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: eventName || 'Event Registration',
              description: `Registration for ${eventName || 'event'}`,
              images: [
                eventImageUrl // Dynamic image URL based on event ID
              ],
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        registrationId,
        eventId,
        userId: userId || '', // Include userId in metadata
        eventName: eventName || '',
      },
      customer_email: email,
      client_reference_id: registrationId,
      mode: 'payment',
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&eventId=${eventId}&userId=${userId || ''}&registrationId=${registrationId}`,
      cancel_url: `${appUrl}/payment/cancel?registration_id=${registrationId}`,
    });

    console.log('Stripe session created:', {
      id: session.id,
      url: session.url,
      payment_status: session.payment_status,
    });

    // Update the registration with the session ID
    try {
      const { error } = await supabase
        .from('registrations')
        .update({
          stripe_session_id: session.id
        })
        .eq('id', registrationId);
      
      if (error) {
        console.error('Error updating registration with session ID:', error);
        // Continue even if there's an error updating the registration
      } else {
        console.log('Registration updated with session ID');
      }
    } catch (error) {
      console.error('Error updating registration with session ID:', error);
      // Continue even if there's an error updating the registration
    }

    // Return the session URL for client-side redirect
    console.log('Returning session URL to client:', session.url);
    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
}