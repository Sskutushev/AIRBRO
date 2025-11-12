// src/tests/setup.ts
import { PrismaClient } from '@prisma/client';

// Set environment variables for testing (only if not already set)
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'supersecretjwtkeyfor_testing_only_12345';
}
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://airbro:airbro_dev@localhost:5432/airbro_test';
}

// Create Prisma client with test database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export async function clearDatabase() {
  // Clear all tables in correct order (respecting foreign keys)
  await prisma.cartItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
}

export async function closeDatabase() {
  await prisma.$disconnect();
}
