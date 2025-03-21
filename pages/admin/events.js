import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import Navigation from '../../components/Navigation';
import AdminLayout from '../../components/AdminLayout';

function EventsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    max_participants: 20,
    is_virtual: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is an administrator
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        // Query the user profile to check admin status
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (!data || !data.is_admin) {
          // User is not an admin, redirect to dashboard
          router.push('/dashboard');
          return;
        }
        
        setIsAdmin(true);
        await fetchEvents();
      } catch (error) {
        console.error('Error checking admin status:', error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [router]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  };

  const openAddModal = () => {
    setCurrentEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      start_time: '',
      end_time: '',
      location: '',
      max_participants: 20,
      is_virtual: false
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      date: event.date || '',
      start_time: event.start_time || '',
      end_time: event.end_time || '',
      location: event.location || '',
      max_participants: event.max_participants || 20,
      is_virtual: event.is_virtual || false
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      start_time: '',
      end_time: '',
      location: '',
      max_participants: 20,
      is_virtual: false
    });
    setFormErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.start_time) errors.start_time = 'Start time is required';
    if (!formData.end_time) errors.end_time = 'End time is required';
    if (!formData.location) errors.location = 'Location is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitLoading(true);
    
    try {
      if (currentEvent) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update(formData)
          .eq('id', currentEvent.id);
        
        if (error) throw error;
      } else {
        // Create new event
        const { error } = await supabase
          .from('events')
          .insert([formData]);
        
        if (error) throw error;
      }
      
      closeModal();
      await fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error.message);
      alert('Error saving event. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
      
      if (error) throw error;
      
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error.message);
      alert('Error deleting event. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
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
    );
  }

  if (!isAdmin) {
    return null; // Redirecting, so don't render anything
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Events Management</h1>
            <div className="flex space-x-2">
              <Link href="/admin" className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                Back to Admin
              </Link>
              <button
                onClick={openAddModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Event
              </button>
            </div>
          </div>
          
          {events.length === 0 ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No events found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new event.</p>
              <div className="mt-6">
                <button
                  onClick={openAddModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Event
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Participants</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{event.is_virtual ? 'Virtual Event' : 'In-Person'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{formatDate(event.date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{event.start_time} - {event.end_time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{event.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{event.max_participants}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openEditModal(event)}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(event.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div 
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog" 
              aria-modal="true" 
              aria-labelledby="modal-headline"
            >
              <form onSubmit={handleSubmit}>
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-headline">
                        {currentEvent ? 'Edit Event' : 'Add New Event'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                          {formErrors.title && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.title}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          ></textarea>
                          {formErrors.description && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.description}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Date
                            </label>
                            <input
                              type="date"
                              name="date"
                              id="date"
                              value={formData.date}
                              onChange={handleChange}
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            />
                            {formErrors.date && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.date}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Location
                            </label>
                            <input
                              type="text"
                              name="location"
                              id="location"
                              value={formData.location}
                              onChange={handleChange}
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            />
                            {formErrors.location && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.location}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Start Time
                            </label>
                            <input
                              type="time"
                              name="start_time"
                              id="start_time"
                              value={formData.start_time}
                              onChange={handleChange}
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            />
                            {formErrors.start_time && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.start_time}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              End Time
                            </label>
                            <input
                              type="time"
                              name="end_time"
                              id="end_time"
                              value={formData.end_time}
                              onChange={handleChange}
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            />
                            {formErrors.end_time && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.end_time}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Max Participants
                            </label>
                            <input
                              type="number"
                              name="max_participants"
                              id="max_participants"
                              min="1"
                              value={formData.max_participants}
                              onChange={handleChange}
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            />
                          </div>
                          
                          <div className="flex items-center mt-6">
                            <input
                              id="is_virtual"
                              name="is_virtual"
                              type="checkbox"
                              checked={formData.is_virtual}
                              onChange={handleChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                            />
                            <label htmlFor="is_virtual" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              Virtual Event
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {submitLoading ? 'Saving...' : currentEvent ? 'Save Changes' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminEventsPage() {
  return (
    <AdminLayout>
      <EventsAdmin />
    </AdminLayout>
  );
}
