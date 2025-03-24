import { supabaseAdmin } from '../../../lib/supabase-admin';

export default async function handler(req, res) {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      throw error;
    }

    // Format the response properly for the admin dashboard
    res.status(200).json({
      users: data.users || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
