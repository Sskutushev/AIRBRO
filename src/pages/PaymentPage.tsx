import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { 
  createPaymentIntent, 
  confirmPayment, 
  createTelegramPayment,
  PaymentResult
} from '../services/paymentService';
import { Link, useNavigate } from 'react-router-dom';

const PaymentPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'telegram'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('pro'); // Default to Pro plan
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const { user } = useAuth();
  const { subscriptionPlans, subscribeToPlan } = useSubscription();
  const navigate = useNavigate();

  // Find the selected plan
  const plan = subscriptionPlans.find(p => p.id === selectedPlan);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !plan) return;

    setIsProcessing(true);
    setPaymentResult(null);

    try {
      if (paymentMethod === 'card') {
        // Create payment intent
        const paymentIntentResult = await createPaymentIntent(
          plan.price, 
          'RUB', 
          'card'
        );

        if (paymentIntentResult.success && paymentIntentResult.paymentIntent) {
          // Confirm payment (in a real app, this would involve actual payment processing)
          const confirmResult = await confirmPayment(
            paymentIntentResult.paymentIntent.id, 
            'card'
          );

          if (confirmResult.success) {
            // Subscribe user to the plan
            await subscribeToPlan(plan.id, 'card');
            setPaymentResult(confirmResult);
          } else {
            setPaymentResult(confirmResult);
          }
        }
      } else if (paymentMethod === 'telegram' && plan) {
        // Create Telegram payment
        const telegramPaymentResult = await createTelegramPayment(
          plan.price,
          `Подписка ${plan.name} для ${user.email}`
        );

        if (telegramPaymentResult.success) {
          setPaymentResult(telegramPaymentResult);
          // For Telegram payments, we redirect to the bot
          if (telegramPaymentResult.redirectUrl) {
            window.location.href = telegramPaymentResult.redirectUrl;
          }
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentResult({
        success: false,
        error: 'Произошла ошибка при обработке платежа. Пожалуйста, попробуйте снова.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-secondary py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Доступ запрещен</h1>
          <p className="text-text-secondary mb-8">Пожалуйста, войдите в свой аккаунт для оформления подписки</p>
          <Link 
            to="/auth" 
            className="inline-block bg-gradient-to-r from-primary-electric to-primary-violet text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Войти в аккаунт
          </Link>
        </div>
      </div>
    );
  }

  if (paymentResult) {
    return (
      <div className="min-h-screen bg-bg-secondary py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary-electric to-primary-violet p-6 text-white">
                <h1 className="text-3xl font-bold">Оплата подписки</h1>
              </div>
              
              <div className="p-8 text-center">
                {paymentResult.success ? (
                  <>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">Платеж успешно обработан!</h2>
                    <p className="text-text-secondary mb-8">
                      {paymentMethod === 'telegram' 
                        ? 'Пожалуйста, завершите оплату в Telegram-боте.' 
                        : 'Ваша подписка активирована. Добро пожаловать в AIRBRO Business!'}
                    </p>
                    <div className="space-y-4">
                      <Link 
                        to="/account" 
                        className="inline-block w-full py-3 bg-gradient-to-r from-primary-electric to-primary-violet text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Перейти в личный кабинет
                      </Link>
                      <Link 
                        to="/" 
                        className="inline-block w-full py-3 border border-gray-300 text-text-primary font-bold rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        На главную
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">Ошибка оплаты</h2>
                    <p className="text-text-secondary mb-8">
                      {paymentResult.error || 'Произошла ошибка при обработке платежа. Пожалуйста, попробуйте снова.'}
                    </p>
                    <button
                      onClick={() => setPaymentResult(null)}
                      className="inline-block w-full py-3 bg-gradient-to-r from-primary-electric to-primary-violet text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Попробовать снова
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary-electric to-primary-violet p-6 text-white">
              <div className="flex items-center">
                <Link to="/account" className="mr-4">
                  <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold">Оформление подписки</h1>
                  <p className="text-white/80">Безопасная оплата через защищенное соединение</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
              {/* Product Info */}
              <div className="lg:col-span-1">
                <div className="bg-bg-primary rounded-xl p-6">
                  <h2 className="text-xl font-bold text-text-primary mb-4">Выбранный план</h2>
                  <div className="space-y-4">
                    {plan && (
                      <>
                        <div>
                          <span className="text-text-secondary block">Тариф</span>
                          <span className="font-bold text-lg">{plan.name}</span>
                        </div>
                        <div>
                          <span className="text-text-secondary block">Описание</span>
                          <span>{plan.description}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-text-primary">Итого</span>
                            <span className="font-bold text-2xl text-primary-coral">{plan.price.toLocaleString()} ₽</span>
                          </div>
                          <p className="text-text-secondary text-sm mt-1">ежемесячно</p>
                        </div>
                        <div className="mt-4">
                          <span className="text-text-secondary block font-medium mb-2">Функции:</span>
                          <ul className="space-y-2">
                            {plan.features.slice(0, 5).map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                <span className="text-text-secondary text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="text-sm">72-часовой пробный период</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="text-sm">Отмена в любое время</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="text-sm">Гарантия возврата средств</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Form */}
              <div className="lg:col-span-2">
                <div className="bg-white">
                  <div className="border-b border-gray-200 mb-6">
                    <div className="flex">
                      <button
                        className={`py-3 px-6 font-medium flex items-center ${
                          paymentMethod === 'card'
                            ? 'text-primary-electric border-b-2 border-primary-electric'
                            : 'text-text-secondary'
                        }`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Банковская карта
                      </button>
                      <button
                        className={`py-3 px-6 font-medium flex items-center ${
                          paymentMethod === 'telegram'
                            ? 'text-primary-electric border-b-2 border-primary-electric'
                            : 'text-text-secondary'
                        }`}
                        onClick={() => setPaymentMethod('telegram')}
                      >
                        <Smartphone className="w-4 h-4 mr-2" />
                        Telegram Pay
                      </button>
                    </div>
                  </div>
                  
                  {paymentMethod === 'card' ? (
                    <form onSubmit={handlePayment} className="space-y-6">
                      <div>
                        <label className="block text-text-secondary font-medium mb-2">
                          Номер карты
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-electric focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-text-secondary font-medium mb-2">
                            Срок действия
                          </label>
                          <input
                            type="text"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-electric focus:border-transparent"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-text-secondary font-medium mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-electric focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-text-secondary font-medium mb-2">
                          Имя на карте
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Иван Иванов"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-electric focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="save-card"
                          defaultChecked
                          className="w-5 h-5 text-primary-electric rounded focus:ring-primary-electric"
                        />
                        <label htmlFor="save-card" className="ml-2 text-text-secondary">
                          Сохранить данные карты для следующих платежей
                        </label>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-4 bg-gradient-to-r from-primary-electric to-primary-violet text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70"
                      >
                        {isProcessing ? 'Обработка...' : `Оплатить ${plan ? plan.price.toLocaleString() : '0'} ₽`}
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-bg-primary rounded-xl p-6 text-center">
                        <div className="w-16 h-16 bg-primary-electric/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Smartphone className="w-8 h-8 text-primary-electric" />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">Оплата через Telegram</h3>
                        <p className="text-text-secondary mb-6">
                          Для оплаты подписки перейдите в нашего Telegram-бота и следуйте инструкциям
                        </p>
                        <button
                          onClick={handlePayment}
                          disabled={isProcessing}
                          className="inline-flex items-center py-3 px-6 bg-gradient-to-r from-primary-electric to-primary-violet text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70"
                        >
                          {isProcessing ? 'Обработка...' : (
                            <>
                              <Smartphone className="w-5 h-5 mr-2" />
                              Перейти к оплате
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-center">
                    <div className="flex items-center text-green-600">
                      <Shield className="w-5 h-5 mr-2" />
                      <span className="text-sm">Платеж защищен 256-bit SSL шифрованием</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPage;