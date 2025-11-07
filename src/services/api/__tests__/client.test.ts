import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, APIError } from '../client';

// Mock fetch
global.fetch = vi.fn();

describe('APIClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear any previously set token
    apiClient.setToken(null);
  });

  describe('Authentication', () => {
    it('should store and use auth token', () => {
      const token = 'test-token';
      apiClient.setToken(token);

      expect((apiClient as any).token).toBe(token);
    });
  });

  describe('Login', () => {
    it('should make successful login request', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@example.com', name: 'Test', telegram: '@test' },
        token: 'test-token',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.login('test@example.com', 'password');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password',
          }),
        })
      );
    });

    it('should throw APIError on failed login request', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid credentials' }),
      });

      await expect(
        apiClient.login('test@example.com', 'wrong-password')
      ).rejects.toThrow(APIError);

      await expect(
        apiClient.login('test@example.com', 'wrong-password')
      ).rejects.toMatchObject({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    });
  });

  describe('Register', () => {
    it('should make successful register request', async () => {
      const mockUserData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        telegram: '@johndoe',
      };
      const mockResponse = {
        user: { id: '2', email: 'john@example.com', name: 'John Doe', telegram: '@johndoe' },
        token: 'new-token',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.register(mockUserData);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockUserData),
        })
      );
    });
  });

  describe('Get user profile', () => {
    it('should make successful getMe request with auth token', async () => {
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test', telegram: '@test' };
      
      apiClient.setToken('test-token');

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await apiClient.getMe();

      expect(result).toEqual(mockUser);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/me'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });
  });

  describe('Products', () => {
    it('should make successful getProducts request', async () => {
      const mockProducts = [{ id: '1', name: 'Test Product' }];
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ products: mockProducts }),
      });

      const result = await apiClient.getProducts();

      expect(result).toEqual({ products: mockProducts });
    });

    it('should include query parameters for getProducts', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ products: [] }),
      });

      await apiClient.getProducts({ tier: 1, isActive: true });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/products\?.*tier=1.*isActive=true/),
        expect.any(Object)
      );
    });
  });

  describe('Cart', () => {
    it('should make successful getCart request', async () => {
      const mockCart = { items: [], total: 0 };
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      });

      const result = await apiClient.getCart();

      expect(result).toEqual(mockCart);
    });

    it('should make successful addToCart request', async () => {
      const productId = '123';
      const quantity = 2;
      const mockCartItem = { id: 'item-1', productId, quantity };
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ cartItem: mockCartItem }),
      });

      const result = await apiClient.addToCart(productId, quantity);

      expect(result).toEqual({ cartItem: mockCartItem });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/cart/add'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ productId, quantity }),
        })
      );
    });
  });

  describe('Payments', () => {
    it('should make successful createCryptoPayment request', async () => {
      const cartItems = ['item1', 'item2'];
      const paymentMethod = 'USDT';
      const mockResponse = { paymentId: 'pay-123', walletAddress: 'wallet-address' };
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.createCryptoPayment(cartItems, paymentMethod);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/payments/crypto/create'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ cartItems, paymentMethod }),
        })
      );
    });
  });

  describe('Error handling', () => {
    it('should throw APIError when fetch fails', async () => {
      (global.fetch as any).mockRejectedValue(new TypeError('Network error'));

      await expect(
        apiClient.getCart()
      ).rejects.toThrow(APIError);

      await expect(
        apiClient.getCart()
      ).rejects.toMatchObject({
        message: 'Ошибка соединения с сервером',
        statusCode: 0,
      });
    });

    it('should handle server error responses', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' }),
      });

      await expect(
        apiClient.getCart()
      ).rejects.toThrow(APIError);

      await expect(
        apiClient.getCart()
      ).rejects.toMatchObject({
        message: 'Internal server error',
        statusCode: 500,
      });
    });
  });
});