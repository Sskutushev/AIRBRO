export interface User {
  id: string;
  email: string;
  name: string;
  telegram: string;
  createdAt: string;
  // Add other user-related fields if necessary
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // In kopecks
  interval: string; // "month" or "year"
  features: string[]; // Parsed JSON
  isActive: boolean;
  tier: number;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product; // Include product details
}

export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string; // ISO 8601 date string
  endDate: string; // ISO 8601 date string
  nextPaymentDate: string | null; // ISO 8601 date string
  cancelledAt: string | null; // ISO 8601 date string
  product: {
    // Simplified product for subscription list
    name: string;
    description: string;
  };
}

export interface Payment {
  id: string;
  userId: string;
  amount: number; // In kopecks
  currency: string; // "RUB", "USD", "USDT", "TON"
  status: 'pending' | 'completed' | 'failed' | 'expired';
  paymentMethod: string;
  walletAddress: string | null;
  txHash: string | null;
  qrCode: string | null; // Base64 QR-code
  expiresAt: string | null; // ISO 8601 date string
  createdAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface CryptoPaymentResponse {
  paymentId: string;
  walletAddress: string;
  amountRub: number;
  amountCrypto: number;
  currency: 'USDT' | 'TON';
  qrCode: string; // Base64 data URL
  expiresAt: string; // ISO 8601
  network: 'TRC20' | 'ERC20' | 'TON';
  warnings: string[];
}

export interface PaymentStatusResponse {
  status: 'pending' | 'completed' | 'failed' | 'expired';
  txHash: string | null;
  expiresAt: string | null;
  timeLeft: number; // Seconds until expiration
}

export interface CartResponse {
  items: CartItem[];
  total: number; // Sum in kopecks
}

export interface ProductsResponse {
  products: Product[];
}

export interface UserProfileResponse {
  user: User;
}

export interface UserSubscriptionsResponse {
  subscriptions: Subscription[];
}

export interface UserPaymentsResponse {
  payments: Payment[];
}

export interface SubscriptionCancellationResponse {
  subscription: {
    id: string;
    status: 'cancelled';
    cancelledAt: string;
  };
}
