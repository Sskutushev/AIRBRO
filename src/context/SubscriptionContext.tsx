import React, {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useAuth } from '../context/AuthContext';
import {
  type UserSubscription,
  type SubscriptionPlan,
  getUserSubscription,
  createSubscription,
  cancelSubscription,
  updateSubscription,
  subscriptionPlans,
} from '../services/subscriptionService';
import { type PaymentMethod, getSavedPaymentMethods } from '../services/paymentService';

interface SubscriptionContextType {
  userSubscription: UserSubscription | null;
  subscriptionPlans: SubscriptionPlan[];
  paymentMethods: PaymentMethod[];
  loading: boolean;
  fetchUserSubscription: () => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  subscribeToPlan: (planId: string) => Promise<UserSubscription>;
  cancelCurrentSubscription: () => Promise<UserSubscription>;
  updateCurrentSubscription: (newPlanId: string) => Promise<UserSubscription>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Загружаем подписку пользователя при изменении user
  useEffect(() => {
    if (user) {
      fetchUserSubscription();
      fetchPaymentMethods();
    } else {
      // Если пользователь не авторизован, сбрасываем данные
      setUserSubscription(null);
      setPaymentMethods([]);
      setLoading(false);
    }
  }, [user, fetchUserSubscription, fetchPaymentMethods]);

  const fetchUserSubscription = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const subscription = await getUserSubscription(user.id);
      setUserSubscription(subscription);
    } catch (error) {
      console.error('Error fetching user subscription:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchPaymentMethods = useCallback(async () => {
    if (!user) return;

    try {
      const methods = await getSavedPaymentMethods(user.id);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  }, [user]);

  const subscribeToPlan = useCallback(
    async (planId: string): Promise<UserSubscription> => {
      if (!user) throw new Error('User not authenticated');

      try {
        const subscription = await createSubscription(user.id, planId);
        setUserSubscription(subscription);
        return subscription;
      } catch (error) {
        console.error('Error subscribing to plan:', error);
        throw error;
      }
    },
    [user]
  );

  const cancelCurrentSubscription = useCallback(async (): Promise<UserSubscription> => {
    if (!userSubscription?.id) throw new Error('No active subscription');

    try {
      const cancelledSub = await cancelSubscription(userSubscription.id);
      setUserSubscription(cancelledSub);
      return cancelledSub;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }, [userSubscription?.id]);

  const updateCurrentSubscription = useCallback(
    async (newPlanId: string): Promise<UserSubscription> => {
      if (!userSubscription?.id) throw new Error('No active subscription');

      try {
        const updatedSub = await updateSubscription(userSubscription.id, newPlanId);
        setUserSubscription(updatedSub);
        return updatedSub;
      } catch (error) {
        console.error('Error updating subscription:', error);
        throw error;
      }
    },
    [userSubscription?.id]
  );

  const value = {
    userSubscription,
    subscriptionPlans,
    paymentMethods,
    loading,
    fetchUserSubscription,
    fetchPaymentMethods,
    subscribeToPlan,
    cancelCurrentSubscription,
    updateCurrentSubscription,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
