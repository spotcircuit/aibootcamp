import Link from 'next/link';
import Navigation from '../../components/Navigation';
import { createClient } from '@supabase/supabase-js'; // Import createClient
import Stripe from 'stripe'; // Import Stripe

// Initialize Stripe with the secret key (server-side only)
// Ensure STRIPE_SECRET_KEY is set in your environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ** IMPORTANT: Ensure these environment variables are set **
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role Key for admin actions

// REMOVED check from module scope - it will be checked within getServerSideProps if needed
// if (!supabaseServiceKey) {
//   console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is not set in environment variables.');
// }

// Helper function to format dates (can remain the same)
const formatDate = (dateString) => {
  if (!dateString) return 'TBD';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// --- SERVER-SIDE DATA FETCHING ---
export async function getServerSideProps(context) {
  const { session_id } = context.query;
  let session;
  let eventDetails = null;
  let registrationDetails = null;
  let errorMessage = null;
  let customerEmail = null;
  let eventId = null;

  // Initialize Supabase Admin Client within the function scope
  // Ensures it uses the latest env vars and avoids module-level issues
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  if (!session_id) {
    return { props: { error: 'No session ID provided.' } };
  }

  try {
    // 1. Retrieve the Stripe Session & Verify Payment
    session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return { props: { error: 'Payment was not successful.' } };
    }

    // 2. Extract necessary data from Stripe session
    eventId = session.metadata?.eventId;
    customerEmail = session.customer_details?.email;
    const amountPaid = session.amount_total;

    if (!eventId) {
      console.error('Error: eventId not found in Stripe Session metadata for session:', session_id);
      return { props: { error: 'Event ID missing from payment session.', event: null, registration: null } };
    }

    // 3. Fetch Event Details from Supabase using eventId
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

    // 4. Try to find existing registration using stripe_session_id
    const { data: existingReg, error: fetchRegError } = await supabaseAdmin
      .from('event_registrations') // Use your actual registration table name
      .select('*, events(*)') // Adjust select as needed
      .eq('stripe_session_id', session_id)
      .maybeSingle(); // Use maybeSingle to not error if not found

    if (fetchRegError) {
      console.error(`Error fetching registration by session_id ${session_id}:`, fetchRegError);
      errorMessage = (errorMessage ? errorMessage + ' ' : '') + 'Could not check for existing registration.';
      // Don't stop here, we might still need to create it.
    }

    if (existingReg) {
      // Registration already exists (perhaps created by webhook or previous attempt)
      registrationDetails = existingReg;
      console.log('Found existing registration:', existingReg.id);
      // Optional: Update paid_at if it's null, though webhook is better
      if (!existingReg.paid_at) {
         const { error: updateError } = await supabaseAdmin
          .from('event_registrations')
          .update({ paid_at: new Date().toISOString(), payment_status: 'paid' })
          .eq('id', existingReg.id);
         if (updateError) console.error('Error updating existing registration paid_at:', updateError);
      }

    } else if (eventDetails && customerEmail) {
      // 5. Registration not found, CREATE it since payment was successful
      console.log(`Registration for session ${session_id} not found, creating...`);
      const { data: newReg, error: createRegError } = await supabaseAdmin
        .from('event_registrations')
        .insert({
          event_id: eventId,
          email: customerEmail, // Assuming you have an email column
          user_id: session.metadata?.userId || null, // Optional: if you pass userId in metadata
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
        errorMessage = (errorMessage ? errorMessage + ' ' : '') + 'Failed to create registration record after payment.';
      } else {
        registrationDetails = newReg;
        console.log('Successfully created new registration:', newReg.id);
      }
    } else {
       // Could not create registration because event or email details were missing
       if (!eventDetails) console.error('Cannot create registration: Event details missing.');
       if (!customerEmail) console.error('Cannot create registration: Customer email missing.');
       errorMessage = (errorMessage ? errorMessage + ' ' : '') + 'Missing data needed to create registration.';
    }

  } catch (error) {
    console.error('Error processing payment success:', error);
    errorMessage = error.message || 'An unexpected error occurred.';
    // Ensure sensitive details aren't passed in props if session retrieval failed early
    if (!session) {
       eventDetails = null;
       registrationDetails = null;
    }
  }

  // Pass data (or errors) to the page component
  return {
    props: {
      event: eventDetails,
      registration: registrationDetails,
      error: errorMessage,
      // Optionally pass other useful info like email, amount
      customerEmail: customerEmail,
      eventId: eventId
    },
  };
}

// --- PAGE COMPONENT ---
// Receives props from getServerSideProps
export default function PaymentSuccess({ success, message, customerEmail, eventId, registrationId, event, registration, amountPaid }) {
  // Handle failure case based on props
  if (!success) {
     return (
       <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
         <Navigation />
         <div className="container mx-auto px-4 py-16">
           <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-4">
                 {/* Error Icon (Example) */}
                 <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               </div>
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment Verification Failed</h1>
             <p className="text-gray-600 dark:text-gray-400">{message || 'There was an issue processing your payment information.'}</p>
             <div className="mt-6">
                <Link href="/dashboard" className="btn btn-secondary">
                   Go to Dashboard
                 </Link>
             </div>
           </div>
         </div>
       </div>
     );
  }

  // --- Successful Payment Display ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h1>
            <p>
              Thank you{customerEmail ? `, ${customerEmail},` : ''} for your payment!
              {registration ? 
                ` You&apos;re now registered for ${event?.name || 'the event'}.` :
                ` Your payment for ${event?.name || 'the event'} has been confirmed.`
              }
               A confirmation has been sent to your email (if provided).
             </p>
           </div>

          {/* Display registration details fetched server-side */}
           <div className="space-y-6">
             <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4">
               <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Confirmation Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {event && (
                   <>
                     <div>
                       <p className="text-sm text-gray-500 dark:text-gray-400">Event</p>
                       <p className="font-medium text-gray-900 dark:text-white">{event.name || 'AI Bootcamp'}</p>
                     </div>
                     <div>
                       <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                       <p className="font-medium text-gray-900 dark:text-white">{event.start_date ? formatDate(event.start_date) : 'TBD'}</p>
                     </div>
                   </>
                 )}
                  {registration && (
                   <>
                     <div>
                       <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                       <p className="font-medium text-gray-900 dark:text-white">{registration.name || 'N/A'}</p>
                     </div>
                     <div>
                       <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                       <p className="font-medium text-gray-900 dark:text-white">{registration.email || customerEmail || 'N/A'}</p>
                     </div>
                   </>
                 )}
                  {amountPaid !== null && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Amount Paid</p>
                      {/* Display amount from Stripe session */}
                      <p className="font-medium text-gray-900 dark:text-white">${amountPaid.toFixed(2)}</p>
                     </div>
                  )}
                 <div>
                   <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
                   <p className="font-medium text-green-600 dark:text-green-400">Completed</p>
                 </div>
                  {eventId && (
                   <div>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Event ID</p>
                     <p className="font-medium text-gray-900 dark:text-white">{eventId}</p>
                   </div>
                  )}
                  {registrationId && (
                   <div>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Registration ID</p>
                     <p className="font-medium text-gray-900 dark:text-white">{registrationId}</p>
                   </div>
                  )}
               </div>
             </div>

              <div className="text-center space-y-4">
               <p className="text-gray-600 dark:text-gray-400">
                 We&apos;ve sent a confirmation email with all the details to your registered email address (if provided during checkout).
               </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Link href="/dashboard" className="btn btn-primary">
                   Go to Dashboard
                 </Link>
                 <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
                   Back to Home
                 </Link>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 }