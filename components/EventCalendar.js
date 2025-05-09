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

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm} EST`;
  };

  // Function to determine the gradient and decorative elements based on the event topic
  const getEventTheme = (event, index) => {
    // Default themes if we can't determine the topic
    const defaultThemes = [
      {
        gradient: "bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500",
        decoration: (
          <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-20">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M47.5,-57.2C59.9,-46.8,67.5,-30.9,71.5,-13.7C75.5,3.5,75.8,22,68.2,36.7C60.5,51.4,44.8,62.3,27.9,67.2C11,72.1,-7.2,71,-22.7,64.5C-38.2,58,-51,46.2,-60.9,31.1C-70.8,16,-77.8,-2.4,-74.3,-19.2C-70.8,-36,-56.8,-51.2,-41.3,-61.1C-25.8,-71,-12.9,-75.6,1.9,-77.9C16.7,-80.2,35.1,-67.5,47.5,-57.2Z" transform="translate(100 100)" />
            </svg>
          </div>
        )
      },
      {
        gradient: "bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500",
        decoration: (
          <div className="absolute -top-6 -left-6 w-32 h-32 opacity-20">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M44.5,-52.1C59.1,-42.7,73.2,-29.6,77.8,-13.5C82.4,2.6,77.4,21.7,67.1,36.7C56.7,51.7,41,62.7,23.9,68.4C6.8,74.1,-11.6,74.5,-27.5,68.1C-43.4,61.7,-56.7,48.4,-65.4,32.2C-74.1,16,-78.1,-3.1,-73.3,-19.8C-68.5,-36.5,-54.9,-50.8,-39.8,-60C-24.7,-69.1,-8.1,-73.1,5.2,-79C18.5,-84.9,29.9,-61.5,44.5,-52.1Z" transform="translate(100 100)" />
            </svg>
          </div>
        )
      },
      {
        gradient: "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500",
        decoration: (
          <div className="absolute -bottom-6 -left-6 w-32 h-32 opacity-20">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M47.7,-51.2C61.3,-33.8,71.7,-16.9,71.4,-0.3C71.1,16.3,60.2,32.6,46.5,44.9C32.6,57.2,16.3,65.6,-2.2,67.8C-20.7,70,-41.4,66,-54.9,53.7C-68.4,41.4,-74.7,20.7,-73.4,1.3C-72.1,-18.1,-63.3,-36.2,-49.8,-53.6C-36.2,-71,-18.1,-87.8,-0.6,-87.2C16.9,-86.5,33.8,-68.6,47.7,-51.2Z" transform="translate(100 100)" />
            </svg>
          </div>
        )
      }
    ];
    
    // Try to determine the topic from the event name or description
    const name = event.name?.toLowerCase() || '';
    const description = event.description?.toLowerCase() || '';
    const content = name + ' ' + description;
    
    if (content.includes('machine learning') || content.includes('ml') || content.includes('ai basics') || content.includes('artificial intelligence')) {
      return {
        gradient: "bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500",
        decoration: (
          <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-20">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M47.5,-57.2C59.9,-46.8,67.5,-30.9,71.5,-13.7C75.5,3.5,75.8,22,68.2,36.7C60.5,51.4,44.8,62.3,27.9,67.2C11,72.1,-7.2,71,-22.7,64.5C-38.2,58,-51,46.2,-60.9,31.1C-70.8,16,-77.8,-2.4,-74.3,-19.2C-70.8,-36,-56.8,-51.2,-41.3,-61.1C-25.8,-71,-12.9,-75.6,1.9,-77.9C16.7,-80.2,35.1,-67.5,47.5,-57.2Z" transform="translate(100 100)" />
            </svg>
          </div>
        ),
        icon: (
          <div className="absolute top-4 right-4 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/>
              <path d="M10 7H8v6h2zm6 0h-2v6h2z"/>
            </svg>
          </div>
        )
      };
    } else if (content.includes('data') || content.includes('analytics') || content.includes('visualization') || content.includes('statistics')) {
      return {
        gradient: "bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500",
        decoration: (
          <div className="absolute -top-6 -left-6 w-32 h-32 opacity-20">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M44.5,-52.1C59.1,-42.7,73.2,-29.6,77.8,-13.5C82.4,2.6,77.4,21.7,67.1,36.7C56.7,51.7,41,62.7,23.9,68.4C6.8,74.1,-11.6,74.5,-27.5,68.1C-43.4,61.7,-56.7,48.4,-65.4,32.2C-74.1,16,-78.1,-3.1,-73.3,-19.8C-68.5,-36.5,-54.9,-50.8,-39.8,-60C-24.7,-69.1,-8.1,-73.1,5.2,-79C18.5,-84.9,29.9,-61.5,44.5,-52.1Z" transform="translate(100 100)" />
            </svg>
          </div>
        ),
        icon: (
          <div className="absolute top-4 right-4 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 9h4v11H4zm6-5h4v16h-4zm6 8h4v8h-4z"/>
            </svg>
          </div>
        )
      };
    } else if (content.includes('nlp') || content.includes('language') || content.includes('text') || content.includes('chat') || content.includes('gpt')) {
      return {
        gradient: "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500",
        decoration: (
          <div className="absolute -bottom-6 -left-6 w-32 h-32 opacity-20">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M47.7,-51.2C61.3,-33.8,71.7,-16.9,71.4,-0.3C71.1,16.3,60.2,32.6,46.5,44.9C32.6,57.2,16.3,65.6,-2.2,67.8C-20.7,70,-41.4,66,-54.9,53.7C-68.4,41.4,-74.7,20.7,-73.4,1.3C-72.1,-18.1,-63.3,-36.2,-49.8,-53.6C-36.2,-71,-18.1,-87.8,-0.6,-87.2C16.9,-86.5,33.8,-68.6,47.7,-51.2Z" transform="translate(100 100)" />
            </svg>
          </div>
        ),
        icon: (
          <div className="absolute top-4 right-4 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
            </svg>
          </div>
        )
      };
    }
    
    // If we couldn't determine the topic, use the default themes
    return defaultThemes[index % defaultThemes.length];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 text-center">
        <div className="bg-white shadow-lg rounded-xl p-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-6 h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8 text-center">
        <div className="bg-white shadow-lg rounded-xl p-8">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {events.length > 0 ? (
          events.map((event, index) => {
            const theme = getEventTheme(event, index);
            return (
              <div key={event.id} className="rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                <div className={`h-full ${theme.gradient} text-white relative overflow-hidden`}>
                  {theme.decoration}
                  {theme.icon}
                  
                  <div className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm text-white">
                        {formatDate(event.start_date)}
                      </div>
                      <div className="text-white/80 text-sm font-medium">
                        {formatTime(event.start_time)}
                      </div>
                    </div>
                    
                    <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg mb-4">
                      <h3 className="text-2xl font-bold text-white mb-3">{event.name}</h3>
                      
                      <p className="text-lg font-medium text-white mb-1 line-clamp-3">{event.description}</p>
                    </div>
                    
                    {/* Display event image if available */}
                    {event.image_name && (
                      <div className="mb-4 overflow-hidden rounded-lg">
                        <img 
                          src={`/${event.image_name}`} 
                          alt={event.name}
                          className="w-full object-cover transform hover:scale-105 transition-transform duration-300"
                          style={{ height: '500px' }}
                          onError={(e) => {
                            console.error(`Failed to load image: ${event.image_name}`);
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    {event.instructor && (
                      <div className="flex items-center gap-3 mb-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">
                            {event.instructor.first_name.charAt(0)}
                            {event.instructor.last_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {event.instructor.first_name} {event.instructor.last_name}
                          </div>
                          <div className="text-white/80 text-sm">
                            {event.instructor.title}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-white">
                        ${event.price}
                      </div>
                      <Link href={`/events/${event.id}`} legacyBehavior>
                        <a className="px-4 py-2 rounded-lg bg-white text-indigo-600 font-bold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
                          Register
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 text-center py-12">
            <div className="bg-white shadow-lg rounded-xl p-8">
              <h3 className="text-xl text-gray-900 mb-2">No upcoming events</h3>
              <p className="text-gray-600">Check back soon for new workshop dates!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}