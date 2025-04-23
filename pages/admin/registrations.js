import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { withAdminAuth } from '../../lib/auth';

function RegistrationsAdmin() {
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);

  // Resend registration email handler
  const handleResendRegistration = async (registration) => {
    try {
      const res = await fetch('/api/admin/resendRegistrationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: registration.id,
          eventId: registration.event?.id,
          eventTitle: registration.event?.name,
          eventDate: registration.event?.date,
          name: registration.name,
          email: registration.email,
        }),
      });
      if (!res.ok) throw new Error('Failed to resend email');
      alert('Registration email resent');
    } catch (err) {
      console.error(err);
      alert('Error resending registration email');
    }
  };

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/registrations');
        if (!response.ok) throw new Error('Failed to fetch registrations');
        const data = await response.json();
        setRegistrations(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Registrations</h1>

        {loading ? (
          <div className="text-center mt-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
          </div>
        ) : (
          <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Amount Paid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                {registrations.map(registration => (
                  <tr key={registration.id}>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {registration.event?.name || 'Unknown Event'}
                      <div className="text-xs">
                        {registration.event?.date && new Date(registration.event.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{registration.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{registration.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{registration.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      ${registration.amount_paid?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => handleResendRegistration(registration)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Resend Email
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default withAdminAuth(RegistrationsAdmin);
