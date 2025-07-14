import request from 'supertest';
import app from '../server.js';        // the Express app export
import { describe, it, expect } from 'vitest';

describe('GET /ping', () => {
  it('returns 200', async () => {
    await request(app).get('/ping').expect(200);
  });
});
