import * as ApiTypes from '../../types/api';
import type { RegisterInput } from '../../lib/validation/auth';

class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Произошла ошибка',
      }));

      throw new APIError(
        error.message || 'Ошибка сервера',
        response.status,
        error.code,
        error.errors
      );
    }

    return response.json();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    } as Record<string, string>;

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      // Network error
      throw new APIError(
        'Ошибка соединения с сервером',
        0
      );
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request<ApiTypes.LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: RegisterInput) {
    return this.request<ApiTypes.RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request<ApiTypes.User>('/auth/me');
  }

  // Products methods
  async getProducts(params?: { tier?: number; isActive?: boolean }) {
    const query = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return this.request<ApiTypes.ProductsResponse>(
      `/products${query ? `?${query}` : ''}`
    );
  }

  async getProductBySlug(slug: string) {
    return this.request<ApiTypes.SingleProductResponse>(`/products/${slug}`);
  }

  // Cart methods
  async getCart() {
    return this.request<ApiTypes.CartResponse>('/cart');
  }

  async addToCart(productId: string, quantity: number = 1) {
    return this.request<{ cartItem: ApiTypes.CartItem }>('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(itemId: string) {
    return this.request<{ message: string }>(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  }
  
  async clearCart() {
    return this.request<{ message: string }>('/cart/clear', {
      method: 'POST',
    });
  }

  // Payment methods
  async createCryptoPayment(cartItems: string[], paymentMethod: string) {
    return this.request<ApiTypes.CryptoPaymentResponse>('/payments/crypto/create', {
      method: 'POST',
      body: JSON.stringify({ cartItems, paymentMethod }),
    });
  }

  async getPaymentStatus(paymentId: string) {
    return this.request<ApiTypes.PaymentStatusResponse>(`/payments/${paymentId}/status`);
  }

  // User methods
  async getUserProfile() {
    return this.request<ApiTypes.User>('/user/profile');
  }

  async updateUserProfile(data: Partial<ApiTypes.User>) {
    return this.request<{ user: ApiTypes.User }>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUserSubscriptions() {
    return this.request<ApiTypes.UserSubscriptionsResponse>(
      '/user/subscriptions'
    );
  }

  async getUserPayments() {
    return this.request<ApiTypes.UserPaymentsResponse>('/user/payments');
  }

  async cancelSubscription(subscriptionId: string) {
    return this.request<ApiTypes.SubscriptionCancellationResponse>(
      `/user/subscriptions/${subscriptionId}/cancel`,
      { method: 'POST' }
    );
  }
}

export const apiClient = new APIClient();
export { APIError };
// Dummy comment to force re-transpilation
