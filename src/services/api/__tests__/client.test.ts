import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient, APIError } from '../client';

// Mock fetch
global.fetch = vi.fn();

describe('APIClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should make successful login request', async () => {
    const mockResponse = {
      user: { id: '1', email: 'test@example.com', name: 'Test' },
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

  it('should throw APIError on failed request', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    await expect(
      apiClient.login('test@example.com', 'wrong-password')
    ).rejects.toThrow(APIError);
  });

  it('should include authorization token in requests', async () => {
    apiClient.setToken('test-token');

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [] }),
    });

    await apiClient.getProducts();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );
  });
});
