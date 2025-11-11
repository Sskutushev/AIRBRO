import request from 'supertest';
import app from '../../src/server'; // Assuming app is exported from server.ts
import prisma from '../../src/config/database'; // Mocked Prisma client
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../../src/middleware/auth'; // Import authenticateToken

// Mock jsonwebtoken for token generation
jest.mock('jsonwebtoken');
// Mock the authentication middleware
jest.mock('../../src/middleware/auth', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    (req as any).userId = 'testUserId123'; // Set a dummy userId
    next();
  }),
}));

describe('CartController', () => {
  let token: string;
  const userId = 'testUserId123';
  const productId1 = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'; // Valid UUID
  const productId2 = 'f0e9d8c7-b6a5-4321-fedc-ba9876543210'; // Valid UUID

  beforeAll(() => {
    // Mock a valid JWT token for authenticated requests
    (jwt.sign as jest.Mock).mockReturnValue('mockedAuthToken');
    token = 'mockedAuthToken';
  });

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset Prisma mock values for each test
    (prisma.cartItem.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.cartItem.create as jest.Mock).mockResolvedValue(null);
    (prisma.cartItem.delete as jest.Mock).mockResolvedValue(null);
    (prisma.cartItem.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(null);
  });

  describe('getCart', () => {
    it('should return an empty cart for a user with no items', async () => {
      (prisma.cartItem.findMany as jest.Mock).mockResolvedValue([]);

      const res = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.items).toEqual([]);
      expect(res.body.total).toEqual(0);
      expect(prisma.cartItem.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              description: true,
            },
          },
        },
      });
    });

    it('should return cart items and total for a user with items', async () => {
      const mockCartItems = [
        {
          id: 'cartItem1',
          userId,
          productId: productId1,
          quantity: 2,
          product: { id: productId1, name: 'Product 1', price: 1000, description: 'Desc 1' },
        },
        {
          id: 'cartItem2',
          userId,
          productId: productId2,
          quantity: 1,
          product: { id: productId2, name: 'Product 2', price: 2500, description: 'Desc 2' },
        },
      ];
      (prisma.cartItem.findMany as jest.Mock).mockResolvedValue(mockCartItems);

      const res = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.items).toHaveLength(2);
      expect(res.body.total).toEqual(2 * 1000 + 1 * 2500); // 4500
    });
  });

  describe('addToCart', () => {
    it('should add a product to the cart', async () => {
      const mockProduct = { id: productId1, name: 'Product 1', price: 1000, isActive: true };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue(null); // No existing item
      (prisma.cartItem.create as jest.Mock).mockResolvedValue({
        id: 'newCartItem',
        userId,
        productId: productId1,
        quantity: 1,
      });

      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: productId1, quantity: 1 });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('cartItem');
      expect(prisma.cartItem.create).toHaveBeenCalledWith({
        data: {
          userId,
          productId: productId1,
          quantity: 1,
        },
      });
    });

    it('should return 404 if product not found', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null); // Product not found

      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: 'a1a2a3a4-b1b2-c1c2-d1d2-e1e2e3e4e5e6', quantity: 1 });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Product not found');
    });

    it('should return 400 if product is not active', async () => {
      const mockProduct = { id: productId1, name: 'Product 1', price: 1000, isActive: false };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: productId1, quantity: 1 });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Product is not available');
    });

    it('should return 409 if product already in cart', async () => {
      const mockProduct = { id: productId1, name: 'Product 1', price: 1000, isActive: true };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue({ id: 'existingCartItem' }); // Item already in cart

      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: productId1, quantity: 1 });

      expect(res.statusCode).toEqual(409);
      expect(res.body).toHaveProperty('error', 'Product already in cart');
    });
  });

  describe('removeFromCart', () => {
    it('should remove a product from the cart', async () => {
      const cartItemId = 'existingCartItem';
      (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue({
        id: cartItemId,
        userId,
        productId: productId1,
      });
      (prisma.cartItem.delete as jest.Mock).mockResolvedValue({ id: cartItemId });

      const res = await request(app)
        .delete(`/api/cart/${cartItemId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Product removed from cart');
      expect(prisma.cartItem.delete).toHaveBeenCalledWith({ where: { id: cartItemId } });
    });

    it('should return 404 if cart item not found or does not belong to user', async () => {
      (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(null); // Item not found or not user's

      const res = await request(app)
        .delete('/api/cart/nonExistentItem')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Cart item not found');
    });
  });

  describe('clearCart', () => {
    it("should clear all items from the user's cart", async () => {
      (prisma.cartItem.deleteMany as jest.Mock).mockResolvedValue({ count: 2 }); // Mock 2 items deleted

      const res = await request(app)
        .post('/api/cart/clear')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Cart cleared');
      expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({ where: { userId } });
    });
  });
});
