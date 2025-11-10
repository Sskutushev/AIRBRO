import { Request, Response } from 'express';
import prisma from '../config/database';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { tier, isActive } = req.query;

    const whereClause: any = {};

    if (tier !== undefined) {
      whereClause.tier = Number(tier);
    }

    if (isActive !== undefined) {
      whereClause.isActive = isActive === 'true';
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        price: true,
        interval: true,
        features: true,
        tier: true,
      },
    });

    // Parse features JSON
    const parsedProducts = products.map((product) => ({
      ...product,
      features: JSON.parse(product.features) as string[],
    }));

    return res.status(200).json({ products: parsedProducts });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        price: true,
        interval: true,
        features: true,
        tier: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json({
      ...product,
      features: JSON.parse(product.features) as string[],
    });
  } catch (error) {
    console.error('Get product by slug error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
