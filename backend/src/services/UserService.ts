import { User, Prisma } from '@prisma/client';
import { UserRepositoryImpl } from '../repositories';

export interface UserService {
  findUserById(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserByTelegram(telegram: string): Promise<User | null>;
  createUser(userData: Prisma.UserCreateInput): Promise<User>;
  updateUser(id: string, userData: Prisma.UserUpdateInput): Promise<User>;
  deleteUser(id: string): Promise<User>;
}

export class UserServiceImpl implements UserService {
  private userRepository: UserRepositoryImpl;

  constructor() {
    this.userRepository = new UserRepositoryImpl();
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findUserByTelegram(telegram: string): Promise<User | null> {
    return this.userRepository.findByTelegram(telegram);
  }

  async createUser(userData: Prisma.UserCreateInput): Promise<User> {
    return this.userRepository.create(userData);
  }

  async updateUser(id: string, userData: Prisma.UserUpdateInput): Promise<User> {
    return this.userRepository.update(id, userData);
  }

  async deleteUser(id: string): Promise<User> {
    return this.userRepository.delete(id);
  }
}
