import { PrismaClient } from '@prisma/client';

// Create Prisma client for tests using test database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://airbro:airbro_dev@localhost:5432/airbro_test',
    },
  },
});

export default prisma;
