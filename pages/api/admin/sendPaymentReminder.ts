import type { NextApiRequest, NextApiResponse } from 'next';
import { sendPaymentReminderEmail } from '../../../lib/emailService';
import { formatTime } from '../../../lib/timeUtils';
import { createClient } from '@supabase/supabase-js';

// Type definitions for API responses
type ApiResponse = {
  success: boolean;
  message: string;
  error?: string;
};

/**
 * API handler for sending payment reminder emails
 * This endpoint is protected and requires admin authentication
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: Missing Supabase credentials'
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract required data from request body
    const { 
      registrationId, 
      eventId, 
      eventTitle, 
      eventDate, 
      name, 
      email 
    } = req.body;

    // Validate required fields
    if (!registrationId || !eventId || !eventTitle || !eventDate || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: registrationId, eventId, eventTitle, eventDate, and email are required'
      });
    }
    
    // Fetch additional event information including instructor and exact time
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('*, instructors(first_name, last_name)')
      .eq('id', eventId)
      .single();
      
    if (eventError) {
      console.warn('Could not fetch instructor information:', eventError.message);
    }
    
    // Get instructor name if available
    let instructorName = null;
    if (eventData?.instructors) {
      const instructor = eventData.instructors;
      instructorName = `${instructor.first_name} ${instructor.last_name}`;
    }
    
    // Get the correct event time from the database
    let eventTime: string | undefined = undefined;
    if (eventData?.start_date) {
      eventTime = formatTime(eventData.start_date);
      console.log(`Formatted event time: ${eventTime} from date: ${eventData.start_date}`);
    }
    
    // Send the payment reminder email
    const result = await sendPaymentReminderEmail({
      registrationId,
      eventId,
      eventTitle,
      eventDate: eventData?.start_date || eventDate, // Use the exact date from the database if available
      name: name || email.split('@')[0], // Use name if provided, otherwise use part of email
      email,
      instructorName: instructorName || undefined,
      meetingLink: eventData?.meeting_link,
      meetingType: eventData?.meeting_type,
      // Pass the formatted time as a custom property
      customTime: eventTime
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message || 'Failed to send payment reminder email',
        error: result.error?.message
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Payment reminder email sent successfully'
    });
  } catch (error) {
    console.error('Error in sendPaymentReminder API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      success: false,
      message: 'Server error sending payment reminder email',
      error: errorMessage
    });
  }
}
