import request from 'supertest';
import { app } from '../src/app.js';

describe('GET /api/health', () => {
  it('zwraca status ok i połączenie z bazą', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', db: 'ok' });
  });
});
