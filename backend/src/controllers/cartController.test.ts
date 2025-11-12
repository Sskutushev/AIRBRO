import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../server';
import { clearDatabase, closeDatabase } from '../tests/setup';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('Cart Controller', () => {
  let token: string;
  let userId: string;
  let productId: string;

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
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /api/cart', () => {
    it('should return an empty cart for a user with no items', async () => {
      const response = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.items).toEqual([]);
      expect(response.body.total).toBe(0);
    });

    it('should return cart items and total for a user with items', async () => {
      // Add item to cart first
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId, quantity: 2 });

      const response = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.total).toBe(2000); // 2 * 1000
    });
  });

  describe('POST /api/cart/add', () => {
    it('should add a product to the cart', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId, quantity: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('cartItem');
    });

    it('should return 404 if product not found', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: 'a1a2a3a4-b1b2-c1c2-d1d2-e1e2e3e4e5e6',
          quantity: 1,
        });

      expect(response.status).toBe(404);
    });

    it('should return 400 if product is not active', async () => {
      // Create inactive product
      const inactiveProduct = await prisma.product.create({
        data: {
          slug: 'inactive-product',
          name: 'Inactive Product',
          description: 'An inactive test product',
          price: 1000,
          interval: 'month',
          features: '[]',
          tier: 1,
          isActive: false,
        },
      });

      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: inactiveProduct.id, quantity: 1 });

      expect(response.status).toBe(400);
    });

    it('should return 409 if product already in cart', async () => {
      // Add item to cart first
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId, quantity: 1 });

      // Try to add the same item again
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId, quantity: 1 });

      expect(response.status).toBe(409);
    });
  });

  describe('DELETE /api/cart/:itemId', () => {
    it('should remove a product from the cart', async () => {
      // Add item to cart first
      const addToCartResponse = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId, quantity: 1 });

      const cartItemId = addToCartResponse.body.cartItem.id;

      const response = await request(app)
        .delete(`/api/cart/${cartItemId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Product removed from cart');
    });

    it('should return 404 if cart item not found', async () => {
      const response = await request(app)
        .delete('/api/cart/non-existent-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/cart/clear', () => {
    it("should clear all items from the user's cart", async () => {
      // Add some items to cart first
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId, quantity: 2 });

      const response = await request(app)
        .post('/api/cart/clear')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Cart cleared');
    });
  });
});
