import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TestRedirect() {
  const router = useRouter();

  useEffect(() => {
    // This will run once the component mounts
    console.log('Test redirect page loaded');
  }, []);

  const handleClick = () => {
    console.log('Redirecting to dashboard...');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Redirect Test Page</h1>
      <p className="mb-4">Click the button below to test redirection to dashboard</p>
      <button 
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
