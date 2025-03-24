import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { withAuth } from '../lib/auth';

function Dashboard({ user }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          console.log('Dashboard: Fetching data for user', user.id);
          // Fetch user's registrations
          fetchUserData(user.id);
        } else {
          console.log('Dashboard: No user available yet');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Error loading data: ' + error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);
  
  const fetchUserData = async (userId) => {
    try {
      let userRegistrations = [];
      
      // Try to fetch from registrations table first
      const { data: regsData, error: regsError } = await supabase
        .from('registrations')
        .select(`
          *,
          events (*)
        `)
        .eq('auth_user_id', userId);
      
      // If that fails, try event_registrations table
      if (regsError && regsError.code === '42P01') {
        console.log('Registrations table not found, trying event_registrations');
        const { data: eventRegsData, error: eventRegsError } = await supabase
          .from('event_registrations')
          .select(`
            *,
            events (*)
          `)
          .eq('auth_user_id', userId);
        
        if (eventRegsError) {
          if (eventRegsError.code === '42P01') {
            console.log('Event registrations table not found. Treating as no registrations.');
          } else {
            console.error('Event registration fetch error:', eventRegsError);
          }
        } else {
          userRegistrations = eventRegsData || [];
        }
      } else {
        userRegistrations = regsData || [];
      }
      
      setRegistrations(userRegistrations);
      
      // Fetch available events
      const { data: allEvents, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (eventsError) {
        if (eventsError.code === '42P01') { // Table does not exist error
          console.log('Events table not found. Setting empty events array.');
          setEvents([]);
        } else {
          console.error('Events fetch error:', eventsError);
          setEvents([]);
        }
      } else {
        setEvents(allEvents || []);
      }

      setError(null);
      setLoading(false);
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      setError('Unable to retrieve your events information at this time.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">Your Dashboard</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-300 dark:bg-gray-700 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md">
            {error}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Welcome, {user?.user_metadata?.name || user?.email?.split('@')[0]}!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {user?.email}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link href="/profile" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Your Registrations</h2>
              
              {loading ? (
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
              ) : error ? (
                <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">
                  <p>There was an error loading your registrations. Please try again later.</p>
                </div>
              ) : registrations.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">You are not registered for any events yet.</p>
                  <Link href="/events" passHref>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      Browse Events
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {registrations.map((registration) => (
                    <div key={registration.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                        {registration.events?.name || registration.events?.title || 'Unknown Event'}
                      </h3>
                      
                      <div className="mb-4">
                        <p className="text-gray-600 dark:text-gray-400 mb-1">
                          <span className="font-medium">Date:</span> {
                            registration.events?.start_date || registration.events?.date
                              ? new Date(registration.events?.start_date || registration.events?.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                              : 'TBD'
                          }
                        </p>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-1">
                          <span className="font-medium">Time:</span> {
                            registration.events?.start_date
                              ? new Date(registration.events.start_date).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'TBD'
                          }
                        </p>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-1">
                          <span className="font-medium">Location:</span> {registration.events?.location || 'Online (Zoom)'}
                        </p>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-1">
                          <span className="font-medium">Payment:</span> {
                            registration.amount_paid
                              ? `$${registration.amount_paid} (Paid)`
                              : registration.stripe_payment_id
                                ? 'Paid'
                                : 'Pending'
                          }
                        </p>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Link href={`/events/${registration.event_id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                          View Event
                        </Link>
                        
                        {/* We could add a "Cancel Registration" button here if needed in the future */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Upcoming Events</h2>
              
              {events.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 py-4">No upcoming events at the moment. Check back later!</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {events.slice(0, 4).map((event) => (
                    <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="font-bold text-gray-800 dark:text-white">{event.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{formatDate(event.start_date)}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{event.description}</p>
                      
                      <div className="mt-4">
                        <Link href={`/events/${event.id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {events.length > 4 && (
                <div className="mt-6 text-center">
                  <Link href="/events" className="text-cyan-600 dark:text-cyan-400 hover:underline">
                    View All Events
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <footer className="bg-gray-800 text-white py-8 mt-10">
        <div className="container mx-auto px-4">
          <p className="text-center">
            &copy; {new Date().getFullYear()} AI Bootcamp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Wrap the Dashboard component with authentication
export default withAuth(Dashboard, {
  redirectTo: '/login'
});
