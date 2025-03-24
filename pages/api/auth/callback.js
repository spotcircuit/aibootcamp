// Server-side callback handler for Supabase auth (invitation, password reset, etc.)
import { supabaseAdmin } from '../../../lib/supabase-admin';

export default async function handler(req, res) {
  // Get the token and type from query parameters
  const { token, type, redirect_to } = req.query;
  
  console.log('Auth callback received:', {
    token: token ? token.substring(0, 10) + '...' : 'none',
    type,
    redirect_to
  });
  
  // No token or redirect destination - bad request
  if (!token) {
    return res.redirect(`/login?error=${encodeURIComponent('Missing authentication token')}`);
  }
  
  if (!redirect_to) {
    // If no redirect_to is provided, default to the setup page
    // This is a fallback in case the redirect URL is missing
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return res.redirect(`${baseUrl}/auth/setup?token=${token}`);
  }
  
  try {
    // Create the final URL to redirect to after successful verification
    // This URL should include the token so the client can complete the flow
    const redirectUrl = new URL(redirect_to);
    
    // Add token to the redirect URL as a query parameter so the client-side can complete auth
    redirectUrl.searchParams.append('token', token);
    redirectUrl.searchParams.append('type', type || 'invite');
    
    // If this is an invitation and we're redirecting to setup, try to extract the email
    if ((type === 'invite' || !type) && redirect_to.includes('/auth/setup')) {
      try {
        // Try to get user info from the token to extract email
        const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
        
        if (!userError && userData && userData.user && userData.user.email) {
          redirectUrl.searchParams.append('email', userData.user.email);
          console.log('Added email to redirect URL:', userData.user.email);
        } else {
          console.warn('Could not get user email from token:', userError);
        }
      } catch (tokenError) {
        console.warn('Error getting user from token:', tokenError);
        // Continue anyway, the setup page will ask for email if needed
      }
    }
    
    // Redirect to the client app with the token
    // This avoids trying to verify the token on the server and lets Supabase handle it
    console.log('Redirecting to:', redirectUrl.toString());
    return res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('Error in auth callback:', error);
    return res.redirect(`/login?error=${encodeURIComponent('Authentication failed: ' + error.message)}`);
  }
}
