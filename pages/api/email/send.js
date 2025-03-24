// This file would typically use a service like SendGrid, Mailgun, etc.
// For demo purposes, we're just simulating the email sending process

import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract authentication token from request
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    
    // Verify the user's token and check if they're an admin
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !userData.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is an admin
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userData.user.id)
      .single();

    if (userError || !user || !user.is_admin) {
      return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }

    // Extract email data from request
    const { recipients, subject, message, template_id } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients are required' });
    }

    if (!subject) {
      return res.status(400).json({ error: 'Subject is required' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get recipient email addresses
    // In a real app, you'd typically use a batched query or a more efficient approach
    const emails = [];
    
    for (const recipientId of recipients) {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(recipientId);
      
      if (!userError && userData?.user?.email) {
        emails.push(userData.user.email);
      }
    }

    if (emails.length === 0) {
      return res.status(400).json({ error: 'No valid email addresses found' });
    }

    // In a real application, you would use an email service here
    // For example, with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    for (const email of emails) {
      const msg = {
        to: email,
        from: process.env.FROM_EMAIL,
        subject: subject,
        text: message,
        html: message.replace(/\n/g, '<br />'),
      };
      
      await sgMail.send(msg);
    }
    */

    // For this demo, we'll just log the emails that would be sent
    console.log(`Would send email to: ${emails.join(', ')}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);

    // Log the email send in the database
    const { error: logError } = await supabase
      .from('email_logs')
      .insert([
        {
          subject,
          body: message,
          recipient_count: recipients.length,
          template_id: template_id || null,
          sent_by: userData.user.id
        }
      ]);

    if (logError) {
      console.error('Error logging email:', logError);
      // Still return success since the email "would have been sent"
    }

    return res.status(200).json({ success: true, recipientCount: emails.length });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
