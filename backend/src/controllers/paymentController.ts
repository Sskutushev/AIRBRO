import { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth';
import { CryptoPaymentCreate } from '../models/payment';
import prisma from '../config/database';
import {
  getCryptoConfig,
  generateQRCode,
  calculateCryptoAmount,
  getPaymentWarnings,
} from '../utils/crypto';
// import { sendTelegramNotification } from '../config/telegram';

export const createCryptoPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { cartItems, paymentMethod }: CryptoPaymentCreate = req.body;

    if (!userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Get user cart items to calculate total
    const userCartItems = await prisma.cartItem.findMany({
      where: {
        id: { in: cartItems },
        userId,
      },
      include: {
        product: true,
      },
    });

    // Verify all requested items are in the user's cart
    if (userCartItems.length !== cartItems.length) {
      return res.status(400).json({ error: 'Some cart items not found in user cart' });
    }

    // Calculate total amount in kopecks
    const totalAmount = userCartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Get crypto configuration
    const cryptoConfig = await getCryptoConfig(paymentMethod);

    // Calculate crypto amount
    const cryptoAmount = calculateCryptoAmount(totalAmount, cryptoConfig.rate);

    // Generate QR code
    const paymentData = `${cryptoConfig.wallet}?amount=${cryptoAmount}`;
    const qrCode = await generateQRCode(paymentData);

    // Set expiration time (30 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: totalAmount,
        currency: cryptoConfig.currency,
        status: 'pending',
        paymentMethod,
        walletAddress: cryptoConfig.wallet,
        qrCode,
        expiresAt,
        metadata: JSON.stringify({
          cartItems: userCartItems.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      },
    });

    // Prepare response
    const response = {
      paymentId: payment.id,
      walletAddress: cryptoConfig.wallet,
      amountRub: totalAmount,
      amountCrypto: cryptoAmount,
      currency: cryptoConfig.currency,
      qrCode: qrCode,
      expiresAt: expiresAt.toISOString(),
      network: cryptoConfig.network,
      warnings: getPaymentWarnings(),
    };

    // Send Telegram notification about new payment
    // try {
    //   await sendTelegramNotification(
    //     `💰 New payment\n\n` +
    //     `💵 Amount: ${totalAmount / 100} ${cryptoConfig.currency}\n` +
    //     `🔐 Method: ${paymentMethod}\n` +
    //     `👤 User: ${(req as any).user?.name || 'Unknown'}\n` +
    //     `📊 Status: pending\n` +
    //     `🔗 ID: ${payment.id}`
    //   );
    // } catch (notificationError) {
    //   console.error('Failed to send Telegram notification:', notificationError);
    // }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Create crypto payment error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Calculate time left until expiration
    let timeLeft = 0;
    if (payment.expiresAt) {
      const now = new Date();
      const expirationTime = new Date(payment.expiresAt);
      timeLeft = Math.max(0, Math.floor((expirationTime.getTime() - now.getTime()) / 1000));
    }

    return res.status(200).json({
      status: payment.status,
      txHash: payment.txHash || null,
      expiresAt: payment.expiresAt?.toISOString() || null,
      timeLeft,
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { txHash } = req.body;

    // In a real implementation, you would verify the transaction hash against the blockchain
    // For now, we'll just update the payment status

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        status: 'completed',
        txHash,
      },
      include: {
        user: {
          select: {
            name: true,
            telegram: true,
          },
        },
      },
    });

    // Parse cart items from metadata
    const metadata = JSON.parse(payment.metadata || '{}');
    const cartItemsData = metadata.cartItems || [];

    // Create subscriptions based on cart items
    for (const cartItemData of cartItemsData) {
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemData.id },
        include: { product: true },
      });

      if (cartItem) {
        // Calculate subscription dates
        const startDate = new Date();
        const endDate = new Date();

        if (cartItem.product.interval === 'month') {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (cartItem.product.interval === 'year') {
          endDate.setFullYear(endDate.getFullYear() + 1);
        }

        // Create subscription
        await prisma.subscription.create({
          data: {
            userId: payment.userId,
            productId: cartItem.productId,
            status: 'active',
            startDate,
            endDate,
            nextPaymentDate:
              cartItem.product.interval === 'month'
                ? new Date(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate())
                : new Date(endDate.getFullYear() + 1, endDate.getMonth(), endDate.getDate()),
          },
        });
      }
    }

    // Clear the user's cart after successful payment
    await prisma.cartItem.deleteMany({
      where: { userId: payment.userId },
    });

    // Send Telegram notification about payment confirmation
    // try {
    //   // Get product names for notification
    //   const productNames = cartItemsData.map((item: any) => {
    //     // We would normally fetch product names, but for now we'll use placeholder
    //     return "Product Name"; // In real implementation, fetch actual product names
    //   }).join(', ');

    //   await sendTelegramNotification(
    //     `✅ Payment confirmed\n\n` +
    //     `💵 Amount: ${payment.amount / 100} ${payment.currency}\n` +
    //     `🔗 TX Hash: ${txHash}\n` +
    //     `👤 User: ${payment.user.name}\n` +
    //     `🎁 Products: ${productNames}`
    //   );
    // } catch (notificationError) {
    //   console.error('Failed to send Telegram notification:', notificationError);
    // }

    return res.status(200).json({
      payment: {
        id: payment.id,
        status: payment.status,
        txHash: payment.txHash,
      },
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCardPayment = async (req: Request, res: Response) => {
  // Card payments are not implemented yet
  return res.status(501).json({
    error: 'Not implemented',
    message: 'Card payments will be available soon',
    availableMethods: ['crypto_usdt_trc20', 'crypto_usdt_erc20', 'crypto_ton'],
  });
};
