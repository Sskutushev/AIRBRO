import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Scissors, Dumbbell, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PricingSection: React.FC = () => {
  const { t } = useTranslation('pricing');
  const [viewMode, setViewMode] = useState<'individual' | 'bundle'>('bundle');
  
  const packages = [
    {
      id: "restaurant-suite",
      name: t('packages.restaurant.name'),
      emoji: "🍽️",
      tagline: t('packages.restaurant.description'),
      icon: <ChefHat className="w-8 h-8" />,
      products: [
        "AI PostMaster (меню дня, акции)",
        "Booking Bot (резервирование столиков)",
        "Feedback Bot (отзывы после ужина)",
        "Video Inventory Agent (инвентаризация кухни)"
      ],
      priceOriginal: 11500,
      priceBundle: 9900,
      savings: 1600,
      savingsPercent: 14,
      bonuses: [
        "Menu Management (динамическое меню)",
        "Table Optimization",
        "Food Waste Tracking"
      ],
      target: "Рестораны, кафе, кофейни (10-100 мест)",
      badge: null
    },
    {
      id: "beauty-suite",
      name: t('packages.beauty.name'),
      emoji: "💇",
      tagline: t('packages.beauty.description'),
      icon: <Scissors className="w-8 h-8" />,
      products: [
        "AI PostMaster (до/после, промо)",
        "Booking Bot (записи на приём)",
        "Feedback Bot (отзывы)",
        "Conversation Bot (консультации)"
      ],
      priceOriginal: 11500,
      priceBundle: 9500,
      savings: 2000,
      savingsPercent: 17,
      bonuses: [
        "Stylist Profiles",
        "Service Upselling",
        "Loyalty Program"
      ],
      target: "Салоны красоты, барбершопы (2-10 специалистов)",
      badge: "BEST VALUE"
    },
    {
      id: "fitness-suite",
      name: t('packages.fitness.name'),
      emoji: "🏋️",
      tagline: t('packages.fitness.description'),
      icon: <Dumbbell className="w-8 h-8" />,
      products: [
        "AI PostMaster (советы по тренировкам)",
        "Booking Bot (записи на классы)",
        "Feedback Bot (отзывы членов)",
        "Conversation Bot (вопросы о членстве)"
      ],
      priceOriginal: 11500,
      priceBundle: 9900,
      savings: 1600,
      savingsPercent: 14,
      bonuses: [
        "Class Capacity Management",
        "Membership Renewals",
        "Progress Tracking"
      ],
      target: "Спортзалы, йога-студии (50-500 членов)",
      badge: null
    },
    {
      id: "retail-suite",
      name: t('packages.retail.name'),
      emoji: "🛍️",
      tagline: t('packages.retail.description'),
      icon: <ShoppingBag className="w-8 h-8" />,
      products: [
        "AI PostMaster (новые поступления, распродажи)",
        "Conversation Bot (запросы продуктов)",
        "Feedback Bot (отзывы)",
        "Video Inventory Agent (отслеживание запасов)"
      ],
      priceOriginal: 10500,
      priceBundle: 8900,
      savings: 1600,
      savingsPercent: 15,
      bonuses: [
        "Product Catalog",
        "Order Processing",
        "Loyalty Points"
      ],
      target: "Бутики, магазины электроники (100-10K SKU)",
      badge: null
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-bg-primary to-bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text">
            {t('industry_bundles')}
          </h2>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto">
            {t('save_up')}
          </p>
        </motion.div>

        {/* Toggle between individual and bundle prices */}
        <div className="flex justify-center mb-12">
          <div className="bg-bg-tertiary rounded-full p-1 inline-flex">
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                viewMode === 'individual'
                  ? 'bg-primary-telegram text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setViewMode('individual')}
            >
              Individual Prices
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                viewMode === 'bundle'
                  ? 'bg-primary-telegram text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setViewMode('bundle')}
            >
              Bundle Prices
            </button>
          </div>
        </div>

        {/* Pricing Packages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              className="glass rounded-2xl p-6 border border-border/50 relative overflow-hidden hover:scale-[1.02] transition-transform duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {pkg.badge && (
                <div className="absolute -top-3 -right-3 bg-accent-gold text-text-primary text-xs font-bold px-3 py-1 rounded-full">
                  {pkg.badge}
                </div>
              )}
              
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-primary-violet/20 rounded-full flex items-center justify-center text-primary-violet text-2xl">
                  {pkg.emoji}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-center mb-2 text-text-primary">
                {pkg.name} {pkg.emoji}
              </h3>
              <p className="text-center text-text-secondary text-sm mb-6">{pkg.tagline}</p>
              
              <div className="mb-6">
                <h4 className="font-medium text-text-primary mb-3">Включает:</h4>
                <ul className="space-y-2">
                  {pkg.products.map((product, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <div className="w-1.5 h-1.5 bg-primary-electric rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      <span className="text-text-secondary">{product}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6 p-4 bg-bg-tertiary rounded-xl">
                <div className="text-center mb-1">
                  <span className={`text-text-secondary ${viewMode === 'bundle' ? 'line-through' : ''} text-sm`}>
                    {pkg.priceOriginal.toLocaleString()}₽
                  </span>
                </div>
                <div className="text-3xl font-bold text-center text-primary-telegram mb-1">
                  {viewMode === 'bundle' 
                    ? `${pkg.priceBundle.toLocaleString()}₽` 
                    : `${pkg.priceOriginal.toLocaleString()}₽`}/мес
                </div>
                {viewMode === 'bundle' && (
                  <div className="text-center text-green-500 font-medium">
                    Экономия {pkg.savings.toLocaleString()}₽ ({pkg.savingsPercent}%)
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-text-primary mb-2">Бонусы:</h4>
                <ul className="space-y-1">
                  {pkg.bonuses.map((bonus, idx) => (
                    <li key={idx} className="flex items-start text-xs">
                      <div className="w-1.5 h-1.5 bg-primary-mint rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                      <span className="text-text-secondary">{bonus}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-text-tertiary text-center mb-4">{pkg.target}</p>
                <button className="w-full py-3 bg-gradient-to-r from-primary-telegram to-primary-electric text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Выбрать пакет
                </button>
              </div>
            </motion.div>
          ))}
        </div>

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

        {/* FAQ teaser */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-text-secondary inline-flex items-center">
            Вопросы по ценам? 
            <a href="#faq" className="text-primary-telegram font-medium ml-2 hover:underline">
              Посмотрите FAQ
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;