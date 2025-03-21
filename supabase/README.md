# AI Bootcamp Supabase Database Structure

This document outlines the database structure used in the AI Bootcamp application.

## Overview
This project uses Supabase for database management, authentication, and real-time functionality. The database is designed to support an AI Bootcamp application with robust security and user management.

## Database Tables

The application uses three main tables in the public schema:

### 1. events

| Column            | Type                      | Description                                |
|-------------------|---------------------------|--------------------------------------------|
| id                | UUID                      | Unique identifier for the event           |
| name              | TEXT                      | Event name                                  |
| description       | TEXT                      | Detailed description of the event          |
| start_date        | DATE                      | Date when the event takes place            |
| duration_hours    | NUMERIC                   | Duration of the event in hours             |
| location          | TEXT                      | Location (physical or online)              |
| price             | NUMERIC                   | Cost of attending the event                |
| created_at        | TIMESTAMP WITH TIME ZONE  | When the event was created                 |

### 2. users

| Column            | Type                      | Description                                |
|-------------------|---------------------------|--------------------------------------------|
| id                | UUID                      | Primary key, references Supabase Auth user |
| name              | TEXT                      | User's full name                           |
| email             | TEXT                      | User's email address (unique)              |
| phone             | TEXT                      | User's phone number                        |
| created_at        | TIMESTAMP WITH TIME ZONE  | Timestamp of user account creation         |
| is_admin          | BOOLEAN                   | Flag to indicate admin status              |

### 3. registrations

| Column            | Type                      | Description                                |
|-------------------|---------------------------|--------------------------------------------|
| id                | UUID                      | Unique identifier for registration         |
| event_id          | UUID                      | Foreign key referencing events table       |
| user_id           | UUID                      | Foreign key referencing users table        |
| name              | TEXT                      | Registrant's full name                     |
| email             | TEXT                      | Registrant's email address                 |
| phone             | TEXT                      | Registrant's phone number                  |
| amount_paid       | NUMERIC                   | Amount paid for the event                  |
| stripe_payment_id | TEXT                      | Stripe payment identifier                  |
| email_sent        | BOOLEAN                   | Flag to track confirmation email status     |
| created_at        | TIMESTAMP WITH TIME ZONE  | Timestamp of registration                  |

## Database Interactions

### API Endpoints

#### Events
- `GET /api/events`: Retrieve all events
- `GET /api/events/[id]`: Retrieve a specific event
- `POST /api/events`: Create a new event (admin only)
- `PUT /api/events/[id]`: Update an event (admin only)
- `DELETE /api/events/[id]`: Delete an event (admin only)

#### Registrations
- `GET /api/registrations`: Get current user's registrations
- `GET /api/registrations?event_id=[id]`: Get all registrations for a specific event (admin only)
- `POST /api/registrations`: Create a new event registration

#### User Profiles
- `GET /api/users/profile`: Get current user's profile
- `PUT /api/users/profile`: Update current user's profile
- `PUT /api/users/profile?user_id=[id]`: Update any user's profile (admin only)

## Security Policies

### Row Level Security (RLS)
- **Events**: 
  - All users can read events
  - Only admins can create, update, or delete events

- **Users**:
  - Users can only view and update their own profile
  - Admins can update any user's profile

- **Registrations**:
  - Users can view their own registrations
  - Admins can view all registrations
  - Users can create registrations for themselves

## Authentication

The application uses Supabase Authentication with the following features:
- Email/Password authentication
- Automatic user profile creation
- Admin role management

## Migration and Setup

1. Use the SQL migration script in `migrations/20250320_initial_schema.sql`
2. Run the script in the Supabase SQL Editor
3. Verify table creation and sample data

## Environment Variables

Required Supabase environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Notes
- Always use the Supabase service role key for admin operations
- Implement proper error handling in API endpoints
- Validate and sanitize all user inputs
