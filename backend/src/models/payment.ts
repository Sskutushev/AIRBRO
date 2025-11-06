// Payment model types based on Prisma schema
export interface Payment {
  id: string;
  userId: string;
  amount: number; // In kopecks
  currency: string; // "RUB", "USD", "USDT", "TON"
  status: string; // "pending", "completed", "failed", "expired"
  paymentMethod: string; // "crypto_usdt_trc20", "crypto_usdt_erc20", "crypto_ton"
  walletAddress?: string;
  txHash?: string;
  qrCode?: string; // Base64 QR-code
  metadata?: string; // JSON
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CryptoPaymentCreate {
  cartItems: string[]; // IDs of cart items
  paymentMethod: 'crypto_usdt_trc20' | 'crypto_usdt_erc20' | 'crypto_ton';
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
  warnings: string[]; // Array of warnings
}

export interface PaymentStatusResponse {
  status: 'pending' | 'completed' | 'failed' | 'expired';
  txHash: string | null;
  expiresAt: string;
  timeLeft: number; // Seconds until expiration
}