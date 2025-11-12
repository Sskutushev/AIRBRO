import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../server';
import { clearDatabase, closeDatabase } from '../tests/setup';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Product Controller', () => {
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

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      // Create test products
      await prisma.product.create({
        data: {
          slug: 'test-product-1',
          name: 'Test Product 1',
          description: 'A test product',
          price: 1000,
          interval: 'month',
          features: '["Feature 1", "Feature 2"]',
          tier: 1,
          isActive: true,
        },
      });

      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('products');
      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0]).toHaveProperty('name', 'Test Product 1');
    });

    it('should return products filtered by tier', async () => {
      // Create test products with different tiers
      await prisma.product.create({
        data: {
          slug: 'test-product-1',
          name: 'Test Product 1',
          description: 'A test product',
          price: 1000,
          interval: 'month',
          features: '["Feature 1"]',
          tier: 1,
          isActive: true,
        },
      });

      await prisma.product.create({
        data: {
          slug: 'test-product-2',
          name: 'Test Product 2',
          description: 'Another test product',
          price: 2000,
          interval: 'month',
          features: '["Feature 1"]',
          tier: 2,
          isActive: true,
        },
      });

      const response = await request(app).get('/api/products?tier=1');

      expect(response.status).toBe(200);
      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0]).toHaveProperty('tier', 1);
    });

    it('should return products filtered by active status', async () => {
      // Create active and inactive products
      await prisma.product.create({
        data: {
          slug: 'active-product',
          name: 'Active Product',
          description: 'An active product',
          price: 1000,
          interval: 'month',
          features: '["Feature 1"]',
          tier: 1,
          isActive: true,
        },
      });

      await prisma.product.create({
        data: {
          slug: 'inactive-product',
          name: 'Inactive Product',
          description: 'An inactive product',
          price: 2000,
          interval: 'month',
          features: '["Feature 1"]',
          tier: 1,
          isActive: false,
        },
      });

      const response = await request(app).get('/api/products?isActive=true');

      expect(response.status).toBe(200);
      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0]).toHaveProperty('name', 'Active Product');
    });
  });

  describe('GET /api/products/:slug', () => {
    it('should return a product by slug', async () => {
      // Create test product
      await prisma.product.create({
        data: {
          slug: 'test-product-slug',
          name: 'Test Product',
          description: 'A test product',
          price: 1000,
          interval: 'month',
          features: '["Feature 1", "Feature 2"]',
          tier: 1,
          isActive: true,
        },
      });

      const response = await request(app).get('/api/products/test-product-slug');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Test Product');
      expect(response.body).toHaveProperty('features');
      expect(Array.isArray(response.body.features)).toBe(true);
    });

    it('should return 404 if product not found', async () => {
      const response = await request(app).get('/api/products/non-existent-slug');

      expect(response.status).toBe(404);
    });
  });
});
