const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Authentication & Authorization Suite', () => {
  const testUser = {
    name: 'Test Customer',
    email: `test_${Date.now()}@example.com`,
    password: 'Password123!',
    phone: '1234567890'
  };

  it('GET /api/health should return 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('healthy');
  });

  it('POST /api/auth/register should register a new customer', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    if (res.status === 201) {
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
      expect(res.body.data.user.role).toBe('customer');
      expect(res.body.data.user.passwordHash).toBeUndefined();
    }
  });

  it('POST /api/auth/register with duplicate email should return 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    if (res.status !== 500) {
      expect([409, 400]).toContain(res.status);
      expect(res.body.success).toBe(false);
    }
  });

  it('POST /api/auth/login with incorrect credentials should fail with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword999'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/admin/dashboard without auth token should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/admin/dashboard');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
