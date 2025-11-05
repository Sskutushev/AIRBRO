import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Shield, CheckCircle } from 'lucide-react';

const PaymentPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'telegram'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика обработки платежа
    console.log('Payment info:', { cardNumber, expiry, cvv, name });
  };

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
              <h1 className="text-3xl font-bold">Оформление подписки</h1>
              <p className="text-white/80">Безопасная оплата через защищенное соединение</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
              {/* Product Info */}
              <div className="lg:col-span-1">
                <div className="bg-bg-primary rounded-xl p-6">
                  <h2 className="text-xl font-bold text-text-primary mb-4">Ваш заказ</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">AI PostMaster Pro</span>
                      <span className="font-bold">5,000 ₽</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Conversation Bot</span>
                      <span className="font-bold">2,000 ₽</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-text-primary">Итого</span>
                        <span className="font-bold text-2xl text-primary-coral">7,000 ₽</span>
                      </div>
                      <p className="text-text-secondary text-sm mt-1">ежемесячно</p>
                    </div>
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
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="save-card"
                          className="w-5 h-5 text-primary-electric rounded focus:ring-primary-electric"
                        />
                        <label htmlFor="save-card" className="ml-2 text-text-secondary">
                          Сохранить данные карты для следующих платежей
                        </label>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-primary-electric to-primary-violet text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Оплатить 7,000 ₽
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
                          Для оплаты подписки перейдите в наш Telegram-бот и следуйте инструкциям
                        </p>
                        <a
                          href="https://t.me/airbro_business_bot"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center py-3 px-6 bg-gradient-to-r from-primary-electric to-primary-violet text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <Smartphone className="w-5 h-5 mr-2" />
                          Перейти в Telegram
                        </a>
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