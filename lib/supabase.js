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
