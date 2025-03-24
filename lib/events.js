import { supabase } from './supabase';

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
    
    // Return the events as is, since we don't need transformations
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
    console.error(`Error in getEventById:`, error);
    throw error;
  }
}

/**
 * Creates a new event
 * @param {Object} eventData - Event data to create
 * @returns {Promise<Object>} - A promise that resolves to the created event
 */
export async function createEvent(eventData) {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([{
        name: eventData.name,
        description: eventData.description,
        start_date: eventData.start_date,
        end_date: eventData.end_date,
        location: 'Online (Zoom)',
        price: eventData.price
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in createEvent:', error);
    throw error;
  }
}

/**
 * Updates an event
 * @param {number} id - Event ID to update
 * @param {Object} eventData - Updated event data
 * @returns {Promise<Object>} - A promise that resolves to the updated event
 */
export async function updateEvent(id, eventData) {
  try {
    const { data, error } = await supabase
      .from('events')
      .update({
        name: eventData.name,
        description: eventData.description,
        start_date: eventData.start_date,
        end_date: eventData.end_date,
        location: 'Online (Zoom)',
        price: eventData.price
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in updateEvent:', error);
    throw error;
  }
}

/**
 * Deletes an event
 * @param {number} id - Event ID to delete
 * @returns {Promise<void>}
 */
export async function deleteEvent(id) {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    throw error;
  }
}
