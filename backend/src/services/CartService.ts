import { CartItem, Prisma } from '@prisma/client';
import { CartItemRepositoryImpl } from '../repositories';

export interface CartService {
  getCartItemsForUser(userId: string): Promise<CartItem[]>;
  addProductToCart(userId: string, productId: string, quantity: number): Promise<CartItem>;
  removeProductFromCart(userId: string, productId: string): Promise<CartItem>;
  updateCartItemQuantity(userId: string, productId: string, quantity: number): Promise<CartItem>;
  clearUserCart(userId: string): Promise<Prisma.BatchPayload>;
  findCartItemByUserAndProduct(userId: string, productId: string): Promise<CartItem | null>;
}

export class CartServiceImpl implements CartService {
  private cartItemRepository: CartItemRepositoryImpl;

  constructor() {
    this.cartItemRepository = new CartItemRepositoryImpl();
  }

  async getCartItemsForUser(userId: string): Promise<CartItem[]> {
    return this.cartItemRepository.findByUserId(userId);
  }

  async addProductToCart(userId: string, productId: string, quantity: number): Promise<CartItem> {
    return this.cartItemRepository.create({
      userId,
      productId,
      quantity,
    });
  }

  async removeProductFromCart(userId: string, productId: string): Promise<CartItem> {
    return this.cartItemRepository.deleteByUserIdAndProductId(userId, productId);
  }

  async updateCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<CartItem> {
    const existingItem = await this.findCartItemByUserAndProduct(userId, productId);
    if (!existingItem) {
      throw new Error('Cart item not found');
    }
    return this.cartItemRepository.update(existingItem.id, { quantity });
  }

  async clearUserCart(userId: string): Promise<Prisma.BatchPayload> {
    return this.cartItemRepository.deleteByUserId(userId);
  }

  async findCartItemByUserAndProduct(userId: string, productId: string): Promise<CartItem | null> {
    return this.cartItemRepository.findByUserIdAndProductId(userId, productId);
  }
}
