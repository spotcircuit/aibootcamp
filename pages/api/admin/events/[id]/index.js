import { supabaseAdmin } from '../../../../../lib/supabase-admin';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Get a specific event including its archived status
    try {
      const { data, error } = await supabaseAdmin
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { error } = await supabaseAdmin
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const { operation } = req.body;
      
      // Handle archive/unarchive operations
      if (operation === 'archive') {
        const { error } = await supabaseAdmin
          .from('events')
          .update({ 
            archived: true,
            archived_at: new Date().toISOString()
          })
          .eq('id', id);
          
        if (error) throw error;
        res.status(200).json({ success: true, message: 'Event archived successfully' });
      } 
      else if (operation === 'unarchive') {
        const { error } = await supabaseAdmin
          .from('events')
          .update({ 
            archived: false,
            archived_at: null
          })
          .eq('id', id);
          
        if (error) throw error;
        res.status(200).json({ success: true, message: 'Event unarchived successfully' });
      }
      else if (operation === 'duplicate') {
        // Get the event to duplicate
        const { data: eventData, error: fetchError } = await supabaseAdmin
          .from('events')
          .select('*')
          .eq('id', id)
          .single();
          
        if (fetchError) throw fetchError;
        
        // Create new event based on the existing one
        const newEventData = {
          name: `${eventData.name} (Copy)`,
          description: eventData.description,
          start_date: eventData.start_date,
          end_date: eventData.end_date,
          location: eventData.location,
          price: eventData.price,
          instructor_id: eventData.instructor_id,
          meeting_link: eventData.meeting_link,
          meeting_type: eventData.meeting_type,
          image_name: eventData.image_name,
          archived: false,
          previous_version_id: eventData.id
        };
        
        const { data: newEvent, error: insertError } = await supabaseAdmin
          .from('events')
          .insert(newEventData)
          .select();
          
        if (insertError) throw insertError;
        res.status(200).json({ success: true, event: newEvent[0] });
      }
      else {
        res.status(400).json({ error: 'Invalid operation' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
