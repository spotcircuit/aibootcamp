import { supabaseAdmin } from '../../../../lib/supabase-admin';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the email from the request body
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: 'Email is required'
    });
  }

  try {
    // Generate a setup token
    const setupToken = uuidv4();
    
    // Use a hardcoded base URL if the environment variable isn't available
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Create the redirect URL for the invitation
    const redirectUrl = `${baseUrl}/auth/callback`;
    
    // Check if the user already exists in auth.users
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error checking existing users:', listError);
      // Continue anyway
    }
    
    let userId = '';
    let isNewUser = true;
    let inviteUrl = '';
    
    // If user exists in auth.users, we'll use their ID
    if (existingUsers && existingUsers.users) {
      const foundUser = existingUsers.users.find(u => u.email === email);
      if (foundUser) {
        userId = foundUser.id;
        isNewUser = false;
      }
    }
    
    // Create or invite the user in Supabase Auth
    try {
      console.log('Creating/inviting user in Supabase Auth:', email);
      
      // First, create the user without sending an email
      const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: false, // Don't send confirmation email yet
        user_metadata: {
          setup_token: setupToken
        },
        password: null // No password yet, will be set during setup
      });
      
      let authData = null;
      
      if (!createError && userData) {
        console.log('User created successfully:', userData.user.id);
        
        // Now explicitly send an invitation email
        const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
          redirectTo: `${redirectUrl}?redirect_to=${encodeURIComponent(`/auth/setup?token=${setupToken}&email=${encodeURIComponent(email)}`)}`
        });
        
        if (inviteError) {
          console.error('Error sending invitation email:', inviteError);
          // Continue anyway, we'll provide a backup link
        } else {
          console.log('Invitation email sent successfully');
          inviteUrl = 'Invitation email sent to user';
        }
        
        authData = userData;
      }
      
      if (createError) {
        // If user already exists, try to send an invitation directly
        if (createError.message.includes('already exists')) {
          console.log('User already exists, sending invitation directly...');
          
          // Try to get the user ID first
          const { data: existingUsers, error: userError } = await supabaseAdmin.auth.admin.listUsers();
          
          if (!userError && existingUsers) {
            const foundUser = existingUsers.users.find(u => u.email === email);
            if (foundUser) {
              userId = foundUser.id;
              console.log('Found existing user:', userId);
              
              // Send an invitation email to the existing user
              const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
                redirectTo: `${redirectUrl}?redirect_to=${encodeURIComponent(`/auth/setup?token=${setupToken}&email=${encodeURIComponent(email)}`)}`
              });
              
              if (inviteError) {
                console.error('Error sending invitation to existing user:', inviteError);
                // Continue anyway, we'll provide a backup link
              } else {
                console.log('Invitation sent to existing user');
                inviteUrl = 'Invitation email sent to existing user';
              }
            } else {
              console.error('User exists but not found in list');
              userId = uuidv4(); // Fallback to a new UUID
            }
          } else {
            console.error('Error listing users:', userError);
            userId = uuidv4(); // Fallback to a new UUID
          }
        } else {
          console.error('Error creating user account:', createError);
          return res.status(400).json({ error: 'Failed to create user account: ' + createError.message });
        }
      } else if (authData) {
        console.log('User account created successfully:', authData.user.id);
        userId = authData.user.id;
      }
    } catch (authError) {
      console.error('Exception during user account creation:', authError);
      return res.status(400).json({ error: 'Exception during account creation: ' + authError.message });
    }
    
    // Store the setup token in the user's metadata
    try {
      // Update the user's metadata to include the setup token
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        {
          user_metadata: {
            setup_token: setupToken,
            setup_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
      );
        
      if (updateError) {
        console.error('Error storing setup token in user metadata:', updateError);
        // Continue anyway
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue anyway
    }

    // Format the response to match what the admin dashboard expects
    const user = {
      id: userId,
      email: email,
      created_at: new Date().toISOString(),
      last_sign_in_at: null
    };

    // Generate a backup setup URL in case the email doesn't arrive
    const setupUrl = `${baseUrl}/auth/setup?token=${setupToken}&email=${encodeURIComponent(email)}`;

    res.status(200).json({
      user: user,
      message: isNewUser ?
        'User created and invitation email sent. IMPORTANT: If the user does not receive the email, you must share the backup setup link below.' :
        'Invitation email sent to existing user. IMPORTANT: If the user does not receive the email, you must share the backup setup link below.',
      setupUrl: setupUrl,
      inviteUrl: inviteUrl || 'No direct invitation link available, use the backup setup link',
      isNewUser: isNewUser,
      manualSetupRequired: true // Flag to indicate manual setup may be required
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(400).json({
      error: 'An unexpected error occurred'
    });
  }
}
