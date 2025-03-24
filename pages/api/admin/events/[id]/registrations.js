import { supabaseAdmin } from '../../../../../lib/supabase-admin';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const { data, error } = await supabaseAdmin
      .from('registrations')
      .select(`
        id,
        event_id,
        name,
        email,
        phone,
        amount_paid,
        stripe_payment_id,
        email_sent,
        created_at,
        auth_user_id
      `)
      .eq('event_id', id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
