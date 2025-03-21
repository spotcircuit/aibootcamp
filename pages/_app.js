import '../styles/globals.css';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { createContext } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

// Create auth context
export const AuthContext = createContext({
  user: null,
  loading: true,
});

// Create theme context
export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    console.log('=== APP INIT ===');
    
    // Check for the current user when the app mounts
    const checkUser = async () => {
      try {
        console.log('Checking current user...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          return;
        }

        if (session?.user) {
          console.log('Found user:', session.user.id);
          
          // Check admin status
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();

          console.log('User data:', { userData, userError });
          
          if (!userError && userData) {
            // Update session with admin status
            await supabase.auth.updateUser({
              data: { is_admin: userData.is_admin === true }
            });
          }

          setUser(session.user);
        } else {
          console.log('No user session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Error in checkUser:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      if (session?.user) {
        // Check admin status on auth change
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        console.log('User data on auth change:', { userData, userError });
        
        if (!userError && userData) {
          await supabase.auth.updateUser({
            data: { is_admin: userData.is_admin === true }
          });
        }

        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    // Load dark mode preference
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedDarkMode);
      if (savedDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <Head>
          <title>AI Bootcamp</title>
          <meta name="description" content="AI Bootcamp - Learn AI Development" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

export default MyApp;
