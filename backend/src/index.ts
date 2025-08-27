
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import fileRoutes from './routes/files';
import aiRoutes from './routes/ai';
import { pool } from './db';

dotenv.config();

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
