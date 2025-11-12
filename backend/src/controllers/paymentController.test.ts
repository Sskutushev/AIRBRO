import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../server';
import { clearDatabase, closeDatabase } from '../tests/setup';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('Payment Controller', () => {
  let token: string;
  let userId: string;
  let productId: string;
  let cartItemId: string;

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

    // Create a test product
    const productResponse = await prisma.product.create({
      data: {
        slug: 'test-product',
        name: 'Test Product',
        description: 'A test product',
        price: 1000,
        interval: 'month',
        features: '[]',
        tier: 1,
        isActive: true,
      },
    });

    productId = productResponse.id;

    // Add product to user's cart
    const addToCartResponse = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 1 });

    cartItemId = addToCartResponse.body.cartItem.id;
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('POST /api/payments/crypto/create', () => {
    it('should create a crypto payment successfully', async () => {
      const response = await request(app)
        .post('/api/payments/crypto/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          cartItems: [cartItemId],
          paymentMethod: 'crypto_usdt_trc20',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('paymentId');
      expect(response.body).toHaveProperty('amountCrypto');
      expect(response.body).toHaveProperty('walletAddress');
      expect(response.body).toHaveProperty('qrCode');
    });

    it('should return 400 if some cart items not found in user cart', async () => {
      const response = await request(app)
        .post('/api/payments/crypto/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          cartItems: ['non-existent-id'],
          paymentMethod: 'crypto_usdt_trc20',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/payments/:id/status', () => {
    it('should return payment status', async () => {
      // Create a payment first
      const createPaymentResponse = await request(app)
        .post('/api/payments/crypto/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          cartItems: [cartItemId],
          paymentMethod: 'crypto_usdt_trc20',
        });

      const paymentId = createPaymentResponse.body.paymentId;

      const response = await request(app)
        .get(`/api/payments/${paymentId}/status`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timeLeft');
    });

    it('should return 404 if payment not found', async () => {
      const response = await request(app)
        .get('/api/payments/non-existent-id/status')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/payments/:id/confirm', () => {
    it('should confirm payment and create subscriptions', async () => {
      // Create a payment first
      const createPaymentResponse = await request(app)
        .post('/api/payments/crypto/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          cartItems: [cartItemId],
          paymentMethod: 'crypto_usdt_trc20',
        });

      const paymentId = createPaymentResponse.body.paymentId;

      const response = await request(app)
        .post(`/api/payments/${paymentId}/confirm`)
        .set('Authorization', `Bearer ${token}`)
        .send({ txHash: 'mockTxHash123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('payment');
      expect(response.body.payment.status).toBe('completed');
    });
  });
});
