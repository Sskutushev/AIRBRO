import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Star, Bot, Video, Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ModulePopup from '../common/ModulePopup';

const ProductsSection: React.FC = () => {
  const { t } = useTranslation('products');
  const [activeModule, setActiveModule] = useState<{id: string, name: string, icon: string, tagline: string, price: string, status: string} | null>(null);

  // Tier 1 Product (Featured)
  const aiPostMaster = {
    id: "ai-postmaster",
    name: t('ai_postmaster.name'),
    tagline: t('ai_postmaster.tagline'),
    description: t('ai_postmaster.description'),
    icon: <Coins className="w-10 h-10" />,
    features: [
      t('ai_postmaster.features.text_gen'),
      t('ai_postmaster.features.image_gen'),
      t('ai_postmaster.features.smart_scheduling'),
      t('ai_postmaster.features.brand_personalization')
    ],
    pricing: {
      starter: { price: 990, features: ["1 канал", "30 постов/мес"] },
      pro: { price: 2490, features: ["1 канал", "Неограниченно", "Аналитика"] },
      business: { price: 4990, features: ["3 канала", "Неограниченно", "Приоритет"] },
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
      statusText: "🟡 Coming Q1 2026"
    },
    {
      id: "booking-bot",
      name: "Booking Bot",
      tagline: "Менеджер по бронированию",
      description: "Автоматические записи, напоминания, управление календарём.",
      icon: <Calendar className="w-8 h-8" />,
      price: "от 2,500₽/мес",
      status: "coming", // available, coming, research
      statusText: "🟡 Coming Q2 2026"
    },
    {
      id: "feedback-bot",
      name: "Feedback Bot",
      tagline: "Превратите клиентов в промоутеров",
      description: "Автосбор отзывов, управление репутацией, NPS-трекинг.",
      icon: <Star className="w-8 h-8" />,
      price: "от 1,500₽/мес",
      status: "coming", // available, coming, research
      statusText: "🟡 Coming Q2 2026"
    },
    {
      id: "video-inventory",
      name: "Video Inventory Agent",
      tagline: "Умный помощник по инвентарю",
      description: "Видео-инвентаризация, OCR сроков годности, автозаказ.",
      icon: <Video className="w-8 h-8" />,
      price: "от 4,990₽/мес",
      status: "research", // available, coming, research
      statusText: "🔴 R&D, Q3 2026"
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
          <div className="bg-gradient-to-r from-primary-telegram to-primary-electric rounded-3xl p-8 md:p-12 text-white bg-opacity-85">
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
                
                <a 
                  href="https://t.me/aipostmaster_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-primary-telegram font-bold px-8 py-4 rounded-lg text-lg hover:bg-gray-100 transition-colors"
                >
                  Попробовать бесплатно 7 дней
                </a>
              </div>
              
              <div className="flex-1 flex justify-center">
                <div className="bg-[#334155]/70 backdrop-blur-[15px] rounded-2xl p-8 border border-white/20 w-full max-w-md">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-primary-mint/20 w-16 h-16 rounded-full flex items-center justify-center mr-3">
                      {aiPostMaster.icon}
                    </div>
                    <h4 className="font-bold text-lg">Тарифы</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Starter</span>
                        <span className="font-bold text-xl">990₽</span>
                      </div>
                      <ul className="text-sm space-y-1 opacity-80">
                        {aiPostMaster.pricing.starter.features.map((feature, idx) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white/10 rounded-xl p-4 relative">
                      <div className="absolute top-[-10px] left-[-10px] bg-gradient-to-r from-primary-telegram to-primary-electric text-white font-bold text-xs px-3 py-1 rounded-full animate-pulse whitespace-nowrap">
                        {t('recommended_badge')}
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Business</span>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-xl">2,490₽</span>
                        </div>
                      </div>
                      <ul className="text-sm space-y-1 opacity-80">
                        {aiPostMaster.pricing.pro.features.map((feature, idx) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Premium</span>
                        <span className="font-bold text-xl">4,990₽</span>
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
                
                <button 
                  className="w-full py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                  onClick={() => setActiveModule({
                    id: product.id,
                    name: product.name,
                    icon: product.id === 'conversation-bot' ? '💬' : 
                         product.id === 'booking-bot' ? '📅' : 
                         product.id === 'feedback-bot' ? '⭐' : '📹',
                    tagline: product.tagline,
                    price: product.price,
                    status: product.statusText
                  })}
                >
                  Узнать больше
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Module Popup */}
        <ModulePopup
          isOpen={!!activeModule}
          onClose={() => setActiveModule(null)}
          moduleId={activeModule?.id || ''}
          moduleName={activeModule?.name || ''}
          moduleIcon={activeModule?.icon || ''}
          tagline={activeModule?.tagline || ''}
          price={activeModule?.price || ''}
          status={activeModule?.status || ''}
        />


      </div>
    </section>
  );
};

export default ProductsSection;