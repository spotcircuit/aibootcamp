import { supabase, supabaseAdmin } from './supabase';

/**
 * Update the current user's profile
 * @param {Object} userData - User profile data to update
 * @returns {Promise<Object>} - Updated user profile
 */
export async function updateUserProfile(userData) {
  try {
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to update profile');
    }
    
    // Validate input
    const validMetadata = {};
    if (userData.name) validMetadata.name = userData.name;
    if (userData.phone) validMetadata.phone = userData.phone;
    if (userData.experience) validMetadata.experience = userData.experience;
    
    // Update user metadata directly in the auth profile
    const { data, error } = await supabase.auth.updateUser({
      data: validMetadata
    });
    
    if (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
    
    return data?.user || { id: user.id, ...validMetadata };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
}

/**
 * Get the current user's profile
 * @returns {Promise<Object>} - User profile data
 */
export async function getUserProfile() {
  try {
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to get profile');
    }
    
    // Fetch user profile from the users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
}

/**
 * Admin function to update any user's profile
 * @param {string} userId - ID of the user to update
 * @param {Object} userData - User profile data to update
 * @returns {Promise<Object>} - Updated user profile
 */
export async function adminUpdateUserProfile(userId, userData) {
  try {
    // Get the current admin user
    const { user } = await supabaseAdmin.auth.getUser();
    
    if (!user) {
      throw new Error('Unauthorized: Admin access required');
    }
    
    // Verify admin status
    const { data: adminProfile } = await supabaseAdmin
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (!adminProfile?.is_admin) {
      throw new Error('Forbidden: Admin access required');
    }
    
    // Validate input
    const validFields = {};
    if (userData.name) validFields.name = userData.name;
    if (userData.phone) validFields.phone = userData.phone;
    if (userData.is_admin !== undefined) validFields.is_admin = userData.is_admin;
    
    // Update user profile in the users table
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(validFields)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile by admin:', error);
      throw new Error('Failed to update user profile');
    }
    
    return data;
  } catch (error) {
    console.error('Error in adminUpdateUserProfile:', error);
    throw error;
  }
}
