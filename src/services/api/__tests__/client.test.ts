import { apiClient, APIError } from '../client';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';

describe('APIClient', () => {
  const mockBaseUrl = 'http://localhost:3001/api';
  let fetchMock: Mock;

  beforeEach(() => {
    // Create a generic mock for fetch for each test
    fetchMock = vi.fn();
    (globalThis as typeof globalThis & { fetch: Mock }).fetch = fetchMock;

    // Default mock for all requests - initially rejecting everything
    fetchMock.mockImplementation((url) => {
      return Promise.reject(new Error(`Unexpected fetch call to ${url}`));
    });

    // Configure the singleton client for tests
    apiClient.baseURL = mockBaseUrl;
    apiClient.setToken(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('login', () => {
    it('should return user and token on successful login', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
        token: 'fake-jwt-token',
      };

      // Mock the login endpoint
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        status: 200,
      });

      const result = await apiClient.login('test@example.com', 'password123');

      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/auth/login`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          credentials: 'include',
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw APIError on failed login (401)', async () => {
      const errorResponse = { message: 'Invalid credentials' };

      fetchMock.mockResolvedValue({
        ok: false,
        json: async () => errorResponse,
        status: 401,
      });

      await expect(apiClient.login('test@example.com', 'wrongpassword')).rejects.toStrictEqual(
        new APIError('Invalid credentials', 401, undefined, undefined)
      );
    });

    it('should throw a generic APIError on network failure', async () => {
      fetchMock.mockRejectedValue(new Error('Network error'));

      await expect(apiClient.login('test@example.com', 'password123')).rejects.toStrictEqual(
        new APIError('Network error. Please check your internet connection.', 0)
      );
    });
  });

  describe('authenticated requests', () => {
    beforeEach(() => {
      apiClient.setToken('fake-jwt-token');
    });

    it('should include Authorization header on GET requests', async () => {
      const mockUserData = { id: '1', email: 'test@example.com', name: 'Test User' };

      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockUserData,
      });

      await apiClient.getMe();

      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/auth/me`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-jwt-token',
          }),
          credentials: 'include',
        })
      );
    });

    it('should clear token and throw on 401 response', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Token expired' }),
      });

      await expect(apiClient.getMe()).rejects.toThrow('Token expired');
      expect((apiClient as { token: string | null }).token).toBeNull();
    });
  });

  describe('other methods', () => {
    it('getProducts should call the correct endpoint with params', async () => {
      const mockProducts = [{ id: '1', name: 'Test Product' }];

      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockProducts,
      });

      await apiClient.getProducts({ tier: 1, isActive: true });

      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/products?tier=1&isActive=true`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          credentials: 'include',
        })
      );
    });

    it('addToCart should send correct payload and headers', async () => {
      apiClient.setToken('fake-jwt-token');
      const mockResponse = { success: true };

      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await apiClient.addToCart('prod-123', 2);

      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/cart`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-jwt-token',
          }),
          body: JSON.stringify({ productId: 'prod-123', quantity: 2 }),
          credentials: 'include',
        })
      );
    });
  });
});
