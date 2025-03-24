import { useState } from 'react';
import { signIn } from '../lib/auth';
import Navigation from '../components/Navigation';

export default function TestAuthError() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testInvalidCredentials = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Intentionally use invalid credentials
      const response = await signIn('test@example.com', 'wrongpassword');
      
      setResult({
        success: !response.error,
        hasUser: !!response.data?.user,
        hasSession: !!response.data?.session,
        errorMessage: response.error?.message
      });
    } catch (err) {
      console.error('Unexpected error during test:', err);
      setError(`Uncaught error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Test Auth Error Handling</h1>
          
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This page tests the error handling in the authentication system. 
              Click the button below to simulate a login with invalid credentials.
            </p>
            
            <button
              onClick={testInvalidCredentials}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Invalid Credentials'}
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              <h3 className="font-bold">Uncaught Error:</h3>
              <p>{error}</p>
              <p className="mt-2 text-sm">
                This indicates that our error handling is not working correctly. 
                The error should have been caught and returned as part of the response.
              </p>
            </div>
          )}
          
          {result && (
            <div className={`mb-4 p-4 rounded ${result.success ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              <h3 className="font-bold">Test Result:</h3>
              <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
              
              <div className="mt-4">
                <h4 className="font-semibold">Interpretation:</h4>
                {result.success ? (
                  <p>The authentication succeeded, which is unexpected for invalid credentials.</p>
                ) : (
                  <p>
                    The authentication failed as expected, and the error was properly handled.
                    The error message is: <span className="font-medium">{result.errorMessage}</span>
                  </p>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded">
            <h3 className="font-bold text-blue-800 dark:text-blue-200">How This Works</h3>
            <p className="mt-2 text-blue-700 dark:text-blue-300">
              This test attempts to sign in with invalid credentials. If our error handling is working correctly:
            </p>
            <ul className="mt-2 list-disc list-inside text-blue-700 dark:text-blue-300">
              <li>No uncaught error should appear</li>
              <li>The result should show success: false</li>
              <li>There should be a user-friendly error message</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}