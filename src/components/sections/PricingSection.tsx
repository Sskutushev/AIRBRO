import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Users, MessageCircle, Calendar, Package } from 'lucide-react';

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: "AI PostMaster",
      price: "3,000 ₽/мес",
      description: "Ваш AI SMM-менеджер",
      icon: <MessageCircle className="w-6 h-6" />,
      features: [
        "1 Telegram-канал",
        "30 постов/месяц",
        "Базовая персонализация",
        "Тон бренда",
        "Планирование публикаций"
      ],
      cta: "Начать с контента",
      popular: false
    },
    {
      name: "Conversation Bot",
      price: "2,000 ₽/мес",
      description: "AI-сотрудник 24/7",
      icon: <MessageCircle className="w-6 h-6" />,
      features: [
        "500 разговоров/месяц",
        "FAQ-автоматизация",
        "Мультиязычность",
        "Аналитика разговоров",
        "Интеграция с базой знаний"
      ],
      cta: "Автоматизировать поддержку",
      popular: false
    },
    {
      name: "Booking Bot",
      price: "2,500 ₽/мес",
      description: "Менеджер по бронированиям",
      icon: <Calendar className="w-6 h-6" />,
      features: [
        "100 бронирований/месяц",
        "Календарь Google/Yandex",
        "Авто-напоминания",
        "Управление сотрудниками",
        "Интеграция с платежами"
      ],
      cta: "Упростить бронирование",
      popular: true
    }
  ];

  const verticalPackages = [
    {
      name: "Restaurant Suite",
      price: "9,900 ₽/мес",
      saving: "Экономия 14%",
      icon: <Package className="w-6 h-6" />,
      products: ["AI PostMaster", "Booking Bot", "Feedback Bot", "Video Inventory Agent"],
      description: "Полный комплект для ресторанов и кафе"
    },
    {
      name: "Beauty Suite", 
      price: "9,500 ₽/мес",
      saving: "Экономия 17%",
      icon: <Package className="w-6 h-6" />,
      products: ["AI PostMaster", "Booking Bot", "Feedback Bot", "Conversation Bot"],
      description: "Все для салонов красоты и барбершопов"
    },
    {
      name: "Fitness Suite",
      price: "9,900 ₽/мес", 
      saving: "Экономия 14%",
      icon: <Package className="w-6 h-6" />,
      products: ["AI PostMaster", "Booking Bot", "Feedback Bot", "Conversation Bot"],
      description: "Решение для фитнес-студий и залов"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-bg-secondary to-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Пакеты для каждого бизнеса
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Начните с одного продукта и добавляйте по мере роста
          </p>
        </motion.div>

        {/* Individual Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden ${
                plan.popular ? 'ring-2 ring-primary-coral transform scale-105' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary-coral text-white px-6 py-1 rounded-bl-lg font-semibold">
                  Популярный
                </div>
              )}
              <div className="w-12 h-12 bg-primary-electric/10 rounded-lg flex items-center justify-center text-primary-electric mb-6">
                {plan.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-text-primary">{plan.name}</h3>
              <div className="text-3xl font-bold text-primary-coral mb-2">{plan.price}</div>
              <p className="text-text-secondary mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <Check className="w-5 h-5 text-primary-electric mr-3" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                plan.popular 
                  ? 'bg-primary-coral text-white hover:bg-primary-coral/90' 
                  : 'bg-bg-secondary text-text-primary hover:bg-bg-secondary/80'
              }`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Vertical Packages */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 text-text-primary">Вертикальные пакеты</h3>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Связанные продукты для конкретных отраслей со скидкой
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {verticalPackages.map((pkg, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-primary-electric/5 to-primary-violet/5 rounded-2xl p-8 border border-primary-electric/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-primary-violet/10 rounded-lg flex items-center justify-center text-primary-violet mb-6">
                {pkg.icon}
              </div>
              <h4 className="text-2xl font-bold mb-2 text-text-primary">{pkg.name}</h4>
              <div className="text-3xl font-bold text-primary-gold mb-2">{pkg.price}</div>
              <div className="text-primary-coral font-semibold mb-4">{pkg.saving}</div>
              <p className="text-text-secondary mb-6">{pkg.description}</p>
              
              <ul className="space-y-2 mb-8">
                {pkg.products.map((product, idx) => (
                  <li key={idx} className="flex items-center text-text-secondary">
                    <Star className="w-4 h-4 text-primary-gold mr-2" />
                    <span>{product}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full py-3 px-6 bg-primary-violet text-white rounded-lg font-semibold hover:bg-primary-violet/90 transition-colors">
                Выбрать пакет
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;