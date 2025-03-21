import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

// Higher order component to protect routes that require authentication
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and has proper permissions
    const checkAuth = async () => {
      try {
        // Check current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error checking session:', sessionError);
          router.push('/login');
          return;
        }
        
        if (!sessionData.session) {
          console.log('No active session found');
          router.push('/login');
          return;
        }
        
        // Get user details
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          console.error('Error getting user details:', userError?.message);
          router.push('/login');
          return;
        }
        
        setUser(userData.user);
        
        // If admin access is required, check admin status
        if (requireAdmin) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', userData.user.id)
            .single();
          
          if (profileError) {
            console.error('Error checking admin status:', profileError);
            router.push('/dashboard');
            return;
          }
          
          if (!profileData || !profileData.is_admin) {
            console.log('User is not an admin, redirecting');
            router.push('/dashboard');
            return;
          }
          
          setIsAdmin(true);
        }
        
        // Successfully authenticated
        setLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, requireAdmin]);

  // Show loading state while checking auth
  if (loading) {
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

  // If authentication and permission checks pass, render the children
  return (requireAdmin && !isAdmin) ? null : (user ? children : null);
}
