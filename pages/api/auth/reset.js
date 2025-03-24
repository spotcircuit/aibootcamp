import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Sign out the current user to clear the session
      await supabase.auth.signOut();
      
      // Clear any local storage items related to Supabase
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token');
      }
      
      res.status(200).json({ success: true, message: 'Auth state reset successfully' });
    } catch (error) {
      console.error('Error resetting auth state:', error);
      res.status(500).json({ success: false, message: 'Failed to reset auth state', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
