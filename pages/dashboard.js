import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function Dashboard({ user }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch user data including registrations
  const fetchUserData = useCallback(async () => {
    try {
      let userRegistrations = [];

      // Try to fetch from registrations table
      const { data: regsData, error: regsError } = await supabase
        .from('registrations')
        .select(`
          *, 
          events (*)
        `)
        .eq('auth_user_id', user.id);

      if (regsError) {
        console.error('Registrations fetch error:', regsError);
      } else if (regsData && regsData.length > 0) {
        console.log('Found registrations in registrations table:', regsData.length);
        userRegistrations = regsData;
      }

      // Also check if the user's email is in any registrations without auth_user_id
      if (user && user.email) {
        const { data: emailRegsData, error: emailRegsError } = await supabase
          .from('registrations')
          .select(`
            *, 
            events (*)
          `)
          .eq('email', user.email)
          .is('auth_user_id', null);

        if (emailRegsError) {
          console.error('Email registrations fetch error:', emailRegsError);
        } else if (emailRegsData && emailRegsData.length > 0) {
          console.log('Found registrations by email in registrations table:', emailRegsData.length);
          
          // Update these registrations to link them to the user account
          for (const reg of emailRegsData) {
            const { error: updateError } = await supabase
              .from('registrations')
              .update({ auth_user_id: user.id })
              .eq('id', reg.id);
            
            if (updateError) {
              console.error(`Error linking registration ${reg.id} to user:`, updateError);
            } else {
              console.log(`Linked registration ${reg.id} to user ${user.id}`);
              // Add to our registrations array
              userRegistrations.push({...reg, auth_user_id: user.id});
            }
          }
        }
      }

      if (!user) {
        router.push('/login');
        return;
      }
      
      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      }
      
      if (profileData) {
        setProfile(profileData);
      }

      setRegistrations(userRegistrations);
      setLoading(false);
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      setError('Unable to retrieve your events information at this time.');
      setLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          console.log('Dashboard: Fetching data for user', user.id);
          // Fetch user's registrations
          fetchUserData();
        } else {
          console.log('Dashboard: No user available yet');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Error loading data: ' + error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [user, fetchUserData]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navigation user={user} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Your Dashboard
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Your Profile
                </h2>
                
                {profile ? (
                  <div className="space-y-3">
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Name:</span> {profile.name || 'Not set'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Email:</span> {profile.email || user?.email || 'Not set'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Phone:</span> {profile.phone || 'Not set'}
                    </p>
                    <div className="pt-3">
                      <Link href="/profile" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        Edit Profile
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600 dark:text-gray-300">
                    <p>Complete your profile to get the most out of your experience.</p>
                    <div className="pt-3">
                      <Link href="/profile" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        Set Up Profile
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Registrations Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Your Registrations
                </h2>
                
                {registrations.length > 0 ? (
                  <div className="space-y-4">
                    {registrations.map((reg) => (
                      <div key={reg.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                          {reg.events?.title || 'Event'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Date:</span> {formatDate(reg.events?.start_date || reg.events?.date)}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Status:</span> {reg.payment_status === 'paid' ? (
                              <span className="text-green-600 dark:text-green-400">Confirmed</span>
                            ) : (
                              <span className="text-yellow-600 dark:text-yellow-400">Pending</span>
                            )}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Amount:</span> ${reg.amount_paid || 'N/A'}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Registration Date:</span> {formatDate(reg.created_at)}
                          </p>
                        </div>
                        
                        {reg.events?.id && (
                          <div className="mt-3">
                            <Link href={`/events/${reg.events.id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                              View Event Details
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-600 dark:text-gray-300">
                    <p>You haven&apos;t registered for any events yet.</p>
                    <div className="pt-3">
                      <Link href="/events" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        Browse Events
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
