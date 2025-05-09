import { createClient, SupabaseClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Types for email service functions
interface EmailSendResult {
  success: boolean;
  error?: Error | null;
  message?: string;
}

interface WelcomeEmailData {
  name: string;
  userId: string;
  email: string;
}

interface EventRegistrationEmailData {
  name: string;
  email: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  registrationId: string;
  meetingLink?: string;
  meetingType?: string;
  instructorName?: string;
  customTime?: string;
}

// Initialize Supabase client with service role key for admin operations
const getSupabaseAdmin = (): SupabaseClient => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL or Service Role Key is missing from environment variables');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Create a reusable transporter object using SMTP transport
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  
  if (!host || !port || !user || !pass) {
    throw new Error('SMTP configuration is missing from environment variables');
  }
  
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Send a welcome email to a newly registered user
 * @param {WelcomeEmailData} data - User data for the welcome email
 * @returns {Promise<EmailSendResult>} Result of the email send operation
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<EmailSendResult> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Log for debugging
    console.log(`Sending welcome email to ${data.email} (${data.name})`);
    
    // Determine base URL based on environment
    const appUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_PRODUCTION_URL || 'https://aibootcamp.lexduo.ai'
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Create the email HTML content
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background-color: #4F46E5;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            color: white;
            margin: 10px 0;
          }
          .content {
            padding: 20px;
            background-color: #ffffff;
          }
          .highlight-box {
            background-color: #f0f9ff;
            border-left: 4px solid #4F46E5;
            padding: 15px;
            margin: 20px 0;
          }
          .footer {
            background-color: #f9fafb;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          }
          .button {
            display: inline-block;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            margin: 20px 0;
          }
          .features {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin: 20px 0;
          }
          .feature {
            width: 48%;
            margin-bottom: 15px;
          }
          .feature h3 {
            margin-top: 0;
            color: #4F46E5;
          }
          @media (max-width: 600px) {
            .feature {
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Thank You for Registering with AI Bootcamp!</h1>
        </div>
        
        <div class="content">
          <p>Hello ${data.name},</p>
          
          <p>Thank you for creating your AI Bootcamp account! We're thrilled to welcome you to our community of AI enthusiasts and learners.</p>
          
          <div class="highlight-box">
            <p><strong>Your account has been successfully created.</strong> You now have access to all our resources, events, and learning materials.</p>
          </div>
          
          <div class="features">
            <div class="feature">
              <h3>Learn AI</h3>
              <p>Access our curriculum designed by industry experts and learn at your own pace.</p>
            </div>
            
            <div class="feature">
              <h3>Join Events</h3>
              <p>Register for upcoming bootcamps, workshops, and networking events.</p>
            </div>
            
            <div class="feature">
              <h3>Build Projects</h3>
              <p>Apply your knowledge by working on real-world AI projects.</p>
            </div>
            
            <div class="feature">
              <h3>Connect</h3>
              <p>Network with fellow learners and industry professionals.</p>
            </div>
          </div>
          
          <p style="text-align: center;">
            <a href="${appUrl}/dashboard" class="button" style="color: white;">Visit Your Dashboard</a>
          </p>
          
          <p>If you have any questions or need assistance, please contact our support team at <a href="mailto:support@lexduo.ai">support@lexduo.ai</a>.</p>
          
          <p>We look forward to being part of your AI learning journey!</p>
          
          <p>Best regards,<br>
          The AI Bootcamp Team</p>
        </div>
        
        <div class="footer">
          <p> 2025 AI Bootcamp. All rights reserved.</p>
          <p>This is an automated message from a no-reply email address. Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `;
    
    // Create the transporter
    const transporter = createTransporter();
    
    // Send the email
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'AI Bootcamp'} (No Reply)" <${process.env.SMTP_FROM_EMAIL}>`,
      to: data.email,
      subject: `Welcome to AI Bootcamp, ${data.name}!`,
      html,
    });

    console.log(`Welcome email sent: ${info.messageId}`);

    // Log and mark email sent
    await supabaseAdmin
      .from('email_logs')
      .insert({
        email_type: 'welcome',
        recipient_email: data.email,
        recipient_name: data.name,
        related_user_id: data.userId,
        sent_at: new Date().toISOString(),
        message_id: info.messageId
      });
    await markRegistrationEmailSent(data.userId as string);

    // Send admin notification for new user
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'AI Bootcamp'} (No Reply)" <${process.env.SMTP_FROM_EMAIL}>`,
        to: adminEmail,
        subject: `New user registered: ${data.email}`,
        text: `A new user has registered:\n\nName: ${data.name}\nEmail: ${data.email}\nUser ID: ${data.userId}`
      });
    }

    console.log(`Admin notified of new user registration at ${adminEmail}`);

    return {
      success: true,
      message: 'Welcome email sent successfully',
    };
  } catch (error) {
    console.error('Exception sending welcome email:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(String(error)),
      message: `Exception sending welcome email: ${errorMessage}`
    };
  }
}

