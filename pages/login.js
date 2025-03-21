import { useState } from 'react';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation';
import { supabase } from '../lib/supabase';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('Form submitted');
    setError('');

    try {
      // 1. Sign in
      console.log('1. Attempting sign in...');
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Auth error:', authError);
        setError(authError.message);
        return;
      }

      console.log('2. Auth successful:', {
        user: authData.user,
        session: authData.session
      });

      // 2. Get user data from users table
      console.log('3. Fetching user data...');
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      console.log('4. User data:', {
        userData,
        error: userError
      });

      if (userError) {
        console.error('User data error:', userError);
        return;
      }

      // 3. Update user metadata
      console.log('5. Updating user metadata...');
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        data: {
          is_admin: userData.is_admin,
          email_verified: userData.email_verified
        }
      });

      console.log('6. Update result:', {
        data: updateData,
        error: updateError
      });

      // 4. Get final session state
      console.log('7. Getting final session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('8. FINAL SESSION STATE:', {
        session,
        error: sessionError
      });

      router.push('/');
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-md mx-auto pt-20 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Sign In</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            onClick={() => console.log('Button clicked')}
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Email: {email}<br />
          Password: {password}
        </div>
      </div>
    </div>
  );
}
