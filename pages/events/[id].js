import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import EventRegistration from '../../components/EventRegistration';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: authLoading } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchEvent = async () => {
      try {
        setLoading(true);
        
        // Fetch event details
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setEvent(data);
        
        // Check if user is already registered
        if (user) {
          checkRegistrationStatus(data.id, user.id);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id, user]);
  
  const checkRegistrationStatus = async (eventId, userId) => {
    try {
      // Try registrations table first
      let { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('event_id', eventId)
        .eq('auth_user_id', userId);
      
      if (error && error.code === '42P01') {
        // If table doesn't exist, try event_registrations
        const response = await supabase
          .from('event_registrations')
          .select('*')
          .eq('event_id', eventId)
          .eq('auth_user_id', userId);
        
        data = response.data;
      }
      
      if (data && data.length > 0) {
        const registration = data[0];
        setIsRegistered(true);
        setRegistrationId(registration.id);
        
        // Check if registration is paid
        setIsPaid(registration.payment_status === 'paid');
        console.log(`Registration found. ID: ${registration.id}, Payment Status: ${registration.payment_status}`);
      } else {
        setIsRegistered(false);
        setIsPaid(false);
        setRegistrationId(null);
      }
    } catch (error) {
      console.error('Error checking registration status:', error);
    }
  };
  
  const handleRegistrationSuccess = () => {
    setRegistrationSuccess(true);
    setShowRegistrationForm(false);
    setIsRegistered(true);
  };
  
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
  
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      // Extract just the time portion (HH:MM) from the ISO string
      // Format: "2025-05-30T09:00:00+00:00"
      if (dateString.includes('T')) {
        const timePart = dateString.split('T')[1];
        // Extract hours and minutes
        const timeComponents = timePart.split(':');
        const hours = parseInt(timeComponents[0], 10);
        const minutes = timeComponents[1];
        
        // Convert to 12-hour format
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
        
        return `${hours12}:${minutes} ${ampm} EST`;
      }
      return dateString;
    } catch (error) {
      console.error('Error formatting time:', error);
      return dateString; // Return original if parsing fails
    }
  };
  
  const formatTimeRange = (startDate, endDate) => {
    if (!startDate || !endDate) return formatTime(startDate);
    return `${formatTime(startDate)} - ${formatTime(endDate)}`;
  };

  if (loading || authLoading) {
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

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h1>
            <p className="text-gray-700 dark:text-gray-300">{error || 'Event not found'}</p>
            <div className="mt-6">
              <Link href="/events" className="text-blue-600 dark:text-blue-400 hover:underline">
                Back to Events
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
        <div className="max-w-4xl mx-auto">
          <Link href="/events" className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
            ← Back to Events
          </Link>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{event.name}</h1>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                  {formatDate(event.start_date)}
                </div>
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                  {formatTimeRange(event.start_date, event.end_date)}
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm">
                  ${event.price || 199}
                </div>
              </div>
              
              <div className="prose dark:prose-invert max-w-none mb-8">
                <p className="text-gray-700 dark:text-gray-300">{event.description}</p>
                
                {/* Display event image if available */}
                {event.image_name && (
                  <div className="mt-6 flex justify-center">
                    <img 
                      src={`/${event.image_name}`} 
                      alt={event.name}
                      className="rounded-md w-full object-contain"
                      style={{ maxHeight: '400px', minHeight: '300px' }}
                      onError={(e) => {
                        console.error(`Failed to load image: ${event.image_name}`);
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Event Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</h3>
                    <p className="text-gray-900 dark:text-white">{formatDate(event.start_date)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</h3>
                    <p className="text-gray-900 dark:text-white">{formatTime(event.start_date)} - {formatTime(event.end_date)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                    <p className="text-gray-900 dark:text-white">{event.location || 'Online (Zoom)'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</h3>
                    <p className="text-gray-900 dark:text-white">${event.price || 199}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                {registrationSuccess ? (
                  <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded mb-4">
                    <p className="font-bold">Registration Successful!</p>
                    <p>Thank you for registering for this event. You can view your registrations on your dashboard.</p>
                    <div className="mt-4">
                      <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Go to Dashboard
                      </Link>
                    </div>
                  </div>
                ) : isRegistered ? (
                  <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-700 text-blue-700 dark:text-blue-200 px-4 py-3 rounded mb-4">
                    {isPaid ? (
                      <>
                        <p className="font-bold">You&apos;re registered for this event!</p>
                        <p>Your registration is confirmed and payment has been received.</p>
                        
                        {/* Show meeting link only if payment is complete */}
                        {event.meeting_link && (
                          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-md border border-green-200 dark:border-green-700">
                            <p className="font-medium text-green-800 dark:text-green-200 mb-2">Meeting Link:</p>
                            <div className="break-all">
                              <a 
                                href={event.meeting_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {event.meeting_link}
                              </a>
                            </div>
                            <p className="mt-2 text-sm text-green-700 dark:text-green-300">
                              Click the link above to join the meeting at the scheduled time.
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="font-bold">Your registration is pending payment</p>
                        <p className="mb-4">Please complete your payment to confirm your spot for this event.</p>
                        
                        {/* Payment button for pending registrations */}
                        <a 
                          href={`/payment/${registrationId}?eventId=${event.id}`}
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors w-fit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Complete Payment
                        </a>
                        
                        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-md border border-yellow-200 dark:border-yellow-700">
                          <p className="text-yellow-800 dark:text-yellow-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Meeting link and event details will be available after payment is complete.
                          </p>
                        </div>
                      </>
                    )}
                    
                    <div className="mt-4">
                      <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Go to Dashboard
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    {!user && (
                      <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 px-4 py-3 rounded mb-4">
                        <p>Please log in to register for this event.</p>
                        <div className="mt-4">
                          <Link 
                            href={`/login?redirect=/events/${id}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Log In
                          </Link>
                        </div>
                      </div>
                    )}
                    
                    {user && !showRegistrationForm && (
                      <button
                        onClick={() => setShowRegistrationForm(true)}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Register for This Event
                      </button>
                    )}
                    
                    {user && showRegistrationForm && (
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Registration Form</h2>
                        <EventRegistration 
                          event={event} 
                          user={user} 
                          onSuccess={handleRegistrationSuccess} 
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}