import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import { useAuth, signOut } from '../lib/auth';
import ThemeToggle from './ThemeToggle';
import { AuthContext } from '../pages/_app';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [debugData, setDebugData] = useState(null);
  const router = useRouter();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [router.asPath]);

  // Load debug information
  useEffect(() => {
    const loadDebugInfo = async () => {
      if (!user) return;
      
      try {
        // Get user data from Auth
        const { data: authUserData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        // Try to get user data from database (users table)
        let dbUserData = null;
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUserData.user.id)
            .single();
          
          if (!error) dbUserData = data;
        } catch (err) {
          console.log('Error fetching db user:', err);
        }
        
        // Set debug data
        setDebugData({
          user: authUserData.user,
          dbUser: dbUserData,
          adminStatus: determineAdminStatus(authUserData.user, dbUserData)
        });
      } catch (err) {
        console.error('Error loading debug info:', err);
      }
    };
    
    loadDebugInfo();
  }, [user]);
  
  // Function to determine admin status
  const determineAdminStatus = (authUser, dbUser) => {
    if (!authUser) return 'Not logged in';
    
    const userMetadata = authUser.user_metadata || {};
    
    // Check various formats
    if (userMetadata.is_admin === true) return 'Admin via metadata is_admin=true';
    if (userMetadata.admin === true) return 'Admin via metadata admin=true';
    if (userMetadata.role === 'admin') return 'Admin via metadata role=admin';
    
    if (dbUser) {
      if (dbUser.is_admin === true) return 'Admin via database is_admin=true';
      if (dbUser.is_admin === 'true') return 'Admin via database is_admin="true"';
      if (dbUser.admin === true) return 'Admin via database admin=true';
      if (dbUser.role === 'admin') return 'Admin via database role=admin';
    }
    
    return 'Not an admin';
  };

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        // Just check users table for is_admin
        const { data, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error checking admin status:', error.message);
          setIsAdmin(false);
          return;
        }

        // Set admin status based on database value
        setIsAdmin(data?.is_admin === true);
        
      } catch (error) {
        console.error('Error checking admin status:', error.message);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleSignOut = async () => {
    const result = await signOut(router);
    if (!result.success) {
      console.error('Error signing out:', result.error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
      {showDebug && debugData && (
        <div className="w-full bg-gray-100 dark:bg-gray-900 p-2 text-xs font-mono overflow-x-auto">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold">User:</span> {debugData.user.email} | 
                <span className="font-bold">ID:</span> {debugData.user.id} | 
                <span className="font-bold">Admin:</span> {debugData.adminStatus}
              </div>
              <button 
                onClick={() => setShowDebug(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
            {debugData.user.user_metadata && (
              <div className="mt-1">
                <span className="font-bold">Metadata:</span> {JSON.stringify(debugData.user.user_metadata)}
              </div>
            )}
            {debugData.dbUser && (
              <div className="mt-1">
                <span className="font-bold">DB User:</span> {JSON.stringify(debugData.dbUser)}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-800 dark:text-white">AI Bootcamp</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                  ${router.pathname === '/' 
                    ? 'border-indigo-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white dark:hover:border-gray-700'
                  }`}
              >
                Home
              </Link>
              <Link
                href="/events"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                  ${router.pathname.startsWith('/events') 
                    ? 'border-indigo-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white dark:hover:border-gray-700'
                  }`}
              >
                Events
              </Link>
              <Link
                href="/resources"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                  ${router.pathname.startsWith('/resources') 
                    ? 'border-indigo-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white dark:hover:border-gray-700'
                  }`}
              >
                Resources
              </Link>
              <Link
                href="/about"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                  ${router.pathname.startsWith('/about') 
                    ? 'border-indigo-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white dark:hover:border-gray-700'
                  }`}
              >
                About
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
            {/* Debug button */}
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              {showDebug ? 'Hide Debug' : 'Show Debug'}
            </button>
            
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="nav-link">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                  <span>Dashboard</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                    title="Admin Access"
                  >
                    <svg 
                      className="h-6 w-6" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" 
                      />
                    </svg>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="nav-link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="nav-link text-left"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                  <Link href="/login" className="nav-link">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Login</span>
                  </Link>
                  <Link href="/register" className="btn-primary">
                    Register Now
                  </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium
                ${router.pathname === '/' 
                  ? 'border-indigo-500 text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-gray-900' 
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
            >
              Home
            </Link>
            <Link
              href="/events"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium
                ${router.pathname.startsWith('/events') 
                  ? 'border-indigo-500 text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-gray-900'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
            >
              Events
            </Link>
            <Link
              href="/resources"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium
                ${router.pathname.startsWith('/resources') 
                  ? 'border-indigo-500 text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-gray-900' 
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
            >
              Resources
            </Link>
            <Link
              href="/about"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium
                ${router.pathname.startsWith('/about') 
                  ? 'border-indigo-500 text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-gray-900' 
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
            >
              About
            </Link>
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {showDebug ? 'Hide Debug' : 'Show Debug'}
            </button>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {user ? (
              <div>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xl font-bold text-white">
                      {user.email ? user.email.charAt(0).toUpperCase() : '?'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-white">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                      title="Admin Access"
                    >
                      <svg 
                        className="h-6 w-6" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" 
                        />
                      </svg>
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-1">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
