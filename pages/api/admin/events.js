import { supabaseAdmin } from '../../../lib/supabase-admin';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const { data, error } = await supabaseAdmin
          .from('events')
          .select('*')
          .order('start_date', { ascending: true });
        
        if (error) throw error;
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        // Explicitly extract expected fields
        const { name, description, start_date, end_date, location, price, instructor_id } = req.body;
        const eventData = { name, description, start_date, end_date, location, price, instructor_id: instructor_id || null }; // Ensure null if empty

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
        const { id, name, description, start_date, end_date, location, price, instructor_id } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'Event ID is required for update' });
        }
        const eventData = { name, description, start_date, end_date, location, price, instructor_id: instructor_id || null }; // Ensure null if empty

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
