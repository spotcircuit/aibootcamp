import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js'; // Keep for admin client if needed

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Add missing import
import Navigation from '../../components/Navigation';

// Initialize Stripe (keep as is)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Initialize Supabase Admin Client (keep as is)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// --- SERVER-SIDE DATA FETCHING ---
export async function getServerSideProps(context) {
  // 1. Create a Supabase client authenticated for the current server request
  const supabase = createPagesServerClient(context); // Use the helper

  // 2. Get the logged-in user's session
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error fetching user session:', userError);
    // Continue without user - we'll handle this case below
  }

  // If auth_user_id is NOT NULL in DB, we MUST have a user here
  const loggedInUserId = user?.id || null;
  
  // We'll track if we're in a no-session scenario
  const hasUserSession = !!loggedInUserId;
  if (!hasUserSession) { 
    console.error('Error: No logged-in user found, but auth_user_id is required by the database.');
    // We'll continue and try to create a registration with userId from URL if available
  }

  const { session_id, userId, eventId } = context.query;
  let session;
  let eventDetails = null;
  let registrationDetails = null;
  let errorMessage = null;
  let customerEmail = null;

  // Use userId from URL if available and no active session
  const effectiveUserId = hasUserSession ? loggedInUserId : (userId || null);
  if (effectiveUserId) {
    console.log(`Using effectiveUserId: ${effectiveUserId} (from ${hasUserSession ? 'session' : 'URL'})`);
  } else {
    console.log('No user ID available from session or URL');
  }

  // Initialize Supabase Admin Client for elevated operations
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  if (!session_id) {
    return { props: { error: 'No session ID provided.' } };
  }

  try {
    // 3. Retrieve the Stripe Session & Verify Payment (keep as is)
    session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return { props: { error: 'Payment was not successful.' } };
    }

    // 4. Extract data from Stripe/URL (keep as is)
    customerEmail = session.customer_details?.email;
    const amountPaid = session.amount_total;

    // Check if eventId was present in the URL
    if (!eventId) {
      // ... (keep existing eventId check) ...
      console.error('Error: eventId not found in URL query parameters for session:', session_id);
      return { props: { error: 'Event ID missing from success URL.', event: null, registration: null } };
    }

    // 5. Fetch Event Details (keep as is)
    // ... (fetch event details using supabaseAdmin) ...
    const { data: eventData, error: eventError } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
     if (eventError || !eventData) {
      console.error(`Error fetching event ${eventId}:`, eventError);
      errorMessage = 'Could not fetch event details.';
      // Continue processing to potentially create registration if payment was successful
    } else {
      eventDetails = eventData;
    }


    // 6. Check for existing registration (keep as is)
    // ... (check using supabaseAdmin and stripe_session_id) ...
    const { data: existingReg, error: fetchRegError } = await supabaseAdmin
      .from('registrations') // Use 'registrations' table
      .select('*, events(*)') // Adjust select as needed
      .eq('stripe_session_id', session_id)
      .maybeSingle(); // Use maybeSingle to not error if not found

    if (fetchRegError) {
      console.error(`Error fetching registration by session_id ${session_id}:`, fetchRegError);
      errorMessage = (errorMessage ? errorMessage + ' ' : '') + 'Could not check for existing registration.';
      // Don't stop here, we might still need to create it.
    }


    if (existingReg) {
      // Registration already exists... (keep existing logic)
      // Registration already exists (perhaps created by webhook or previous attempt)
      registrationDetails = existingReg;
      console.log('Found existing registration:', existingReg.id);
      // Optional: Update paid_at if it's null, though webhook is better
      if (!existingReg.paid_at) {
         const { error: updateError } = await supabaseAdmin
          .from('registrations')
          .update({ 
            paid_at: new Date().toISOString(), 
            payment_status: 'paid',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingReg.id);
         if (updateError) console.error('Error updating existing registration paid_at:', updateError);
      }


    } else if (eventDetails && customerEmail) { 
      // 7. Registration not found, CREATE it using effectiveUserId if available
      // 5. Registration not found, CREATE it since payment was successful
      console.log(`Registration for session ${session_id} not found, creating for user ${effectiveUserId || 'unknown'}...`);
      const { data: newReg, error: createRegError } = await supabaseAdmin
        .from('registrations') // Use 'registrations' table
        .insert({
          event_id: eventId,
          email: customerEmail,
          name: session.customer_details?.name || 'Unknown',
          auth_user_id: effectiveUserId,
          stripe_session_id: session_id,
          stripe_payment_id: session.payment_intent,
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
          amount_paid: amountPaid ? amountPaid / 100 : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*, events(*)') // Select the newly created record with event details
        .single();

      if (createRegError) {
        console.error(`Error creating registration for session ${session_id}:`, createRegError);
        errorMessage = (errorMessage ? errorMessage + ' ' : '') + `Failed to create registration record after payment. DB Error: ${createRegError.message}`;
      } else {
        registrationDetails = newReg;
        console.log('Successfully created new registration:', newReg.id);
      }
    } else {
       // Handle cases where creation isn't possible
       if (!eventDetails) {
         console.error('Cannot create registration: Event details missing.');
         errorMessage = (errorMessage ? errorMessage + ' ' : '') + 'Could not create registration due to missing event information.';
       } else if (!customerEmail) {
         console.error('Cannot create registration: Customer email missing.');
         errorMessage = (errorMessage ? errorMessage + ' ' : '') + 'Could not create registration due to missing email information.';
       } else if (!effectiveUserId) {
         console.log('No user ID available from session or URL');
         // This is expected in some cases - the webhook will create the registration
         // We'll show a special message to the user
         errorMessage = null; // Clear any error message
       } else {
         // Some other unexpected case
         console.error('Cannot create registration: Unexpected error.');
         errorMessage = (errorMessage ? errorMessage + ' ' : '') + 'Could not create registration due to an unexpected error.';
       }
    }

  } catch (error) {
    console.error('Error processing payment success:', error);
    errorMessage = error.message || 'An unexpected error occurred.';
  }

  // 8. Return props (keep as is)
  // Return props including the fetched/created data or error
  return {
    props: {
      event: eventDetails,
      registration: registrationDetails,
      error: errorMessage,
      customerEmail: customerEmail // Pass email for display if needed
    },
  };
}

// --- REACT COMPONENT ---
// The React component PaymentSuccess remains unchanged
function PaymentSuccess({ event, registration, error, customerEmail }) {
  const router = useRouter();

  // Handle loading state or potentially redirect based on props
  // Example: Redirect to login if error indicates user not logged in
  useEffect(() => {
    if (error && error.includes("Your session may have expired")) {
      // Optional: Redirect to login after a delay or immediately
      // setTimeout(() => router.push('/login?reason=session_expired'), 3000);
    }
  }, [error, router]);

  // Basic loading state example
  const [isLoading, setIsLoading] = useState(!event && !registration && !error);
  useEffect(() => {
     if (event || registration || error) {
       setIsLoading(false);
     }
  }, [event, registration, error]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-6">Processing Payment...</h1>
          <p>Verifying details, please wait.</p>
          {/* Add a loading spinner here if desired */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {error ? 'Payment Processing Issue' : 'Payment Successful!'}
        </h1>
        
        {error ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <p>{error}</p>
            </div>
            <p className="mb-4">
              We encountered an issue while processing your payment confirmation. However, if your payment was successful, our system will still register you for the event.
            </p>
            <p className="mb-4">
              Please check your email for a payment confirmation from Stripe. If you have any concerns, please contact our support team.
            </p>
          </div>
        ) : !registration && !event ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="text-green-600 dark:text-green-400 mb-4 text-center">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <h2 className="text-2xl font-semibold">Payment Processed Successfully!</h2>
            </div>
            <p className="mb-4 text-center">
              Your payment has been processed successfully. Our system is currently finalizing your registration.
            </p>
            <p className="mb-4 text-center">
              You will receive a confirmation email shortly with all the details. You can also view your registrations in your dashboard once you log in.
            </p>
            <div className="flex justify-center mt-6">
              <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md mr-4">
                Log In
              </Link>
              <Link href="/events" className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-2 rounded-lg shadow-md">
                Browse Events
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Registration Success Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <div className="text-green-600 dark:text-green-400 mb-4 text-center">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <h2 className="text-2xl font-semibold">Registration Confirmed!</h2>
              </div>
              
              {event && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(event.start_date).toLocaleDateString()} at {new Date(event.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  {event.location && (
                    <p className="text-gray-600 dark:text-gray-400">{event.location}</p>
                  )}
                </div>
              )}
              
              {registration && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                  <p className="mb-2">
                    <span className="font-semibold">Registration ID:</span> {registration.id}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Email:</span> {registration.email || customerEmail}
                  </p>
                  {registration.amount_paid && (
                    <p className="mb-2">
                      <span className="font-semibold">Amount Paid:</span> ${registration.amount_paid}
                    </p>
                  )}
                  <p className="mb-2">
                    <span className="font-semibold">Status:</span>{' '}
                    <span className="text-green-600 dark:text-green-400">Confirmed</span>
                  </p>
                </div>
              )}
              
              <div className="text-center text-gray-600 dark:text-gray-400 mb-6">
                <p>A confirmation email has been sent to {registration?.email || customerEmail}.</p>
                <p>Please check your inbox (and spam folder) for details.</p>
              </div>
            </div>
            
            <div className="text-center">
              <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md mr-4">
                Go to Dashboard
              </Link>
              <Link href="/events" className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-2 rounded-lg shadow-md">
                Browse More Events
              </Link>
            </div>
          </>
        )}
        
        {/* <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">
            Return to Dashboard
          </Link> 
        </div> */}
      </div>
    </div>
  );
}

export default PaymentSuccess;