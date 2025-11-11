import { Product, Prisma } from '@prisma/client';
import { ProductRepositoryImpl } from '../repositories';

export interface ProductService {
  findProductById(id: string): Promise<Product | null>;
  findProductBySlug(slug: string): Promise<Product | null>;
  findAllProducts(): Promise<Product[]>;
  findActiveProducts(): Promise<Product[]>;
  findProductsByTier(tier: number): Promise<Product[]>;
  createProduct(productData: Prisma.ProductCreateInput): Promise<Product>;
  updateProduct(id: string, productData: Prisma.ProductUpdateInput): Promise<Product>;
  deleteProduct(id: string): Promise<Product>;
}

export class ProductServiceImpl implements ProductService {
  private productRepository: ProductRepositoryImpl;

  constructor() {
    this.productRepository = new ProductRepositoryImpl();
  }

  async findProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async findProductBySlug(slug: string): Promise<Product | null> {
    return this.productRepository.findBySlug(slug);
  }

  async findAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async findActiveProducts(): Promise<Product[]> {
    return this.productRepository.findActiveProducts();
  }

  async findProductsByTier(tier: number): Promise<Product[]> {
    return this.productRepository.findProductsByTier(tier);
  }

  async createProduct(productData: Prisma.ProductCreateInput): Promise<Product> {
    return this.productRepository.create(productData);
  }

  async updateProduct(id: string, productData: Prisma.ProductUpdateInput): Promise<Product> {
    return this.productRepository.update(id, productData);
  }

  async deleteProduct(id: string): Promise<Product> {
    return this.productRepository.delete(id);
  }
}
