import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEventRegistrationEmail } from '../../lib/emailService';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

// Type definitions for API responses
type ApiResponse = {
  success: boolean;
  message: string;
  error?: string;
};

/**
 * API handler for sending event registration confirmation emails
 * This endpoint is protected and requires authentication
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
    // Initialize Supabase client
    let supabase;
    
    // Check if this is a server-to-server request with service role key
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const serviceRoleKey = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      // Verify this is a valid service role key request (from our webhook)
      if (serviceRoleKey === process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.log('Processing server-to-server request with service role key');
        
        // Initialize with service role key for server-to-server requests
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!supabaseUrl) {
          return res.status(500).json({
            success: false,
            message: 'Server configuration error'
          });
        }
        
        supabase = createClient(supabaseUrl, serviceRoleKey);
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid authorization'
        });
      }
    } else {
      // Regular user request - initialize with context and verify authentication
      supabase = createServerSupabaseClient({ req, res });
      
      // Verify the user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (!session) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }
    }

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

    // Fetch event details to get meeting link information
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('meeting_link, meeting_type')
      .eq('id', eventId)
      .single();
      
    if (eventError) {
      console.warn('Could not fetch meeting link information:', eventError.message);
    }
    
    // Send the registration confirmation email
    const result = await sendEventRegistrationEmail({
      registrationId,
      eventId,
      eventTitle,
      eventDate,
      name: name || email.split('@')[0], // Use name if provided, otherwise use part of email
      email,
      meetingLink: eventData?.meeting_link || undefined,
      meetingType: eventData?.meeting_type || undefined
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message || 'Failed to send registration confirmation email',
        error: result.error?.message
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Registration confirmation email sent successfully'
    });
  } catch (error) {
    console.error('Error in sendRegistrationEmail API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      success: false,
      message: 'Server error sending registration email',
      error: errorMessage
    });
  }
}
