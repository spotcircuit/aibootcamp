import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js'; // Keep for admin client if needed

// Initialize Stripe (keep as is)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Initialize Supabase Admin Client (keep as is)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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