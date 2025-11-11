import { CartItem, Prisma } from '@prisma/client';
import { BaseRepositoryImpl } from './BaseRepository';
import prisma from '../config/database';

export interface CartItemRepository
  extends BaseRepository<CartItem, CreateCartItemInput, UpdateCartItemInput> {
  findByUserId(userId: string): Promise<CartItem[]>;
  findByUserIdAndProductId(userId: string, productId: string): Promise<CartItem | null>;
  deleteByUserIdAndProductId(userId: string, productId: string): Promise<CartItem>;
  deleteByUserId(userId: string): Promise<Prisma.BatchPayload>;
}

export type CreateCartItemInput = Prisma.CartItemCreateInput;
export type UpdateCartItemInput = Prisma.CartItemUpdateInput;

export class CartItemRepositoryImpl
  extends BaseRepositoryImpl<CartItem, CreateCartItemInput, UpdateCartItemInput>
  implements CartItemRepository
{
  constructor() {
    super(prisma);
  }

  async findAll(): Promise<CartItem[]> {
    return this.prisma.cartItem.findMany();
  }

  async findById(id: string): Promise<CartItem | null> {
    return this.prisma.cartItem.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<CartItem[]> {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
  }

  async findByUserIdAndProductId(userId: string, productId: string): Promise<CartItem | null> {
    return this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async create(data: CreateCartItemInput): Promise<CartItem> {
    return this.prisma.cartItem.create({
      data,
    });
  }

  async update(id: string, data: UpdateCartItemInput): Promise<CartItem> {
    return this.prisma.cartItem.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<CartItem> {
    return this.prisma.cartItem.delete({
      where: { id },
    });
  }

  async deleteByUserIdAndProductId(userId: string, productId: string): Promise<CartItem> {
    return this.prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async deleteByUserId(userId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.cartItem.deleteMany({
      where: { userId },
    });
  }

  async exists(id: string): Promise<boolean> {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id },
    });
    return cartItem !== null;
  }
}