/**
 * Send an event registration confirmation email
 * @param {EventRegistrationEmailData} data - Registration data for the email
 * @returns {Promise<EmailSendResult>} Result of the email send operation
 */
export async function sendEventRegistrationEmail(
  data: EventRegistrationEmailData
): Promise<EmailSendResult> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Log for debugging
    console.log(`Sending registration confirmation email to ${data.email} for event: ${data.eventTitle}`);
    
    // Format the event date for display
    const eventDate = new Date(data.eventDate);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Generate meeting info section if meeting link is provided
    let meetingInfo = '';
    if (data.meetingLink) {
      const meetingType = data.meetingType || 'online';
      const meetingTypeDisplay = meetingType === 'zoom' ? 'Zoom' : 
                               meetingType === 'google_meet' ? 'Google Meet' : 
                               meetingType === 'teams' ? 'Microsoft Teams' : 'Online';
      
      meetingInfo = `
        <p><strong>Meeting Link:</strong> <a href="${data.meetingLink}">${meetingTypeDisplay} Meeting</a></p>
        <p class="meeting-note">Please save this link to join the event. We'll also send a reminder before the event starts.</p>
      `;
    }
    
    // Determine base URL based on environment
    const appUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_PRODUCTION_URL || 'https://aibootcamp.lexduo.ai'
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Create the email HTML content
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background-color: #4F46E5;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            color: white;
            margin: 10px 0;
          }
          .event-details {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
          }
          .meeting-info {
            background-color: #e0f2fe;
            border-left: 4px solid #0ea5e9;
            padding: 15px;
            margin: 20px 0;
          }
          .meeting-note {
            font-size: 14px;
            color: #4b5563;
            font-style: italic;
          }
          .content {
            padding: 20px;
            background-color: #ffffff;
          }
          .footer {
            background-color: #f9fafb;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          }
          .button {
            display: inline-block;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            margin: 20px 0;
          }
          .calendar-button {
            display: inline-block;
            background-color: #10B981;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            margin: 0 10px;
          }
          .what-to-expect {
            margin: 20px 0;
          }
          .what-to-expect h3 {
            color: #4F46E5;
            margin-bottom: 10px;
          }
          .what-to-expect ul {
            margin: 0;
            padding-left: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Thank You for Registering!</h1>
        </div>
        
        <div class="content">
          <p>Hello ${data.name},</p>
          
          <p>Thank you for registering for <strong>${data.eventTitle}</strong>! Your spot has been confirmed, and we're excited to have you join us.</p>
          
          <div class="event-details">
            <p><strong>Event:</strong> ${data.eventTitle}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${formattedTime}</p>
            <p><strong>Location:</strong> Virtual</p>
            <p><strong>Registration ID:</strong> ${data.registrationId}</p>
            ${meetingInfo ? `<div class="meeting-info">${meetingInfo}</div>` : ''}
          </div>
          
          <div class="what-to-expect">
            <h3>What to Expect</h3>
            <ul>
              <li>Interactive sessions with AI experts</li>
              <li>Hands-on exercises and practical demonstrations</li>
              <li>Networking opportunities with fellow participants</li>
              <li>Access to resources and materials after the event</li>
            </ul>
          </div>
          
          <p style="text-align: center;">
            <a href="${appUrl}/events/${data.eventId}" class="button" style="color: white;">View Event Details</a>
          </p>
          
          <p>If you have any questions or need to make changes to your registration, please contact our support team at <a href="mailto:support@lexduo.ai">support@lexduo.ai</a>.</p>
          
          <p>We look forward to seeing you at the event!</p>
          
          <p>Best regards,<br>
          The AI Bootcamp Team</p>
        </div>
        
        <div class="footer">
          <p> 2025 AI Bootcamp. All rights reserved.</p>
          <p>This is an automated message from a no-reply email address. Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `;
    
    // Create the transporter
    const transporter = createTransporter();
    
    // Send the email
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'AI Bootcamp'} (No Reply)" <${process.env.SMTP_FROM_EMAIL}>`,
      to: data.email,
      subject: `Registration Confirmed: ${data.eventTitle}`,
      html: html,
    });
    
    console.log(`Registration email sent: ${info.messageId}`);
    
    // Store the registration email information in a custom table for tracking
    try {
      // Log the email in our database
      await supabaseAdmin
        .from('email_logs')
        .insert({
          email_type: 'event_registration',
          recipient_email: data.email,
          recipient_name: data.name,
          related_event_id: data.eventId,
          related_registration_id: data.registrationId,
          event_title: data.eventTitle,
          event_date: data.eventDate,
          sent_at: new Date().toISOString(),
          message_id: info.messageId
        });
        
      // Also update the registration record to mark email as sent
      await markRegistrationEmailSent(data.registrationId);
    } catch (logError) {
      console.error('Error logging registration email:', logError);
      // Continue even if logging fails
    }
    
    // Send admin notification for new registration
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'AI Bootcamp'} (No Reply)" <${process.env.SMTP_FROM_EMAIL}>`,
        to: adminEmail,
        subject: `New class registration: ${data.email}`,
        text: `A new class registration has occurred:\n\nName: ${data.name}\nEmail: ${data.email}\nEvent: ${data.eventTitle}\nRegistration ID: ${data.registrationId}`
      });
      console.log(`Admin notified of new registration at ${adminEmail}`);
    }

    return {
      success: true,
      message: 'Registration email sent successfully'
    };
  } catch (error) {
    console.error('Exception sending registration email:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(String(error)),
      message: `Exception sending registration email: ${errorMessage}`
    };
  }
}

