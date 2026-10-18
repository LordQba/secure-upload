import { Router } from 'express';

// SECURE: wersja zabezpieczona, logika uploadu zostanie dodana w kolejnym etapie.
export const router = Router();

router.get('/ping', (_req, res) => {
  res.json({ version: 'secure' });
});
