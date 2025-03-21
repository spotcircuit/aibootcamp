import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jrxgocrwwoofyyliwsnk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyeGdvY3J3d29vZnl5bGl3c25rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MDcwMDUsImV4cCI6MjA1NjE4MzAwNX0.6I40cVGtfnlavZk7lnP-myRb2w5G_HJGqJZxu2D-WL4';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Monitor auth state changes
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', { 
      event, 
      email: session?.user?.email,
      isAdmin: session?.user?.user_metadata?.is_admin 
    });
  });
}
