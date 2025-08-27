
import dotenv from 'dotenv';
// By calling dotenv.config() here, at the very top of the application's entry point,
// we ensure that all environment variables are loaded from the .env file (for local development)
// before any other code that might need them (like the AI controller or database config) is executed.
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import fileRoutes from './routes/files';
import aiRoutes from './routes/ai';
import { pool } from './db';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
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
    console.error('Database connection error', err.stack);
  });