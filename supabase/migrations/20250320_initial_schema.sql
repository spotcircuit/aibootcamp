-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  duration_hours NUMERIC(4, 2) NOT NULL,
  location VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES public.events(id) NOT NULL,
  user_id UUID REFERENCES public.users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  amount_paid DECIMAL(10, 2) NOT NULL,
  stripe_payment_id VARCHAR(255),
  email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create RLS (Row Level Security) policies
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to events (read-only)
CREATE POLICY "Events are viewable by everyone" 
ON public.events FOR SELECT 
USING (true);

-- Create policies for admin access to events (full access)
CREATE POLICY "Events are editable by admins" 
ON public.events FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.is_admin = TRUE
  )
);

-- Create policies for users table
CREATE POLICY "Users can view their own profile"
ON public.users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.users FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
ON public.users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.is_admin = TRUE
  )
);

-- Create policies for registrations
CREATE POLICY "Users can view their own registrations" 
ON public.registrations FOR SELECT 
USING (
  email = auth.email() OR
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.is_admin = TRUE
  )
);

CREATE POLICY "Users can create registrations" 
ON public.registrations FOR INSERT 
WITH CHECK (true);

-- Add functions for user management
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, created_at, is_admin)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email, new.created_at, FALSE);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Add sample event data
INSERT INTO public.events (name, description, start_date, duration_hours, location, price)
VALUES 
('AI Bootcamp: Building AI Agents', 'Learn how to build AI agents for recruiting, analysis, and customer service in just 2 hours.', '2025-04-15', 2.0, 'Online (Zoom)', 199.00),
('Advanced AI Techniques Workshop', 'Take your AI skills to the next level with advanced prompt engineering and agent creation.', '2025-04-22', 2.0, 'Online (Zoom)', 249.00),
('AI for Talent Acquisition Masterclass', 'Specialized bootcamp for HR and recruiting professionals to build AI tools for talent acquisition.', '2025-05-01', 2.0, 'Online (Zoom)', 199.00);

-- Add phone column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS phone TEXT;
