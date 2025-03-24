import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Log everything to help debug
        console.log('Query params:', router.query);
        console.log('Hash fragments:', window.location.hash);
        
        // First, check for error conditions
        if (router.query.error) {
          console.error('Error in auth callback:', router.query.error);
          router.push(`/login?error=${encodeURIComponent(router.query.error_description || router.query.error)}`);
          return;
        }
        
        // Check for hash errors (OAuth flows)
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          if (hashParams.get('error')) {
            router.push(`/login?error=${encodeURIComponent(hashParams.get('error_description') || hashParams.get('error'))}`);
            return;
          }
        }
        
        // Handle invitation flow - check for type=invite or type=recovery in query params
        if (router.query.type === 'invite' || router.query.type === 'recovery') {
          setMessage(`Processing ${router.query.type} flow...`);
          
          // If we have a token and email, go directly to setup
          if (router.query.token && router.query.email) {
            console.log('Found token and email in query params, redirecting to setup');
            router.push(`/auth/setup?token=${router.query.token}&email=${encodeURIComponent(router.query.email)}&type=${router.query.type}`);
            return;
          }
          
          // If we have just a token, try to get the user's email from Supabase
          if (router.query.token) {
            try {
              // Try to exchange the token for a session
              const { error } = await supabase.auth.verifyOtp({
                token_hash: router.query.token,
                type: router.query.type === 'invite' ? 'invite' : 'recovery'
              });
              
              if (error) {
                console.error('Error verifying token:', error);
                // Continue with the token we have, the setup page will handle errors
              } else {
                console.log('Successfully verified token');
                // If we couldn't get the email, just redirect with the token
                router.push(`/auth/setup?token=${router.query.token}&type=${router.query.type}`);
                return;
              }
            } catch (verifyError) {
              console.error('Exception verifying token:', verifyError);
              // Continue with the token we have
            }
            
            // If we couldn't get the email, just redirect with the token
            router.push(`/auth/setup?token=${router.query.token}&type=${router.query.type}`);
            return;
          }
        }
        
        // Extract any token/email from the hash fragment or redirect_to parameter
        let setupToken = '';
        let userEmail = '';
        let setupType = '';
        
        // Look for setup parameters in hash fragment or query parameters
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          
          // Check for redirect_to in hash params
          const redirectTo = hashParams.get('redirect_to');
          if (redirectTo) {
            // Try to extract setup parameters from the redirect URL
            try {
              const redirectUrl = new URL(decodeURIComponent(redirectTo));
              const redirectParams = new URLSearchParams(redirectUrl.search);
              setupToken = redirectParams.get('token') || '';
              userEmail = redirectParams.get('email') || '';
              setupType = redirectParams.get('type') || 'invite';
              
              if (setupToken) {
                console.log('Found setup parameters in hash fragment redirect_to');
                const setupUrl = `/auth/setup?token=${setupToken}${userEmail ? `&email=${encodeURIComponent(userEmail)}` : ''}&type=${setupType}`;
                router.push(setupUrl);
                return;
              }
            } catch (urlError) {
              console.error('Error parsing redirect URL:', urlError);
            }
          }
          
          // Check for access_token in hash (OAuth flow)
          if (hashParams.get('access_token')) {
            setMessage('Processing OAuth login...');
            try {
              const accessToken = hashParams.get('access_token');
              const refreshToken = hashParams.get('refresh_token');
              
              if (accessToken && refreshToken) {
                const { error } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken
                });
                
                if (error) throw error;
                
                // Successfully set session
                console.log('Session established via OAuth');
                
                // Check if redirectTo had setup parameters
                if (redirectTo) {
                  try {
                    // Try to parse the redirect URL for setup parameters
                    const redirectUrl = new URL(decodeURIComponent(redirectTo));
                    const params = new URLSearchParams(redirectUrl.search);
                    
                    if (params.has('token')) {
                      router.push(redirectUrl.pathname + redirectUrl.search);
                      return;
                    }
                  } catch (err) {
                    console.error('Error parsing redirect URL:', err);
                  }
                }
                
                // Default to dashboard if no setup redirect
                router.push('/');
                return;
              } else {
                throw new Error('Missing tokens in OAuth redirect');
              }
            } catch (err) {
              console.error('Error processing OAuth:', err);
              router.push(`/login?error=${encodeURIComponent(err.message)}`);
              return;
            }
          }
        }
        
        // Check if we have a session already
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('User is authenticated, session exists');
          
          // Get the email from the session
          const email = session.user.email;
          
          // If we have both the email and token in the URL already, redirect to setup
          if (router.query.token && router.query.email) {
            router.push(`/auth/setup?token=${router.query.token}&email=${encodeURIComponent(router.query.email)}&type=${router.query.type || 'invite'}`);
            return;
          }
          
          // If just the token, use the email from the session
          if (router.query.token) {
            router.push(`/auth/setup?token=${router.query.token}&email=${encodeURIComponent(email)}&type=${router.query.type || 'invite'}`);
            return;
          }
          
          // Check for redirect_to in query params
          if (router.query.redirect_to) {
            try {
              const redirectUrl = new URL(decodeURIComponent(router.query.redirect_to));
              router.push(redirectUrl.pathname + redirectUrl.search);
              return;
            } catch (urlError) {
              console.error('Error parsing redirect_to URL:', urlError);
            }
          }
          
          // Otherwise, just go to dashboard
          router.push('/');
          return;
        }
        
        // If we got here, we don't have enough information to proceed
        console.error('No authentication data found in URL');
        router.push('/login?error=No authentication data found');
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        router.push(`/login?error=${encodeURIComponent(err.message)}`);
      }
    };
    
    if (router.isReady) {
      processCallback();
    }
  }, [router.isReady, router.query, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Authentication</h1>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">{message}</p>
        </div>
      </div>
    </div>
  );
}
