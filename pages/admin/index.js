import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { withAdminAuth } from '../../lib/auth';

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    metadata: {}
  });

  // Get users on mount
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

  // Get events on mount
  useEffect(() => {
    const getEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/events');
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
  }, []);

  // Get registrations on mount
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
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const result = await response.json();

      // Update events list
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

  const handleDeleteEvent = async (eventId) => {
    if (!eventId) return;
    
    if (!confirm('Are you sure you want to delete this event? This will also delete all registrations for this event.')) {
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

      // Remove user from state
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
      price: event.price
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

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Users Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Users</h2>
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

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
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

        {/* Events Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Events</h2>
            <button
              onClick={() => setEditingEvent({})}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Event
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {events.map((event) => (
                  <tr 
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">{event.name}</td>
                    <td className="px-4 py-2">{new Date(event.start_date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">${event.price}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={(e) => handleEditClick(event, e)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Registrations Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Registrations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Event</th>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {registrations.map((reg) => (
                  <tr key={reg.id}>
                    <td className="px-4 py-2">{reg.event?.name || 'Unknown Event'}</td>
                    <td className="px-4 py-2">{reg.user?.email || 'Unknown User'}</td>
                    <td className="px-4 py-2">{reg.name}</td>
                    <td className="px-4 py-2">{reg.email}</td>
                    <td className="px-4 py-2">{reg.phone || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
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
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
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

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={editingEvent.start_date}
                    onChange={(e) => setEditingEvent({...editingEvent, start_date: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={editingEvent.end_date}
                    onChange={(e) => setEditingEvent({...editingEvent, end_date: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={editingEvent.location}
                    onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-6">
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
      </div>
    </AdminLayout>
  );
}

// Export the component wrapped with the admin auth HOC
export default withAdminAuth(AdminDashboard);
