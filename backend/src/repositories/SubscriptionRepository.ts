import { Subscription, Prisma } from '@prisma/client';
import { BaseRepositoryImpl, BaseRepository } from './BaseRepository';
import prisma from '../config/database';

export interface SubscriptionRepository
  extends BaseRepository<Subscription, CreateSubscriptionInput, UpdateSubscriptionInput> {
  findByUserId(userId: string): Promise<Subscription[]>;
  findActiveByUserId(userId: string): Promise<Subscription[]>;
  findByProductId(productId: string): Promise<Subscription[]>;
}

export type CreateSubscriptionInput = Prisma.SubscriptionCreateInput;
export type UpdateSubscriptionInput = Prisma.SubscriptionUpdateInput;

export class SubscriptionRepositoryImpl
  extends BaseRepositoryImpl<Subscription, CreateSubscriptionInput, UpdateSubscriptionInput>
  implements SubscriptionRepository
{
  constructor() {
    super(prisma);
  }

  async findAll(): Promise<Subscription[]> {
    return this.prisma.subscription.findMany();
  }

  async findById(id: string): Promise<Subscription | null> {
    return this.prisma.subscription.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return this.prisma.subscription.findMany({
      where: { userId },
    });
  }

  async findActiveByUserId(userId: string): Promise<Subscription[]> {
    return this.prisma.subscription.findMany({
      where: {
        userId,
        status: { in: ['active', 'trial'] },
      },
    });
  }

  async findByProductId(productId: string): Promise<Subscription[]> {
    return this.prisma.subscription.findMany({
      where: { productId },
    });
  }

  async create(data: CreateSubscriptionInput): Promise<Subscription> {
    return this.prisma.subscription.create({
      data,
    });
  }

  async update(id: string, data: UpdateSubscriptionInput): Promise<Subscription> {
    return this.prisma.subscription.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Subscription> {
    return this.prisma.subscription.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });
    return subscription !== null;
  }
}
