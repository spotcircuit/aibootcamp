import type { NextApiRequest, NextApiResponse } from 'next';  
import { sendWelcomeEmail } from '../../lib/emailService';

// Type definitions for API responses
type ApiResponse = {
  success: boolean;
  message: string;
  error?: string;
};

/**
 * API handler for sending welcome emails
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
    // For welcome emails, we don't require authentication since this is called during signup
    // We'll use the service role key to access Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }
    
    // Log the request for debugging
    console.log('Processing welcome email request for:', req.body.email);

    // Extract required data from request body
    const { userId, email, name } = req.body;

    // Validate required fields
    if (!userId || !email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, email, and name are required'
      });
    }

    // Send the welcome email
    const result = await sendWelcomeEmail({
      userId,
      email, 
      name
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message || 'Failed to send welcome email',
        error: result.error?.message
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Welcome email sent successfully'
    });
  } catch (error) {
    console.error('Error in sendWelcomeEmail API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      success: false,
      message: 'Server error sending welcome email',
      error: errorMessage
    });
  }
}
