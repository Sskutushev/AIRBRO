import React from 'react';
import { motion } from 'framer-motion';
import { Check, MessageCircle, Calendar, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SolutionSection: React.FC = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      id: 1,
      title: "Всё в одном приложении",
      description: "Не нужны отдельные приложения. Всё управление — в Telegram, где вы уже работаете.",
      highlights: [
        "✓ Уведомления в реальном времени",
        "✓ Никакого переключения приложений",
        "✓ 98% открываемость (vs 20% у email)"
      ],
      icon: <MessageCircle className="w-8 h-8" />,
      visual: <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" /> // Placeholder for Telegram mockup
    },
    {
      id: 2,
      title: "Начните с малого, растите вместе с нами",
      description: "Не платите за то, что не используете. Добавляйте модули по мере роста бизнеса.",
      highlights: [
        "✓ Низкий входной барьер (3,000₽/мес)",
        "✓ Естественные апсейлы",
        "✓ Никакого vendor lock-in"
      ],
      icon: <Calendar className="w-8 h-8" />,
      visual: <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" /> // Placeholder for module diagram
      , reverse: true
    },
    {
      id: 3,
      title: "Чем дольше — тем умнее",
      description: "Каждый клиент получает персональный AI Data Store. Знает ваши продукты, цены, стиль бренда.",
      highlights: [
        "✓ RAG-based персонализация",
        "✓ Никаких шаблонов",
        "✓ Уникальный контент для вашего бизнеса"
      ],
      icon: <BarChart3 className="w-8 h-8" />,
      visual: <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" /> // Placeholder for AI brain animation
    }
  ];

  const comparisonData = [
    { feature: "Стоимость/месяц", freelancer: "58,000₽", corp: "150,000₽+", aibro: "от 3,000₽" },
    { feature: "Время на настройку", freelancer: "2-4 недели", corp: "3-6 месяцев", aibro: "15 минут" },
    { feature: "Персонализация", freelancer: "Высокая", corp: "Низкая", aibro: "AI-driven" },
    { feature: "Надёжность", freelancer: "Зависит", corp: "Высокая", aibro: "SLA 99.9%" },
    { feature: "Масштабируемость", freelancer: "Нет", corp: "Да", aibro: "Да" },
    { feature: "Интеграция с Telegram", freelancer: "Нет", corp: "Нет", aibro: "Нативная" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-bg-secondary to-bg-primary" id="solution">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text">
            AIBRO Business: Ваш AI-отдел в Telegram
          </h2>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto">
            Не просто инструменты. Полная экосистема, которая растёт вместе с вами.
          </p>
        </motion.div>

        <div className="space-y-20">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={benefit.id}
              className={`flex flex-col ${benefit.id % 2 === 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className={`${benefit.id % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} lg:w-1/2`}>
                <div className="bg-gradient-to-br from-primary-telegram/10 to-primary-electric/10 p-8 rounded-2xl">
                  <div className="w-16 h-16 bg-primary-telegram/10 rounded-xl flex items-center justify-center text-primary-telegram mb-6">
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-text-primary">{benefit.title}</h3>
                  <p className="text-text-secondary mb-6">{benefit.description}</p>
                  <ul className="space-y-3">
                    {benefit.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-primary-electric mt-1 mr-3 flex-shrink-0" />
                        <span className="text-text-secondary">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={`${benefit.id % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} lg:w-1/2`}>
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-80 flex items-center justify-center">
                  <span className="text-gray-500">Визуализация: {benefit.title}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div 
          className="mt-32"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-text-primary">
            AIBRO Business vs Альтернативы
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bg-tertiary">
                  <th className="p-4 text-left text-text-primary font-semibold">Критерий</th>
                  <th className="p-4 text-center text-amber-600 font-semibold">Фрилансер SMM</th>
                  <th className="p-4 text-center text-blue-600 font-semibold">Корп. ПО</th>
                  <th className="p-4 text-center text-primary-telegram font-semibold">AIBRO Business</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <motion.tr 
                    key={idx}
                    className="border-b border-border hover:bg-bg-tertiary transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                  >
                    <td className="p-4 font-medium text-text-primary">{row.feature}</td>
                    <td className="p-4 text-center text-text-secondary">{row.freelancer}</td>
                    <td className="p-4 text-center text-text-secondary">{row.corp}</td>
                    <td className="p-4 text-center text-primary-telegram font-medium">{row.aibro}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div 
          className="mt-20 bg-gradient-to-r from-primary-telegram to-primary-electric rounded-2xl p-8 text-center text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Готовы начать?</h3>
          <button className="bg-white text-primary-telegram font-bold px-8 py-4 rounded-lg text-lg hover:bg-gray-100 transition-colors">
            Попробовать бесплатно
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;