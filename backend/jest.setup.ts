// jest.setup.ts
// This file can be used for global test setup, e.g., mocking Prisma client.

// Set environment variables for testing
process.env.JWT_SECRET = 'supersecretjwtkeyfor_testing_only_12345';
process.env.NODE_ENV = 'test';

// Mock PrismaClient to prevent actual database interactions during tests
jest.mock('@/config/database', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    product: {
      findUnique: jest.fn(), // Added for cartController
      findMany: jest.fn(),
    },
    cartItem: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(), // Added for cartController
      deleteMany: jest.fn(), // Added for cartController
    },
    payment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    subscription: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    // Add other models as needed
  },
}));
