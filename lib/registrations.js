import { supabase, supabaseAdmin } from './supabase';

/**
 * Creates a new registration for an event
 * @param {Object} registrationData - Object containing registration details
 * @returns {Promise<Object>} - A promise that resolves to the created registration
 */
export async function createRegistration(registrationData) {
  try {
    console.log('Attempting to create registration with data:', JSON.stringify(registrationData, null, 2));
    
    // Insert into registrations table
    const { data, error } = await supabase
      .from('registrations')
      .insert([registrationData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating registration:', error);
      return { error: error.message || 'Failed to create registration' };
    }
    
    console.log('Registration created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createRegistration:', error);
    return { error: error.message || 'An unexpected error occurred during registration' };
  }
}

/**
 * Gets all registrations for a specific event (admin only)
 * @param {number} eventId - The event ID
 * @returns {Promise<Array>} - A promise that resolves to an array of registrations
 */
export async function getRegistrationsByEvent(eventId) {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('event_id', eventId);
    
    if (error) {
      console.error('Error fetching registrations:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getRegistrationsByEvent:', error);
    return []; // Return empty array on error for better UX
  }
}

/**
 * Gets registrations for the currently authenticated user
 * @returns {Promise<Array>} - A promise that resolves to an array of the user's registrations
 */
export async function getUserRegistrations() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to view registrations');
    }
    
    const { data, error } = await supabase
      .from('registrations')
      .select('*, events(*)')
      .eq('auth_user_id', user.id);
    
    if (error) {
      console.error('Error fetching user registrations:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUserRegistrations:', error);
    return []; // Return empty array on error for better UX
  }
}

/**
 * Updates a registration's payment status (admin only)
 * @param {number} id - The registration ID
 * @param {Object} updateData - Object containing updated registration details
 * @returns {Promise<Object>} - A promise that resolves to the updated registration
 */
export async function updateRegistration(id, updateData) {
  try {
    // This should only be called server-side with the admin client
    if (!supabaseAdmin) {
      throw new Error('Admin privileges required to update registrations');
    }
    
    const { data, error } = await supabaseAdmin
      .from('registrations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating registration:', error);
      return { error: error.message || 'Failed to update registration' };
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateRegistration:', error);
    return { error: error.message || 'An unexpected error occurred while updating registration' };
  }
}

/**
 * Updates the email_sent status for a registration
 * @param {number} id - The registration ID
 * @param {boolean} emailSent - The new email_sent status
 * @returns {Promise<Object>} - A promise that resolves to the updated registration
 */
export async function markEmailSent(id, emailSent = true) {
  return updateRegistration(id, { 
    email_sent: emailSent,
    email_sent_at: emailSent ? new Date().toISOString() : null,
    updated_at: new Date().toISOString()
  });
}
