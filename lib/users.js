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
    
    // Instead of fetching from the users table, just return the user metadata from auth
    // This avoids the dependency on the public.users table
    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email,
      phone: user.user_metadata?.phone || '',
      experience: user.user_metadata?.experience || 'beginner',
      created_at: user.created_at
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
}

/**
 * Check if a user is an admin
 * @param {string} userId - ID of the user to check
 * @returns {Promise<boolean>} - Whether the user is an admin
 */
export async function isUserAdmin(userId) {
  try {
    // Get the user from auth.users
    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (!user) {
      return false;
    }
    
    // Check if the user has admin role in their JWT claims or metadata
    return (
      user?.app_metadata?.role === 'admin' ||
      user?.user_metadata?.is_admin === true
    );
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get all users from auth.users
 * @returns {Promise<Array>} - Array of users
 */
export async function getAllUsers() {
  try {
    // Get all users from auth.users
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) throw error;
    
    // Format the users to match the expected format
    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email,
      phone: user.user_metadata?.phone || '',
      experience: user.user_metadata?.experience || 'beginner',
      is_admin: user.app_metadata?.role === 'admin' || user.user_metadata?.is_admin === true,
      created_at: user.created_at
    }));
  } catch (error) {
    console.error('Error fetching all users:', error);
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
    const { data: { user } } = await supabaseAdmin.auth.getUser();
    
    if (!user) {
      throw new Error('Unauthorized: Admin access required');
    }
    
    // Check if the current user is an admin
    const isAdmin = await isUserAdmin(user.id);
    
    if (!isAdmin) {
      throw new Error('Forbidden: Admin access required');
    }
    
    // Validate input
    const validMetadata = {};
    if (userData.name) validMetadata.name = userData.name;
    if (userData.phone) validMetadata.phone = userData.phone;
    if (userData.experience) validMetadata.experience = userData.experience;
    
    // For admin status, we need to update app_metadata
    let appMetadata = {};
    if (userData.is_admin !== undefined) {
      appMetadata.role = userData.is_admin ? 'admin' : 'user';
    }
    
    // Update user metadata directly in auth.users
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        user_metadata: validMetadata,
        app_metadata: Object.keys(appMetadata).length > 0 ? appMetadata : undefined
      }
    );
    
    if (error) {
      console.error('Error updating user profile by admin:', error);
      throw new Error('Failed to update user profile');
    }
    
    // Return the updated user data
    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || data.user.email,
      phone: data.user.user_metadata?.phone || '',
      experience: data.user.user_metadata?.experience || 'beginner',
      is_admin: data.user.app_metadata?.role === 'admin',
      created_at: data.user.created_at
    };
  } catch (error) {
    console.error('Error in adminUpdateUserProfile:', error);
    throw error;
  }
}
