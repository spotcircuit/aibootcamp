import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [eventFormData, setEventFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    capacity: 30,
    price: 199
  });
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchUsers();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('startDate', { ascending: true });
      
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  const fetchRegistrations = async (eventId) => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('eventId', eventId);

      if (error) throw error;
      setRegistrations(data || []);
      setSelectedEvent(events.find(e => e.id === eventId));
    } catch (error) {
      console.error('Error fetching registrations:', error.message);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([eventFormData])
        .select()
        .single();

      if (error) throw error;

      setEvents([...events, data]);
      setEventFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        capacity: 30,
        price: 199
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userFormData.email,
        password: userFormData.password,
        options: {
          data: {
            name: userFormData.name,
            role: userFormData.role
          }
        }
      });

      if (authError) throw authError;

      const { error: dbError } = await supabase
        .from('users')
        .insert([{
          name: userFormData.name,
          email: userFormData.email,
          role: userFormData.role
        }]);

      if (dbError) throw dbError;

      fetchUsers();
      setUserFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure? This will delete the event and all registrations.')) return;
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      setEvents(events.filter(e => e.id !== eventId));
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null);
        setRegistrations([]);
      }
    } catch (error) {
      console.error('Error deleting event:', error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const { error: dbError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (dbError) throw dbError;

      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold dark:text-white">Admin Dashboard</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Management Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold dark:text-white">Event Management</h2>
            
            <form onSubmit={handleEventSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Name</label>
                <input
                  type="text"
                  required
                  value={eventFormData.name}
                  onChange={(e) => setEventFormData({ ...eventFormData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  required
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={eventFormData.startDate}
                    onChange={(e) => setEventFormData({ ...eventFormData, startDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={eventFormData.endDate}
                    onChange={(e) => setEventFormData({ ...eventFormData, endDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Capacity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={eventFormData.capacity}
                    onChange={(e) => setEventFormData({ ...eventFormData, capacity: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={eventFormData.price}
                    onChange={(e) => setEventFormData({ ...eventFormData, price: parseFloat(e.target.value) })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Creating Event...' : 'Create Event'}
              </button>
            </form>

            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium dark:text-white">{event.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <p>Start: {new Date(event.startDate).toLocaleString()}</p>
                        <p>End: {new Date(event.endDate).toLocaleString()}</p>
                        <p>Capacity: {event.capacity}</p>
                        <p>Price: ${event.price}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => fetchRegistrations(event.id)}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View Registrations
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {selectedEvent?.id === event.id && (
                    <div className="mt-4 border-t pt-4 dark:border-gray-700">
                      <h4 className="text-md font-medium mb-2 dark:text-white">Registered Users ({registrations.length})</h4>
                      {registrations.length > 0 ? (
                        <div className="space-y-2">
                          {registrations.map((reg) => (
                            <div key={reg.id} className="text-sm text-gray-600 dark:text-gray-300">
                              <p>{reg.name} ({reg.email})</p>
                              <p className="text-xs text-gray-500">Experience: {reg.experience}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No registrations yet</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* User Management Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold dark:text-white">User Management</h2>
            
            <form onSubmit={handleUserSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  required
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  required
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input
                  type="password"
                  required
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Creating User...' : 'Create User'}
              </button>
            </form>

            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium dark:text-white">{user.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Role: {user.role}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
