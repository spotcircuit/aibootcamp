// pages/api/events/index-supabase.js
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Get events from Supabase
      const { data: events, error } = await supabaseAdmin
        .from('events')
        .select('*')
        .order('startDate', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Error fetching events' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, startDate, endDate, capacity, price } = req.body;
      
      if (!name || !startDate || !endDate || !capacity || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Insert new event into Supabase
      const { data, error } = await supabaseAdmin
        .from('events')
        .insert([
          { 
            name, 
            description, 
            startDate, 
            endDate, 
            capacity: parseInt(capacity), 
            price: parseFloat(price)
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      res.status(201).json(data[0]);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Error creating event' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
