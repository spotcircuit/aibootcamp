import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js'; // Keep for admin client if needed
import fetch from 'node-fetch';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Add missing import
import Navigation from '../../components/Navigation';

// Initialize Stripe (keep as is)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Initialize Supabase Admin Client (keep as is)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Determine the appropriate app URL based on environment
const getAppUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment 
    ? process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_PRODUCTION_URL || 'https://aibootcamp.lexduo.ai';
};

// --- SERVER-SIDE DATA FETCHING ---
export async function getServerSideProps(context) {
  console.log('Payment success page - Environment:', process.env.NODE_ENV);
  const appUrl = getAppUrl();
  console.log('Using app URL:', appUrl);

  // Initialize Supabase Admin Client for elevated operations
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  // 1. Create a Supabase client authenticated for the current server request
  const supabase = createPagesServerClient(context); // Use the helper

  // Check if user is logged in, but don't error if not
  let loggedInUserId = null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      loggedInUserId = session.user.id;
      console.log('User is logged in with ID:', loggedInUserId);
    } else {
      console.log('No active user session, will use URL parameters instead');
    }
  } catch {
    // Just log that there's no session, but don't treat it as an error
    console.log('No active user session, will use URL parameters instead');
  }

  const { session_id, registrationId, free } = context.query;
  console.log('URL query parameters:', context.query);
  
  // Handle free events differently
  if (free === 'true') {
    console.log('Free event detected, bypassing session ID check');
    if (!registrationId) {
      return { props: { error: 'No registration ID provided for free event.' } };
    }
  } else if (!session_id) {
    return { props: { error: 'No session ID provided.' } };
  }

  let session;
  let eventDetails = null;
  let registrationDetails = null;
  let errorMessage = null;
  let customerEmail = null;

  try {
    let amountPaid = 0;
    
    // Handle free events differently than paid events
    if (free === 'true') {
      console.log('Processing free event registration');
      // For free events, we don't have a Stripe session
      customerEmail = null; // We'll get this from the registration
    } else {
      // 3. Retrieve the Stripe Session & Verify Payment (for paid events)
      session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status !== 'paid') {
        return { props: { error: 'Payment was not successful.' } };
      }

      // 4. Extract data from Stripe/URL
      customerEmail = session.customer_details?.email;
      amountPaid = session.amount_total;
    }
    
    // Extract registrationId from URL
    const urlRegistrationId = registrationId;
    console.log('Registration ID from URL:', urlRegistrationId);
    
    if (!urlRegistrationId) {
      console.error('No registration ID provided in URL');
      return {
        props: {
          success: false,
          error: 'Registration ID is missing. Cannot update registration.',
          event: null,
          registration: null,
          customerEmail: null,
          sessionId: session_id
        }
      };
    }

    // Find the existing registration by ID
    console.log(`Looking for registration with ID: ${urlRegistrationId}`);
    const { data: existingReg, error: regError } = await supabaseAdmin
      .from('registrations')
      .select('*, events(*)')
      .eq('id', urlRegistrationId)
      .single();
      
    if (regError) {
      console.error(`Error finding registration with ID ${urlRegistrationId}:`, regError);
      return {
        props: {
          success: false,
          error: `Failed to find registration record. Error: ${regError.message}`,
          event: null,
          registration: null,
          customerEmail,
          sessionId: session_id
        }
      };
    }
    
    if (!existingReg) {
      console.error(`Registration with ID ${urlRegistrationId} not found`);
      return {
        props: {
          success: false,
          error: 'Registration record not found.',
          event: null,
          registration: null,
          customerEmail,
          sessionId: session_id
        }
      };
    }
    
    console.log(`Found existing registration:`, existingReg);
    
    // Update the registration with payment details
    let updateData = {};
    
    if (free === 'true') {
      // For free events
      updateData = { 
        paid_at: new Date().toISOString(), 
        payment_status: 'completed',
        amount_paid: 0
      };
    } else {
      // For paid events
      updateData = { 
        paid_at: new Date().toISOString(), 
        payment_status: 'paid',
        stripe_session_id: session_id,
        stripe_payment_id: session.payment_intent,
        amount_paid: amountPaid ? amountPaid / 100 : null
      };
    }
    
    const { error: updateError } = await supabaseAdmin
      .from('registrations')
      .update(updateData)
      .eq('id', existingReg.id);
      
    if (updateError) {
      console.error(`Error updating registration ${existingReg.id}:`, updateError);
      return {
        props: {
          success: false,
          error: `Failed to update registration record. Error: ${updateError.message}`,
          event: null,
          registration: existingReg,
          customerEmail,
          sessionId: session_id
        }
      };
    }
    
    console.log(`Successfully updated registration ${existingReg.id} with payment details`); 
    
    // Send confirmation email with meeting link after successful payment
    try {
      console.log('Sending confirmation email with meeting link...');
      const emailResponse = await fetch(`${appUrl}/api/sendRegistrationEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}` // Use service role key for server-to-server request
        },
        body: JSON.stringify({
          registrationId: existingReg.id,
          eventId: existingReg.event_id,
          eventTitle: eventDetails?.name || 'AI Bootcamp Event',
          eventDate: eventDetails?.start_date || new Date().toISOString(),
          name: existingReg.name,
          email: existingReg.email
        })
      });
      
      const emailResult = await emailResponse.json();
      console.log('Email sending result:', emailResult);
      
      if (!emailResult.success) {
        console.error('Failed to send confirmation email:', emailResult.message);
        errorMessage = 'Your registration is confirmed, but there was an issue sending the confirmation email.';
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      errorMessage = 'Your registration is confirmed, but there was an issue sending the confirmation email.';
    }
    
    // Get the updated registration
    const { data: updatedReg } = await supabaseAdmin
      .from('registrations')
      .select('*, events(*)')
      .eq('id', existingReg.id)
      .single();
    
    registrationDetails = updatedReg;
    eventDetails = updatedReg?.events;

    // Return all the data we've gathered
    return {
      props: {
        success: true,
        error: errorMessage,
        event: eventDetails || null,
        registration: registrationDetails || null,
        customerEmail: customerEmail || null,
        sessionId: session_id
      }
    };
  } catch (error) {
    console.error('Error in success page:', error);
    return {
      props: {
        success: false,
        error: `An error occurred: ${error.message}`,
        event: null,
        registration: null
      }
    };
  }
}

