import { getAllEvents, createEvent } from '../../../lib/events';
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const events = await getAllEvents();
      res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Error fetching events' });
    }
  } else if (req.method === 'POST') {
    // Check if user has admin access
    const { user } = await supabaseAdmin.auth.getUser();
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      // Get user profile to check if admin
      const { data: profile } = await supabaseAdmin
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      if (!profile || !profile.is_admin) {
        return res.status(403).json({ error: 'Forbidden - Admin access required' });
      }
      
      const newEvent = await createEvent(req.body);
      res.status(201).json(newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
