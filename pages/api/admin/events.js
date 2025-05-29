import { supabaseAdmin } from '../../../lib/supabase-admin';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        // Check for query parameters to handle archived events
        const { showArchived, archivedOnly } = req.query;
        let query = supabaseAdmin
          .from('events')
          .select('*')
          
        // Filter based on archived status
        if (archivedOnly === 'true') {
          query = query.eq('archived', true);
        } else if (showArchived !== 'true') {
          // By default, only show non-archived events
          query = query.eq('archived', false);
        }
        
        // Always sort by date
        const { data, error } = await query.order('start_date', { ascending: true });
        
        if (error) throw error;
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        // Explicitly extract expected fields
        const { name, description, start_date, end_date, location, price, instructor_id, meeting_link, meeting_type, image_name } = req.body;
        const eventData = { 
          name, 
          description, 
          start_date, 
          end_date, 
          location, 
          price, 
          instructor_id: instructor_id || null,
          meeting_link: meeting_link || null,
          meeting_type: meeting_type || null,
          image_name: image_name || null,
          archived: false // New events are not archived by default
        }; // Ensure null if empty

        const { data, error } = await supabaseAdmin
          .from('events')
          .insert(eventData) // Use extracted data
          .select();
        
        if (error) throw error;
        res.status(200).json(data[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'PUT':
      try {
        // Explicitly extract expected fields
        const { id, name, description, start_date, end_date, location, price, instructor_id, meeting_link, meeting_type, image_name, archived, previous_version_id } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'Event ID is required for update' });
        }
        const eventData = { 
          name, 
          description, 
          start_date, 
          end_date, 
          location, 
          price, 
          instructor_id: instructor_id || null,
          meeting_link: meeting_link || null,
          meeting_type: meeting_type || null,
          image_name: image_name || null
        }; 

        // Only include archiving fields if they are provided
        if (archived !== undefined) {
          eventData.archived = archived;
          // If archiving, set the archive timestamp
          if (archived === true) {
            eventData.archived_at = new Date().toISOString();
          }
        }

        // Only include previous version if it's provided
        if (previous_version_id !== undefined) {
          eventData.previous_version_id = previous_version_id || null;
        }

        const { data, error } = await supabaseAdmin
          .from('events')
          .update(eventData) // Use extracted data
          .eq('id', id)
          .select();
        
        if (error) throw error;
        res.status(200).json(data[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
