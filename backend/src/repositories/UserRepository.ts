import { User, Prisma } from '@prisma/client';
import { BaseRepositoryImpl } from './BaseRepository';
import prisma from '../config/database';

export interface UserRepository extends BaseRepository<User, CreateUserInput, UpdateUserInput> {
  findByEmail(email: string): Promise<User | null>;
  findByTelegram(telegram: string): Promise<User | null>;
}

export type CreateUserInput = Prisma.UserCreateInput;
export type UpdateUserInput = Prisma.UserUpdateInput;

export class UserRepositoryImpl
  extends BaseRepositoryImpl<User, CreateUserInput, UpdateUserInput>
  implements UserRepository
{
  constructor() {
    super(prisma);
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByTelegram(telegram: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { telegram },
    });
  }

  async create(data: CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user !== null;
  }
}
