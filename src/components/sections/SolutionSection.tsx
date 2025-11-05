import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Zap, CheckCircle } from 'lucide-react';

const SolutionSection: React.FC = () => {
  const benefits = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Telegram-нативная экосистема",
      description: "Все продукты работают внутри Telegram - без переключения приложений"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Молниеносная автоматизация",
      description: "Запуск за 5 минут, настройка под особенности вашего бизнеса"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Модульное ценообразование",
      description: "Платите только за то, что используете, расширяйте по мере роста"
    }
  ];

  return (
    <section className="py-20 bg-white" id="solution">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Решение: <span className="text-text-primary">AIRBRO Business</span>
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              Полная AI-операционная система для малого бизнеса, построенная на Telegram.
            </p>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-primary-electric/10 rounded-lg flex items-center justify-center text-primary-electric flex-shrink-0 mr-4">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">{benefit.title}</h3>
                    <p className="text-text-secondary">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button className="flex items-center text-text-primary font-bold text-lg group">
                Узнайте, как AIBRO трансформирует ваш бизнес
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-primary-electric to-primary-violet rounded-2xl shadow-2xl"></div>
              <div className="absolute -top-6 -right-6 w-64 h-64 bg-gradient-to-br from-primary-coral to-primary-gold rounded-2xl shadow-xl transform rotate-12"></div>
              <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-gradient-to-br from-primary-teal to-primary-blue rounded-2xl shadow-xl transform -rotate-12"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;