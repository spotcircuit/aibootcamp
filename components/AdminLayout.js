import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Get session immediately
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace('/login');
        return;
      }

      // Quick check for admin status
      const { data } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (!data?.is_admin) {
        router.replace('/');
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
