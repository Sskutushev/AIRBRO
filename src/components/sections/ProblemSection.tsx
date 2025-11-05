import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Users, MessageCircle, Clock } from 'lucide-react';

const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Ручной контент-маркетинг",
      description: "Потери времени на создание постов вместо фокуса на бизнесе"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Нет времени на клиентов",
      description: "Владельцы бизнеса тонут в операционной рутине"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Пропущенные сообщения",
      description: "Ответы на запросы клиентов занимают слишком много времени"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Высокие расходы на персонал",
      description: "SMM-специалист стоит 60,000+ ₽ в месяц"
    }
  ];

  return (
    <section id="problem" className="py-20 bg-gradient-to-b from-bg-primary to-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Проблемы малого бизнеса в Telegram
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Владельцы бизнеса не могут позволить себе SMM-специалистов, но и ручная работа неэффективна
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-16 h-16 bg-primary-electric/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-electric">
                {problem.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-text-primary">{problem.title}</h3>
              <p className="text-text-secondary">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;