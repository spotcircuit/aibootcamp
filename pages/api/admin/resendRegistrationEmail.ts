import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEventRegistrationEmail } from '../../../lib/emailService';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

type ApiResponse = { success: boolean; message: string; error?: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const { registrationId, eventId, eventTitle, eventDate, name, email } = req.body;
    if (!registrationId || !eventId || !eventTitle || !eventDate || !email) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const result = await sendEventRegistrationEmail({ registrationId, eventId, eventTitle, eventDate, name, email });
    if (!result.success) {
      return res.status(500).json({ success: false, message: result.message || 'Failed to resend email', error: result.error?.message });
    }
    return res.status(200).json({ success: true, message: 'Email resent successfully' });
  } catch (err) {
    console.error('Error in resendRegistrationEmail:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err instanceof Error ? err.message : String(err) });
  }
}
