import request from 'supertest';
import express from 'express';
import authRoutes from './routes.js';
import prisma from '../../lib/prisma.js';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /auth/register', () => {
    it('should create a new user with valid data', async () => {
      const testUser = {
        email: `test${Date.now()}@example.com`,
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User created successfully');
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');

      await prisma.user.delete({
        where: {email: testUser.email}
      });
    });

    it('should fail with missing email', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({password: 'Password123!'})
        .expect(422);

      expect(response.body.message).toContain('Email is required');
    });

    it('should fail with duplicate email', async () => {
      const testUser = {
        email: `test${Date.now()}@example.com`,
        password: 'Password123!'
      };

      await request(app)
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      const response = await request(app)
        .post('/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body.message).toContain('User already exists');

      await prisma.user.delete({
        where: {email: testUser.email}
      });
    });
  });

  describe('POST /auth/login', () => {
    const email = `test${Date.now()}@example.com`;
    const password = 'Password123!';

    beforeAll(async () => {
      await request(app)
        .post('/auth/register')
        .send({email, password});
    });

    afterAll(async () => {
      await prisma.user.delete({
        where: {email}
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({email, password})
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(email);
    });

    it('should fail with invalid password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({email, password: 'wrongpassword'})
        .expect(401);

      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should fail with non-existent email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!'
        })
        .expect(401);

      expect(response.body.message).toContain('Invalid credentials');
    });
  });
});
