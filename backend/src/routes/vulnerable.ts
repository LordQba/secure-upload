import { Router } from 'express';

// VULNERABLE: wersja celowo podatna, logika uploadu zostanie dodana w kolejnym etapie.
export const router = Router();

router.get('/ping', (_req, res) => {
  res.json({ version: 'vulnerable' });
});
