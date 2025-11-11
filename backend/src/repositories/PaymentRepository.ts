import { Payment, Prisma } from '@prisma/client';
import { BaseRepositoryImpl } from './BaseRepository';
import prisma from '../config/database';

export interface PaymentRepository
  extends BaseRepository<Payment, CreatePaymentInput, UpdatePaymentInput> {
  findByUserId(userId: string): Promise<Payment[]>;
  findByStatus(status: string): Promise<Payment[]>;
  findByTxHash(txHash: string): Promise<Payment | null>;
  findPendingPayments(): Promise<Payment[]>;
}

export type CreatePaymentInput = Prisma.PaymentCreateInput;
export type UpdatePaymentInput = Prisma.PaymentUpdateInput;

export class PaymentRepositoryImpl
  extends BaseRepositoryImpl<Payment, CreatePaymentInput, UpdatePaymentInput>
  implements PaymentRepository
{
  constructor() {
    super(prisma);
  }

  async findAll(): Promise<Payment[]> {
    return this.prisma.payment.findMany();
  }

  async findById(id: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { userId },
    });
  }

  async findByStatus(status: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { status },
    });
  }

  async findByTxHash(txHash: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { txHash },
    });
  }

  async findPendingPayments(): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { status: 'pending' },
    });
  }

  async create(data: CreatePaymentInput): Promise<Payment> {
    return this.prisma.payment.create({
      data,
    });
  }

  async update(id: string, data: UpdatePaymentInput): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Payment> {
    return this.prisma.payment.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });
    return payment !== null;
  }
}
