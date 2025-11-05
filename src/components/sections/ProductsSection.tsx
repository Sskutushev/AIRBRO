import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Calendar, Package, Zap, Shield, Target, Clock } from 'lucide-react';

const ProductsSection: React.FC = () => {
  const tier1Products = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "AI PostMaster",
      description: "Автоматизация создания контента для Telegram-каналов",
      price: "от 3,000 ₽/мес",
      features: ["1 канал", "30 постов/мес", "Базовая персонализация"]
    }
  ];

  const tier2Products = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Conversation Bot",
      description: "AI-помощник для обслуживания клиентов 24/7",
      price: "от 2,000 ₽/мес",
      features: ["FAQ-автоматизация", "Мультиязычность", "Аналитика"]
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Booking Bot",
      description: "Автоматизация бронирования и записи на приём",
      price: "от 2,500 ₽/мес",
      features: ["Календарь Google/Yandex", "Авто-напоминания", "Управление сотрудниками"]
    }
  ];

  const tier3Products = [
    {
      icon: <Package className="w-8 h-8" />,
      title: "Restaurant Suite",
      description: "Полный комплект для ресторанов и кафе",
      price: "9,900 ₽/мес",
      features: ["Скидка 14%", "Все продукты", "Персонализация"]
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Beauty Suite",
      description: "Все для салонов красоты и барбершопов",
      price: "9,500 ₽/мес",
      features: ["Скидка 17%", "Все продукты", "Персонализация"]
    }
  ];

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-white to-bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Продуктовая экосистема
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Начните с одного продукта и расширяйте по мере роста
          </p>
        </motion.div>

        {/* Tier 1: Core Product */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-text-primary">Tier 1: Основной продукт</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tier1Products.map((product, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border-2 border-primary-electric"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-primary-electric/10 rounded-xl flex items-center justify-center text-primary-electric mb-6">
                  {product.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-text-primary">{product.title}</h3>
                <p className="text-text-secondary mb-6">{product.description}</p>
                
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary-coral mb-4">{product.price}</div>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-text-secondary">
                        <Zap className="w-4 h-4 text-primary-electric mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button className="w-full py-3 bg-primary-electric text-white rounded-lg font-semibold hover:bg-primary-electric/90 transition-colors">
                  Начать с контента
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tier 2: Horizontal Products */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-text-primary">Tier 2: Горизонтальные продукты</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tier2Products.map((product, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-primary-violet/10 rounded-xl flex items-center justify-center text-primary-violet mb-6">
                  {product.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-text-primary">{product.title}</h3>
                <p className="text-text-secondary mb-6">{product.description}</p>
                
                <div className="mb-6">
                  <div className="text-2xl font-bold text-primary-coral mb-4">{product.price}</div>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-text-secondary">
                        <Zap className="w-4 h-4 text-primary-violet mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button className="w-full py-3 bg-primary-violet text-white rounded-lg font-semibold hover:bg-primary-violet/90 transition-colors">
                  Узнать больше
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tier 3: Vertical Packages */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8 text-text-primary">Tier 3: Вертикальные пакеты</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tier3Products.map((product, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-primary-electric/10 to-primary-violet/10 p-8 rounded-2xl shadow-lg border border-primary-electric"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-primary-gold/10 rounded-xl flex items-center justify-center text-primary-gold mb-6">
                  {product.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-text-primary">{product.title}</h3>
                <p className="text-text-secondary mb-6">{product.description}</p>
                
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary-gold mb-4">{product.price}</div>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-text-secondary">
                        <Shield className="w-4 h-4 text-primary-gold mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button className="w-full py-3 bg-gradient-to-r from-primary-gold to-primary-coral text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Выбрать пакет
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-primary-electric to-primary-violet p-8 rounded-2xl text-white">
            <div className="flex items-center mb-4">
              <Target className="w-6 h-6 mr-3" />
              <h3 className="text-xl font-bold">Преимущества экосистемы</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Zap className="w-5 h-5 mr-3 text-primary-gold" />
                <span>Мгновенная интеграция между продуктами</span>
              </li>
              <li className="flex items-center">
                <Shield className="w-5 h-5 mr-3 text-primary-gold" />
                <span>Персонализированный AI для вашего бизнеса</span>
              </li>
              <li className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-primary-gold" />
                <span>Экономия до 40 часов в неделю</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-r from-primary-coral to-primary-gold p-8 rounded-2xl text-white">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 mr-3" />
              <h3 className="text-xl font-bold">Результаты клиентов</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Target className="w-5 h-5 mr-3 text-white" />
                <span>Рост подписчиков на 70% за 3 месяца</span>
              </li>
              <li className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-white" />
                <span>Снижение времени на маркетинг на 80%</span>
              </li>
              <li className="flex items-center">
                <Zap className="w-5 h-5 mr-3 text-white" />
                <span>Увеличение конверсии с канала на 45%</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;