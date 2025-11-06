// Subscription model types based on Prisma schema
export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  status: string; // "active", "cancelled", "expired", "trial"
  startDate: Date;
  endDate: Date;
  nextPaymentDate?: Date | null;
  cancelledAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionCreate {
  userId: string;
  productId: string;
  status: string;
  startDate: Date;
  endDate: Date;
  nextPaymentDate?: Date | null;
}

export interface SubscriptionCancel {
  id: string;
  status: 'cancelled';
  cancelledAt: Date;
}