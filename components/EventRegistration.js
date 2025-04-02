import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function EventRegistration({ event, user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
  
  // Save user info and create a registration
  const handleRegistration = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate form
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
          setLoading(false);
          return;
        }
      }
      
      // Create a registration record
      const { data: registration, error: regError } = await supabase
        .from('registrations')
        .insert([
          {
            event_id: event.id,
            auth_user_id: user?.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            experience_level: formData.experience,
            payment_status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
      
      if (regError) {
        console.error('Error creating registration:', regError);
        setError('Failed to create registration: ' + regError.message);
        setLoading(false);
        return;
      }
      
      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          registrationId: registration.id,
          amount: event.price || 199,
          email: formData.email
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }
      
      const { url } = await response.json();
      
      // Redirect to Stripe checkout in the same window
      window.location.href = url;
      
    } catch (error) {
      console.error('Error during registration:', error);
      setError(error.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

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
        
        <div className="flex flex-col items-center space-y-4">
          <div className="flex justify-between w-full">
            <div className="text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                Price: ${event.price || 199}
              </p>
            </div>
          </div>
          
          {/* Custom Checkout Button */}
          <button
            onClick={handleRegistration}
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md shadow-sm disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Register Now - $${event.price || 199}`}
          </button>
        </div>
      </div>
    </div>
  );
}