import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Load Stripe script only once at the application level
if (typeof window !== 'undefined' && !document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]')) {
  const script = document.createElement('script');
  script.src = 'https://js.stripe.com/v3/buy-button.js';
  script.async = true;
  document.body.appendChild(script);
}

export default function EventRegistration({ event, user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    experience: user?.user_metadata?.experience || 'beginner'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // When using Stripe Buy Button, we don't need custom payment handling
  // The button handles the checkout process directly
  
  // We'll still want to save the user's information
  const saveUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      // Only save user info if we have a name and email
      if (!formData.name || !formData.email) {
        setError('Name and email are required');
        setLoading(false);
        return;
      }
      
      // Update user metadata with form data
      if (user) {
        const { error } = await supabase.auth.updateUser({
          data: {
            name: formData.name,
            phone: formData.phone,
            experience: formData.experience
          }
        });
        
        if (error) {
          console.error('Error updating user info:', error);
          setError('Failed to update profile: ' + error.message);
        } else {
          setSuccessMessage('Profile updated successfully');
          // Hide success message after 3 seconds
          setTimeout(() => setSuccessMessage(null), 3000);
        }
      }
    } catch (error) {
      console.error('Error saving user info:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Only save user info when explicitly requested, not on every change
  // This prevents excessive updates that could cause page reloads
  
  // Initialize Stripe Buy Button only once when component mounts
  useEffect(() => {
    // This effect runs only once on component mount
    // No cleanup needed as we're not setting up any subscriptions
  }, []);

  return (
    <div className="mt-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone (optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Experience Level
          </label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        <div className="flex flex-col items-center space-y-4">
          <div className="flex justify-between w-full">
            <div className="text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                Price: ${event.price || 199}
              </p>
            </div>
            
            <button
              type="button"
              onClick={saveUserInfo}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Update Profile
            </button>
          </div>
          
          {/* Stripe Buy Button */}
          <div className="w-full">
            <stripe-buy-button
              buy-button-id="buy_btn_1R6FgLI7NYD96A52uaoF4iLW"
              publishable-key="pk_live_51PEbgkI7NYD96A52oKRZ3UwZ3kLqE66a6frydjKbnyV051QOZVkf4Rn2Ux2ioPDcwmL7Qbg1IVd09663MPG9tScC00FF6sQ2KK"
              customer-email={formData.email}
              customer-name={formData.name}
              client-reference-id={event.id.toString()}
            >
            </stripe-buy-button>
          </div>
        </div>
      </div>
    </div>
  );
}