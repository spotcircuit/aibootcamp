import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Type definitions for API responses
type ApiResponse = {
  success: boolean;
  message: string;
  error?: string;
};

/**
 * API handler for deleting a registration
 * This endpoint is protected and requires admin authentication
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
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

    // Extract registration ID from request
    const { registrationId } = req.query;

    // Validate required fields
    if (!registrationId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: registrationId is required'
      });
    }
    
    // Delete the registration
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', registrationId);

    if (error) {
      console.error('Error deleting registration:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete registration',
        error: error.message
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Registration deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteRegistration API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      success: false,
      message: 'Server error deleting registration',
      error: errorMessage
    });
  }
}
