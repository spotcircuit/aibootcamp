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
      
      setIsRegistered(data && data.length > 0);
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
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
                  {formatTime(event.start_date)} - {formatTime(event.end_date)}
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm">
                  ${event.price || 199}
                </div>
              </div>
              
              <div className="prose dark:prose-invert max-w-none mb-8">
                <p className="text-gray-700 dark:text-gray-300">{event.description}</p>
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
                    <p className="font-bold">You&apos;re registered for this event!</p>
                    <p>You can view your registration details on your dashboard.</p>
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