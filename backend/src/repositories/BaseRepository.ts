import { PrismaClient } from '@prisma/client';

/**
 * Base repository interface defining common CRUD operations
 */
export interface BaseRepository<T, CreateData, UpdateData> {
  /**
   * Find all records
   */
  findAll(): Promise<T[]>;

  /**
   * Find record by ID
   */
  findById(id: string): Promise<T | null>;

  /**
   * Create a new record
   */
  create(data: CreateData): Promise<T>;

  /**
   * Update an existing record
   */
  update(id: string, data: UpdateData): Promise<T>;

  /**
   * Delete a record by ID
   */
  delete(id: string): Promise<T>;

  /**
   * Check if a record exists by ID
   */
  exists(id: string): Promise<boolean>;
}

/**
 * Base repository implementation with Prisma
 */
export abstract class BaseRepositoryImpl<T, CreateData, UpdateData>
  implements BaseRepository<T, CreateData, UpdateData>
{
  protected prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  abstract findAll(): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract create(data: CreateData): Promise<T>;
  abstract update(id: string, data: UpdateData): Promise<T>;
  abstract delete(id: string): Promise<T>;
  abstract exists(id: string): Promise<boolean>;
}
