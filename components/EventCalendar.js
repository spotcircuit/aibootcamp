import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch events and instructors from Supabase directly
  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            instructor:instructors(*)
          `)
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
        
        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {formatDate(event.start_date)}
                </p>
                <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>
                
                {event.instructor && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">Instructor</h4>
                    <p className="text-lg font-semibold text-gray-800">{event.instructor.first_name} {event.instructor.last_name}</p>
                    <p className="text-blue-600 text-sm font-medium mb-2">{event.instructor.title}</p>
                    <p className="text-gray-600 text-sm mb-1 italic line-clamp-2">{event.instructor.summary}</p> 
                    <p className="text-gray-600 text-sm mt-2 line-clamp-3">{event.instructor.bio}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <Link href={`/events/${event.id}`} passHref>
                  <span className="text-blue-600 hover:text-blue-800 font-semibold">
                    Learn More &rarr;
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
