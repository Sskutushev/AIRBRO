import { Product, Prisma } from '@prisma/client';
import { BaseRepositoryImpl } from './BaseRepository';
import prisma from '../config/database';

export interface ProductRepository
  extends BaseRepository<Product, CreateProductInput, UpdateProductInput> {
  findBySlug(slug: string): Promise<Product | null>;
  findActiveProducts(): Promise<Product[]>;
  findProductsByTier(tier: number): Promise<Product[]>;
}

export type CreateProductInput = Prisma.ProductCreateInput;
export type UpdateProductInput = Prisma.ProductUpdateInput;

export class ProductRepositoryImpl
  extends BaseRepositoryImpl<Product, CreateProductInput, UpdateProductInput>
  implements ProductRepository
{
  constructor() {
    super(prisma);
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { slug },
    });
  }

  async findActiveProducts(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { isActive: true },
    });
  }

  async findProductsByTier(tier: number): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { tier },
    });
  }

  async create(data: CreateProductInput): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async update(id: string, data: UpdateProductInput): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product !== null;
  }
}
