import { supabase, supabaseAdmin } from './supabase';

/**
 * Fetches all events from the Supabase database
 * @returns {Promise<Array>} - A promise that resolves to an array of events
 */
export async function getAllEvents() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllEvents:', error);
    throw error;
  }
}

/**
 * Fetches a single event by ID
 * @param {number} id - The event ID
 * @returns {Promise<Object>} - A promise that resolves to the event object
 */
export async function getEventById(id) {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching event with ID ${id}:`, error);
      throw new Error('Failed to fetch event');
    }
    
    return data;
  } catch (error) {
    console.error('Error in getEventById:', error);
    throw error;
  }
}

/**
 * Creates a new event (admin only)
 * @param {Object} eventData - Object containing event details
 * @returns {Promise<Object>} - A promise that resolves to the created event
 */
export async function createEvent(eventData) {
  try {
    // This should only be called server-side with the admin client
    if (!supabaseAdmin) {
      throw new Error('Admin privileges required to create events');
    }
    
    const { data, error } = await supabaseAdmin
      .from('events')
      .insert([eventData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
    
    return data;
  } catch (error) {
    console.error('Error in createEvent:', error);
    throw error;
  }
}

/**
 * Updates an existing event (admin only)
 * @param {number} id - The event ID to update
 * @param {Object} eventData - Object containing updated event details
 * @returns {Promise<Object>} - A promise that resolves to the updated event
 */
export async function updateEvent(id, eventData) {
  try {
    // This should only be called server-side with the admin client
    if (!supabaseAdmin) {
      throw new Error('Admin privileges required to update events');
    }
    
    const { data, error } = await supabaseAdmin
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating event with ID ${id}:`, error);
      throw new Error('Failed to update event');
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateEvent:', error);
    throw error;
  }
}

/**
 * Deletes an event by ID (admin only)
 * @param {number} id - The event ID to delete
 * @returns {Promise<void>}
 */
export async function deleteEvent(id) {
  try {
    // This should only be called server-side with the admin client
    if (!supabaseAdmin) {
      throw new Error('Admin privileges required to delete events');
    }
    
    const { error } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting event with ID ${id}:`, error);
      throw new Error('Failed to delete event');
    }
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    throw error;
  }
}

/**
 * Gets the first available event or creates a default one if none exists
 * @returns {Promise<Object>} - A promise that resolves to the event object
 */
export async function getOrCreateDefaultEvent() {
  try {
    // First try to get any existing event
    const { data: existingEvents, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .limit(1);
    
    if (fetchError) {
      console.error('Error fetching events:', fetchError);
      throw new Error('Failed to fetch events');
    }
    
    // If we found an event, return it
    if (existingEvents && existingEvents.length > 0) {
      return existingEvents[0];
    }
    
    // Otherwise create a default event
    const defaultEvent = {
      title: 'Getting Started with AI Bootcamp',
      description: 'An introductory session to start your AI journey',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // One week from now
      start_time: '10:00:00',
      end_time: '16:00:00',
      location: 'Online',
      max_participants: 50,
      is_virtual: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: newEvent, error: createError } = await supabaseAdmin
      .from('events')
      .insert([defaultEvent])
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating default event:', createError);
      throw new Error('Failed to create default event');
    }
    
    return newEvent;
  } catch (error) {
    console.error('Error in getOrCreateDefaultEvent:', error);
    throw error;
  }
}
