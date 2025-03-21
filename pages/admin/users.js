import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import Navigation from '../../components/Navigation';

function UsersAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    is_admin: false
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
        await fetchUsers();
      } catch (error) {
        console.error('Error checking admin status:', error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [router]);

  const fetchUsers = async () => {
    try {
      // First fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;
      
      // Then get all the user data from auth.users
      // In a real app, this would require admin access to auth data
      // This is a simplified example - in production, you'd need a secure server-side API
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        // If admin auth fails, just use the profiles (this is fallback)
        setUsers(profiles.map(profile => ({
          ...profile,
          email: 'Protected', // In a real app, this would come from auth data
          created_at: new Date().toISOString()
        })));
        return;
      }
      
      // Combine both datasets
      const combinedUsers = profiles.map(profile => {
        const authUser = usersData?.users?.find(u => u.id === profile.id);
        return {
          ...profile,
          email: authUser?.email || 'Protected',
          created_at: authUser?.created_at || new Date().toISOString()
        };
      });
      
      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      is_admin: user.is_admin || false
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openNewUserModal = () => {
    setCurrentUser(null);
    setFormData({
      email: '',
      full_name: '',
      phone: '',
      is_admin: false
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      is_admin: false
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
    if (!formData.full_name) errors.full_name = 'Full name is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitLoading(true);
    
    try {
      if (currentUser) {
        // Update user profile
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            phone: formData.phone,
            is_admin: formData.is_admin
          })
          .eq('id', currentUser.id);
        
        if (error) throw error;
      } else {
        // Create new user profile
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            is_admin: formData.is_admin
          });
        
        if (error) throw error;
      }
      
      closeModal();
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error.message);
      alert('Error updating user. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Delete user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (profileError) throw profileError;
      
      // In a real app, you'd also delete the user from auth.users
      // This would typically be done via a secure server-side API
      
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error.message);
      alert('Error deleting user. Please try again.');
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <div className="flex space-x-2">
              <Link href="/admin" className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                Back to Admin
              </Link>
              <button
                onClick={openNewUserModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New User
              </button>
            </div>
          </div>
          
          {users.length === 0 ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No users found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new user or wait for users to register.</p>
              <div className="mt-6">
                <button
                  onClick={openNewUserModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New User
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-300 font-medium">
                              {user.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.full_name || 'Unnamed User'}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{user.phone || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.is_admin ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                            Admin
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                            User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openEditModal(user)}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
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

      {/* Edit User Modal */}
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
                        {currentUser ? 'Edit User' : 'Add New User'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="full_name"
                            id="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                          {formErrors.full_name && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.full_name}</p>
                          )}
                        </div>
                        
                        {currentUser ? (
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={formData.email}
                              readOnly
                              disabled
                              className="mt-1 bg-gray-100 dark:bg-gray-600 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-md"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                          </div>
                        ) : (
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            />
                          </div>
                        )}
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Phone
                          </label>
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            id="is_admin"
                            name="is_admin"
                            type="checkbox"
                            checked={formData.is_admin}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                          />
                          <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Administrator
                          </label>
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
                    {submitLoading ? 'Saving...' : 'Save Changes'}
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

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <UsersAdmin />
    </AdminLayout>
  );
}
