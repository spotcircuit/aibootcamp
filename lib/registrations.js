import { supabase, supabaseAdmin } from './supabase';

/**
 * Creates a new registration for an event
 * @param {Object} registrationData - Object containing registration details
 * @returns {Promise<Object>} - A promise that resolves to the created registration
 */
export async function createRegistration(registrationData) {
  try {
    console.log('Attempting to create registration with data:', JSON.stringify(registrationData, null, 2));
    
    // Check if the event_registrations table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('event_registrations')
      .select('id')
      .limit(1);
    
    if (tableError && tableError.code === '42P01') { // Table doesn't exist error
      console.error('The event_registrations table does not exist:', tableError);
      throw new Error('Registration table does not exist. Please run database migrations first.');
    }
    
    // Proceed with insertion if table exists
    const { data, error } = await supabase
      .from('event_registrations')
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
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId);
    
    if (error) {
      console.error(`Error fetching registrations for event ${eventId}:`, error);
      throw new Error('Failed to fetch registrations');
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getRegistrationsByEvent:', error);
    throw error;
  }
}

/**
 * Gets registrations for the currently authenticated user
 * @returns {Promise<Array>} - A promise that resolves to an array of the user's registrations
 */
export async function getUserRegistrations() {
  try {
    const user = supabase.auth.user();
    
    if (!user) {
      throw new Error('User must be logged in to view registrations');
    }
    
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*, events(*)')
      .eq('email', user.email);
    
    if (error) {
      console.error('Error fetching user registrations:', error);
      throw new Error('Failed to fetch registrations');
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUserRegistrations:', error);
    throw error;
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
      .from('event_registrations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating registration with ID ${id}:`, error);
      throw new Error('Failed to update registration');
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateRegistration:', error);
    throw error;
  }
}

/**
 * Updates the email_sent status for a registration
 * @param {number} id - The registration ID
 * @param {boolean} emailSent - The new email_sent status
 * @returns {Promise<Object>} - A promise that resolves to the updated registration
 */
export async function markEmailSent(id, emailSent = true) {
  try {
    // This should only be called server-side with the admin client
    if (!supabaseAdmin) {
      throw new Error('Admin privileges required to update email status');
    }
    
    const { data, error } = await supabaseAdmin
      .from('event_registrations')
      .update({ email_sent: emailSent })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating email_sent status for registration ${id}:`, error);
      throw new Error('Failed to update email status');
    }
    
    return data;
  } catch (error) {
    console.error('Error in markEmailSent:', error);
    throw error;
  }
}
