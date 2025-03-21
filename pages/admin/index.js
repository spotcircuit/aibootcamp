import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    upcomingEvents: 0,
  });

  useEffect(() => {
    // Fetch data upon component mount
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching users from database...');
      // Get users from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (userError) {
        console.error('Error fetching users:', userError);
      } else {
        console.log('Users fetched successfully:', userData?.length || 0);
        console.log('User data sample:', userData ? JSON.stringify(userData[0]) : 'No users');
        setUsers(userData || []);
      }
      
      // Get events - only retrieve events with dates in the future
      const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
      let eventData = [];
      
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*, event_registrations(count)')
          .gte('date', today)
          .order('date', { ascending: true })
          .limit(5);
        
        if (!error) {
          eventData = data;
        } else {
          console.log('Error fetching events:', error);
          console.error('Error fetching events:', error.message);
        }
      } catch (eventError) {
        console.log('Exception fetching events:', eventError);
        console.error('Error fetching events:', eventError.message);
      }
      
      // Set states with what we got (even if partial data)
      setEvents(eventData || []);
      setStats({
        totalUsers: users.length,
        upcomingEvents: eventData ? eventData.length : 0,
      });
    } catch (error) {
      console.log('General error:', error);
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', eventId);
        
        if (error) {
          console.error('Error deleting event:', error.message);
          alert('Failed to delete event. Please try again.');
        } else {
          // Remove the deleted event from state
          setEvents(events.filter(event => event.id !== eventId));
          alert('Event deleted successfully');
        }
      } catch (error) {
        console.error('Error:', error.message);
        alert('An unexpected error occurred');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const { error } = await supabase
          .from('users')  
          .delete()
          .eq('id', userId);
        
        if (error) {
          console.error('Error deleting user:', error.message);
          alert('Failed to delete user. Please try again.');
        } else {
          // Remove the deleted user from state
          setUsers(users.filter(user => user.id !== userId));
          alert('User deleted successfully');
        }
      } catch (error) {
        console.error('Error:', error.message);
        alert('An unexpected error occurred');
      }
    }
  };
  
  if (loading) {
    return (
      <AdminLayout>
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
        
        {/* Events Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Upcoming Events</h2>
            <Link href="/admin/events/create" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm">
              Create New Event
            </Link>
          </div>
          
          {events.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Event Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Registrations
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {event.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {event.event_registrations?.[0]?.count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/admin/events/${event.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            View
                          </Link>
                          <Link href={`/admin/events/edit/${event.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md text-center">
              <p className="text-gray-500 dark:text-gray-300">No upcoming events found.</p>
              <Link href="/admin/events/create" className="mt-2 inline-block text-blue-600 hover:underline dark:text-blue-400">
                Create your first event
              </Link>
            </div>
          )}
          
          {events.length > 0 && (
            <div className="mt-4 text-right">
              <Link href="/admin/events" className="text-blue-600 hover:underline dark:text-blue-400">
                View all events →
              </Link>
            </div>
          )}
        </div>
        
        {/* Users Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Users</h2>
            <Link href="/admin/users/create" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm">
              Create New User
            </Link>
          </div>
          
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Admin
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.is_admin ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/admin/users/${user.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            View
                          </Link>
                          <Link href={`/admin/users/edit/${user.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md text-center">
              <p className="text-gray-500 dark:text-gray-300">No users found.</p>
            </div>
          )}
          
          {users.length > 0 && (
            <div className="mt-4 text-right">
              <Link href="/admin/users" className="text-purple-600 hover:underline dark:text-purple-400">
                View all users →
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
