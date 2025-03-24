import { supabaseAdmin } from '../../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, email, password, name, phone } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    console.log('Starting user setup for email:', email);
    
    // First, try to verify if this is a valid invitation token from Supabase Auth
    let userId = null;
    let isInviteToken = false;
    
    if (token) {
      try {
        // Check if this is a valid token in the auth system
        // This would be the case for invitations sent via email
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (!userError && userData && userData.users) {
          // Find the user with this email
          const matchingUser = userData.users.find(u => u.email === email);
          
          if (matchingUser) {
            console.log('Found matching user in auth system:', matchingUser.id);
            userId = matchingUser.id;
            
            // Check if the user has a confirmation token that matches
            if (matchingUser.confirmation_token === token) {
              console.log('Token matches confirmation token');
              isInviteToken = true;
            }
          }
        }
      } catch (tokenError) {
        console.warn('Error checking auth token:', tokenError);
        // Continue to check the profiles table
      }
    }
    
    // If not a valid auth token, verify the setup token in the profiles table
    if (!isInviteToken) {
      const { data: profiles, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('email', email);
      
      if (profileError) {
        console.error('Error querying profiles:', profileError);
        return res.status(400).json({ error: 'Failed to verify user profile' });
      }
      
      // If we have a token, verify it matches
      if (token && profiles && profiles.length > 0) {
        const matchingProfile = profiles.find(p => p.setup_token === token);
        
        if (!matchingProfile) {
          console.error('Invalid setup token for email:', email);
          return res.status(400).json({ error: 'Invalid setup token' });
        }
        
        console.log('Found matching profile with token:', matchingProfile.id);
        userId = matchingProfile.id;
      } else if (profiles && profiles.length > 0) {
        // No token but profile exists
        console.log('Found existing profile without token check:', profiles[0].id);
        userId = profiles[0].id;
      }
    }
    
    // Handle the user account in Supabase Auth
    try {
      // If we have a userId, try to update the existing user
      if (userId) {
        console.log('Updating existing user:', userId);
        
        // Update the user with the new password and metadata
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          {
            password,
            email_confirm: true, // Ensure email is confirmed
            user_metadata: {
              name: name || '',
              phone: phone || '',
              setup_completed: true,
              setup_completed_at: new Date().toISOString()
            }
          }
        );
        
        if (updateError) {
          console.error('Error updating existing user:', updateError);
          
          // If user doesn't exist in auth but exists in profiles, create them
          if (updateError.message.includes('not found')) {
            console.log('User exists in profiles but not in auth, creating...');
            
            // Create the user with the provided email and password
            const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
              email,
              password,
              email_confirm: true,
              user_metadata: {
                name: name || '',
                phone: phone || '',
                setup_completed: true,
                setup_completed_at: new Date().toISOString()
              }
            });
            
            if (createError) {
              console.error('Error creating user account:', createError);
              return res.status(400).json({ error: 'Failed to create user account: ' + createError.message });
            }
            
            console.log('User account created successfully:', authData.user.id);
            userId = authData.user.id;
          } else {
            return res.status(400).json({ error: 'Failed to update user: ' + updateError.message });
          }
        }
      } else {
        // No existing user found, create a new one
        console.log('Creating new user account...');
        
        // Create the user with the provided email and password
        const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            name: name || '',
            phone: phone || '',
            setup_completed: true,
            setup_completed_at: new Date().toISOString()
          }
        });
        
        if (createError) {
          console.error('Error creating user account:', createError);
          return res.status(400).json({ error: 'Failed to create user account: ' + createError.message });
        }
        
        console.log('User account created successfully:', authData.user.id);
        userId = authData.user.id;
      }
    } catch (authError) {
      console.error('Exception during user account management:', authError);
      return res.status(400).json({ error: 'Exception during account setup: ' + authError.message });
    }
    
    // Update or create the profile record
    try {
      console.log('Updating user profile...');
      
      // Upsert the profile with the user ID
      const { error: profileUpsertError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          email: email,
          name: name || '',
          phone: phone || '',
          setup_completed: true,
          setup_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileUpsertError) {
        console.warn('Could not update profile:', profileUpsertError);
        // Continue anyway
      } else {
        console.log('Profile updated successfully');
      }
    } catch (profileError) {
      console.warn('Exception updating profile:', profileError);
      // Continue anyway
    }

    // Return success
    return res.status(200).json({
      success: true,
      message: 'User setup completed successfully'
    });
  } catch (error) {
    console.error('Unexpected error in setup-user:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred',
      details: error.message
    });
  }
}
