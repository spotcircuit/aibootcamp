import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { signIn } from '../lib/auth';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Check URL params for messages
  useEffect(() => {
    if (router.isReady) {
      // Check for setup success message
      if (router.query.setup === 'success') {
        setMessage(`Account setup completed successfully! You can now log in with your email and password.`);
      }
      
      // Check for logout message
      if (router.query.logout === 'success') {
        setMessage('You have been successfully logged out.');
      }
      
      // Check for error message
      if (router.query.error) {
        setError(decodeURIComponent(router.query.error));
      }
    }
  }, [router.isReady, router.query]);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // User is already logged in, redirect to dashboard
        router.push('/dashboard');
      }
    };
    
    checkSession();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Sign in with email and password
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error details:', error);
        setError(error.message || 'Failed to sign in. Please try again later.');
        setLoading(false);
        return;
      }
      
      if (!data?.user) {
        setError('Login failed. Please try again or contact support if the problem persists.');
        setLoading(false);
        return;
      }
      
      // Check if user is admin and redirect accordingly
      if (data.user?.user_metadata?.is_admin) {
        console.log('Admin user detected, redirecting to admin dashboard');
        router.push('/admin');
      } else {
        // Regular user, redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      
      // Provide a user-friendly error message
      setError('An unexpected error occurred. Please try again later.');
      setLoading(false);
    } finally {
      // Ensure loading state is reset even if there's an error
      if (loading) setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">Sign In</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded text-center">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <button
              type="button"
              className="absolute top-1/2 transform -translate-y-1/2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none flex items-center justify-center"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account? <Link href="/register" className="text-indigo-600 hover:underline">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
