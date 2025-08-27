import { Pool } from 'pg';

// dotenv.config() has been removed from here.
// It is now handled centrally in the main `src/index.ts` file, which is best practice.

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});