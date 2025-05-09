import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';

export default function PaymentPage() {
  const router = useRouter();
  const { id, eventId } = router.query;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [event, setEvent] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!id || !eventId) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch registration details
        const { data: regData, error: regError } = await supabase
          .from('registrations')
          .select('*')
          .eq('id', id)
          .single();
        
        if (regError) throw regError;
        
        // Check if registration is already paid
        if (regData.payment_status === 'paid') {
          setError('This registration has already been paid.');
          setLoading(false);
          return;
        }
        
        setRegistration(regData);
        
        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*, instructors(first_name, last_name)')
          .eq('id', eventId)
          .single();
        
        if (eventError) throw eventError;
        
        setEvent(eventData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load registration details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, eventId]);
  
  const handlePayment = async () => {
    if (!registration || !event) return;
    
    try {
      setIsRedirecting(true);
      
      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          registrationId: registration.id,
          amount: event.price || 199,
          email: registration.email,
          userId: user?.id || '',
          eventName: event.name // Pass the event name for Stripe
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }
      
      const sessionData = await response.json();
      
      if (!sessionData.url) {
        throw new Error('No checkout URL returned from server');
      }
      
      // Redirect to Stripe checkout
      window.location.href = sessionData.url;
      
    } catch (err) {
      console.error('Error initiating payment:', err);
      setError(err.message || 'An unexpected error occurred');
      setIsRedirecting(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm} EST`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-10">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Error</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!registration || !event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Registration Not Found</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">We couldn't find the registration you're looking for.</p>
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
            ← Back to Dashboard
          </Link>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Complete Your Payment</h1>
              
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-6">
                <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Event Details</h2>
                <div className="space-y-2 text-blue-700 dark:text-blue-300">
                  <p><span className="font-medium">Event:</span> {event.name}</p>
                  <p><span className="font-medium">Date:</span> {formatDate(event.start_date)}</p>
                  <p><span className="font-medium">Time:</span> {formatTime(event.start_date)}</p>
                  {event.instructors && (
                    <p><span className="font-medium">Instructor:</span> {event.instructors.first_name} {event.instructors.last_name}</p>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Registration Details</h2>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><span className="font-medium">Name:</span> {registration.name}</p>
                  <p><span className="font-medium">Email:</span> {registration.email}</p>
                  <p><span className="font-medium">Registration Date:</span> {formatDate(registration.created_at)}</p>
                  <p><span className="font-medium">Status:</span> <span className="text-yellow-600 dark:text-yellow-400">Pending Payment</span></p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-gray-800 dark:text-white">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">${event.price || 199}</span>
                </div>
                
                <button
                  onClick={handlePayment}
                  disabled={isRedirecting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isRedirecting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Redirecting to Checkout...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Proceed to Payment
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