/**
 * Update the email_sent field for a registration
 * @param {string} registrationId - ID of the registration to update
 * @returns {Promise<boolean>} Whether the update was successful
 */
export async function markRegistrationEmailSent(registrationId: string): Promise<boolean> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { error } = await supabaseAdmin
      .from('registrations')
      .update({ email_sent: true })
      .eq('id', registrationId);
    
    if (error) {
      console.error(`Error marking registration ${registrationId} as email sent:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Exception marking registration ${registrationId} as email sent:`, error);
    return false;
  }
}

/**
 * Send a payment reminder email for a pending registration
 * @param {EventRegistrationEmailData} data - Registration data for the email
 * @returns {Promise<EmailSendResult>} Result of the email send operation
 */
export async function sendPaymentReminderEmail(
  data: EventRegistrationEmailData
): Promise<EmailSendResult> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Log for debugging
    console.log(`Sending payment reminder email to ${data.email} for event: ${data.eventTitle}`);
    
    // Format the event date for display
    const eventDate = new Date(data.eventDate);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Determine base URL based on environment
    const appUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_APP_URL || 'https://aibootcamp.vercel.app'
      : 'http://localhost:3000';
    
    // Generate the payment URL
    // This URL will redirect to the Stripe checkout page for this registration
    const paymentUrl = `${appUrl}/payment/${data.registrationId}?eventId=${data.eventId}`;
    
    // Create the payment reminder email HTML content
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Reminder: ${data.eventTitle}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #f0f4f8;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
            background-color: #ffffff;
            border-left: 1px solid #e1e8ed;
            border-right: 1px solid #e1e8ed;
          }
          .footer {
            background-color: #f0f4f8;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #657786;
            border-radius: 0 0 5px 5px;
          }
          .reminder-box {
            background-color: #fff8e1;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin-bottom: 20px;
          }
          .event-details {
            background-color: #f8f9fa;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
          }
          .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 15px;
            font-weight: bold;
            text-align: center;
          }
          .button-container {
            text-align: center;
            margin: 25px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Payment Reminder</h2>
          </div>
          
          <div class="content">
            <p>Hello ${data.name},</p>
            
            <div class="reminder-box">
              <p><strong>This is a friendly reminder that your registration for ${data.eventTitle} is still pending payment.</strong></p>
              <p>To secure your spot, please complete your payment as soon as possible.</p>
            </div>
            
            <div class="event-details">
              <h3>Event Details</h3>
              <p><strong>Event:</strong> ${data.eventTitle}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${data.customTime || formattedTime}</p>
              <p><strong>Location:</strong> Virtual</p>
              ${data.instructorName ? `<p><strong>Instructor:</strong> ${data.instructorName}</p>` : ''}
            </div>
            
            <div class="button-container">
              <a href="${paymentUrl}" class="button">Complete Your Payment</a>
            </div>
            
            <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all;"><a href="${paymentUrl}">${paymentUrl}</a></p>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <p>Thank you,<br>AI Bootcamp Team</p>
          </div>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Create the transporter
    const transporter = createTransporter();
    
    // Send the email
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'AI Bootcamp'} (No Reply)" <${process.env.SMTP_FROM_EMAIL}>`,
      to: data.email,
      subject: `Payment Reminder: ${data.eventTitle}`,
      html: html,
    });
    
    console.log(`Payment reminder email sent: ${info.messageId}`);
    
    // Store the email information in a custom table for tracking
    try {
      // Log the email in our database
      await supabaseAdmin
        .from('email_logs')
        .insert({
          email_type: 'payment_reminder',
          recipient_email: data.email,
          recipient_name: data.name,
          related_event_id: data.eventId,
          related_registration_id: data.registrationId,
          event_title: data.eventTitle,
          event_date: data.eventDate,
          sent_at: new Date().toISOString(),
          message_id: info.messageId
        });
    } catch (logError) {
      // Just log the error but don't fail the overall operation
      console.error('Error logging email send:', logError);
    }
    
    return {
      success: true,
      message: 'Payment reminder email sent successfully'
    };
  } catch (error) {
    console.error('Error sending payment reminder email:', error);
    return {
      success: false,
      error: error as Error,
      message: 'Failed to send payment reminder email'
    };
  }
}
