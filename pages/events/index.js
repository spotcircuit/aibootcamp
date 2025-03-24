import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import { getAllEvents } from '../../lib/events';
import { useAuth } from '../../lib/auth';

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await getAllEvents();
        setEvents(eventsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">Upcoming Events</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
            <p className="text-gray-700 dark:text-gray-300">No upcoming events at the moment. Check back later!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{event.name}</h2>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                      {formatDate(event.start_date)}
                    </span>
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs">
                      {event.location || 'Online (Zoom)'}
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-xs">
                      ${event.price || 199}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <Link 
                      href={`/events/${event.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Details
                    </Link>
                    
                    <Link 
                      href={user ? `/events/${event.id}` : `/login?redirect=/events/${event.id}`}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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