import { supabaseAdmin } from '../../../lib/supabase-admin';

export default async function handler(req, res) {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust origin as needed for security
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).json({});
  }

  // Set CORS headers for actual requests
  res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust origin as needed

  const { instructor_id, ...instructorData } = req.body || {};

  try {
    if (req.method === 'GET') {
      // Fetch all instructors
      const { data, error } = await supabaseAdmin
        .from('instructors')
        .select('*')
        .order('last_name', { ascending: true })
        .order('first_name', { ascending: true });

      if (error) throw error;
      return res.status(200).json(data);
    }
    
    else if (req.method === 'POST') {
      // Create a new instructor
      console.log("Creating instructor with data:", instructorData);
      const { data, error } = await supabaseAdmin
        .from('instructors')
        .insert([instructorData])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }
      console.log("Instructor created:", data);
      return res.status(201).json(data);
    }
    
    else if (req.method === 'PUT') {
      // Update an existing instructor
      if (!instructor_id) {
        return res.status(400).json({ error: 'Instructor ID is required for update' });
      }
      console.log(`Updating instructor ${instructor_id} with data:`, instructorData);
      const { data, error } = await supabaseAdmin
        .from('instructors')
        .update(instructorData)
        .eq('instructor_id', instructor_id)
        .select()
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
       console.log("Instructor updated:", data);
      return res.status(200).json(data);
    }
    
    else if (req.method === 'DELETE') {
      // Delete an instructor
      const { instructor_id: idToDelete } = req.query;
      if (!idToDelete) {
        return res.status(400).json({ error: 'Instructor ID is required for delete' });
      }
      console.log(`Deleting instructor ${idToDelete}`);
      const { error } = await supabaseAdmin
        .from('instructors')
        .delete()
        .eq('instructor_id', idToDelete);

      if (error) {
         console.error("Supabase delete error:", error);
        // Handle potential foreign key constraint errors more gracefully
        if (error.code === '23503') { // Foreign key violation
           return res.status(409).json({ error: 'Cannot delete instructor. They are currently assigned to one or more events.', details: error.message });
        }
        throw error;
      }
      console.log(`Instructor ${idToDelete} deleted`);
      return res.status(204).end(); // No content on successful delete
    }
    
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
}
