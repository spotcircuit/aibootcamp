import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
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
  const supabase = createServerSupabaseClient(context); // Use the helper

  // 2. Get the logged-in user's session
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error fetching user session:', userError);
    // Handle error appropriately, maybe redirect to login or show error
    // For now, we'll proceed but might fail later if user_id is required
  }

  // If auth_user_id is NOT NULL in DB, we MUST have a user here
  // You might want to add stricter error handling if user is null and DB requires it
  const loggedInUserId = user?.id || null;
  if (!loggedInUserId) { 
      console.error('Error: No logged-in user found, but auth_user_id is required by the database.');
      // Redirect to login or return an error prop
      // return { redirect: { destination: '/login?error=session_expired', permanent: false } };
      // Return error prop:
      return { props: { error: 'Your session may have expired. Please log in and try again.', event: null, registration: null } };
  }


  const { session_id } = context.query;
  let session;
  let eventDetails = null;
  let registrationDetails = null;
  let errorMessage = null;
  let customerEmail = null;
  // Get eventId from URL query parameter INSTEAD of metadata
  let eventId = context.query.eventId;

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
    // eventId is now taken directly from context.query.eventId above
    // eventId = session.metadata?.eventId;
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
          .update({ paid_at: new Date().toISOString(), payment_status: 'paid' })
          .eq('id', existingReg.id);
         if (updateError) console.error('Error updating existing registration paid_at:', updateError);
      }


    } else if (eventDetails && customerEmail /* && loggedInUserId is checked above */) { 
      // 7. Registration not found, CREATE it using loggedInUserId (which is confirmed non-null)
      // 5. Registration not found, CREATE it since payment was successful
      console.log(`Registration for session ${session_id} not found, creating for user ${loggedInUserId}...`);
      const { data: newReg, error: createRegError } = await supabaseAdmin
        .from('registrations') // Use 'registrations' table
        .insert({
          event_id: eventId,
          email: customerEmail, // Assuming you have an email column
          auth_user_id: loggedInUserId, // Use the ID fetched from the user's session
          stripe_session_id: session_id,
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
          registration_date: new Date().toISOString(),
          amount_paid: amountPaid ? amountPaid / 100 : null // Store amount in base units (e.g., dollars)
          // Add other necessary fields with default or retrieved values
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
       // Could not create registration because event or email details were missing
       if (!eventDetails) console.error('Cannot create registration: Event details missing.');
       if (!customerEmail) console.error('Cannot create registration: Customer email missing.');
       // loggedInUserId is already checked and handled above
       errorMessage = (errorMessage ? errorMessage + ' ' : '') + 'Could not create registration due to missing information (event or email).';

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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
            <p className="text-sm mt-2">Please contact support or <Link href="/login" className="underline">log in again</Link>.</p>
          </div>
        )}

        {!error && registration && event && (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-semibold mb-4">Registration Confirmed</h2>
            <p className="mb-2">Thank you for registering, {customerEmail || 'attendee'}!</p>
            <p className="mb-2">You are registered for:</p>
            <p className="font-bold text-xl mb-4">{event.title}</p>
            {/* Use helper or ensure start_time is valid Date */}
            <p className="mb-2"><span className="font-semibold">Date:</span> {event.start_time ? new Date(event.start_time).toLocaleDateString() : 'N/A'}</p>
            <p className="mb-2"><span className="font-semibold">Registration ID:</span> {registration.id}</p>
            <p className="mb-2"><span className="font-semibold">Payment Status:</span> {registration.payment_status || 'paid'}</p>
            {registration.paid_at && (
               <p className="mb-4"><span className="font-semibold">Payment Date:</span> {new Date(registration.paid_at).toLocaleString()}</p>
            )}
            <p className="text-sm text-gray-600">A confirmation email may be sent separately.</p>
          </div>
        )}

        {/* Optional: Handle case where data is missing without explicit error */}
        {!error && (!registration || !event) && (
          <div className="text-center text-gray-600 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6">
            <p>Registration details are currently unavailable, but your payment was likely successful.</p>
            <p>Please check your email or contact support if you have concerns.</p>
          </div>
        )}

        <div className="text-center mt-6">
          <Link href="/" passHref>
             <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
              Back to Home
            </button>
          </Link>
          {/* Optional: Link to user dashboard if applicable */}
          {/* <Link href="/dashboard" passHref>
             <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Go to Dashboard
            </button>
          </Link> */} 
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;