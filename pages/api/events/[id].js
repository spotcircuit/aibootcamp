import { getEventById, updateEvent, deleteEvent } from '../../../lib/events';
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const event = await getEventById(id);
      
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      res.status(200).json(event);
    } catch (error) {
      console.error(`Error fetching event with ID ${id}:`, error);
      res.status(500).json({ error: 'Error fetching event' });
    }
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
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
      
      const updatedEvent = await updateEvent(id, req.body);
      
      if (!updatedEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error(`Error updating event with ID ${id}:`, error);
      res.status(500).json({ error: 'Failed to update event' });
    }
  } else if (req.method === 'DELETE') {
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
      
      await deleteEvent(id);
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting event with ID ${id}:`, error);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
