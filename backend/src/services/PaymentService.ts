import { Payment, Prisma } from '@prisma/client';
import { PaymentRepositoryImpl } from '../repositories';

/**
 * @interface PaymentService
 * @description Defines the interface for payment-related operations.
 */
export interface PaymentService {
  /**
   * @method findPaymentById
   * @description Finds a payment by its unique ID.
   * @param {string} id - The ID of the payment.
   * @returns {Promise<Payment | null>} A promise that resolves to the payment or null if not found.
   */
  findPaymentById(id: string): Promise<Payment | null>;
  /**
   * @method findPaymentsByUser
   * @description Finds all payments associated with a specific user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Payment[]>} A promise that resolves to an array of payments.
   */
  findPaymentsByUser(userId: string): Promise<Payment[]>;
  /**
   * @method findPaymentByTxHash
   * @description Finds a payment by its transaction hash.
   * @param {string} txHash - The transaction hash of the payment.
   * @returns {Promise<Payment | null>} A promise that resolves to the payment or null if not found.
   */
  findPaymentByTxHash(txHash: string): Promise<Payment | null>;
  /**
   * @method createPayment
   * @description Creates a new payment record.
   * @param {Prisma.PaymentCreateInput} paymentData - The data for creating the payment.
   * @returns {Promise<Payment>} A promise that resolves to the newly created payment.
   */
  createPayment(paymentData: Prisma.PaymentCreateInput): Promise<Payment>;
  /**
   * @method updatePayment
   * @description Updates an existing payment record.
   * @param {string} id - The ID of the payment to update.
   * @param {Prisma.PaymentUpdateInput} paymentData - The data for updating the payment.
   * @returns {Promise<Payment>} A promise that resolves to the updated payment.
   */
  updatePayment(id: string, paymentData: Prisma.PaymentUpdateInput): Promise<Payment>;
  /**
   * @method findPendingPayments
   * @description Finds all payments with a 'pending' status.
   * @returns {Promise<Payment[]>} A promise that resolves to an array of pending payments.
   */
  findPendingPayments(): Promise<Payment[]>;
}

/**
 * @class PaymentServiceImpl
 * @implements {PaymentService}
 * @description Implements the PaymentService interface, interacting with the PaymentRepository.
 */
export class PaymentServiceImpl implements PaymentService {
  private paymentRepository: PaymentRepositoryImpl;

  /**
   * @constructor
   * @description Creates an instance of PaymentServiceImpl.
   */
  constructor() {
    this.paymentRepository = new PaymentRepositoryImpl();
  }

  /**
   * @inheritdoc
   */
  async findPaymentById(id: string): Promise<Payment | null> {
    return this.paymentRepository.findById(id);
  }

  /**
   * @inheritdoc
   */
  async findPaymentsByUser(userId: string): Promise<Payment[]> {
    return this.paymentRepository.findByUserId(userId);
  }

  /**
   * @inheritdoc
   */
  async findPaymentByTxHash(txHash: string): Promise<Payment | null> {
    return this.paymentRepository.findByTxHash(txHash);
  }

  /**
   * @inheritdoc
   */
  async createPayment(paymentData: Prisma.PaymentCreateInput): Promise<Payment> {
    return this.paymentRepository.create(paymentData);
  }

  /**
   * @inheritdoc
   */
  async updatePayment(id: string, paymentData: Prisma.PaymentUpdateInput): Promise<Payment> {
    return this.paymentRepository.update(id, paymentData);
  }

  /**
   * @inheritdoc
   */
  async findPendingPayments(): Promise<Payment[]> {
    return this.paymentRepository.findPendingPayments();
  }
}
