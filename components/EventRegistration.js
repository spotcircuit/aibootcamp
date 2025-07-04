import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function EventRegistration({ event, user }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Save user info and create a registration
  const handleRegistration = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    console.log('Registration button clicked');
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Check if event is archived
      if (event.archived) {
        setError('This event has been archived and is no longer available for registration.');
        setIsSubmitting(false);
        return;
      }
      
      // Validate form
      if (!formData.name || !formData.email) {
        setError('Name and email are required');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Form data validated, updating user metadata...');
      
      // Update user metadata with form data
      if (user) {
        console.log('Updating user metadata for user:', user.id);
        const { error } = await supabase.auth.updateUser({
          data: {
            name: formData.name,
            phone: formData.phone
          }
        });
        
        if (error) {
          console.error('Error updating user info:', error);
          setError('Failed to update profile: ' + error.message);
          setIsSubmitting(false);
          return;
        }
        console.log('User metadata updated successfully');
      } else {
        console.log('No user logged in, skipping metadata update');
      }
      
      // Create a registration record
      console.log('Creating registration record with data:', {
        event_id: event.id,
        auth_user_id: user?.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      
      // Ensure all fields are properly formatted to match the database schema exactly
      const registrationData = {
        event_id: event.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        amount_paid: 0,
        stripe_payment_id: null,
        email_sent: false,
        created_at: new Date().toISOString(),
        payment_status: 'pending',
        stripe_session_id: null,
        paid_at: null,
        auth_user_id: user?.id // Always include auth_user_id
      };
      
      // Check if user is logged in - REQUIRED
      if (!user?.id) {
        setError('You must be logged in to register for this event.');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Sanitized registration data:', registrationData);
      
      const { data: registration, error: regError } = await supabase
        .from('registrations')
        .insert([registrationData])
        .select()
        .single();
      
      if (regError) {
        console.error('Error creating registration:', regError);
        setError('Failed to create registration: ' + regError.message);
        setIsSubmitting(false);
        return;
      }
      
      console.log('Registration created successfully:', registration);
      
      // Check if this is a free event (price is 0)
      if (event.price === 0) {
        console.log('Free event detected, bypassing Stripe checkout');
        
        // For free events, mark as paid immediately
        const { error: updateError } = await supabase
          .from('registrations')
          .update({
            payment_status: 'completed',
            paid_at: new Date().toISOString(),
            email_sent: true
          })
          .eq('id', registration.id);
          
        if (updateError) {
          console.error('Error updating registration status for free event:', updateError);
          setError('Failed to complete registration: ' + updateError.message);
          setIsSubmitting(false);
          return;
        }
        
        // Send confirmation email directly for free events
        try {
          const emailResponse = await fetch('/api/send-confirmation-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              registrationId: registration.id,
              eventId: event.id,
              email: formData.email,
              name: formData.name
            }),
          });
          
          if (!emailResponse.ok) {
            console.warn('Email sending failed but registration is complete');
          } else {
            console.log('Confirmation email sent for free event');
          }
        } catch (emailError) {
          console.warn('Error sending confirmation email:', emailError);
          // Continue even if email fails - registration is still valid
        }
        
        // Redirect to success page directly
        window.location.href = `/payment/success?eventId=${event.id}&userId=${user?.id || ''}&registrationId=${registration.id}&free=true`;
        return;
      }
      
      // For paid events, continue with Stripe checkout
      console.log('Paid event, creating Stripe checkout session with data:', {
        eventId: event.id,
        registrationId: registration.id,
        amount: event.price,
        email: formData.email,
        userId: user?.id || '',
        eventName: event.name
      });
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          registrationId: registration.id,
          amount: event.price,
          email: formData.email,
          userId: user?.id || '',
          eventName: event.name
        }),
      });
      
      console.log('Checkout session API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from checkout API:', errorData);
        throw new Error(errorData.error || 'Failed to create checkout session');
      }
      
      const sessionData = await response.json();
      console.log('Checkout session created:', sessionData);
      
      if (!sessionData.url) {
        console.error('No URL returned from checkout session');
        throw new Error('No checkout URL returned from server');
      }
      
      console.log('Redirecting to Stripe checkout URL:', sessionData.url);
      
      // Redirect to Stripe checkout in the same window
      window.location.href = sessionData.url;
      
    } catch (error) {
      console.error('Error during registration:', error);
      setError(error.message || 'An unexpected error occurred');
      setIsSubmitting(false);
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
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
                Price: {event.price === 0 ? 'Free' : `$${event.price}`}
              </p>
            </div>
          </div>
          
          {/* Custom Checkout Button */}
          <button
            onClick={handleRegistration}
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Register Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}