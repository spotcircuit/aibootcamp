import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from './supabase';

// Custom hook for checking authentication status
export function useAuth({ redirectTo = null, redirectIfFound = false } = {}) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current authentication status
    const checkAuth = async () => {
      try {
        // First check for an existing session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error checking session:', sessionError);
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (sessionData?.session) {
          // If we have a session, get the user
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error('Error getting user details:', userError);
            setUser(null);
          } else {
            setUser(userData.user);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting auth status:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event);
        
        if (event === 'SIGNED_IN') {
          // On sign in, check database for admin status
          try {
            const { data, error } = await supabase
              .from('users')
              .select('is_admin')
              .eq('id', session.user.id)
              .single();
              
            if (!error && data?.is_admin === true) {
              // Update session metadata with admin status
              await supabase.auth.updateUser({
                data: { is_admin: true }
              });
            }
          } catch (err) {
            console.error('Error checking admin status:', err);
          }
        }
        
        const currentUser = session?.user;
        setUser(currentUser || null);
        setLoading(false);
        
        // Handle auth change events
        if (event === 'SIGNED_OUT') {
          // Clear any local state/cache
          setUser(null);
          // Redirect on sign out if specified
          if (redirectTo && !redirectIfFound) {
            router.push(redirectTo);
          }
        }
        
        if (event === 'SIGNED_IN' && redirectIfFound) {
          router.push(redirectTo);
        }
      }
    );

    // Cleanup subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [redirectTo, redirectIfFound, router]);

  return { user, loading };
}

// Higher-order component to protect routes
export function withAuth(Component, options = {}) {
  return function AuthProtected(props) {
    const { user, loading } = useAuth(options);
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    // Fetch user profile data if user is authenticated
    useEffect(() => {
      const fetchUserProfile = async () => {
        if (!user) return;
        
        setProfileLoading(true);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching user profile:', error);
          } else {
            console.log('User profile fetched:', data);
            setProfile(data);
          }
        } catch (error) {
          console.error('Unexpected error fetching profile:', error);
        } finally {
          setProfileLoading(false);
        }
      };
      
      if (user) {
        fetchUserProfile();
      }
    }, [user]);

    // Show loading indicator
    if (loading || profileLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-300 dark:bg-gray-700 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If no redirect is specified, render the component only when authenticated
    if (!options.redirectTo && !user) {
      router.push('/login');
      return null;
    }

    // Pass auth state and profile as props to the component
    const enhancedUser = user ? {
      ...user,
      profile: profile || null
    } : null;
    
    return <Component {...props} user={enhancedUser} />;
  };
}

// Sign out helper function
export async function signOut(router) {
  try {
    // First clear any session data
    const { error } = await supabase.auth.signOut({
      scope: 'global'  // Clear all sessions, not just current
    });
    
    if (error) throw error;
    
    // Force clear any cached user data
    await supabase.auth.refreshSession();
    
    // Redirect to home page after sign out
    router.push('/');
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
}
