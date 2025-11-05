import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import { staggerContainer, fadeInUp } from '../../lib/motionPresets';

const ChallengeSection: React.FC = () => {
  const steps = [
    {
      id: "01",
      title: "Вы даёте 100 документов",
      description: "Под полным NDA. Реальные, грязные сканы договоров или отчётов",
      icon: "📄"
    },
    {
      id: "02",
      title: "Мы возвращаемся с прототипом",
      description: "Работающий AI, обученный на ваших данных",
      icon: "⚡"
    },
    {
      id: "03",
      title: "Вы задаёте вопрос — получаете ответ",
      description: "'Условия оплаты ООО Ромашка?' → Мгновенный ответ с цитатой",
      icon: "✓"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-bg-primary to-bg-secondary" id="challenge">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
            variants={fadeInUp}
          >
            Мы не делаем "Демо"
          </motion.h2>
          <motion.p 
            className="text-2xl text-text-secondary max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Мы запускаем 72-Hour Challenge
          </motion.p>
          <motion.p 
            className="text-xl text-text-secondary max-w-2xl mx-auto mt-4"
            variants={fadeInUp}
          >
            Вместо пустых обещаний — мгновенное доказательство на ваших данных
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-coral to-primary-teal transform -translate-x-1/2"></div>
          
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id}
                className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="md:w-5/12 mb-6 md:mb-0 md:px-8">
                  <Card variant="glass" className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-coral to-primary-teal flex items-center justify-center text-white font-bold mr-4">
                        {step.id}
                      </div>
                      <h3 className="text-2xl font-bold text-text-primary">{step.title}</h3>
                    </div>
                    <p className="text-text-secondary">{step.description}</p>
                  </Card>
                </div>
                
                <div className="md:w-2/12 flex justify-center my-4 md:my-0">
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-primary-coral flex items-center justify-center text-2xl shadow-lg z-10">
                    {step.icon}
                  </div>
                </div>
                
                <div className="md:w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChallengeSection;