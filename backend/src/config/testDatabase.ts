import { PrismaClient } from '@prisma/client';

// Set test environment variables if not already set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://airbro:airbro_dev@localhost:5432/airbro_test';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
}

// Create Prisma client for tests using test database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export default prisma;
