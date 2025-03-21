-- Schema for AI Bootcamp application

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  startDate TIMESTAMP NOT NULL,
  endDate TIMESTAMP NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 30,
  price DECIMAL(10, 2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  experience VARCHAR(100) NOT NULL,
  eventId INTEGER REFERENCES events(id),
  isPaid BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  path VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert demo events
INSERT INTO events (name, description, startDate, endDate, capacity, price) VALUES
('AI Bootcamp: Spring Session', 'Learn how to build your own AI tools in 2 hours! This session covers AI Recruiter, AI Analyst, and AI Avatars.', '2025-04-15 13:00:00', '2025-04-15 15:00:00', 30, 199),
('AI Bootcamp: Summer Session', 'Learn how to build your own AI tools in 2 hours! This session covers AI Recruiter, AI Analyst, and AI Avatars.', '2025-06-20 13:00:00', '2025-06-20 15:00:00', 30, 199),
('AI Bootcamp: Fall Session', 'Learn how to build your own AI tools in 2 hours! This session covers AI Recruiter, AI Analyst, and AI Avatars.', '2025-09-10 13:00:00', '2025-09-10 15:00:00', 30, 199);

-- Insert demo admin user (password: admin123 - in a real app, this would be hashed)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@aibootcamp.com', 'admin123', 'admin');
