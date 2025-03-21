import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function EventCalendar() {
  const [view, setView] = useState('calendar');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: 'beginner',
  });
  const [registering, setRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // Fetch events from Supabase
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError(null);
        
        // Check if Supabase client is available with valid keys
        if (!supabase) {
          throw new Error('Supabase client is not initialized properly');
        }
        
        // Use Supabase client directly
        const { data, error: supabaseError } = await supabase
          .from('events')
          .select('*')
          .order('startDate', { ascending: true });
        
        if (supabaseError) {
          throw supabaseError;
        }
        
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
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setRegistrationSuccess(false);
    setRegistering(false);
    setFormData({
      name: '',
      email: '',
      experience: 'beginner',
    });
  };
  
  const closeEventModal = () => {
    setSelectedEvent(null);
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Register for an event
  const registerForEvent = async (eventId) => {
    try {
      setRegistering(true);
      
      // Validate form
      if (!formData.name || !formData.email) {
        alert('Please fill in all required fields');
        setRegistering(false);
        return;
      }
      
      // Use Supabase client directly
      const { data, error } = await supabase
        .from('registrations')
        .insert([
          { 
            name: formData.name,
            email: formData.email,
            experience: formData.experience,
            eventId: parseInt(eventId),
            isPaid: false
          }
        ])
        .select();
      
      if (error) throw error;
      
      setRegistrationSuccess(true);
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Error registering for event. Please try again.');
    } finally {
      setRegistering(false);
    }
  };
  
  return (
    <div id="schedule" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Upcoming Bootcamp Sessions</h2>
        
        <div className="flex justify-center space-x-4 mb-8">
          <button
            className={`calendar-view-btn ${view === 'calendar' ? 'calendar-view-btn-active' : 'calendar-view-btn-inactive'}`}
            onClick={() => setView('calendar')}
          >
            Calendar View
          </button>
          <button
            className={`calendar-view-btn ${view === 'list' ? 'calendar-view-btn-active' : 'calendar-view-btn-inactive'}`}
            onClick={() => setView('list')}
          >
            List View
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200 max-w-2xl mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 text-xl font-medium mb-1">Error Loading Events</p>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-blue-50 rounded-lg border border-blue-200 max-w-2xl mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-blue-800 text-xl font-medium mb-1">No Events Found</p>
            <p className="text-blue-600">No upcoming bootcamp sessions are currently scheduled.</p>
            <p className="text-blue-600 mt-2">Please check back later or contact us for more information.</p>
          </div>
        ) : view === 'list' ? (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-blue-50 cursor-pointer" onClick={() => handleEventClick(event)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{event.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(event.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                        {new Date(event.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">${event.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        Register
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-blue-100 hover:shadow-xl transition-shadow duration-300"
                onClick={() => handleEventClick(event)}
              >
                <div className="bg-blue-800 text-white p-4">
                  <h3 className="text-xl font-bold truncate">{event.name}</h3>
                  <p className="text-blue-100 mt-1">
                    {new Date(event.startDate).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm">
                      ${event.price}
                    </span>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="event-modal">
            <div className="event-modal-content max-w-md mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
              <div className="bg-blue-800 text-white p-6">
                <h3 className="text-2xl font-bold">{selectedEvent.name}</h3>
                <p className="mt-2 text-blue-100">
                  {new Date(selectedEvent.startDate).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric'
                  })}
                </p>
                <p className="text-blue-100">
                  {new Date(selectedEvent.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                  {new Date(selectedEvent.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
              
              <div className="p-6">
                <p className="mb-4 text-gray-700">{selectedEvent.description}</p>
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="block text-gray-500 text-sm">Price</span>
                    <span className="text-2xl font-bold text-blue-800">${selectedEvent.price}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-sm">Capacity</span>
                    <span className="text-2xl font-bold text-blue-800">{selectedEvent.capacity} seats</span>
                  </div>
                </div>
                
                {registrationSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 className="text-xl font-medium text-green-800 mb-1">Registration Successful!</h4>
                    <p className="text-green-700">Thank you for registering. You will receive a confirmation email shortly.</p>
                  </div>
                ) : (
                  <form>
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="experience" className="form-label">AI Experience Level</label>
                      <select
                        id="experience"
                        name="experience"
                        className="form-select"
                        value={formData.experience}
                        onChange={handleFormChange}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    
                    <div className="mt-6 flex justify-between gap-4">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 w-1/2"
                        onClick={closeEventModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 w-1/2 flex justify-center items-center"
                        onClick={() => registerForEvent(selectedEvent.id)}
                        disabled={registering}
                      >
                        {registering ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : 'Register Now'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
              
              <button
                onClick={closeEventModal}
                className="absolute top-4 right-4 text-white hover:text-blue-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
