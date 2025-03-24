import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      return res.status(401).json({ 
        error: 'Authentication error', 
        details: sessionError.message 
      });
    }
    
    if (!sessionData.session) {
      return res.status(401).json({ error: 'No active session' });
    }
    
    // Get user details
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      return res.status(401).json({ 
        error: 'User fetch error', 
        details: userError.message 
      });
    }
    
    // Try to fetch user from database
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userData.user.id)
      .single();
      
    // Try to fetch events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(5);
      
    // Return all the debug information
    return res.status(200).json({
      auth: {
        session: {
          exists: !!sessionData.session,
          user_id: sessionData.session?.user?.id,
          expires_at: sessionData.session?.expires_at
        },
        user: {
          id: userData.user?.id,
          email: userData.user?.email,
          app_metadata: userData.user?.app_metadata,
          user_metadata: userData.user?.user_metadata
        }
      },
      database: {
        user: dbUser || null,
        userError: dbError ? dbError.message : null,
        events: events || [],
        eventsError: eventsError ? eventsError.message : null
      }
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return res.status(500).json({ 
      error: 'Server error', 
      details: error.message 
    });
  }
}
