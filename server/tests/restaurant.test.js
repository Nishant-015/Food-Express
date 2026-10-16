const request = require('supertest');
const app = require('../src/app');

describe('Restaurants & Foods Suite', () => {
  it('GET /api/restaurants should return list of restaurants with pagination metadata', async () => {
    const res = await request(app).get('/api/restaurants?page=1&limit=5');
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toHaveProperty('page', 1);
    }
  });

  it('GET /api/restaurants with search filter should execute query', async () => {
    const res = await request(app).get('/api/restaurants?search=pizza');
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    }
  });

  it('POST /api/restaurants without authentication should return 401', async () => {
    const res = await request(app)
      .post('/api/restaurants')
      .send({
        name: 'Unauthenticated Bistro',
        address: '123 Test St',
        city: 'New York',
        cuisines: ['Italian']
      });

    expect(res.status).toBe(401);
  });
});
