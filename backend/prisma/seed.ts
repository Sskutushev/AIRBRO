import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create products if they don't exist
  const products = [
    {
      slug: 'ai-postmaster-starter',
      name: 'AI PostMaster Starter',
      description: '1 channel, 30 posts/month',
      price: 300000, // 3000 rubles in kopecks
      interval: 'month',
      tier: 1,
      features: JSON.stringify([
        '1 Telegram channel',
        '30 posts per month',
        'Basic personalization',
        'Email support',
      ]),
    },
    {
      slug: 'ai-postmaster-pro',
      name: 'AI PostMaster Pro',
      description: '1 channel, unlimited posts',
      price: 500000,
      interval: 'month',
      tier: 1,
      features: JSON.stringify([
        '1 Telegram channel',
        'Unlimited posts',
        'Advanced personalization',
        'Analytics',
        'Priority support',
      ]),
    },
    {
      slug: 'ai-automator-starter',
      name: 'AI Automator Starter',
      description: 'Basic automation tools',
      price: 150000,
      interval: 'month',
      tier: 2,
      features: JSON.stringify([
        '5 automated processes',
        'Basic CRM integration',
        'Email notifications',
        'Standard support',
      ]),
    },
    {
      slug: 'ai-automator-pro',
      name: 'AI Automator Pro',
      description: 'Advanced automation tools',
      price: 800000,
      interval: 'month',
      tier: 2,
      features: JSON.stringify([
        'Unlimited automated processes',
        'Advanced CRM integration',
        'SMS and Telegram notifications',
        'Priority support',
        'Custom settings',
      ]),
    },
    {
      slug: 'ai-analyst-starter',
      name: 'AI Analyst Starter',
      description: 'Basic business analytics',
      price: 250000,
      interval: 'month',
      tier: 3,
      features: JSON.stringify([
        'Basic analytics',
        'Weekly reports',
        'Standard metrics',
        'Email support',
      ]),
    },
    {
      slug: 'ai-analyst-pro',
      name: 'AI Analyst Pro',
      description: 'Advanced business analytics',
      price: 1200000,
      interval: 'month',
      tier: 3,
      features: JSON.stringify([
        'Advanced analytics',
        'Daily reports',
        'Personalized metrics',
        'Forecasting',
        '24/7 support',
        'Integration with any systems',
      ]),
    },
  ];

  for (const product of products) {
    const existingProduct = await prisma.product.findUnique({
      where: { slug: product.slug },
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: product,
      });
      console.log(`Created product: ${product.name}`);
    } else {
      console.log(`Product already exists: ${product.name}`);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
