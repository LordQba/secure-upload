import express from 'express';
import cors from 'cors';
import { mkdirSync } from 'node:fs';
import { pool } from './db.js';
import { currentUser } from './user.js';
import { router as vulnerableRouter } from './routes/vulnerable.js';
import { router as secureRouter } from './routes/secure.js';

mkdirSync('uploads/vulnerable', { recursive: true });
mkdirSync('uploads/secure', { recursive: true });

export const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'ok' });
  } catch {
    res.status(503).json({ status: 'ok', db: 'error' });
  }
});

app.use('/api/vulnerable', currentUser, vulnerableRouter);
app.use('/api/secure', currentUser, secureRouter);
