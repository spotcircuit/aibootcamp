import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch events from Supabase directly
  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('start_date', { ascending: true })
          .limit(3); // Only show 3 upcoming events on the homepage
        
        if (error) throw error;
        
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
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

  if (loading) return <div className="text-center py-12">Loading events...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <section id="events" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>
        
        {events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No upcoming events at the moment. Check back later!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-500">
                      <div>Date: {formatDate(event.start_date)}</div>
                      <div>Location: {event.location || 'Online (Zoom)'}</div>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      ${event.price || 199}
                    </div>
                  </div>
                  <Link
                    href={`/events/${event.id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-8">
          <Link
            href="/events"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            View All Events
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
