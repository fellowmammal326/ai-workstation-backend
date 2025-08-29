

import dotenv from 'dotenv';
// By calling dotenv.config() here, at the very top of the application's entry point,
// we ensure that all environment variables are loaded from the .env file (for local development)
// before any other code that might need them (like the AI controller or database config) is executed.
dotenv.config();

// FIX: Aliased express types to avoid conflicts with global Request/Response types.
import express, { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import fileRoutes from './routes/files';
import aiRoutes from './routes/ai';
import { pool } from './db';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// FIX: Explicitly use aliased express types to avoid type conflicts.
app.get('/', (req: ExpressRequest, res: ExpressResponse) => {
  res.send('AI Workstation Backend is running!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/ai', aiRoutes);

pool.connect()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err: Error) => {
    console.error('\n*******************************************************************');
    console.error('***           FATAL: DATABASE CONNECTION FAILED                   ***');
    console.error('*******************************************************************');
    if (!process.env.DATABASE_URL) {
      console.error('REASON: The DATABASE_URL environment variable is not set.');
      console.error('ACTION: Please set this variable with your PostgreSQL connection string.');
      console.error('Example for local .env file: DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"');
    } else {
      console.error('REASON: Could not connect to the database specified by DATABASE_URL.');
      console.error('ACTION: Please verify the following:');
      console.error('  1. Your PostgreSQL database server is running.');
      console.error('  2. The connection string (host, port, user, password, db name) is correct.');
      console.error('  3. The database is accessible from where you are running the app.');
      console.error('  4. If using a cloud provider like Render, ensure you are using the "Internal Connection String".');
    }
    console.error('\nOriginal Error Message:', err.message);
    console.error('*******************************************************************');
    console.error('***    The application cannot start without a database. Exiting.  ***');
    console.error('*******************************************************************\n');
    // FIX: Use `global.process.exit` to disambiguate from a potential conflicting global `Process` type.
    global.process.exit(1); // Exit with a failure code
  });