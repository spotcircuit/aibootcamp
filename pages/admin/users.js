import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import { withAdminAuth } from '../../lib/auth';

function UsersAdmin() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [setupLinks, setSetupLinks] = useState({});
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    is_admin: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    // Fetch users on component mount
    const loadUsers = async () => {
      try {
        await fetchUsers();
      } catch (error) {
        console.error('Error loading users:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setUsers(users);
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
    setShowEditForm(true);
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
    setShowEditForm(true);
  };

  const closeModal = () => {
    setShowEditForm(false);
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
    if (!formData.email) errors.email = 'Email is required';
    
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
          .from('users')
          .update({
            full_name: formData.full_name,
            phone: formData.phone,
            is_admin: formData.is_admin
          })
          .eq('id', currentUser.id);
        
        if (error) throw error;
        
        // Success - close the modal
        closeModal();
        await fetchUsers();
      } else {
        // Create new user via our custom API that handles Supabase accounts
        const response = await fetch('/api/admin/users/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: formData.email,
            name: formData.full_name,
            phone: formData.phone || '',
            is_admin: formData.is_admin
          })
        });
        
        const result = await response.json();
        console.log("FULL RESPONSE FROM SERVER:", result);
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to create user');
        }
        
        // Also update users list with the new user
        await fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user:', error.message);
      setFormErrors({ ...formErrors, submit: error.message });
    } finally {
      setSubmitLoading(false);
    }
  };

  const generateSetupLink = (email) => {
    // Generate a token that will work with our setup-user implementation
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Generate the full URL using the origin (base URL) of the current page
    const url = `${window.location.origin}/auth/setup?token=${token}&email=${encodeURIComponent(email)}`;
    
    // Update the setupLinks state with the new URL
    setSetupLinks(prevLinks => ({
      ...prevLinks,
      [email]: url
    }));
    
    // Also create a profile record with this token
    createSetupProfile(email, token);
  };

  const handleCopySetupLink = (email) => {
    const link = setupLinks[email];
    if (link) {
      navigator.clipboard.writeText(link)
        .then(() => {
          alert('Setup link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy URL:', err);
        });
    }
  };

  // Create a profile record with the setup token
  const createSetupProfile = async (email, token) => {
    try {
      // First check if a profile exists
      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email);
      
      if (existingProfiles && existingProfiles.length > 0) {
        // Update existing profile with new token
        await supabase
          .from('profiles')
          .update({
            setup_token: token,
            setup_completed: false,
            updated_at: new Date().toISOString()
          })
          .eq('email', email);
      } else {
        // Create a new profile entry
        await supabase
          .from('profiles')
          .insert({
            email: email,
            setup_token: token,
            setup_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
      
      console.log("Setup profile created/updated with token", token);
    } catch (error) {
      console.error("Failed to create/update setup profile:", error);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Delete user profile
      const { error: profileError } = await supabase
        .from('users')
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

  // Resend welcome email handler
  const handleResendWelcome = async (user) => {
    try {
      const res = await fetch('/api/admin/resendWelcomeEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: user.full_name,
          email: user.email,
        }),
      });
      if (!res.ok) throw new Error('Failed to resend welcome email');
      alert('Welcome email resent');
    } catch (err) {
      console.error(err);
      alert('Error resending welcome email');
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

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
            <button
              onClick={openNewUserModal}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Add New User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Setup Link</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{user.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.phone || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.is_admin ? 
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Yes</span> : 
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">No</span>
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                      {setupLinks[user.email] ? (
                        <div className="flex flex-col space-y-2">
                          <div className="max-w-sm truncate">{setupLinks[user.email]}</div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleCopySetupLink(user.email)}
                              className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-2 py-1 rounded"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => generateSetupLink(user.email)}
                          className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-2 py-1 rounded"
                        >
                          Generate Link
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleResendWelcome(user)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Resend Welcome
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No users found. Create your first user using the &quot;Add New User&quot; button.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for creating/editing user */}
      {showEditForm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal}></div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  {currentUser ? 'Edit User' : 'Create New User'}
                </h3>
                
                {formErrors.submit && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {formErrors.submit}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={currentUser}
                      className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    />
                    {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    />
                    {formErrors.full_name && <p className="mt-1 text-sm text-red-600">{formErrors.full_name}</p>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_admin"
                        name="is_admin"
                        checked={formData.is_admin}
                        onChange={handleChange}
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_admin" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Admin User
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {submitLoading ? 'Processing...' : currentUser ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// Export the component wrapped with the admin auth HOC
export default withAdminAuth(UsersAdmin);
