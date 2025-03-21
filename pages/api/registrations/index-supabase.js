// pages/api/registrations/index-supabase.js
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const userId = req.query.userId || null;
      
      let query = supabaseAdmin
        .from('registrations')
        .select(`
          *,
          events (*)
        `);
      
      // Filter by userId if provided
      if (userId) {
        query = query.eq('userId', userId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      res.status(500).json({ error: 'Error fetching registrations' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, email, experience, eventId } = req.body;
      
      if (!name || !email || !experience || !eventId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Insert new registration into Supabase
      const { data, error } = await supabaseAdmin
        .from('registrations')
        .insert([
          { 
            name, 
            email, 
            experience, 
            eventId: parseInt(eventId),
            isPaid: false
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      res.status(201).json(data[0]);
    } catch (error) {
      console.error('Error creating registration:', error);
      res.status(500).json({ error: 'Error creating registration' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
