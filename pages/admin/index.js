import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { withAdminAuth } from '../../lib/auth';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [instructors, setInstructors] = useState([]); 
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    metadata: {}
  });
  
  // Archive state
  const [showArchivedEvents, setShowArchivedEvents] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showBatchActions, setShowBatchActions] = useState(false);
  
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
  const [currentInstructor, setCurrentInstructor] = useState(null);
  const [isEditingInstructor, setIsEditingInstructor] = useState(false);
  const [isSubmittingInstructor, setIsSubmittingInstructor] = useState(false);
  const [instructorError, setInstructorError] = useState(null);
  
  // Registration action states
  const [sendingReminder, setSendingReminder] = useState(null);
  const [reminderSuccess, setReminderSuccess] = useState(null);
  const [reminderError, setReminderError] = useState(null);
  
  // Section collapse states
  const [sectionsCollapsed, setSectionsCollapsed] = useState({
    users: false,
    instructors: false,
    events: false,
    registrations: false
  }); 

  useEffect(() => {
    const getUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }
        const data = await response.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getUsers();
  }, []);

  useEffect(() => {
    const getInstructors = async () => {
      try {
        setIsLoading(true); 
        const response = await fetch('/api/admin/instructors');
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || 'Failed to fetch instructors');
        }
        const data = await response.json();
        setInstructors(data || []);
      } catch (err) {
        console.error('Error fetching instructors:', err);
        setError(err.message); 
      } finally {
        setIsLoading(false);
      }
    };
    getInstructors();
  }, []);

  useEffect(() => {
    const getEvents = async () => {
      try {
        setIsLoading(true);
        
        // Pass showArchived parameter to include archived events if needed
        const url = showArchivedEvents 
          ? '/api/admin/events?showArchived=true' 
          : '/api/admin/events';
          
        const response = await fetch(url);
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }
        const data = await response.json();
        setEvents(data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getEvents();
  }, [showArchivedEvents]); // Re-fetch when showArchivedEvents changes

  useEffect(() => {
    const getRegistrations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/registrations');
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }
        const data = await response.json();
        console.log('Registration data:', data);
        setRegistrations(data || []);
      } catch (err) {
        console.error('Error fetching registrations:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getRegistrations();
  }, []);

  const handleEventSubmit = async (eventData) => {
    if (!eventData) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/events', {
        method: eventData.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const result = await response.json();

      setEvents(prev => {
        const filtered = prev.filter(e => e.id !== result.id);
        return [...filtered, result].sort((a, b) => 
          new Date(a.start_date) - new Date(b.start_date)
        );
      });

      setEditingEvent(null);
    } catch (err) {
      console.error('Error saving event:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = async (event) => {
    setSelectedEvent(event);
    try {
      const response = await fetch(`/api/admin/events/${event.id}/registrations`);
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      const data = await response.json();
      setRegistrations(data || []);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError(err.message);
    }
  };

  const handleArchiveEvent = async (eventId, isArchived) => {
    if (!eventId) return;
    
    const action = isArchived ? 'unarchive' : 'archive';
    const confirmMessage = isArchived 
      ? 'Are you sure you want to unarchive this event? It will become visible to users again.'
      : 'Are you sure you want to archive this event? It will no longer be visible to users but will remain in the system.';
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: action
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      // Refresh events list
      const updatedEventsResponse = await fetch(showArchivedEvents 
        ? '/api/admin/events?showArchived=true' 
        : '/api/admin/events');
      
      const updatedEvents = await updatedEventsResponse.json();
      setEvents(updatedEvents || []);
      
    } catch (err) {
      console.error(`Error ${action}ing event:`, err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBatchArchive = async (isArchived = false) => {
    if (selectedEvents.length === 0) {
      setError('No events selected for batch operation');
      return;
    }
    
    const action = isArchived ? 'unarchive' : 'archive';
    const confirmMessage = isArchived 
      ? `Are you sure you want to unarchive ${selectedEvents.length} events? They will become visible to users again.`
      : `Are you sure you want to archive ${selectedEvents.length} events? They will no longer be visible to users but will remain in the system.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Process each event in sequence
      for (const eventId of selectedEvents) {
        const response = await fetch(`/api/admin/events/${eventId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operation: action
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error ${action}ing event ${eventId}:`, errorText);
        }
      }
      
      // Refresh events list
      const updatedEventsResponse = await fetch(showArchivedEvents 
        ? '/api/admin/events?showArchived=true' 
        : '/api/admin/events');
      
      const updatedEvents = await updatedEventsResponse.json();
      setEvents(updatedEvents || []);
      
      // Clear selections
      setSelectedEvents([]);
      setShowBatchActions(false);
      
    } catch (err) {
      console.error(`Error during batch ${action}:`, err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleEventSelection = (eventId) => {
    setSelectedEvents(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };
  
  const handleSelectAllEvents = () => {
    if (selectedEvents.length === events.length) {
      // If all are selected, deselect all
      setSelectedEvents([]);
    } else {
      // Otherwise select all
      setSelectedEvents(events.map(event => event.id));
    }
  };
  
  const handleDuplicateEvent = async (eventId) => {
    if (!eventId) return;
    
    if (!confirm('Create a new copy of this event?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'duplicate'
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      
      const result = await response.json();
      
      // Add the new event to the list
      setEvents(prev => {
        const newEvents = [...prev, result.event];
        return newEvents.sort((a, b) => 
          new Date(a.start_date) - new Date(b.start_date)
        );
      });

      // Optionally, you could set the new event for editing right away
      setEditingEvent({
        id: result.event.id,
        name: result.event.name,
        description: result.event.description,
        start_date: new Date(result.event.start_date).toISOString().slice(0, 16),
        end_date: new Date(result.event.end_date).toISOString().slice(0, 16),
        location: result.event.location,
        price: result.event.price,
        instructor_id: result.event.instructor_id,
        meeting_link: result.event.meeting_link || '',
        meeting_type: result.event.meeting_type || '',
        image_name: result.event.image_name || ''
      });
      
    } catch (err) {
      console.error('Error duplicating event:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!eventId) return;
    
    if (!confirm('Are you sure you want to DELETE this event? This will permanently remove it and all associated registrations. Consider ARCHIVING instead.')) {
      return;
    }
    
    // Double-check for permanent deletion
    if (!confirm('WARNING: This action cannot be undone! Press OK to permanently delete.')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPaymentReminder = async (registration) => {
    if (!registration) return;
    
    if (!confirm(`Send payment reminder to ${registration.name || registration.email} for ${registration.event?.name || 'this event'}?`)) {
      return;
    }
    
    try {
      setSendingReminder(registration.id);
      setReminderError(null);
      setReminderSuccess(null);
      
      // Log the data being sent for debugging
      const requestData = {
        registrationId: registration.id,
        eventId: registration.event_id,
        eventTitle: registration.event?.name || 'AI Bootcamp Event',
        eventDate: registration.event?.start_date || new Date().toISOString(),
        name: registration.name || registration.email.split('@')[0],
        email: registration.email
      };
      
      console.log('Sending payment reminder with data:', requestData);
      
      const response = await fetch('/api/admin/sendPaymentReminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      // Log the raw response for debugging
      console.log('Payment reminder API response status:', response.status);
      
      const result = await response.json();
      console.log('Payment reminder API response:', result);
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to send payment reminder');
      }
      
      setReminderSuccess(`Payment reminder sent to ${registration.email}`);
      setTimeout(() => setReminderSuccess(null), 5000); // Clear success message after 5 seconds
    } catch (err) {
      console.error('Error sending payment reminder:', err);
      setReminderError(err.message);
      setTimeout(() => setReminderError(null), 5000); // Clear error message after 5 seconds
    } finally {
      setSendingReminder(null);
    }
  };
  
  const handleDeleteRegistration = async (registration) => {
    if (!registration) return;
    
    const isPaid = registration.payment_status?.toLowerCase() === 'paid';
    const confirmMessage = isPaid 
      ? `WARNING: This registration has been PAID. Are you absolutely sure you want to delete ${registration.name}'s registration for ${registration.event?.name || 'this event'}?` 
      : `Are you sure you want to delete ${registration.name}'s registration for ${registration.event?.name || 'this event'}?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }
    
    // Double confirmation for paid registrations
    if (isPaid && !confirm('This action cannot be undone and may require manual refund processing. Proceed with deletion?')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/deleteRegistration?registrationId=${registration.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete registration');
      }
      
      // Remove the deleted registration from state
      setRegistrations(prev => prev.filter(reg => reg.id !== registration.id));
    } catch (err) {
      console.error('Error deleting registration:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message);
    }
  };

  const handleEditClick = (event, e) => {
    e.stopPropagation();
    console.log('Edit clicked for event:', event);
    setEditingEvent({
      id: event.id,
      name: event.name,
      description: event.description,
      start_date: new Date(event.start_date).toISOString().slice(0, 16),
      end_date: new Date(event.end_date).toISOString().slice(0, 16),
      location: event.location,
      price: event.price,
      instructor_id: event.instructor_id,
      meeting_link: event.meeting_link || '',
      meeting_type: event.meeting_type || '',
      image_name: event.image_name || ''
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newUser.email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to create user');
        return;
      }

      setUsers(prev => [...prev, data.user]);
      setShowAddUser(false);
      setNewUser({ email: '', metadata: {} });
      alert(data.message || 'Invitation sent successfully!');
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddInstructor = () => {
    setCurrentInstructor({ first_name: '', last_name: '', title: '', summary: '', bio: '' });
    setIsEditingInstructor(false);
    setInstructorError(null);
    setIsInstructorModalOpen(true);
  };

  const handleEditInstructorClick = (instructor, e) => {
    e.stopPropagation(); 
    setCurrentInstructor({ 
      instructor_id: instructor.instructor_id,
      first_name: instructor.first_name || '', 
      last_name: instructor.last_name || '', 
      title: instructor.title || '', 
      summary: instructor.summary || '', 
      bio: instructor.bio || '' 
    });
    setIsEditingInstructor(true);
    setInstructorError(null);
    setIsInstructorModalOpen(true);
  };

  const handleCloseInstructorModal = () => {
    setIsInstructorModalOpen(false);
    setCurrentInstructor(null);
    setIsEditingInstructor(false);
    setInstructorError(null);
    setIsSubmittingInstructor(false);
  };

  const handleInstructorInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentInstructor(prev => ({ ...prev, [name]: value }));
  };

  const handleInstructorSubmit = async (e) => {
    e.preventDefault();
    if (!currentInstructor) return;
    setIsSubmittingInstructor(true);
    setInstructorError(null); 
    const method = isEditingInstructor ? 'PUT' : 'POST';
    const url = '/api/admin/instructors';
    const body = JSON.stringify(currentInstructor);

    try {
      const response = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: body });
      if (!response.ok) {
        let errorData = await response.json();
        let errorMsg = errorData.error || errorData.message || `Failed to ${isEditingInstructor ? 'update' : 'create'} instructor`;
        if (response.status === 409) { errorMsg = "Cannot delete: Instructor is assigned to one or more events."; }
        throw new Error(errorMsg);
      }
      
      const fetchResponse = await fetch('/api/admin/instructors');
      const updatedInstructors = await fetchResponse.json();
      setInstructors(updatedInstructors || []);
      
      handleCloseInstructorModal(); 
    } catch (err) {
      console.error(`Error ${isEditingInstructor ? 'updating' : 'creating'} instructor:`, err);
      setInstructorError(err.message || `Failed to ${isEditingInstructor ? 'update' : 'create'} instructor`); 
    } finally {
      setIsSubmittingInstructor(false);
    }
  };

  const handleDeleteInstructor = async (instructorId, e) => {
    e.stopPropagation(); 
    if (!window.confirm('Are you sure you want to delete this instructor? This might affect existing events.')) return;
      
    setInstructorError(null); 
    setError(null); 

    try {
      const response = await fetch(`/api/admin/instructors?instructor_id=${instructorId}`, { method: 'DELETE' });
      if (!response.ok) {
        let errorMsg = `Failed to delete instructor. Status: ${response.status}`;
        try {
          let errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
          if (response.status === 409) { errorMsg = "Cannot delete: Instructor is assigned to one or more events."; }
        } catch { errorMsg = response.statusText || errorMsg; }
        throw new Error(errorMsg);
      }
      setInstructors(prev => prev.filter(inst => inst.instructor_id !== instructorId));
    } catch (err) {
      console.error('Error deleting instructor:', err);
      setError(err.message); 
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Users Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center cursor-pointer" 
                 onClick={() => setSectionsCollapsed({...sectionsCollapsed, users: !sectionsCollapsed.users})}>
              {sectionsCollapsed.users ? 
                <ChevronDownIcon className="h-6 w-6 text-gray-500 mr-2" /> : 
                <ChevronUpIcon className="h-6 w-6 text-gray-500 mr-2" />}
              <h2 className="text-2xl font-semibold">Users</h2>
            </div>
            <button
              onClick={() => setShowAddUser(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add User
            </button>
          </div>

          {showAddUser && (
            <form onSubmit={handleAddUser} className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Add New User</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-base font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full px-4 py-3 text-base rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                {error && (
                  <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddUser(false)}
                    className="px-5 py-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-3 text-base font-medium text-white bg-indigo-600 dark:bg-indigo-500 border-2 border-transparent rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Sending...' : 'Send Invitation'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {!sectionsCollapsed.users && (
            <div className="overflow-x-auto">
              <div className={`${users.length > 20 ? 'max-h-[500px] overflow-y-auto' : ''}`}>
                <table className="min-w-full table-auto">
                  <thead className="sticky top-0 bg-white">
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Created At</th>
                      <th className="px-4 py-2 text-left">Last Sign In</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">{new Date(user.created_at).toLocaleString()}</td>
                        <td className="px-4 py-2">
                          {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Instructors Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center cursor-pointer" 
                 onClick={() => setSectionsCollapsed({...sectionsCollapsed, instructors: !sectionsCollapsed.instructors})}>
              {sectionsCollapsed.instructors ? 
                <ChevronDownIcon className="h-6 w-6 text-gray-500 mr-2" /> : 
                <ChevronUpIcon className="h-6 w-6 text-gray-500 mr-2" />}
              <h2 className="text-2xl font-semibold">Instructors</h2>
            </div>
            <button
              onClick={handleAddInstructor} 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Instructor
            </button>
          </div>

          {!sectionsCollapsed.instructors && (
            <div className="overflow-x-auto">
              <div className={`${instructors.length > 20 ? 'max-h-[500px] overflow-y-auto' : ''}`}>
                <table className="min-w-full table-auto">
                  <thead className="sticky top-0 bg-white">
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Title</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {instructors.map(instructor => (
                      <tr key={instructor.instructor_id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{instructor.first_name} {instructor.last_name}</td>
                        <td className="px-4 py-2">{instructor.title || 'N/A'}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={(e) => handleEditInstructorClick(instructor, e)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => handleDeleteInstructor(instructor.instructor_id, e)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {instructors.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center px-4 py-4 text-gray-500">No instructors found.</td>
                      </tr> 
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center cursor-pointer" 
                 onClick={() => setSectionsCollapsed({...sectionsCollapsed, events: !sectionsCollapsed.events})}>
              {sectionsCollapsed.events ? 
                <ChevronDownIcon className="h-6 w-6 text-gray-500 mr-2" /> : 
                <ChevronUpIcon className="h-6 w-6 text-gray-500 mr-2" />}
              <h2 className="text-2xl font-semibold">Events</h2>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowArchivedEvents(!showArchivedEvents)}
                className={`px-4 py-2 rounded border ${
                  showArchivedEvents 
                  ? 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200' 
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {showArchivedEvents ? 'Hide Archived' : 'Show Archived'}
              </button>
              <button
                onClick={() => setShowBatchActions(!showBatchActions)}
                className={`px-4 py-2 rounded border ${
                  showBatchActions 
                  ? 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {showBatchActions ? 'Cancel Batch' : 'Batch Actions'}
              </button>
              <button
                onClick={() => setEditingEvent({})}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Event
              </button>
            </div>
          </div>
          
          {/* Batch Actions Bar */}
          {showBatchActions && !sectionsCollapsed.events && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="select-all-events"
                  checked={selectedEvents.length > 0 && selectedEvents.length === events.length}
                  onChange={handleSelectAllEvents}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="select-all-events" className="text-sm text-gray-700">
                  {selectedEvents.length === 0 
                    ? 'Select All' 
                    : `Selected ${selectedEvents.length} of ${events.length}`}
                </label>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleBatchArchive(false)}
                  disabled={selectedEvents.length === 0}
                  className="text-amber-600 hover:text-amber-900 disabled:text-gray-400 disabled:cursor-not-allowed bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded text-sm"
                >
                  Archive Selected
                </button>
                <button
                  onClick={() => handleBatchArchive(true)}
                  disabled={selectedEvents.length === 0}
                  className="text-purple-600 hover:text-purple-900 disabled:text-gray-400 disabled:cursor-not-allowed bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded text-sm"
                >
                  Unarchive Selected
                </button>
              </div>
            </div>
          )}

          {!sectionsCollapsed.events && (
            <div className="overflow-x-auto">
              <div className={`${events.length > 20 ? 'max-h-[500px] overflow-y-auto' : ''}`}>
                <table className="min-w-full table-auto">
                  <thead className="sticky top-0 bg-white">
                    <tr className="bg-gray-100">
                      {showBatchActions && (
                        <th className="px-2 py-2 w-10 text-center">#</th>
                      )}
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Price</th>
                      <th className="px-4 py-2 text-left">Instructor</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {events.map((event) => {
                      // Find instructor name
                      const instructor = instructors.find(inst => inst.instructor_id === event.instructor_id);
                      const instructorName = instructor ? `${instructor.first_name} ${instructor.last_name}` : 'N/A';
                      const isArchived = event.archived;
                      
                      // Check if event has previous version
                      const hasPreviousVersion = event.previous_version_id !== null;

                      return (
                        <tr 
                          key={event.id}
                          onClick={(e) => {
                            if (showBatchActions) {
                              e.preventDefault();
                              handleToggleEventSelection(event.id);
                            } else {
                              handleEventClick(event);
                            }
                          }}
                          className={`cursor-pointer hover:bg-gray-50 ${isArchived ? 'bg-gray-50' : ''} ${selectedEvents.includes(event.id) ? 'bg-blue-50' : ''}`}
                        >
                          {showBatchActions && (
                            <td className="px-2 py-2 text-center">
                              <input 
                                type="checkbox" 
                                checked={selectedEvents.includes(event.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleToggleEventSelection(event.id);
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </td>
                          )}
                          <td className="px-4 py-2">
                            {event.name}
                            {hasPreviousVersion && (
                              <span className="ml-2 text-xs text-blue-500 font-medium">
                                (New version)
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2">{new Date(event.start_date).toLocaleDateString()}</td>
                          <td className="px-4 py-2">${event.price}</td>
                          <td className="px-4 py-2">{instructorName}</td>
                          <td className="px-4 py-2">
                            {isArchived ? (
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                Archived
                                {event.archived_at && (
                                  <span className="ml-1 text-gray-500">
                                    {new Date(event.archived_at).toLocaleDateString()}
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2 space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(event, e);
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-2"
                            >
                              Edit
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateEvent(event.id);
                              }}
                              className="text-green-600 hover:text-green-900 mr-2"
                              title="Create a copy of this event"
                            >
                              Duplicate
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArchiveEvent(event.id, isArchived);
                              }}
                              className={`${isArchived ? 'text-purple-600 hover:text-purple-900' : 'text-amber-600 hover:text-amber-900'} mr-2`}
                            >
                              {isArchived ? 'Unarchive' : 'Archive'}
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEvent(event.id);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    
                    {events.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                          {showArchivedEvents 
                            ? 'No archived events found.' 
                            : 'No active events found.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Registrations Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center cursor-pointer mb-4" 
               onClick={() => setSectionsCollapsed({...sectionsCollapsed, registrations: !sectionsCollapsed.registrations})}>
            {sectionsCollapsed.registrations ? 
              <ChevronDownIcon className="h-6 w-6 text-gray-500 mr-2" /> : 
              <ChevronUpIcon className="h-6 w-6 text-gray-500 mr-2" />}
            <h2 className="text-2xl font-semibold">Registrations</h2>
          </div>
          {!sectionsCollapsed.registrations && (
          <div className="overflow-x-auto">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="min-w-full table-auto">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="bg-gray-100">
                    <th className="px-2 py-2 text-left text-sm w-24">Date</th>
                    <th className="px-2 py-2 text-left text-sm max-w-[180px]">Event</th>
                    <th className="px-2 py-2 text-left text-sm">Name</th>
                    <th className="px-2 py-2 text-left text-sm">Email</th>
                    <th className="px-2 py-2 text-left text-sm">Payment Status</th>
                    <th className="px-2 py-2 text-left text-sm">Amount Paid</th>
                    <th className="px-2 py-2 text-left text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {registrations.map((reg) => {
                    // Format the date from the event or registration
                    const eventDate = reg.event?.start_date || reg.created_at;
                    const formattedDate = eventDate ? new Date(eventDate).toLocaleDateString() : 'N/A';
                    const isPending = !reg.payment_status || reg.payment_status.toLowerCase() === 'pending';
                    
                    return (
                      <tr key={reg.id}>
                        <td className="px-2 py-2 whitespace-nowrap">{formattedDate}</td>
                        <td className="px-2 py-2 max-w-[180px] truncate" title={reg.event?.name || 'Unknown Event'}>
                          {reg.event?.name || 'Unknown Event'}
                        </td>
                        <td className="px-2 py-2">{reg.name}</td>
                        <td className="px-2 py-2">{reg.email}</td>
                        <td className="px-2 py-2">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${reg.payment_status?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' : 
                              reg.payment_status?.toLowerCase() === 'refunded' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {reg.payment_status || 'pending'}
                          </span>
                        </td>
                        <td className="px-2 py-2">${reg.amount_paid?.toFixed(2) || '0.00'}</td>
                        <td className="px-2 py-2">
                          <div className="flex space-x-2">
                            {isPending && (
                              <button
                                onClick={() => handleSendPaymentReminder(reg)}
                                disabled={sendingReminder === reg.id}
                                className="text-blue-600 hover:text-blue-900 text-xs bg-blue-50 px-2 py-1 rounded"
                                title="Send payment reminder email"
                              >
                                {sendingReminder === reg.id ? 'Sending...' : 'Send Reminder'}
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteRegistration(reg)}
                              className="text-red-600 hover:text-red-900 text-xs bg-red-50 px-2 py-1 rounded"
                              title="Delete registration"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </div>

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {reminderSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {reminderSuccess}
          </div>
        )}
        
        {reminderError && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error sending reminder: {reminderError}
          </div>
        )}

        {isLoading && <LoadingSpinner />}

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">{selectedEvent.name}</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">{selectedEvent.description}</p>
                <div className="text-sm text-gray-500">
                  <p>Date: {new Date(selectedEvent.start_date).toLocaleDateString()}</p>
                  <p>Time: {new Date(selectedEvent.start_date).toLocaleTimeString()}</p>
                  <p>Location: {selectedEvent.location}</p>
                  <p>Price: ${selectedEvent.price}</p>
                  {selectedEvent.meeting_link && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                      <p className="font-medium text-blue-800">
                        {selectedEvent.meeting_type === 'zoom' ? 'Zoom' : 
                         selectedEvent.meeting_type === 'google_meet' ? 'Google Meet' : 
                         selectedEvent.meeting_type === 'teams' ? 'Microsoft Teams' : 'Meeting'} Link:
                      </p>
                      <a 
                        href={selectedEvent.meeting_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {selectedEvent.meeting_link}
                      </a>
                      <p className="text-xs mt-1">This link will be sent to attendees in registration emails.</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-4">Registrations</h4>
                {registrations.filter(reg => reg.event_id === selectedEvent.id).length === 0 ? (
                  <p className="text-gray-500">No registrations yet</p>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations
                        .filter(reg => reg.event_id === selectedEvent.id)
                        .map((reg) => (
                          <tr key={reg.id}>
                            <td className="px-4 py-2">{reg.name || 'N/A'}</td>
                            <td className="px-4 py-2">{reg.email || 'N/A'}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Event Modal */}
        {editingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">
                  {editingEvent.id ? 'Edit Event' : 'Create New Event'}
                </h3>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleEventSubmit(editingEvent);
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={editingEvent.name}
                    onChange={(e) => setEditingEvent({...editingEvent, name: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                    className="w-full p-2 border rounded"
                    rows="3"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      value={editingEvent.start_date}
                      onChange={(e) => setEditingEvent({...editingEvent, start_date: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">End Date & Time</label>
                    <input
                      type="datetime-local"
                      value={editingEvent.end_date}
                      onChange={(e) => setEditingEvent({...editingEvent, end_date: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                      type="text"
                      value={editingEvent.location}
                      onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingEvent.price}
                      onChange={(e) => setEditingEvent({...editingEvent, price: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                
                {/* Meeting Type Dropdown (Optional) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meeting Type <span className="text-gray-500 font-normal">(optional)</span>
                    </label>
                    <select
                      value={editingEvent.meeting_type || ''}
                      onChange={(e) => setEditingEvent({...editingEvent, meeting_type: e.target.value})}
                      className="w-full p-2 border rounded bg-white"
                    >
                      <option value="">-- Select Meeting Type --</option>
                      <option value="zoom">Zoom</option>
                      <option value="google_meet">Google Meet</option>
                      <option value="teams">Microsoft Teams</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meeting Link <span className="text-gray-500 font-normal">(optional)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://zoom.us/j/123456789 or similar"
                      value={editingEvent.meeting_link || ''}
                      onChange={(e) => setEditingEvent({...editingEvent, meeting_link: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 -mt-4 mb-6">
                  This meeting link will be included in registration confirmation emails. You can add this later if not available now.
                </p>
                
                {/* Image Name Field (Optional) */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    Image Name <span className="text-gray-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="event-image.png"
                    value={editingEvent.image_name || ''}
                    onChange={(e) => setEditingEvent({...editingEvent, image_name: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Name of the image file in the public directory. This will be used for the Stripe checkout page.
                  </p>
                </div>

                {/* Instructor Selection Dropdown */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Instructor</label>
                  <select
                    value={editingEvent.instructor_id || ''} // Handle null/undefined case
                    // Removed parseInt - value is already the UUID string or empty
                    onChange={(e) => setEditingEvent({...editingEvent, instructor_id: e.target.value || null})}
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="">-- Select Instructor (Optional) --</option>
                    {instructors.map(instructor => (
                      <option key={instructor.instructor_id} value={instructor.instructor_id}>
                        {instructor.first_name} {instructor.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? 'Saving...' 
                      : (editingEvent.id ? 'Update Event' : 'Create Event')
                    }
                  </button>
                </div>

                {error && (
                  <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Instructor Add/Edit Modal */}
        {isInstructorModalOpen && currentInstructor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">
                  {isEditingInstructor ? 'Edit Instructor' : 'Add New Instructor'}
                </h3>
                <button
                  onClick={handleCloseInstructorModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  &times; 
                </button>
              </div>

              <form onSubmit={handleInstructorSubmit} className="space-y-4">
                {instructorError && (
                  <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm">
                    Error: {instructorError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" name="first_name" id="first_name" required 
                           value={currentInstructor.first_name}
                           onChange={handleInstructorInputChange}
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" name="last_name" id="last_name" required 
                           value={currentInstructor.last_name}
                           onChange={handleInstructorInputChange}
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                </div>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <input type="text" name="title" id="title" required 
                         value={currentInstructor.title}
                         onChange={handleInstructorInputChange}
                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Summary (Short)</label>
                  <textarea name="summary" id="summary" rows="2" 
                            value={currentInstructor.summary}
                            onChange={handleInstructorInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio (Detailed)</label>
                  <textarea name="bio" id="bio" rows="4" 
                            value={currentInstructor.bio}
                            onChange={handleInstructorInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button type="button" onClick={handleCloseInstructorModal} 
                          disabled={isSubmittingInstructor}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50">
                    Cancel
                  </button>
                  <button type="submit" 
                          disabled={isSubmittingInstructor}
                          className={`px-4 py-2 rounded-md text-white ${isEditingInstructor ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isEditingInstructor ? 'focus:ring-blue-500' : 'focus:ring-green-500'} disabled:opacity-50`}>
                    {isSubmittingInstructor ? 'Saving...' : (isEditingInstructor ? 'Save Changes' : 'Add Instructor')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default withAdminAuth(AdminDashboard);
