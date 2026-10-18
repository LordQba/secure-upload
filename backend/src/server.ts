import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, '127.0.0.1', () => {
  console.log('Backend: http://127.0.0.1:3000');
});