import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../server';
import { clearDatabase, closeDatabase } from '../tests/setup';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('User Controller', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    await clearDatabase();

    // Create a test user and authenticate
    const registerResponse = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      telegram: '@testuser',
    });

    token = registerResponse.body.token;
    userId = registerResponse.body.user.id;
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /api/user/profile', () => {
    it('should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('name', 'Test User');
      expect(response.body).toHaveProperty('telegram', '@testuser');
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/user/profile');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/user/profile', () => {
    it('should update user profile', async () => {
      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Name',
          telegram: '@updatedtelegram',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('name', 'Updated Name');
      expect(response.body.user).toHaveProperty('telegram', '@updatedtelegram');
    });

    it('should return 409 if telegram is already taken', async () => {
      // Register another user
      const registerResponse2 = await request(app).post('/api/auth/register').send({
        email: 'test2@example.com',
        password: 'password123',
        name: 'Test User 2',
        telegram: '@testuser2',
      });

      const token2 = registerResponse2.body.token;

      // Try to update first user with the same telegram as second user
      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          telegram: '@testuser2', // This is already taken by user 2
        });

      expect(response.status).toBe(409);
    });

    it('should return 401 without token', async () => {
      const response = await request(app).put('/api/user/profile').send({
        name: 'Updated Name',
      });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/user/subscriptions', () => {
    it('should return user subscriptions', async () => {
      // Create a test product
      const product = await prisma.product.create({
        data: {
          slug: 'test-subscription',
          name: 'Test Subscription',
          description: 'A test subscription',
          price: 1000,
          interval: 'month',
          features: '["Feature 1"]',
          tier: 1,
          isActive: true,
        },
      });

      // Create a subscription for the user
      await prisma.subscription.create({
        data: {
          userId,
          productId: product.id,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
      });

      const response = await request(app)
        .get('/api/user/subscriptions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('subscriptions');
      expect(response.body.subscriptions).toHaveLength(1);
      expect(response.body.subscriptions[0]).toHaveProperty('product');
      expect(response.body.subscriptions[0]).toHaveProperty('status', 'active');
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/user/subscriptions');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/user/payments', () => {
    it('should return user payments', async () => {
      // Create a test payment for the user
      await prisma.payment.create({
        data: {
          userId,
          amount: 1000,
          currency: 'RUB',
          status: 'completed',
          paymentMethod: 'crypto_usdt_trc20',
        },
      });

      const response = await request(app)
        .get('/api/user/payments')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('payments');
      expect(response.body.payments).toHaveLength(1);
      expect(response.body.payments[0]).toHaveProperty('amount', 1000);
      expect(response.body.payments[0]).toHaveProperty('status', 'completed');
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/user/payments');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/user/subscriptions/:id/cancel', () => {
    it('should cancel user subscription', async () => {
      // Create a test product
      const product = await prisma.product.create({
        data: {
          slug: 'test-subscription',
          name: 'Test Subscription',
          description: 'A test subscription',
          price: 1000,
          interval: 'month',
          features: '["Feature 1"]',
          tier: 1,
          isActive: true,
        },
      });

      // Create a subscription for the user
      const subscription = await prisma.subscription.create({
        data: {
          userId,
          productId: product.id,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
      });

      const response = await request(app)
        .post(`/api/user/subscriptions/${subscription.id}/cancel`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('subscription');
      expect(response.body.subscription).toHaveProperty('status', 'cancelled');
    });

    it('should return 404 if subscription not found', async () => {
      const response = await request(app)
        .post('/api/user/subscriptions/non-existent-id/cancel')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 without token', async () => {
      const response = await request(app).post('/api/user/subscriptions/test-id/cancel');

      expect(response.status).toBe(401);
    });
  });
});
