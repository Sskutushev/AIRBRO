import { Subscription, Prisma } from '@prisma/client';
import { SubscriptionRepositoryImpl } from '../repositories';

export interface SubscriptionService {
  findSubscriptionById(id: string): Promise<Subscription | null>;
  findSubscriptionsByUser(userId: string): Promise<Subscription[]>;
  findActiveSubscriptionsByUser(userId: string): Promise<Subscription[]>;
  createSubscription(subscriptionData: Prisma.SubscriptionCreateInput): Promise<Subscription>;
  updateSubscription(
    id: string,
    subscriptionData: Prisma.SubscriptionUpdateInput
  ): Promise<Subscription>;
  cancelSubscription(id: string): Promise<Subscription>;
}

export class SubscriptionServiceImpl implements SubscriptionService {
  private subscriptionRepository: SubscriptionRepositoryImpl;

  constructor() {
    this.subscriptionRepository = new SubscriptionRepositoryImpl();
  }

  async findSubscriptionById(id: string): Promise<Subscription | null> {
    return this.subscriptionRepository.findById(id);
  }

  async findSubscriptionsByUser(userId: string): Promise<Subscription[]> {
    return this.subscriptionRepository.findByUserId(userId);
  }

  async findActiveSubscriptionsByUser(userId: string): Promise<Subscription[]> {
    return this.subscriptionRepository.findActiveByUserId(userId);
  }

  async createSubscription(
    subscriptionData: Prisma.SubscriptionCreateInput
  ): Promise<Subscription> {
    return this.subscriptionRepository.create(subscriptionData);
  }

  async updateSubscription(
    id: string,
    subscriptionData: Prisma.SubscriptionUpdateInput
  ): Promise<Subscription> {
    return this.subscriptionRepository.update(id, subscriptionData);
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    return this.subscriptionRepository.update(id, {
      status: 'cancelled',
      cancelledAt: new Date(),
    });
  }
}
