// Product model types based on Prisma schema
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // In kopecks
  interval: string; // "month" or "year"
  features: string; // JSON string
  isActive: boolean;
  tier: number; // 1, 2, 3
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCreate {
  slug: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string;
  isActive?: boolean;
  tier: number;
}