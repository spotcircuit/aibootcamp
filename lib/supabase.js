import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create regular client for user operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// --- Admin Client Initialization ---
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabaseAdmin = null;

// Create admin client ONLY if service key is available (typically server-side)
if (supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      // For service roles, disable session persistence and auto-refresh
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
} else {
  // Log a warning if the service key is missing in a server environment
  if (typeof window === 'undefined') { // Check if likely server-side
    console.warn(
      'WARNING: SUPABASE_SERVICE_ROLE_KEY is not set. Supabase admin client will not be initialized.'
    );
  }
}

// Export the admin client (it might be null if the key was missing)
export { supabaseAdmin };
// --- End Admin Client Initialization ---

// Add request interceptor
if (typeof window !== 'undefined') {
  const originalFrom = supabase.from.bind(supabase);
  supabase.from = (...args) => {
    const result = originalFrom(...args);
    return result;
  };
}

// Monitor auth state changes
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('[Supabase] Auth state changed:', { 
      event, 
      email: session?.user?.email,
      id: session?.user?.id,
      metadata: session?.user?.user_metadata
    });
    
    // Force refresh token on certain events
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      console.log('Refreshing auth state');
      // This helps ensure the token is properly stored and available
      if (session) {
        supabase.auth.getSession().then(({ data }) => {
          console.log('Session refreshed:', data?.session?.user?.id);
        });
      }
    }
  });
}