// --- CLIENT-SIDE COMPONENT ---
export default function SuccessPage({ success, error, event, registration, customerEmail, sessionId }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const { free } = router.query;

  useEffect(() => {
    if (success && !error) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [success, error, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          {success ? (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {free === 'true' ? 'Registration Successful!' : 'Payment Successful!'}
              </h1>
              
              {registration ? (
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Thank you for registering for:
                  </p>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {event?.title || 'AI Bootcamp Event'}
                  </h2>
                  
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-left">
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        <span className="font-medium">Registration ID:</span> {registration.id}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        <span className="font-medium">Email:</span> {registration.email || customerEmail}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        <span className="font-medium">Amount:</span> {registration.amount_paid === 0 ? 'Free' : `$${registration.amount_paid}`}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Status:</span> 
                        <span className="text-green-600 dark:text-green-400 ml-1">Confirmed</span>
                      </p>
                      
                      {/* Show meeting link if available */}
                      {event?.meeting_link && (
                        <div className="mt-4">
                          <p className="text-gray-600 dark:text-gray-300 mb-2">
                            <span className="font-medium">Meeting Link:</span>
                          </p>
                          <a 
                            href={event.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            {event.meeting_type === 'zoom' ? 'Join Zoom Meeting' : 
                             event.meeting_type === 'google_meet' ? 'Join Google Meet' : 
                             event.meeting_type === 'teams' ? 'Join Microsoft Teams' : 'Join Meeting'}
                          </a>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            This link has also been sent to your email for future reference.
                          </p>
                        </div>
                      )}
                      
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    Your payment was successful, but we&apos;re still processing your registration.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    You&apos;ll receive a confirmation email at {customerEmail} shortly.
                  </p>
                </div>
              )}
              
              {error && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg">
                  <p>Note: {error}</p>
                  <p className="mt-2 text-sm">Don&apos;t worry, your payment was successful and our team has been notified.</p>
                </div>
              )}
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Redirecting to your dashboard in {countdown} seconds...
              </p>
              
              <div className="flex flex-col space-y-3">
                <Link href="/dashboard" className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Go to Dashboard Now
                </Link>
                
                <Link href="/events" className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Browse More Events
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="h-16 w-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Something went wrong
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {error || 'We encountered an error processing your payment.'}
              </p>
              
              <div className="flex flex-col space-y-3">
                <Link href="/events" className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Try Again
                </Link>
                
                <a href={`mailto:support@aibootcamp.com?subject=Payment%20Issue%20(Session%20${sessionId})&body=I%20encountered%20an%20issue%20with%20my%20payment.%20Session%20ID:%20${sessionId}`} className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Contact Support
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}