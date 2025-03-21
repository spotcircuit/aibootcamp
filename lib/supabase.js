import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for cases where they might not be available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jrxgocrwwoofyyliwsnk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyeGdvY3J3d29vZnl5bGl3c25rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MDcwMDUsImV4cCI6MjA1NjE4MzAwNX0.6I40cVGtfnlavZk7lnP-myRb2w5G_HJGqJZxu2D-WL4';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if keys are available
if (!supabaseUrl) {
  console.warn('Supabase URL is not defined in environment variables');
}

if (!supabaseAnonKey) {
  console.warn('Supabase Anon Key is not defined in environment variables');
}

// Create a single Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize session check
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      // Check admin status and update session
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();
      
      if (!error && data?.is_admin === true) {
        // Update user metadata
        await supabase.auth.updateUser({
          data: { is_admin: true }
        });
      }
    }
  });
}

// Create a Supabase admin client with the service role key for server-side operations
// This is conditionally created only if the service role key is available
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      }
    })
  : null;

// Helper function to check if admin client is available
export const isAdminClientAvailable = () => !!supabaseServiceKey;
