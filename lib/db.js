import { Pool } from 'pg';

let pool;

// Check if we're in a production environment
if (process.env.NODE_ENV === 'production') {
  // This configuration works with Vercel Postgres, Neon, Supabase, and Upstash
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      // This can be adjusted based on the provider
      // - For Neon: rejectUnauthorized: true
      // - For Supabase: rejectUnauthorized: false
      // - For Upstash: You might need to use ssl: true instead of this object
      rejectUnauthorized: false
    }
  });
} else {
  // Local development configuration
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'aibootcamp',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  });
}

// Helper for logging in development
if (process.env.NODE_ENV !== 'production') {
  const originalQuery = pool.query;
  pool.query = (...args) => {
    console.log('EXECUTING QUERY:', args[0]);
    return originalQuery.apply(pool, args);
  };
}

const db = {
  query: (text, params) => pool.query(text, params),
  // Add a function to get a client from the pool
  getClient: async () => {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;
    
    // Override client.query
    client.query = (...args) => {
      return query.apply(client, args);
    };
    
    // Override client.release
    client.release = () => {
      release.apply(client);
    };
    
    return client;
  }
};

export default db;
