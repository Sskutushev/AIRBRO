import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ProblemSection: React.FC = () => {
  const { t } = useTranslation();

  const problems = [
    {
      id: 1,
      emoji: "💰",
      title: "SMM-менеджер: 58,000₽/месяц",
      description: "Нужен контент каждый день. Нанять дорого, делать самому — нет времени.",
      stat: "58K₽/мес на одного человека",
      color: "accent-coral"
    },
    {
      id: 2,
      emoji: "💬",
      title: "3-5 часов/день на ответы",
      description: "Одни и те же вопросы. Пропущенные сообщения = потерянные клиенты.",
      stat: "40+ часов/месяц впустую",
      color: "primary-electric"
    },
    {
      id: 3,
      emoji: "📅",
      title: "Пропущенные звонки = потерянные заказы",
      description: "Ручное управление календарём. No-show клиенты. Потерянная прибыль.",
      stat: "20% пропущенных бронирований",
      color: "primary-neon"
    },
    {
      id: 4,
      emoji: "📊",
      title: "Работаете вслепую",
      description: "Не знаете, что работает. Нет данных для решений.",
      stat: "95% МСБ не используют аналитику",
      color: "primary-mint"
    }
  ];

  return (
    <section id="problem" className="py-20 bg-gradient-to-b from-bg-primary to-bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text">
            {t('frequently_asked', { ns: 'faq' }) /* Using a translation key temporarily */}
          </h2>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text">
            Знакомая боль?
          </h2>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto">
            Малый бизнес тратит слишком много на задачи, которые AI решает за минуты
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.id}
              className="glass p-8 rounded-2xl border border-border/50 hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
            >
              <div className="flex items-start">
                <div className={`text-4xl p-3 rounded-xl bg-${problem.color}/20 mr-6`}>
                  {problem.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-text-primary">{problem.title}</h3>
                  <p className="text-text-secondary mb-4">{problem.description}</p>
                  <div className="inline-block bg-bg-tertiary text-text-primary text-sm font-medium px-3 py-1 rounded-full">
                    {problem.stat}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transition element */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="inline-flex items-center text-text-secondary">
            <span>Но есть решение...</span>
            <motion.div 
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ↓
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;