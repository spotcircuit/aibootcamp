import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import { supabase } from '../lib/supabase';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    experience: 'beginner'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // No need to load default event
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear errors when user starts typing again
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');
    
    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // 1. Check if email already exists by trying to sign in with a dummy password
      const { error: emailCheckError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: 'dummy-password-for-check',
      });

      // If error code is not invalid_login_credentials, then the email doesn't exist, which is what we want
      if (!emailCheckError || emailCheckError.message !== 'Invalid login credentials') {
        setError('This email is already registered. Please use a different email or try logging in.');
        setLoading(false);
        return;
      }

      // 2. Create the user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            experience: formData.experience,
          },
          // In development, automatically confirm emails
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (signUpError) {
        setError(signUpError.message || 'Error creating account. Please try again.');
        setLoading(false);
        return;
      }
      
      // Create user profile with is_admin = false
      if (authData && authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            is_admin: false,
            email: authData.user.email,
            name: formData.name,
            phone: formData.phone,
            experience_level: formData.experience,
            created_at: new Date().toISOString()
          });
          
        if (profileError) {
          console.error('Error creating profile:', profileError.message);
          // Don't return error to user as the auth account was created successfully
        }
      }

      // Success!
      setSuccessMessage(
        'Registration successful! Please check your email to confirm your account. ' +
        'For demonstration purposes, you can now try logging in directly.'
      );
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        experience: 'beginner'
      });
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">Register for AI Bootcamp</h1>
        
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
          
          <form onSubmit={handleSubmit}>
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
                disabled={loading}
              />
            </div>
            
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
                disabled={loading}
              />
            </div>
            
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
                minLength={6}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
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
            
            <div className="mb-4 relative">
              <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Confirm Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
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
            
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register Now'}
              </button>
              <Link href="/">
                <span className="text-cyan-600 dark:text-cyan-400 hover:underline">Back to Home</span>
              </Link>
            </div>
          </form>
        </div>
        
        <div className="max-w-md mx-auto mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account? <Link href="/login" className="text-cyan-600 dark:text-cyan-400 hover:underline">Login here</Link>
          </p>
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
