import { Request, Response } from 'express';
import { CartItemAdd } from '../models/cart';
import prisma from '../config/database';

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
          },
        },
      },
    });

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return res.status(200).json({
      items: cartItems.map((item) => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
      })),
      total,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId, quantity = 1 }: CartItemAdd = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.isActive) {
      return res.status(400).json({ error: 'Product is not available' });
    }

    // Check if item already in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingCartItem) {
      return res.status(409).json({ error: 'Product already in cart' });
    }

    // Add item to cart
    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });

    return res.status(200).json({ cartItem });
  } catch (error) {
    console.error('Add to cart error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { itemId } = req.params;

    // Verify that the item belongs to the user
    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId,
      },
    });

    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    return res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
