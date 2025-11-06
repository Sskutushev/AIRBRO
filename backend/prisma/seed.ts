import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create products if they don't exist
  const products = [
    {
      slug: "ai-postmaster-starter",
      name: "AI PostMaster Starter",
      description: "1 канал, 30 постов/месяц",
      price: 300000, // 3000 рублей в копейках
      interval: "month",
      tier: 1,
      features: JSON.stringify([
        "1 Telegram канал",
        "30 постов в месяц",
        "Базовая персонализация",
        "Email поддержка"
      ])
    },
    {
      slug: "ai-postmaster-pro",
      name: "AI PostMaster Pro",
      description: "1 канал, неограниченные посты",
      price: 500000,
      interval: "month",
      tier: 1,
      features: JSON.stringify([
        "1 Telegram канал",
        "Неограниченные посты",
        "Продвинутая персонализация",
        "Аналитика",
        "Приоритетная поддержка"
      ])
    },
    {
      slug: "ai-automator-starter",
      name: "AI Automator Starter",
      description: "Базовые инструменты автоматизации",
      price: 150000,
      interval: "month",
      tier: 2,
      features: JSON.stringify([
        "5 автоматизированных процессов",
        "Базовая интеграция с CRM",
        "Email уведомления",
        "Стандартная поддержка"
      ])
    },
    {
      slug: "ai-automator-pro",
      name: "AI Automator Pro",
      description: "Продвинутые инструменты автоматизации",
      price: 800000,
      interval: "month",
      tier: 2,
      features: JSON.stringify([
        "Неограниченные автоматизированные процессы",
        "Продвинутая интеграция с CRM",
        "SMS и Telegram уведомления",
        "Приоритетная поддержка",
        "Индивидуальные настройки"
      ])
    },
    {
      slug: "ai-analyst-starter",
      name: "AI Analyst Starter",
      description: "Базовая аналитика бизнеса",
      price: 250000,
      interval: "month",
      tier: 3,
      features: JSON.stringify([
        "Базовая аналитика",
        "Еженедельные отчеты",
        "Стандартные метрики",
        "Email поддержка"
      ])
    },
    {
      slug: "ai-analyst-pro",
      name: "AI Analyst Pro",
      description: "Продвинутая аналитика бизнеса",
      price: 1200000,
      interval: "month",
      tier: 3,
      features: JSON.stringify([
        "Продвинутая аналитика",
        "Ежедневные отчеты",
        "Персонализированные метрики",
        "Прогнозирование",
        "Круглосуточная поддержка",
        "Интеграция с любыми системами"
      ])
    }
  ];

  for (const product of products) {
    const existingProduct = await prisma.product.findUnique({
      where: { slug: product.slug }
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: product
      });
      console.log(`Created product: ${product.name}`);
    } else {
      console.log(`Product already exists: ${product.name}`);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });