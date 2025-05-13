import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Navigation from '../../components/Navigation';
import { getAllEvents } from '../../lib/events';
import { useAuth } from '../../lib/auth';

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await getAllEvents();
        setEvents(eventsData);
        setFilteredEvents(eventsData);
        setError(null);
        
        // Check for category in URL
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const category = urlParams.get('category');
          if (category) {
            setActiveCategory(category);
            filterEventsByCategory(eventsData, category);
          }
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  
  const filterEventsByCategory = (eventsToFilter, category) => {
    if (category === 'all') {
      setFilteredEvents(eventsToFilter);
      return;
    }
    
    const filtered = eventsToFilter.filter(event => {
      const name = event.name?.toLowerCase() || '';
      const description = event.description?.toLowerCase() || '';
      const content = name + ' ' + description;
      
      switch(category) {
        case 'ai':
          return content.includes('machine learning') || content.includes('ml') || 
                 content.includes('ai') || content.includes('artificial intelligence');
        case 'data':
          return content.includes('data') || content.includes('analytics') || 
                 content.includes('visualization') || content.includes('statistics');
        case 'nlp':
          return content.includes('nlp') || content.includes('language') || 
                 content.includes('text') || content.includes('chat') || content.includes('gpt');
        case 'creative':
          return content.includes('creative') || content.includes('design') || 
                 content.includes('art') || content.includes('generate');
        default:
          return true;
      }
    });
    
    setFilteredEvents(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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
    } else if (content.includes('creative') || content.includes('design') || content.includes('art') || content.includes('generate')) {
      return {
        gradient: "bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500",
        decoration: (
          <div className="absolute -top-6 -right-6 w-32 h-32 opacity-20">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M42.7,-62.2C56.8,-53.9,70.8,-43.2,77.2,-28.7C83.7,-14.2,82.5,4.1,76.4,19.9C70.2,35.7,59.1,48.9,45.1,57.9C31.1,66.9,14.1,71.6,-2.3,74.8C-18.8,78,-37.5,79.6,-51.9,71.5C-66.3,63.4,-76.3,45.6,-79.2,27.2C-82.2,8.8,-78,-10.2,-70.2,-26.1C-62.4,-42,-50.9,-54.8,-37.4,-63.2C-23.9,-71.6,-8.3,-75.7,4.2,-81.5C16.7,-87.3,28.6,-70.5,42.7,-62.2Z" transform="translate(100 100)" />
            </svg>
          </div>
        ),
        icon: (
          <div className="absolute top-4 right-4 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z"/>
              <circle cx="6.5" cy="11.5" r="1.5"/>
              <circle cx="9.5" cy="7.5" r="1.5"/>
              <circle cx="14.5" cy="7.5" r="1.5"/>
              <circle cx="17.5" cy="11.5" r="1.5"/>
            </svg>
          </div>
        )
      };
    }
    
    // If we couldn't determine the topic, use the default themes
    return defaultThemes[index % defaultThemes.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Upcoming Events | AI Bootcamp</title>
        <meta name="description" content="Browse and register for upcoming AI workshops and events" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <div className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 opacity-90"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 opacity-20">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M47.5,-57.2C59.9,-46.8,67.5,-30.9,71.5,-13.7C75.5,3.5,75.8,22,68.2,36.7C60.5,51.4,44.8,62.3,27.9,67.2C11,72.1,-7.2,71,-22.7,64.5C-38.2,58,-51,46.2,-60.9,31.1C-70.8,16,-77.8,-2.4,-74.3,-19.2C-70.8,-36,-56.8,-51.2,-41.3,-61.1C-25.8,-71,-12.9,-75.6,1.9,-77.9C16.7,-80.2,35.1,-67.5,47.5,-57.2Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 opacity-20">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M44.5,-52.1C59.1,-42.7,73.2,-29.6,77.8,-13.5C82.4,2.6,77.4,21.7,67.1,36.7C56.7,51.7,41,62.7,23.9,68.4C6.8,74.1,-11.6,74.5,-27.5,68.1C-43.4,61.7,-56.7,48.4,-65.4,32.2C-74.1,16,-78.1,-3.1,-73.3,-19.8C-68.5,-36.5,-54.9,-50.8,-39.8,-60C-24.7,-69.1,-8.1,-73.1,5.2,-79C18.5,-84.9,29.9,-61.5,44.5,-52.1Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        {/* Header content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-6 drop-shadow-lg">
            Upcoming Events & Workshops
          </h1>
          <p className="text-xl text-white text-center max-w-3xl mx-auto mb-10 font-medium drop-shadow">
            Expand your AI skills with our expert-led workshops and events. 
            Register today to secure your spot!
          </p>
          
          {/* Category filter buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105 ${
                selectedCategory === null
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setSelectedCategory('AI')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105 ${
                selectedCategory === 'AI'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              AI
            </button>
            <button
              onClick={() => setSelectedCategory('Data')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105 ${
                selectedCategory === 'Data'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              Data
            </button>
            <button
              onClick={() => setSelectedCategory('NLP')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105 ${
                selectedCategory === 'NLP'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              NLP
            </button>
            <button
              onClick={() => setSelectedCategory('Creative')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105 ${
                selectedCategory === 'Creative'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              Creative
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              {filteredEvents.map((event, index) => (
                <div key={event.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${getEventTheme(event, index).gradient}`}>
                  {getEventTheme(event, index).decoration}
                  {getEventTheme(event, index).icon}
                  <div className="p-6 relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{event.name}</h2>
                    <div className="flex items-center mb-3">
                      <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-white font-medium">{formatDate(event.start_date)}</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-white font-medium">{formatTimeRange(event.start_date, event.end_date)}</span>
                    </div>
                    <p className="text-white text-lg mb-4 font-medium leading-relaxed line-clamp-3">{event.description}</p>
                    
                    {/* Display event image if available */}
                    {event.image_name && (
                      <div className="mb-4 flex justify-center">
                        <img 
                          src={`/${event.image_name}`} 
                          alt={event.name}
                          className="rounded-md max-h-96 w-full object-contain"
                          style={{ minHeight: '200px' }}
                          onError={(e) => {
                            console.error(`Failed to load image: ${event.image_name}`);
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center mb-4">
                      <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <span className="text-white font-medium">{event.location || 'Online'}</span>
                    </div>
                    {event.instructor && (
                      <div className="flex items-center mb-6">
                        <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span className="text-white font-medium">{event.instructor}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {event.category || 'Workshop'}
                      </span>
                      <Link href={`/events/${event.id}`} legacyBehavior>
                        <a className="bg-white text-gray-800 hover:bg-gray-100 font-bold py-2 px-4 rounded-full inline-flex items-center transition-all duration-200 transform hover:scale-105">
                          <span>Details</span>
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </svg>
                        </a>
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
    </div>
  );
}