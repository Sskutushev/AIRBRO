import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Calendar, Star, Bot, Video, ShoppingBag, Scissors, Dumbbell, ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProductsSection: React.FC = () => {
  const { t } = useTranslation('products');
  
  const [activeTab, setActiveTab] = useState<'individual' | 'bundle'>('bundle');

  // Tier 1 Product (Featured)
  const aiPostMaster = {
    id: "ai-postmaster",
    name: t('ai_postmaster.name'),
    tagline: t('ai_postmaster.tagline'),
    description: t('ai_postmaster.description'),
    icon: <MessageCircle className="w-10 h-10" />,
    features: [
      t('ai_postmaster.features.text_gen'),
      t('ai_postmaster.features.image_gen'),
      t('ai_postmaster.features.smart_scheduling'),
      t('ai_postmaster.features.brand_personalization')
    ],
    pricing: {
      starter: { price: 3000, features: ["1 канал", "30 постов/мес"] },
      pro: { price: 5000, features: ["1 канал", "Неограниченно", "Аналитика"] },
      business: { price: 8000, features: ["3 канала", "Неограниченно", "Приоритет"] },
    }
  };

  // Tier 2 Products
  const tier2Products = [
    {
      id: "conversation-bot",
      name: "Conversation Bot",
      tagline: "AI-сотрудник 24/7",
      description: "Отвечает на вопросы, квалифицирует лиды, передаёт сложные случаи человеку.",
      icon: <Users className="w-8 h-8" />,
      price: "от 2,000₽/мес",
      status: "coming", // available, coming, research
      statusText: "🟡 Coming Q2 2025"
    },
    {
      id: "booking-bot",
      name: "Booking Bot",
      tagline: "Менеджер по бронированию",
      description: "Автоматические записи, напоминания, управление календарём.",
      icon: <Calendar className="w-8 h-8" />,
      price: "от 2,500₽/мес",
      status: "coming", // available, coming, research
      statusText: "🟡 Coming Q3 2025"
    },
    {
      id: "feedback-bot",
      name: "Feedback Bot",
      tagline: "Превратите клиентов в промоутеров",
      description: "Автосбор отзывов, управление репутацией, NPS-трекинг.",
      icon: <Star className="w-8 h-8" />,
      price: "от 1,500₽/мес",
      status: "coming", // available, coming, research
      statusText: "🟡 Coming Q4 2025"
    },
    {
      id: "video-inventory",
      name: "Video Inventory Agent",
      tagline: "Умный помощник по инвентарю",
      description: "Видео-инвентаризация, OCR сроков годности, автозаказ.",
      icon: <Video className="w-8 h-8" />,
      price: "от 3,000₽/мес",
      status: "research", // available, coming, research
      statusText: "🔴 R&D, 2026"
    }
  ];

  // Tier 3 Packages
  const packages = [
    {
      id: "restaurant-suite",
      name: "Restaurant Suite 🍽️",
      tagline: "Полная автоматизация для ресторанов",
      icon: <ChefHat className="w-8 h-8" />,
      products: ["AI PostMaster", "Booking Bot", "Feedback Bot", "Video Inventory"],
      priceOriginal: 11500,
      priceBundle: 9900,
      savings: 1600,
      savingsPercent: 14,
      bonuses: ["Menu Management", "Table Optimization", "Food Waste Tracking"],
      targetAudience: "Рестораны, кафе, кофейни (10-100 мест)",
      badge: null
    },
    {
      id: "beauty-suite",
      name: "Beauty & Wellness Suite 💇",
      tagline: "Все для салонов красоты и барбершопов",
      icon: <Scissors className="w-8 h-8" />,
      products: ["AI PostMaster", "Booking Bot", "Feedback Bot", "Conversation Bot"],
      priceOriginal: 11500,
      priceBundle: 9500,
      savings: 2000,
      savingsPercent: 17,
      bonuses: ["Stylist Profiles", "Service Upselling", "Loyalty Program"],
      targetAudience: "Салоны красоты, барбершопы (2-10 специалистов)",
      badge: "BEST VALUE"
    },
    {
      id: "fitness-suite",
      name: "Fitness Suite 🏋️",
      tagline: "Решение для фитнес-студий и залов",
      icon: <Dumbbell className="w-8 h-8" />,
      products: ["AI PostMaster", "Booking Bot", "Feedback Bot", "Conversation Bot"],
      priceOriginal: 11500,
      priceBundle: 9900,
      savings: 1600,
      savingsPercent: 14,
      bonuses: ["Class Capacity Management", "Membership Renewals", "Progress Tracking"],
      targetAudience: "Спортзалы, йога-студии (50-500 членов)",
      badge: null
    },
    {
      id: "retail-suite",
      name: "Retail Suite 🛍️",
      tagline: "Решение для розничных магазинов",
      icon: <ShoppingBag className="w-8 h-8" />,
      products: ["AI PostMaster", "Conversation Bot", "Feedback Bot", "Video Inventory"],
      priceOriginal: 10500,
      priceBundle: 8900,
      savings: 1600,
      savingsPercent: 15,
      bonuses: ["Product Catalog", "Order Processing", "Loyalty Points"],
      targetAudience: "Бутики, магазины электроники (100-10K SKU)",
      badge: null
    }
  ];

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-bg-primary to-bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text">
            {t('ecosystem')}
          </h2>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto">
            {t('description')}
          </p>
        </motion.div>

        {/* Featured Product (AI PostMaster) */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-gradient-to-r from-primary-telegram to-primary-electric rounded-3xl p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
                  MOST POPULAR
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-3">{aiPostMaster.name}</h3>
                <p className="text-lg mb-6 opacity-90">{aiPostMaster.tagline}</p>
                <p className="mb-6 opacity-80">{aiPostMaster.description}</p>
                
                <ul className="space-y-2 mb-8">
                  {aiPostMaster.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Bot className="w-4 h-4 mr-2 opacity-80" />
                      <span className="opacity-90">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="bg-white text-primary-telegram font-bold px-8 py-4 rounded-lg text-lg hover:bg-gray-100 transition-colors">
                  Попробовать бесплатно 7 дней
                </button>
              </div>
              
              <div className="flex-1 flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 w-full max-w-md">
                  <div className="text-center mb-6">
                    <div className="bg-primary-mint/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      {aiPostMaster.icon}
                    </div>
                    <h4 className="font-bold text-lg">Тарифы</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Starter</span>
                        <span className="font-bold text-xl">3,000₽</span>
                      </div>
                      <ul className="text-sm space-y-1 opacity-80">
                        {aiPostMaster.pricing.starter.features.map((feature, idx) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Pro</span>
                        <span className="font-bold text-xl">5,000₽</span>
                      </div>
                      <ul className="text-sm space-y-1 opacity-80">
                        {aiPostMaster.pricing.pro.features.map((feature, idx) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Business</span>
                        <span className="font-bold text-xl">8,000₽</span>
                      </div>
                      <ul className="text-sm space-y-1 opacity-80">
                        {aiPostMaster.pricing.business.features.map((feature, idx) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tier 2 Products */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-text-primary">
            Дополнительные модули
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tier2Products.map((product, index) => (
              <motion.div
                key={product.id}
                className="glass rounded-2xl p-6 border border-border/50 hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-primary-electric/20 w-12 h-12 rounded-xl flex items-center justify-center text-primary-electric mr-4">
                    {product.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-text-primary">{product.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.status === 'available' ? 'bg-green-500/20 text-green-600' :
                      product.status === 'coming' ? 'bg-yellow-500/20 text-yellow-600' :
                      'bg-red-500/20 text-red-600'
                    }`}>
                      {product.statusText}
                    </span>
                  </div>
                </div>
                
                <p className="text-text-secondary text-sm mb-4">{product.tagline}</p>
                <p className="text-text-secondary text-xs mb-6">{product.description}</p>
                
                <div className="text-primary-telegram font-bold text-lg mb-4">{product.price}</div>
                
                <button className="w-full py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors">
                  Узнать больше
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Packages Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-bg-tertiary rounded-full p-1 inline-flex">
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'individual'
                  ? 'bg-primary-telegram text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setActiveTab('individual')}
            >
              Individual Prices
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'bundle'
                  ? 'bg-primary-telegram text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setActiveTab('bundle')}
            >
              Bundle Prices
            </button>
          </div>
        </div>

        {/* Tier 3 Packages */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-text-primary">
            Готовые решения для вашей индустрии
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                className="glass rounded-2xl p-6 border border-border/50 relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                {pkg.badge && (
                  <div className="absolute -top-3 -right-3 bg-accent-gold text-text-primary text-xs font-bold px-3 py-1 rounded-full">
                    {pkg.badge}
                  </div>
                )}
                
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-primary-violet/20 w-16 h-16 rounded-full flex items-center justify-center text-primary-violet">
                    {pkg.icon}
                  </div>
                </div>
                
                <h4 className="font-bold text-xl text-center mb-2 text-text-primary">{pkg.name}</h4>
                <p className="text-center text-text-secondary text-sm mb-6">{pkg.tagline}</p>
                
                <div className="mb-6">
                  <h5 className="font-medium text-text-primary mb-3">Включает:</h5>
                  <ul className="space-y-2">
                    {pkg.products.map((product, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-primary-electric rounded-full mr-2"></div>
                        <span className="text-text-secondary">{product}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6 p-4 bg-bg-tertiary rounded-xl">
                  <div className="text-center mb-2">
                    <span className="text-text-secondary line-through text-sm">
                      {activeTab === 'bundle' ? `~~${pkg.priceOriginal}₽~~` : `${pkg.priceOriginal}₽`}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-center text-primary-telegram mb-1">
                    {activeTab === 'bundle' ? `${pkg.priceBundle}₽` : `${pkg.priceOriginal}₽`}/мес
                  </div>
                  {activeTab === 'bundle' && (
                    <div className="text-center text-green-500 font-medium">
                      Экономия {pkg.savings}₽ ({pkg.savingsPercent}%)
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <h5 className="font-medium text-text-primary mb-2">Бонусы:</h5>
                  <ul className="space-y-1">
                    {pkg.bonuses.map((bonus, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-primary-mint rounded-full mr-2"></div>
                        <span className="text-text-secondary">{bonus}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-text-tertiary text-center mb-4">{pkg.targetAudience}</p>
                  <button className="w-full py-3 bg-gradient-to-r from-primary-telegram to-primary-electric text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                    Выбрать пакет
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Custom Package Builder */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="inline-block bg-bg-tertiary rounded-2xl p-8">
            <h3 className="text-xl font-bold text-text-primary mb-2">Не нашли подходящий пакет?</h3>
            <p className="text-text-secondary mb-4">Соберите свой пакет</p>
            <button className="px-6 py-3 border border-primary-telegram text-primary-telegram rounded-lg font-medium hover:bg-primary-telegram/10 transition-colors">
              Собрать свой пакет
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;