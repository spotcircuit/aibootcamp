# Event Archive System Documentation

## Overview

The Event Archive System allows administrators to archive past events instead of deleting them, which preserves historical data and payment records while keeping the active event list clean and organized.

## Features

- **Archiving/Unarchiving Events**: Move events between active and archived states
- **Batch Actions**: Perform actions on multiple events simultaneously
- **Event Duplication**: Create new versions of events with reference to previous versions
- **User Experience**: Special handling for archived events in user-facing interfaces

## Admin Dashboard

### Viewing Archived Events

1. Navigate to the Admin Dashboard
2. In the Events section, click the "Show Archived" button
3. The event list will now include archived events (displayed with an "Archived" status)
4. Click "Hide Archived" to return to showing only active events

### Archiving an Event

1. Find the event you want to archive in the event list
2. Click the "Archive" button in the Actions column
3. Confirm the action when prompted
4. The event will now be marked as archived and hidden from public view

### Unarchiving an Event

1. Click "Show Archived" to view archived events
2. Find the event you want to restore
3. Click the "Unarchive" button in the Actions column
4. Confirm the action when prompted
5. The event will return to active status and be visible to users

### Batch Operations

1. Click the "Batch Actions" button to enable batch mode
2. Select events by clicking the checkboxes or use "Select All"
3. Use the "Archive Selected" or "Unarchive Selected" buttons to perform bulk operations
4. Click "Cancel Batch" to exit batch mode

### Creating New Versions of Events

1. Find an event you want to duplicate (can be active or archived)
2. Click the "Duplicate" button in the Actions column
3. A new copy of the event will be created with "(Copy)" added to the name
4. The new event will reference the original as its "previous version"
5. Edit the new event as needed (dates, details, etc.)

## User Experience

### User Dashboard

- Users can see all their registrations, including for archived events
- Archived events are clearly marked with an "Archived" tag
- Meeting links and resources remain accessible for past events

### Registration Page

- Archived events display a notification that they are no longer available
- Users cannot register for archived events
- Links to browse current events are provided

## Data Retention

- Archived events are never deleted from the database
- All registrations and payment records remain intact
- Previous versions of events maintain links to newer versions

## Best Practices

1. **Archive Instead of Delete**: Always archive events rather than deleting them to preserve history
2. **Duplicate for New Cohorts**: Use the duplication feature when creating new instances of recurring events
3. **Batch Archive Past Events**: Use batch operations to archive multiple old events at once
4. **Regular Maintenance**: Periodically review and archive past events to keep the active list manageable

## Troubleshooting

If you encounter issues with the archive system:

1. Check if the event has active registrations
2. Verify that the event ID is correctly referenced in the system
3. If duplicate creation fails, ensure the original event exists
4. For unarchiving issues, confirm the event was previously archived properly

## Technical Details

The archive system uses the following database fields:

- `archived`: Boolean flag indicating archive status
- `archived_at`: Timestamp of when the event was archived
- `previous_version_id`: Reference to the original event ID (for duplicated events)