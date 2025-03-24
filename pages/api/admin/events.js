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
        const { data, error } = await supabaseAdmin
          .from('events')
          .insert(req.body)
          .select();
        
        if (error) throw error;
        res.status(200).json(data[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { data, error } = await supabaseAdmin
          .from('events')
          .update(req.body)
          .eq('id', req.body.id)
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
