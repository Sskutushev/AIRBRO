import request from 'supertest';
import app from '../../src/server'; // Assuming app is exported from server.ts
import prisma from '../../src/config/database'; // Mocked Prisma client
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../../src/middleware/auth'; // Import authenticateToken
import * as cryptoUtils from '../../src/utils/crypto'; // Import crypto utility functions

// Mock jsonwebtoken for token generation
jest.mock('jsonwebtoken');
// Mock the authentication middleware
jest.mock('../../src/middleware/auth', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    (req as any).userId = 'testUserId123'; // Set a dummy userId
    next();
  }),
}));
// Mock crypto utility functions
jest.mock('../../src/utils/crypto', () => ({
  getCryptoConfig: jest.fn(),
  generateQRCode: jest.fn(),
  calculateCryptoAmount: jest.fn(),
  getPaymentWarnings: jest.fn(),
}));

describe('PaymentController', () => {
  let token: string;
  const userId = 'testUserId123';
  const cartItemId1 = 'c1d2e3f4-a5b6-7890-1234-567890abcdef'; // Valid UUID
  const productId1 = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
  const paymentId = 'payment123';

  beforeAll(() => {
    (jwt.sign as jest.Mock).mockReturnValue('mockedAuthToken');
    token = 'mockedAuthToken';
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Prisma mock values for each test
    (prisma.cartItem.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.payment.create as jest.Mock).mockResolvedValue(null);
    (prisma.payment.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.payment.update as jest.Mock).mockResolvedValue(null);
    (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.subscription.create as jest.Mock).mockResolvedValue(null);
    (prisma.cartItem.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });

    // Reset crypto utils mocks
    (cryptoUtils.getCryptoConfig as jest.Mock).mockResolvedValue({
      wallet: 'mockWalletAddress',
      rate: 100, // 1 RUB = 100 crypto units
      currency: 'USDT',
      network: 'TRC20',
    });
    (cryptoUtils.calculateCryptoAmount as jest.Mock).mockReturnValue(10); // 1000 kopecks / 100 rate = 10 crypto
    (cryptoUtils.generateQRCode as jest.Mock).mockResolvedValue('mockQRCodeBase64');
    (cryptoUtils.getPaymentWarnings as jest.Mock).mockReturnValue(['Warning 1']);
  });

  describe('createCryptoPayment', () => {
    it('should create a crypto payment successfully', async () => {
      const mockCartItems = [
        {
          id: cartItemId1,
          userId,
          productId: productId1,
          quantity: 1,
          product: { id: productId1, price: 1000, interval: 'month' },
        },
      ];
      (prisma.cartItem.findMany as jest.Mock).mockResolvedValue(mockCartItems);
      (prisma.payment.create as jest.Mock).mockResolvedValue({
        id: paymentId,
        userId,
        amount: 1000,
        currency: 'USDT',
        status: 'pending',
        paymentMethod: 'crypto_usdt_trc20',
        walletAddress: 'mockWalletAddress',
        qrCode: 'mockQRCodeBase64',
        expiresAt: new Date(),
        metadata: JSON.stringify({
          cartItems: [{ id: cartItemId1, productId: productId1, quantity: 1 }],
        }),
      });

      const res = await request(app)
        .post('/api/payments/crypto/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ cartItems: [cartItemId1], paymentMethod: 'crypto_usdt_trc20' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('paymentId', paymentId);
      expect(res.body).toHaveProperty('amountCrypto', 10);
      expect(res.body).toHaveProperty('qrCode', 'mockQRCodeBase64');
      expect(prisma.payment.create).toHaveBeenCalled();
    });

    it('should return 400 if some cart items not found in user cart', async () => {
      (prisma.cartItem.findMany as jest.Mock).mockResolvedValue([]); // No cart items found

      const res = await request(app)
        .post('/api/payments/crypto/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ cartItems: [cartItemId1], paymentMethod: 'crypto_usdt_trc20' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Some cart items not found in user cart');
    });
  });

  describe('getPaymentStatus', () => {
    it('should return payment status', async () => {
      const mockPayment = {
        id: paymentId,
        status: 'pending',
        txHash: null,
        expiresAt: new Date(Date.now() + 60 * 1000), // 1 minute from now
      };
      (prisma.payment.findUnique as jest.Mock).mockResolvedValue(mockPayment);

      const res = await request(app)
        .get(`/api/payments/${paymentId}/status`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'pending');
      expect(res.body).toHaveProperty('timeLeft');
      expect(prisma.payment.findUnique).toHaveBeenCalledWith({ where: { id: paymentId } });
    });

    it('should return 404 if payment not found', async () => {
      (prisma.payment.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .get(`/api/payments/nonExistentPayment/status`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Payment not found');
    });
  });

  describe('confirmPayment', () => {
    it('should confirm payment and create subscriptions', async () => {
      const mockPayment = {
        id: paymentId,
        userId,
        amount: 1000,
        currency: 'USDT',
        status: 'pending',
        paymentMethod: 'crypto_usdt_trc20',
        metadata: JSON.stringify({
          cartItems: [{ id: cartItemId1, productId: productId1, quantity: 1 }],
        }),
        user: { name: 'Test User', telegram: '@testuser' },
      };
      const mockCartItem = {
        id: cartItemId1,
        productId: productId1,
        product: { id: productId1, interval: 'month' },
      };

      (prisma.payment.update as jest.Mock).mockResolvedValue({
        ...mockPayment,
        status: 'completed',
        txHash: 'mockTxHash123',
      });
      (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue(mockCartItem);
      (prisma.subscription.create as jest.Mock).mockResolvedValue({});
      (prisma.cartItem.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

      const res = await request(app)
        .post(`/api/payments/${paymentId}/confirm`)
        .set('Authorization', `Bearer ${token}`)
        .send({ txHash: 'mockTxHash123' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('payment');
      expect(res.body.payment).toHaveProperty('status', 'completed');
      expect(prisma.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: paymentId },
          data: { status: 'completed', txHash: 'mockTxHash123' },
        })
      );
      expect(prisma.subscription.create).toHaveBeenCalled();
      expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({ where: { userId } });
    });
  });
});
