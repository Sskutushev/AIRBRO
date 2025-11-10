/**
 * @file Centralized API client for interacting with the AIRBRO Business backend.
 * @module services/api/client
 */

import { storage } from '../../lib/utils/storage';
import { showToast } from '../../lib/toast'; // Assuming showToast exists or will be created
import type { RegisterInput } from '../../lib/validation/auth';

// --- Type Definitions ---
interface UserData {
  id: string;
  email: string;
  name: string;
  telegram: string;
  createdAt: string;
}

interface AuthResponse {
  user: UserData;
  token: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string; // JSON string
  isActive: boolean;
  tier: number;
  createdAt: string;
  updatedAt: string;
}

interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

interface CryptoPaymentResponse {
  id: string;
  amount: number;
  currency: string;
  address: string;
  qrCode?: string;
  status: string;
  expiresAt: string;
}

interface PaymentStatus {
  id: string;
  status: 'pending' | 'paid' | 'failed' | 'expired';
  amount: number;
  currency: string;
  transactionId?: string;
  paidAt?: string;
}

// RegisterInput interface is no longer needed since we're using the one from validation schema

// --- APIError Class ---
/**
 * Custom error class for API-related errors.
 */
export class APIError extends Error {
  statusCode: number;
  code?: string;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number,
    code?: string,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    Object.setPrototypeOf(this, APIError.prototype); // Correctly set the prototype chain
  }
}

// --- APIClient Class ---
/**
 * Centralized client for making requests to the AIRBRO Business backend API.
 */
class APIClient {
  public baseURL: string; // Made public for testing purposes
  private token: string | null = null;
  // private csrfToken: string | null = null; // For CSRF protection

  constructor() {
    // Production fallback to hardcoded URL if env var is not set
    this.baseURL =
      import.meta.env.VITE_API_URL ||
      (import.meta.env.PROD ? 'https://api.aibrobusiness.com' : 'http://localhost:3000');
    this.token = storage.get<string>('authToken') || null; // Load token from storage on init
  }

