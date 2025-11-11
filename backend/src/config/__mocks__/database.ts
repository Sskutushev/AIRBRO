import { vi } from 'vitest';

const prisma = {
  user: {
    findFirst: vi.fn(),
    create: vi.fn(),
    findUnique: vi.fn(),
  },
  cartItem: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    findFirst: vi.fn(),
  },
  product: {
    findUnique: vi.fn(),
  },
  payment: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  subscription: {
    create: vi.fn(),
  },
};

export default prisma;
