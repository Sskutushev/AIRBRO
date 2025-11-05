// services/subscriptionService.ts

// Типы для подписок
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number; // цена в рублях
  interval: 'month' | 'year';
  features: string[];
  productId: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'trial' | 'cancelled';
  nextPaymentDate?: string;
  amount: number;
}

// Доступные планы подписок
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Для начинающих предпринимателей',
    price: 3000,
    interval: 'month',
    features: [
      'AI PostMaster',
      '1 Telegram-канал',
      '30 постов/месяц',
      'Базовая персонализация',
      'Стандартная поддержка'
    ],
    productId: 'ai_postmaster'
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Для растущего бизнеса',
    price: 5000,
    interval: 'month',
    features: [
      'AI PostMaster',
      'Conversation Bot',
      '3 Telegram-канала',
      'Неограниченные посты',
      'Продвинутая персонализация',
      'Приоритетная поддержка'
    ],
    productId: 'ai_postmaster_conversation'
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Для развитого бизнеса',
    price: 8000,
    interval: 'month',
    features: [
      'Все функции Pro',
      'Booking Bot',
      'Feedback Bot',
      '5 Telegram-каналов',
      'Продвинутая аналитика',
      'White-label опции',
      'Персональный менеджер'
    ],
    productId: 'full_suite'
  }
];

// Моковая функция для получения подписки пользователя
export const getUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
  // В реальном приложении этот вызов будет к API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Проверяем, есть ли у пользователя активная подписка
      const storedSub = localStorage.getItem(`user_${userId}_subscription`);
      if (storedSub) {
        resolve(JSON.parse(storedSub));
      } else {
        resolve(null);
      }
    }, 500);
  });
};

// Моковая функция для оформления подписки
export const createSubscription = async (userId: string, planId: string): Promise<UserSubscription> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const plan = subscriptionPlans.find(p => p.id === planId);
      if (!plan) {
        reject(new Error('План подписки не найден'));
        return;
      }

      // Рассчитываем даты
      const startDate = new Date().toISOString();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // Подписка на 1 месяц
      
      const newSubscription: UserSubscription = {
        id: `sub_${Date.now()}`,
        userId,
        planId,
        startDate,
        endDate: endDate.toISOString(),
        status: 'active',
        nextPaymentDate: endDate.toISOString(),
        amount: plan.price
      };

      // Сохраняем в localStorage
      localStorage.setItem(`user_${userId}_subscription`, JSON.stringify(newSubscription));

      resolve(newSubscription);
    }, 1000);
  });
};

// Моковая функция для отмены подписки
export const cancelSubscription = async (subscriptionId: string): Promise<UserSubscription> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // В реальном приложении это будет вызов API
      // Получаем текущую подписку
      const storedSub = localStorage.getItem(`subscription_${subscriptionId}`);
      if (!storedSub) {
        reject(new Error('Подписка не найдена'));
        return;
      }

      const subscription: UserSubscription = JSON.parse(storedSub);
      // Просто меняем статус на cancelled
      const cancelledSubscription = {
        ...subscription,
        status: 'cancelled'
      };

      // Обновляем в localStorage
      localStorage.setItem(`subscription_${subscriptionId}`, JSON.stringify(cancelledSubscription));

      resolve(cancelledSubscription);
    }, 500);
  });
};

// Моковая функция для обновления подписки
export const updateSubscription = async (subscriptionId: string, newPlanId: string): Promise<UserSubscription> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const plan = subscriptionPlans.find(p => p.id === newPlanId);
      if (!plan) {
        reject(new Error('План подписки не найден'));
        return;
      }

      // В реальном приложении это будет вызов API
      // Получаем текущую подписку
      const storedSub = localStorage.getItem(`subscription_${subscriptionId}`);
      if (!storedSub) {
        reject(new Error('Подписка не найдена'));
        return;
      }

      const currentSub: UserSubscription = JSON.parse(storedSub);
      // Обновляем план
      const updatedSubscription = {
        ...currentSub,
        planId: newPlanId,
        amount: plan.price
      };

      // Обновляем в localStorage
      localStorage.setItem(`subscription_${subscriptionId}`, JSON.stringify(updatedSubscription));

      resolve(updatedSubscription);
    }, 500);
  });
};

// Моковая функция для получения истории платежей
export const getPaymentHistory = async (userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // В реальном приложении этот вызов будет к API
      const history = [
        {
          id: 'pay_1',
          date: '2025-10-05',
          amount: 5000,
          plan: 'Pro',
          status: 'completed',
          method: 'card'
        },
        {
          id: 'pay_2',
          date: '2025-09-05',
          amount: 5000,
          plan: 'Pro',
          status: 'completed',
          method: 'card'
        },
        {
          id: 'pay_3',
          date: '2025-08-05',
          amount: 3000,
          plan: 'Starter',
          status: 'completed',
          method: 'card'
        }
      ];
      resolve(history);
    }, 300);
  });
};