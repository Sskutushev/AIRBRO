// services/subscriptionService.ts

// Types for subscriptions
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number; // price in rubles
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

// Available subscription plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For starting entrepreneurs',
    price: 990,
    interval: 'month',
    features: [
      'AI PostMaster',
      '1 Telegram channel',
      '30 posts/month',
      'Basic personalization',
      'Standard support',
    ],
    productId: 'ai_postmaster',
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For growing business',
    price: 2490,
    interval: 'month',
    features: [
      'AI PostMaster',
      'Conversation Bot',
      '3 Telegram channels',
      'Unlimited posts',
      'Advanced personalization',
      'Priority support',
    ],
    productId: 'ai_postmaster_conversation',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For established business',
    price: 4990,
    interval: 'month',
    features: [
      'All Business features',
      'Booking Bot',
      'Feedback Bot',
      '5 Telegram channels',
      'Advanced analytics',
      'White-label options',
      'Personal manager',
    ],
    productId: 'full_suite',
  },
];

// Mock function to get user subscription
export const getUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
  // In a real application this call would be to the API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check if user has an active subscription
      const storedSub = localStorage.getItem(`user_${userId}_subscription`);
      if (storedSub) {
        resolve(JSON.parse(storedSub));
      } else {
        resolve(null);
      }
    }, 500);
  });
};

// Mock function to create subscription
export const createSubscription = async (
  userId: string,
  planId: string
): Promise<UserSubscription> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const plan = subscriptionPlans.find((p) => p.id === planId);
      if (!plan) {
        reject(new Error('Subscription plan not found'));
        return;
      }

      // Calculate dates
      const startDate = new Date().toISOString();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // Subscription for 1 month

      const newSubscription: UserSubscription = {
        id: `sub_${Date.now()}`,
        userId,
        planId,
        startDate,
        endDate: endDate.toISOString(),
        status: 'active',
        nextPaymentDate: endDate.toISOString(),
        amount: plan.price,
      };

      // Save to localStorage
      localStorage.setItem(`user_${userId}_subscription`, JSON.stringify(newSubscription));

      resolve(newSubscription);
    }, 1000);
  });
};

// Mock function to cancel subscription
export const cancelSubscription = async (subscriptionId: string): Promise<UserSubscription> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In a real application this would be an API call
      // Get current subscription
      const storedSub = localStorage.getItem(`subscription_${subscriptionId}`);
      if (!storedSub) {
        reject(new Error('Subscription not found'));
        return;
      }

      const subscription: UserSubscription = JSON.parse(storedSub);
      // Just change status to cancelled
      const cancelledSubscription: UserSubscription = {
        ...subscription,
        status: 'cancelled',
      };

      // Update in localStorage
      localStorage.setItem(`subscription_${subscriptionId}`, JSON.stringify(cancelledSubscription));

      resolve(cancelledSubscription);
    }, 500);
  });
};

// Mock function to update subscription
export const updateSubscription = async (
  subscriptionId: string,
  newPlanId: string
): Promise<UserSubscription> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const plan = subscriptionPlans.find((p) => p.id === newPlanId);
      if (!plan) {
        reject(new Error('Subscription plan not found'));
        return;
      }

      // In a real application this would be an API call
      // Get current subscription
      const storedSub = localStorage.getItem(`subscription_${subscriptionId}`);
      if (!storedSub) {
        reject(new Error('Subscription not found'));
        return;
      }

      const currentSub: UserSubscription = JSON.parse(storedSub);
      // Update plan
      const updatedSubscription = {
        ...currentSub,
        planId: newPlanId,
        amount: plan.price,
      };

      // Update in localStorage
      localStorage.setItem(`subscription_${subscriptionId}`, JSON.stringify(updatedSubscription));

      resolve(updatedSubscription);
    }, 500);
  });
};

// Mock function to get payment history
export const getPaymentHistory = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real application this call would be to the API
      const history = [
        {
          id: 'pay_1',
          date: '2025-10-05',
          amount: 2490,
          plan: 'Business',
          status: 'completed',
          method: 'card',
        },
        {
          id: 'pay_2',
          date: '2025-09-05',
          amount: 2490,
          plan: 'Business',
          status: 'completed',
          method: 'card',
        },
        {
          id: 'pay_3',
          date: '2025-08-05',
          amount: 990,
          plan: 'Starter',
          status: 'completed',
          method: 'card',
        },
      ];
      resolve(history);
    }, 300);
  });
};