  /**
   * Sets the authentication token.
   * @param {string | null} token - The JWT token to use for authenticated requests.
   */
  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      storage.set('authToken', token);
    } else {
      storage.remove('authToken');
    }
  }

  /**
   * Validates the current JWT token.
   * (Simplified for now, full JWT parsing and expiration check would be here)
   * @returns {boolean} True if the token is considered valid, false otherwise.
   */
  validateToken(): boolean {
    if (!this.token) return false;
    // TODO: Implement actual JWT decoding and expiration check
    return true;
  }

  /**
   * Fetches the CSRF token from the backend.
   * @returns {Promise<string>} The CSRF token.
   * @throws {APIError} If fetching the token fails.
   */
  // private async fetchCSRFToken(): Promise<string> {
  //   console.log('Fetching CSRF token from:', `${this.baseURL}/api/csrf-token`);
  //   try {
  //     const response = await fetch(`${this.baseURL}/api/csrf-token`, { credentials: 'include' });
  //     if (!response.ok) {
  //       throw new APIError('Failed to fetch CSRF token', response.status);
  //     }
  //     const data = await response.json();
  //     this.csrfToken = data.csrfToken;
  //     console.log('CSRF token fetched:', this.csrfToken);
  //     return this.csrfToken || '';
  //   } catch (error) {
  //     console.error('Error fetching CSRF token:', error);
  //     throw error;
  //   }
  // }

  /**
   * Handles the HTTP response, checking for errors and parsing JSON.
   * @template T The expected type of the successful response data.
   * @param {Response} response - The raw HTTP response.
   * @returns {Promise<T>} The parsed JSON data.
   * @throws {APIError} If the response indicates an error.
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) {
      return response.json();
    }

    const errorData = await response
      .json()
      .catch(() => ({ message: 'Unknown error', error: 'Unknown' }));
    const errorMessage =
      errorData.message || errorData.error || 'Something went wrong with the API request.';

    if (response.status === 401) {
      this.setToken(null); // Clear token on 401
      showToast.error('Сессия истекла. Пожалуйста, войдите снова.');
      // Optionally, redirect to login page
      // } else if (response.status === 403 && errorData.code === 'EBADCSRFTOKEN') {
      //   showToast.error('Ошибка безопасности (CSRF). Пожалуйста, попробуйте еще раз.');
    } else {
      showToast.error(errorMessage);
    }

    throw new APIError(errorMessage, response.status, errorData.code, errorData.errors);
  }

  /**
   * Makes an authenticated or unauthenticated request to the API.
   * @template T The expected type of the response data.
   * @param {string} endpoint - The API endpoint (e.g., '/auth/login').
   * @param {RequestInit} options - Fetch API options.
   * @param {boolean} [retryOnCsrf=true] - Whether to retry the request once if a CSRF error occurs.
   * @returns {Promise<T>} The parsed response data.
   * @throws {APIError} For network errors or API-specific errors.
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    console.log(
      `Making request to: ${this.baseURL}${endpoint} with method: ${options.method || 'GET'}`
    );
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add Authorization header if token exists
    if (this.token && this.validateToken()) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
      console.log('Authorization header added.');
    }

    // Add CSRF token for non-GET requests
    // const isMutatingRequest =
    //   options.method &&
    //   options.method !== 'GET' &&
    //   options.method !== 'HEAD' &&
    //   options.method !== 'OPTIONS';
    // if (isMutatingRequest) {
    //   if (!this.csrfToken) {
    //     console.log('CSRF token missing for mutating request, fetching...');
    //     try {
    //       await this.fetchCSRFToken(); // Fetch if missing
    //     } catch (error) {
    //       console.error('Failed to fetch CSRF token before request:', error);
    //       throw new APIError('Failed to obtain security token.', 0);
    //     }
    //   }
    //   if (this.csrfToken) {
    //     (headers as Record<string, string>)['X-CSRF-Token'] = this.csrfToken;
    //     console.log('X-CSRF-Token header added.');
    //   } else {
    //     console.warn('CSRF token is missing for a mutating request despite attempt to fetch.');
    //     throw new APIError('Missing security token for request.', 0);
    //   }
    // }

    try {
      const response = await fetch(`${this.baseURL}/api${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      // if (
      //   error instanceof APIError &&
      //   error.statusCode === 403 &&
      //   error.code === 'EBADCSRFTOKEN' &&
      //   retryOnCsrf
      // ) {
      //   console.warn('CSRF token invalid, attempting to refresh and retry...');
      //   this.csrfToken = null; // Invalidate current token
      //   await this.fetchCSRFToken(); // Fetch a new one
      //   return this.request<T>(endpoint, options, false); // Retry once, without further retries
      // }
      if (error instanceof APIError) {
        throw error;
      }
      // Handle network errors
      console.error('Network error:', error);
      throw new APIError('Network error. Please check your internet connection.', 0);
    }
  }

  // --- Public API Methods ---

  // AUTH
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(
    data: Omit<RegisterInput, 'confirmPassword' | 'agreement'>
  ): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<UserData> {
    return this.request<UserData>('/auth/me');
  }

  // PRODUCTS
  async getProducts(params?: { tier?: number; isActive?: boolean }): Promise<Product[]> {
    const query = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : '';
    return this.request<Product[]>(`/products${query ? `?${query}` : ''}`);
  }

  async getProductBySlug(slug: string): Promise<Product> {
    return this.request<Product>(`/products/${slug}`);
  }

  // CART
  async getCart(): Promise<CartItem[]> {
    return this.request<CartItem[]>('/cart');
  }

  async addToCart(productId: string, quantity: number = 1): Promise<CartItem> {
    return this.request<CartItem>('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId: string): Promise<void> {
    return this.request<void>(`/cart/${productId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<void> {
    // Assuming a backend endpoint exists for clearing the entire cart
    // This might need to be implemented on the backend if it doesn't exist
    return this.request<void>('/cart/clear', {
      method: 'DELETE',
    });
  }

  // PAYMENTS (Simplified, full implementation would be more complex)
  async createCryptoPayment(
    cartItems: CartItem[],
    paymentMethod: string
  ): Promise<CryptoPaymentResponse> {
    return this.request<CryptoPaymentResponse>('/payments/crypto', {
      method: 'POST',
      body: JSON.stringify({ cartItems, paymentMethod }),
    });
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    return this.request<PaymentStatus>(`/payments/${paymentId}/status`);
  }

  // USER (Simplified, full implementation would be more complex)
  async getUserProfile(): Promise<UserData> {
    return this.request<UserData>('/user/profile'); // Assuming this endpoint exists
  }

  async updateUserProfile(data: Partial<UserData>): Promise<UserData> {
    return this.request<UserData>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUserSubscriptions(): Promise<any[]> {
    // Define proper subscription type if needed
    return this.request<any[]>('/user/subscriptions');
  }

  async getUserPayments(): Promise<any[]> {
    // Define proper payment type if needed
    return this.request<any[]>('/user/payments');
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    return this.request<void>(`/user/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
    });
  }
}

export const apiClient = new APIClient();
