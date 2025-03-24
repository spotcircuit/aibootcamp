import { useEffect, useState } from 'react';

// Placeholder ProtectedRoute - no active authentication
export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
