import { supabase, supabaseAdmin } from './supabase';

/**
 * Creates a new registration for an event
 * @param {Object} registrationData - Object containing registration details
 * @returns {Promise<Object>} - A promise that resolves to the created registration
 */
export async function createRegistration(registrationData) {
  try {
    console.log('Attempting to create registration with data:', JSON.stringify(registrationData, null, 2));
    
    // Try to insert into registrations table first
    let data, error;
    
    try {
      const result = await supabase
        .from('registrations')
        .insert([registrationData])
        .select()
        .single();
      
      data = result.data;
      error = result.error;
      
      if (error && error.code === '42P01') { // Table doesn't exist error
        console.log('The registrations table does not exist, trying event_registrations');
        throw error; // Throw to trigger the fallback
      }
    } catch {
      // Fallback to event_registrations table
      console.log('Falling back to event_registrations table');
      const fallbackResult = await supabase
        .from('event_registrations')
        .insert([registrationData])
        .select()
        .single();
      
      data = fallbackResult.data;
      error = fallbackResult.error;
      
      if (error && error.code === '42P01') {
        console.error('Neither registrations nor event_registrations tables exist:', error);
        throw new Error('Registration tables do not exist. Please run database migrations first.');
      }
    }
    
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
    let registrations = [];
    
    // Try registrations table first
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('event_id', eventId);
      
      if (error) {
        if (error.code === '42P01') { // Table doesn't exist
          console.log('Registrations table not found, trying event_registrations');
          throw error; // Throw to trigger fallback
        } else {
          console.error('Error fetching from registrations table:', error);
          throw error;
        }
      }
      
      registrations = data || [];
    } catch {
      // Fallback to event_registrations
      try {
        const { data, error } = await supabase
          .from('event_registrations')
          .select('*')
          .eq('event_id', eventId);
        
        if (error) {
          if (error.code === '42P01') {
            console.log('Neither registrations nor event_registrations tables exist');
            return []; // Return empty array if no tables exist
          } else {
            console.error('Error fetching from event_registrations:', error);
            throw error;
          }
        }
        
        registrations = data || [];
      } catch (eventRegError) {
        console.error('Error in fallback registration fetch:', eventRegError);
        return []; // Return empty array on error
      }
    }
    
    return registrations;
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
    
    let registrations = [];
    
    // Try registrations table first
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*, events(*)')
        .eq('auth_user_id', user.id);
      
      if (error) {
        if (error.code === '42P01') { // Table doesn't exist
          console.log('Registrations table not found, trying event_registrations');
          throw error; // Throw to trigger fallback
        } else {
          console.error('Error fetching from registrations table:', error);
          throw error;
        }
      }
      
      registrations = data || [];
    } catch {
      // Fallback to event_registrations
      try {
        const { data, error } = await supabase
          .from('event_registrations')
          .select('*, events(*)')
          .eq('auth_user_id', user.id);
        
        if (error) {
          if (error.code === '42P01') {
            console.log('Neither registrations nor event_registrations tables exist');
            return []; // Return empty array if no tables exist
          } else {
            console.error('Error fetching from event_registrations:', error);
            throw error;
          }
        }
        
        registrations = data || [];
      } catch (eventRegError) {
        console.error('Error in fallback registration fetch:', eventRegError);
        return []; // Return empty array on error
      }
    }
    
    return registrations;
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
    
    let data, error;
    
    // Try registrations table first
    try {
      const result = await supabaseAdmin
        .from('registrations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
      
      if (error && error.code === '42P01') { // Table doesn't exist
        console.log('Registrations table not found, trying event_registrations');
        throw error; // Throw to trigger fallback
      }
    } catch {
      // Fallback to event_registrations
      const fallbackResult = await supabaseAdmin
        .from('event_registrations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      data = fallbackResult.data;
      error = fallbackResult.error;
    }
    
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
    
    let data, error;
    
    // Try registrations table first
    try {
      const result = await supabaseAdmin
        .from('registrations')
        .update({ email_sent: emailSent })
        .eq('id', id)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
      
      if (error && error.code === '42P01') { // Table doesn't exist
        console.log('Registrations table not found, trying event_registrations');
        throw error; // Throw to trigger fallback
      }
    } catch {
      // Fallback to event_registrations
      const fallbackResult = await supabaseAdmin
        .from('event_registrations')
        .update({ email_sent: emailSent })
        .eq('id', id)
        .select()
        .single();
      
      data = fallbackResult.data;
      error = fallbackResult.error;
    }
    
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
