/**
 * Utility functions for formatting dates and times
 */

/**
 * Format a date string into a readable time in 12-hour format with EST suffix
 * @param dateString ISO date string (already in Eastern Time)
 * @returns Formatted time string in Eastern Time (e.g., "9:00 AM EST")
 */
export function formatTime(dateString: string): string {
  // Create a date object from the string (assuming it's already in Eastern Time)
  const date = new Date(dateString);
  
  // Format the time in 12-hour format
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${formattedHours}:${formattedMinutes} ${ampm} EST`; // Added EST to indicate Eastern Standard Time
}

/**
 * Format a date string into a readable date
 * @param dateString ISO date string
 * @returns Formatted date string (e.g., "Monday, January 1, 2025")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
