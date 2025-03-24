import '../styles/globals.css';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { createContext } from 'react';
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
          setUser(null);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('Found user:', session.user.id, session.user.email);
          setUser(session.user);
          console.log('User set in context:', session.user.email);
        } else {
          console.log('No user session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Error in checkUser:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id, session?.user?.email);
      
      if (session?.user) {
        console.log('Setting user in context after auth change:', session.user.email);
        setUser(session.user);
        
        // If this was a sign-in event, redirect to dashboard after a short delay
        if (event === 'SIGNED_IN' && window.location.pathname === '/login') {
          console.log('Auto-redirecting to dashboard after sign in');
          setTimeout(() => {
            window.location.href = '/dashboard?via=authStateChange';
          }, 1000);
        }
      } else {
        console.log('Clearing user from context');
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
