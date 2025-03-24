// This endpoint configures the Supabase project settings to allow redirects to localhost
import { supabaseAdmin } from '../../../lib/supabase-admin';

export default async function handler(req, res) {
  try {
    // Create a direct connection to the Supabase auth settings
    // This is a workaround because we can't access the Supabase dashboard directly
    // We're using raw SQL to update the auth.redirects table
    
    // First, we need to check if the redirect is already set up
    const { data: existingRedirects, error: queryError } = await supabaseAdmin.from('auth.redirects').select('*');
    
    if (queryError) {
      return res.status(500).json({ 
        error: 'Failed to query auth settings', 
        details: queryError.message
      });
    }
    
    // Check if localhost:3000 is already configured
    const hasLocalhost = existingRedirects?.some(redirect => 
      redirect.uri?.includes('localhost:3000')
    );
    
    if (hasLocalhost) {
      return res.status(200).json({ 
        message: 'Localhost redirect already configured',
        redirects: existingRedirects 
      });
    }
    
    // Add localhost:3000 to the allowed redirects
    const { error: insertError } = await supabaseAdmin.rpc('add_redirect_url', {
      new_url: 'http://localhost:3000'
    });
    
    if (insertError) {
      // If the RPC function doesn't exist, try direct SQL
      const { error: sqlError } = await supabaseAdmin.from('auth.redirects').insert({
        uri: 'http://localhost:3000',
        site_url: true,
        redirect_url: true
      });
      
      if (sqlError) {
        return res.status(500).json({ 
          error: 'Failed to add redirect URL', 
          details: sqlError.message 
        });
      }
    }
    
    // Also update site URL in auth.config
    const { error: configError } = await supabaseAdmin.from('auth.config').update({
      site_url: 'http://localhost:3000'
    }).eq('id', 1);
    
    if (configError) {
      return res.status(500).json({ 
        error: 'Failed to update site URL', 
        details: configError.message 
      });
    }
    
    return res.status(200).json({ 
      message: 'Supabase redirects configured successfully',
    });
  } catch (error) {
    console.error('Unexpected error configuring Supabase:', error);
    return res.status(500).json({ 
      error: 'Unexpected error', 
      details: error.message 
    });
  }
}
