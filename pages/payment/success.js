import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import { supabase } from '../../lib/supabase';

export default function PaymentSuccess() {
  const router = useRouter();
  const { session_id, registration_id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchRegistrationDetails = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from registrations table first
        let registrationData = null;
        let eventData = null;
        
        // If we have a registration_id, use that to fetch the registration
        if (registration_id) {
          try {
            const { data, error } = await supabase
              .from('registrations')
              .select('*, events(*)')
              .eq('id', registration_id)
              .single();
            
            if (error) {
              if (error.code === '42P01') {
                // Table doesn't exist, try event_registrations
                throw error;
              } else {
                console.error('Error fetching registration:', error);
                throw error;
              }
            }
            
            registrationData = data;
            eventData = data.events;
          } catch {
            // Fallback to event_registrations table
            const { data, error: fallbackError } = await supabase
              .from('event_registrations')
              .select('*, events(*)')
              .eq('id', registration_id)
              .single();
            
            if (fallbackError) {
              console.error('Error fetching event_registration:', fallbackError);
              throw fallbackError;
            }
            
            registrationData = data;
            eventData = data.events;
          }
        }
        // If we have a session_id but no registration_id, try to find the registration by session_id
        else if (session_id) {
          try {
            const { data, error } = await supabase
              .from('registrations')
              .select('*, events(*)')
              .eq('stripe_session_id', session_id)
              .single();
            
            if (error) {
              if (error.code === '42P01') {
                // Table doesn't exist, try event_registrations
                throw error;
              } else {
                console.error('Error fetching registration by session_id:', error);
                throw error;
              }
            }
            
            registrationData = data;
            eventData = data.events;
          } catch {
            // Fallback to event_registrations table
            const { data, error: fallbackError } = await supabase
              .from('event_registrations')
              .select('*, events(*)')
              .eq('stripe_session_id', session_id)
              .single();
            
            if (fallbackError) {
              console.error('Error fetching event_registration by session_id:', fallbackError);
              throw fallbackError;
            }
            
            registrationData = data;
            eventData = data.events;
          }
        } else {
          throw new Error('No registration_id or session_id provided');
        }
        
        setRegistration(registrationData);
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching registration details:', error);
        setError('Unable to load registration details. Please check your dashboard for confirmation.');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have either registration_id or session_id
    if (registration_id || session_id) {
      fetchRegistrationDetails();
    }
  }, [registration_id, session_id]);

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
            <p className="text-gray-600 dark:text-gray-400">Thank you for registering for the AI Bootcamp.</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Registration Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Event</p>
                    <p className="font-medium text-gray-900 dark:text-white">{event?.name || 'AI Bootcamp'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">{event?.start_date ? formatDate(event.start_date) : 'TBD'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{registration?.name || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{registration?.email || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount Paid</p>
                    <p className="font-medium text-gray-900 dark:text-white">${registration?.amount_paid || event?.price || '199'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
                    <p className="font-medium text-green-600 dark:text-green-400">Completed</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  We&apos;ve sent a confirmation email with all the details to your registered email address.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/dashboard" className="btn btn-primary">
                    Go to Dashboard
                  </Link>
                  <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Return to Home
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}