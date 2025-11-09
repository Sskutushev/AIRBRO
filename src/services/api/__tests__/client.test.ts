import { apiClient, APIError } from '../client';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

describe('APIClient', () => {
  const mockBaseUrl = 'http://localhost:3000';
  let fetchMock: Mock;

  beforeEach(() => {
    // Create a generic mock for fetch for each test
    fetchMock = vi.fn();
    global.fetch = fetchMock;

    // Default mock for CSRF token requests, which happen automatically
    fetchMock.mockImplementation((url) => {
      if (url.toString().endsWith('/api/csrf-token')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ csrfToken: 'test-csrf-token' }),
          status: 200,
        });
      }
      // For any other URL, return a default rejection to catch un-mocked requests
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

      // Specific mock for the login endpoint for this test
      fetchMock.mockImplementation((url) => {
        if (url.toString().endsWith('/api/auth/login')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockResponse,
            status: 200,
          });
        }
        if (url.toString().endsWith('/api/csrf-token')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ csrfToken: 'test-csrf-token' }),
            status: 200,
          });
        }
        return Promise.reject(new Error(`Unexpected fetch call to ${url}`));
      });

      const result = await apiClient.login('test@example.com', 'password123');

      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/api/auth/login`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ 'X-CSRF-Token': 'test-csrf-token' }),
          body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw APIError on failed login (401)', async () => {
      const errorResponse = { message: 'Invalid credentials' };

      fetchMock.mockImplementation((url) => {
        if (url.toString().endsWith('/api/auth/login')) {
          return Promise.resolve({
            ok: false,
            json: async () => errorResponse,
            status: 401,
          });
        }
        if (url.toString().endsWith('/api/csrf-token')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ csrfToken: 'test-csrf-token' }),
            status: 200,
          });
        }
        return Promise.reject(new Error(`Unexpected fetch call to ${url}`));
      });

      await expect(apiClient.login('test@example.com', 'wrongpassword')).rejects.toStrictEqual(
        new APIError('Invalid credentials', 401, undefined, undefined)
      );
    });

    it('should throw a generic APIError on network failure', async () => {
      fetchMock.mockImplementation((url) => {
        if (url.toString().endsWith('/api/auth/login')) {
          return Promise.reject(new Error('Network error'));
        }
        if (url.toString().endsWith('/api/csrf-token')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ csrfToken: 'test-csrf-token' }),
            status: 200,
          });
        }
        return Promise.reject(new Error(`Unexpected fetch call to ${url}`));
      });

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
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ user: 'data' }),
      });

      await apiClient.getMe();

      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/api/auth/me`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer fake-jwt-token',
          }),
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
      expect((apiClient as any).token).toBeNull();
    });
  });

  describe('other methods', () => {
    it('getProducts should call the correct endpoint with params', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ products: [] }),
      });

      await apiClient.getProducts({ tier: 1, isActive: true });

      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/api/products?tier=1&isActive=true`,
        expect.any(Object)
      );
    });

    it('addToCart should send correct payload and headers', async () => {
      apiClient.setToken('fake-jwt-token');
      fetchMock.mockImplementation((url) => {
        if (url.toString().endsWith('/api/cart')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true }),
          });
        }
        if (url.toString().endsWith('/api/csrf-token')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ csrfToken: 'test-csrf-token' }),
          });
        }
        return Promise.reject(new Error(`Unexpected fetch call to ${url}`));
      });

      await apiClient.addToCart('prod-123', 2);

      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/api/cart`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-CSRF-Token': 'test-csrf-token',
            Authorization: 'Bearer fake-jwt-token',
          }),
          body: JSON.stringify({ productId: 'prod-123', quantity: 2 }),
        })
      );
    });
  });
});
