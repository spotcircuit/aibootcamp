import { createRegistration, getUserRegistrations, getRegistrationsByEvent } from '../../../lib/registrations';
import { supabase } from '../../../lib/supabase';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Check for event_id query param for admin requests
    const { event_id } = req.query;
    
    if (event_id) {
      // This should only allow admin users to get all registrations for an event
      try {
        const { user } = await supabaseAdmin.auth.getUser();
        
        if (!user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        
        // Get user profile to check if admin
        const { data: profile } = await supabaseAdmin
          .from('users')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        if (!profile || !profile.is_admin) {
          return res.status(403).json({ error: 'Forbidden - Admin access required' });
        }
        
        const registrations = await getRegistrationsByEvent(event_id);
        res.status(200).json(registrations);
      } catch (error) {
        console.error('Error fetching registrations for event:', error);
        res.status(500).json({ error: 'Error fetching registrations' });
      }
    } else {
      // Get registrations for the current user
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          return res.status(401).json({ error: 'Unauthorized - You must be logged in to view your registrations' });
        }
        
        const registrations = await getUserRegistrations();
        res.status(200).json(registrations);
      } catch (error) {
        console.error('Error fetching user registrations:', error);
        res.status(500).json({ error: 'Error fetching registrations' });
      }
    }
  } else if (req.method === 'POST') {
    try {
      const { user_id, event_id, status = 'registered' } = req.body;
      
      if (!user_id || !event_id) {
        return res.status(400).json({ error: 'Missing required fields: user_id and event_id are required' });
      }
      
      // Validate that the user exists
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(user_id);
      
      if (userError || !userData.user) {
        console.error('Error validating user for registration:', userError);
        return res.status(400).json({ error: 'Invalid user_id provided' });
      }
      
      // Validate that the event exists
      const { data: eventData, error: eventError } = await supabaseAdmin
        .from('events')
        .select('*')
        .eq('id', event_id)
        .single();
      
      if (eventError || !eventData) {
        console.error('Error validating event for registration:', eventError);
        return res.status(400).json({ error: 'Invalid event_id provided' });
      }
      
      const registrationData = {
        user_id,
        event_id,
        status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const registration = await createRegistration(registrationData);
      res.status(201).json(registration);
    } catch (error) {
      console.error('Error creating registration:', error);
      res.status(500).json({ error: 'Failed to create registration', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
