// Cart model types based on Prisma schema
export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
}

export interface CartItemAdd {
  productId: string;
  quantity?: number;
}

export interface CartWithItems {
  items: CartItemWithProduct[];
  total: number;
}

export interface CartItemWithProduct {
  id: string;
  product: Product;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}