import { useEffect } from 'react';

export default function Logout() {
  useEffect(() => {
    // Simply redirect back to login
    setTimeout(() => {
      window.location.href = '/login?from=logout';
    }, 500);
  }, []);

  // Display a simple message while logout is processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Logging out...</h1>
        <p className="text-gray-600 dark:text-gray-400">Please wait while we sign you out.</p>
      </div>
    </div>
  );
}