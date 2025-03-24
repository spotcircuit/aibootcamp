import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const router = useRouter();
  const { token, email } = router.query;
  
  const [formData, setFormData] = useState({
    email: email || '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stage, setStage] = useState(token ? 'reset' : 'request');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear errors when user starts typing again
    if (error) setError(null);
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccessMessage('');
    setLoading(true);
    
    try {
      // Request a password reset with Supabase
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) throw resetError;
      
      // Success!
      setSuccessMessage('Password reset instructions have been sent to your email address. Please check your inbox.');
      
    } catch (err) {
      console.error('Password reset request error:', err);
      setError(err.message || 'An error occurred while requesting a password reset');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccessMessage('');
    setLoading(true);
    
    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Update password with Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (updateError) throw updateError;
      
      // Success!
      setSuccessMessage('Your password has been successfully reset. You will be redirected to the login page shortly.');
      
      // Redirect after a delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.message || 'An error occurred while resetting your password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          {stage === 'request' ? 'Reset Your Password' : 'Create New Password'}
        </h1>
        
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-md">
              {successMessage}
            </div>
          )}
          
          {stage === 'request' ? (
            // Email form for requesting password reset
            <form onSubmit={handleRequestReset}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={loading || !!successMessage}
                >
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
                <Link href="/login">
                  <span className="text-cyan-600 dark:text-cyan-400 hover:underline">Back to Login</span>
                </Link>
              </div>
            </form>
          ) : (
            // New password form
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">New Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                  minLength={6}
                  disabled={loading || !!successMessage}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                  disabled={loading || !!successMessage}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={loading || !!successMessage}
                >
                  {loading ? 'Updating...' : 'Reset Password'}
                </button>
                <Link href="/login">
                  <span className="text-cyan-600 dark:text-cyan-400 hover:underline">Back to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
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
