import { Request, Response } from 'express';
import prisma from '../config/database';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        telegram: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, telegram } = req.body;

    // Check if new telegram is already taken by another user
    if (telegram) {
      const existingUser = await prisma.user.findFirst({
        where: {
          telegram,
          id: { not: userId }  // Exclude current user
        }
      });

      if (existingUser) {
        return res.status(409).json({ error: 'Telegram username already taken' });
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(telegram && { telegram })
      },
      select: {
        id: true,
        email: true,
        name: true,
        telegram: true,
        createdAt: true
      }
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSubscriptions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            name: true,
            description: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      subscriptions: subscriptions.map(sub => ({
        id: sub.id,
        product: {
          name: sub.product.name,
          description: sub.product.description
        },
        status: sub.status,
        startDate: sub.startDate,
        endDate: sub.endDate,
        nextPaymentDate: sub.nextPaymentDate
      }))
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      payments: payments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        createdAt: payment.createdAt
      }))
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    // Verify that the subscription belongs to the user
    const subscription = await prisma.subscription.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: 'cancelled',
        cancelledAt: new Date()
      }
    });

    res.status(200).json({
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        cancelledAt: updatedSubscription.cancelledAt
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};