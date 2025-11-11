// services/paymentService.ts

export interface PaymentMethod {
  id: string;
  type: 'card' | 'telegram' | 'yookassa' | 'stripe';
  last4?: string;
  brand?: string;
  expiry?: string;
  isDefault: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'created' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  paymentMethod?: string;
  created: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntent?: PaymentIntent;
  error?: string;
  redirectUrl?: string;
}

export const getSavedPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const methods = localStorage.getItem(`user_${userId}_payment_methods`);
      if (methods) {
        resolve(JSON.parse(methods));
      } else {
        // Return a stub
        resolve([
          {
            id: 'card_1',
            type: 'card',
            last4: '4242',
            brand: 'Visa',
            expiry: '12/26',
            isDefault: true,
          },
        ]);
      }
    }, 300);
  });
};

export const addPaymentMethod = async (
  userId: string,
  paymentMethod: Omit<PaymentMethod, 'id'>
): Promise<PaymentMethod> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMethod = {
        ...paymentMethod,
        id: `card_${Date.now()}`,
      };

      // Get existing methods
      const methods = localStorage.getItem(`user_${userId}_payment_methods`);
      let paymentMethods: PaymentMethod[] = methods ? JSON.parse(methods) : [];

      // Add new method
      paymentMethods = [...paymentMethods, newMethod];

      // Save back
      localStorage.setItem(`user_${userId}_payment_methods`, JSON.stringify(paymentMethods));

      resolve(newMethod);
    }, 500);
  });
};

export const createPaymentIntent = async (
  amount: number,
  currency: string = 'RUB',
  paymentMethod: string
): Promise<PaymentResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful payment creation
      const paymentIntent: PaymentIntent = {
        id: `pi_${Date.now()}`,
        amount,
        currency,
        status: 'processing',
        paymentMethod,
        created: new Date().toISOString(),
      };

      // Return successful result
      resolve({
        success: true,
        paymentIntent,
      });
    }, 1000);
  });
};

export const confirmPayment = async (
  paymentIntentId: string,
  paymentMethod: string
): Promise<PaymentResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate payment confirmation result
      if (Math.random() > 0.1) {
        // 90% successful payments
        const updatedPayment: PaymentIntent = {
          id: paymentIntentId,
          amount: 5000, // In a real application, get from database
          currency: 'RUB',
          status: 'succeeded',
          paymentMethod,
          created: new Date().toISOString(),
        };

        resolve({
          success: true,
          paymentIntent: updatedPayment,
        });
      } else {
        reject({
          success: false,
          error: 'Payment failed. Please check card details.',
        });
      }
    }, 1500);
  });
};

export const createTelegramPayment = async (amount: number): Promise<PaymentResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        redirectUrl: `https://t.me/airbro_business_bot?start=pay_${amount}`,
        paymentIntent: {
          id: `tg_${Date.now()}`,
          amount,
          currency: 'RUB',
          status: 'created',
          created: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const getPaymentStatus = async (paymentIntentId: string): Promise<PaymentIntent> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real application this would be an API request
      const status: PaymentIntent = {
        id: paymentIntentId,
        amount: 5000,
        currency: 'RUB',
        status: 'succeeded',
        created: new Date().toISOString(),
      };

      resolve(status);
    }, 500);
  });
};
