import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, interest, message, source } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Create email content for admin
    const adminEmailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Interest:</strong> ${interest || 'Not specified'}</p>
      <p><strong>Message:</strong> ${message || 'No message provided'}</p>
      <p><strong>Source:</strong> ${source || 'Contact Page'}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
    `;

    // Create auto-response email content
    const userEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4F46E5; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">Thank You for Contacting Us!</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <p>Hello ${name},</p>
          
          <p>Thank you for reaching out to us. We've received your message and a member of our team will be in touch within 24 hours.</p>
          
          ${interest ? `<p>We're excited to discuss your interest in our ${interest} offering and how we can help you achieve your goals.</p>` : ''}
          
          <p>If you have any immediate questions, please reply to this email or call us at (555) 123-4567.</p>
          
          <p>Best regards,<br>The AI Bootcamp Team</p>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>© 2025 AI Bootcamp. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send email to admin and tech email
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'AI Bootcamp'}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      cc: process.env.TECH_EMAIL,
      subject: `New Contact Form Submission${interest ? ': ' + interest : ''}`,
      html: adminEmailContent,
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'AI Bootcamp'}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'Thank You for Contacting AI Bootcamp',
      html: userEmailContent,
    });

    // Return success response
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}
