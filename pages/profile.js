import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { withAuth } from '../lib/auth';

function Profile({ user }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSetup, setIsSetup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: 'beginner',
  });
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (!user) {
      console.error("No user object provided to Profile component");
      setLoading(false);
      return;
    }

    // Check if this is initial setup from an invitation
    if (router.query.setup === 'true') {
      setIsSetup(true);
      // Force showing password form for new users from invites
      setShowPasswordForm(true);
    }

    try {
      console.log("User data in Profile component:", user);
      console.log("Profile data in user object:", user.user_metadata);

      // Set data from profile if available, otherwise from user metadata
      setFormData({
        name: user.user_metadata?.name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        experience: user.user_metadata?.experience || 'beginner',
      });

      console.log("Form data set:", {
        name: user.user_metadata?.name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        experience: user.user_metadata?.experience || 'beginner',
      });
    } catch (error) {
      console.error('Error setting up profile form:', error);
    } finally {
      setLoading(false);
    }
  }, [user, router.query.setup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Check if email has changed
      const emailChanged = formData.email !== user.email;
      
      // Update user metadata
      const updateOptions = {
        data: { 
          name: formData.name,
          phone: formData.phone,
          experience: formData.experience
        }
      };
      
      // If email has changed, update it
      if (emailChanged) {
        updateOptions.email = formData.email;
      }
      
      const { error: updateError } = await supabase.auth.updateUser(updateOptions);

      if (updateError) throw updateError;
      
      // No need to insert/update a separate profiles table, as user data is already in auth.users
      // The updateUser call above already updates the user metadata in Supabase Auth

      setMessage({
        type: 'success',
        text: isSetup ? 
          'Profile setup completed successfully!' :
          (emailChanged ? 
            'Profile updated successfully! Please check your email for verification.' : 
            'Profile updated successfully!')
      });
      
      // If initial setup, redirect to dashboard
      if (isSetup) {
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
      // If email changed, redirect to login
      else if (emailChanged) {
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred while updating your profile'
      });
    } finally {
      setSaveLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });
    
    try {
      // Validate passwords
      if (passwordData.password !== passwordData.confirmPassword) {
        setPasswordMessage({
          type: 'error',
          text: 'Passwords do not match'
        });
        setPasswordLoading(false);
        return;
      }
      
      if (passwordData.password.length < 6) {
        setPasswordMessage({
          type: 'error',
          text: 'Password must be at least 6 characters'
        });
        setPasswordLoading(false);
        return;
      }
      
      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: passwordData.password
      });
      
      if (error) throw error;
      
      setPasswordMessage({
        type: 'success',
        text: 'Password changed successfully!'
      });
      
      // Reset password fields
      setPasswordData({
        password: '',
        confirmPassword: ''
      });
      
      // Hide password form after successful change
      setTimeout(() => {
        setShowPasswordForm(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordMessage({
        type: 'error',
        text: error.message || 'An error occurred while changing your password'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">Your Profile</h1>
        
        {loading ? (
          <div className="flex justify-center">
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
        ) : (
          <div className="max-w-lg mx-auto">
            {/* Profile Information Form */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Profile Information</h2>
              
              {message.text && (
                <div className={`mb-4 p-3 rounded-md ${
                  message.type === 'error' 
                    ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100' 
                    : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100'
                }`}>
                  {message.text}
                </div>
              )}
              
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Account Information</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Member since:</strong> {new Date(user?.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                  {formData.email !== user.email && (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                      You&apos;ll need to verify your new email address after saving.
                    </p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="experience" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">AI Experience Level</label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="beginner">Beginner - No experience</option>
                    <option value="intermediate">Intermediate - Some experience</option>
                    <option value="advanced">Advanced - Experienced with AI tools</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={saveLoading}
                  >
                    {saveLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    {showPasswordForm ? 'Hide Password Form' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Password Change Form */}
            {showPasswordForm && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Change Password</h2>
                
                {passwordMessage.text && (
                  <div className={`mb-4 p-3 rounded-md ${
                    passwordMessage.type === 'error' 
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100' 
                      : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100'
                  }`}>
                    {passwordMessage.text}
                  </div>
                )}
                
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-4 relative">
                    <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={passwordData.password}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 transform -translate-y-1/2 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  <div className="mb-6 relative">
                    <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Confirm New Password</label>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 transform -translate-y-1/2 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? 'Changing Password...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}
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
  );
}

// Wrap the Profile component with authentication
export default withAuth(Profile, {
  redirectTo: '/login'
});
