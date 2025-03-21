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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setUser(null);
        } else if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }

      // Handle redirects
      if (redirectTo) {
        if (redirectIfFound && session?.user) {
          router.push(redirectTo);
        } else if (!redirectIfFound && !session?.user) {
          router.push(redirectTo);
        }
      }
    });

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, [redirectTo, redirectIfFound, router]);

  return { user, loading };
}

// Higher-order component to protect routes
export function withAuth(Component, options = {}) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth(options);
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user && options.redirectTo) {
        router.push(options.redirectTo);
      }
    }, [loading, user, router]);

    // Show loading state
    if (loading) {
      return <div>Loading...</div>;
    }

    // If auth is required and user is not logged in, don't render component
    if (!user && options.redirectTo) {
      return null;
    }

    // If user is logged in and page is meant for unauthenticated users, redirect
    if (user && options.redirectIfFound) {
      router.push(options.redirectTo || '/');
      return null;
    }

    // Render component
    return <Component {...props} user={user} />;
  };
}

// Sign out helper function
export async function signOut(router) {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      return false;
    }
    router.push('/login');
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
}
