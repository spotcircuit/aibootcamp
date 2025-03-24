import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function Setup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formValues, setFormValues] = useState({
    email: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [setupType, setSetupType] = useState('invite'); // Default to invite flow

  useEffect(() => {
    // Handle URL fragments and extract any errors
    const handleUrlFragments = () => {
      // Check for hash fragments which might contain errors
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        if (hashParams.get('error')) {
          console.warn('Auth error in URL:', hashParams.get('error'));
          console.warn('Error description:', hashParams.get('error_description'));
          // Don't show error message to user - we'll still let them set up their account
        }
      }
    };

    // Process URL when component mounts
    handleUrlFragments();
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    // Set the setup type from query params
    if (router.query.type) {
      setSetupType(router.query.type);
      console.log('Setup type:', router.query.type);
    }

    // Pre-fill email from query params
    if (router.query.email) {
      console.log('Got email from query params:', router.query.email);
      setFormValues(prev => ({
        ...prev,
        email: router.query.email
      }));
    } else {
      console.log('No email in query params, trying to get from token');
      
      // If we have a token but no email, try to get the email from the token
      if (router.query.token) {
        const tryGetEmailFromToken = async () => {
          try {
            // Try to get user info from the token
            const { data, error } = await supabase.auth.getUser();
            
            if (!error && data && data.user && data.user.email) {
              console.log('Got email from token:', data.user.email);
              setFormValues(prev => ({
                ...prev,
                email: data.user.email
              }));
            } else {
              console.warn('Could not get email from token:', error);
            }
          } catch (err) {
            console.error('Error getting user from token:', err);
          }
        };
        
        tryGetEmailFromToken();
      } else {
        console.log('No email or token in query params');
      }
    }
  }, [router.isReady, router.query]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (formValues.password !== formValues.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formValues.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Make sure we have an email
      if (!formValues.email) {
        setError('Email is required');
        setLoading(false);
        return;
      }

      // Get the token from the URL query params
      const token = router.query.token || '';
      
      console.log('Submitting setup form with email:', formValues.email);
      
      // Submit the setup request
      const response = await fetch('/api/auth/setup-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          email: formValues.email,
          password: formValues.password,
          name: formValues.name,
          phone: formValues.phone,
          type: setupType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Setup failed:', data);
        throw new Error(data.error || data.details || 'Failed to complete setup');
      }

      console.log('Setup completed successfully');
      
      // Try to sign in with the new credentials
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formValues.email,
          password: formValues.password
        });
        
        if (signInError) {
          console.warn('Auto sign-in failed:', signInError);
          // Continue to success page anyway
        } else {
          console.log('Auto sign-in successful');
        }
      } catch (signInErr) {
        console.warn('Exception during auto sign-in:', signInErr);
        // Continue to success page anyway
      }
      
      // Show success message and redirect after a short delay
      setSuccess(true);
      setTimeout(async () => {
        // If we successfully signed in, go to dashboard, otherwise to login
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push('/');
        } else {
          router.push('/login?setup=success&email=' + encodeURIComponent(formValues.email));
        }
      }, 2000);
    } catch (err) {
      console.error('Setup error:', err);
      setError(err.message || 'An unexpected error occurred during setup');
    } finally {
      setLoading(false);
    }
  };

  // Determine the title based on setup type
  const getTitle = () => {
    switch (setupType) {
      case 'recovery':
        return 'Reset Your Password';
      case 'invite':
      default:
        return 'Complete Your Account Setup';
    }
  };

  // Determine the button text based on setup type
  const getButtonText = () => {
    switch (setupType) {
      case 'recovery':
        return loading ? 'Processing...' : 'Reset Password';
      case 'invite':
      default:
        return loading ? 'Processing...' : 'Complete Setup';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{getTitle()}</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success ? (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>Your account has been set up successfully!</p>
            <p>You will be redirected shortly...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                readOnly={!!router.query.email}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            
            {setupType !== 'recovery' && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formValues.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formValues.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">
                {setupType === 'recovery' ? 'New Password' : 'Create Password'}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formValues.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formValues.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
                minLength={6}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            >
              {getButtonText()}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-cyan-600 hover:text-cyan-800">
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}
