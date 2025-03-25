import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
// Import directly from the shared directory path instead of using path alias
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);