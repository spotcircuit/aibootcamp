import { supabaseAdmin } from '../../../lib/supabase-admin';

export default async function handler(req, res) {
  try {
    // First, let's see what's in the database
    const { data: rawData } = await supabaseAdmin
      .from('registrations')
      .select('*');
    
    console.log('Raw database data:', rawData);

    const { data, error } = await supabaseAdmin
      .from('registrations')
      .select(`
        id,
        event_id,
        name,
        email,
        phone,
        amount_paid,
        payment_status,
        stripe_payment_id,
        email_sent,
        created_at,
        auth_user_id,
        event:events(*)
      `).order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
