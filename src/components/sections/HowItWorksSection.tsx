import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, TrendingUp } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Подключение",
      description: "Создайте аккаунт и подключите свой Telegram-канал за несколько минут"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Настройка",
      description: "Настройте AI-ассистента под особенности вашего бизнеса"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Автоматизация",
      description: "Начните автоматизировать процессы и экономить до 40 часов в неделю"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            3 шага к автоматизации
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Начните с AI PostMaster и постепенно расширяйте экосистему
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-16 h-16 bg-primary-electric/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-electric">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-text-primary">{step.title}</h3>
              <p className="text-text-secondary">{step.description}</p>
              <div className="mt-6 text-4xl font-bold text-primary-coral">0{index + 1}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;