import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { withAuth } from '../lib/auth';

function Dashboard({ user }) {
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setLoading(false);
        return;
      }

      console.log('Dashboard user:', user);
      console.log('User metadata:', user.user_metadata);

      try {
        // Fetch registrations with event details
        const { data: regsData, error: regsError } = await supabase
          .from('registrations')
          .select(`
            *,
            events (
              id,
              name,
              start_date,
              location
            )
          `)
          .or(`auth_user_id.eq.${user.id},email.eq.${user.email}`);

        if (regsError) {
          console.error('Error fetching registrations:', regsError);
          setError('Failed to load your registrations.');
        } else {
          setRegistrations(regsData || []);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navigation user={user} />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Please log in to view your dashboard.
          </div>
        </div>
      </div>
    );
  }

  // Get profile from user metadata
  const profile = {
    name: user.user_metadata?.name || user.user_metadata?.full_name || user.email,
    email: user.email,
    phone: user.user_metadata?.phone || '',
    auth_user_id: user.id
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
                
                <div className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Name:</span> {profile.name || 'Not set'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Email:</span> {profile.email || 'Not set'}
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
                          {reg.events?.name || 'Event'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Date:</span> {formatDate(reg.events?.start_date)}
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

// Wrap the Dashboard component with authentication
export default withAuth(Dashboard, {
  redirectTo: '/login'
});
