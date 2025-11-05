import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Settings, Send } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Найдите @AIBROBusinessBot",
      description: "Просто напишите боту в Telegram. Никаких регистраций на сайтах.",
      duration: "1 минута",
      icon: <MessageCircle className="w-8 h-8" />,
      mockup: <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center">Telegram Chat Mockup</div>
    },
    {
      id: 2,
      title: "Расскажите о своём бизнесе",
      description: "Бот задаст несколько вопросов: название, ниша, продукты, стиль. AI создаст ваш персональный Data Store.",
      duration: "5 минут",
      icon: <Settings className="w-8 h-8" />,
      mockup: <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center">Onboarding Form Mockup</div>
    },
    {
      id: 3,
      title: "Создайте первый пост",
      description: "Просто скажите боту тему. AI сгенерирует текст + изображение. Одобрите или отредактируйте. Готово!",
      duration: "9 минут",
      icon: <Send className="w-8 h-8" />,
      mockup: <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center">Post Preview Mockup</div>
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-bg-primary to-bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text">
            3 шага к автоматизации
          </h2>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto">
            От регистрации до первого поста — 15 минут
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary-telegram to-primary-electric"></div>
          
          <div className="space-y-20">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} lg:w-1/2`}>
                  <div className="bg-gradient-to-br from-primary-telegram/10 to-primary-electric/10 p-8 rounded-2xl">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary-telegram/10 rounded-lg flex items-center justify-center text-primary-telegram mr-4">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-text-primary">{step.title}</h3>
                        <div className="inline-block bg-primary-telegram/20 text-primary-telegram text-sm font-medium px-3 py-1 rounded-full mt-2">
                          {step.duration}
                        </div>
                      </div>
                    </div>
                    <p className="text-text-secondary mb-6">{step.description}</p>
                  </div>
                </div>
                <div className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} lg:w-1/2`}>
                  <div className="glass rounded-2xl p-6 border border-border/50">
                    {step.mockup}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pro Tip Banner */}
        <motion.div 
          className="mt-20 bg-gradient-to-r from-primary-mint/10 to-primary-neon/10 rounded-2xl p-6 border border-border/50"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-mint/10 rounded-xl flex items-center justify-center text-primary-mint mr-4">
              💡
            </div>
            <div>
              <h3 className="font-bold text-text-primary">Pro Tip</h3>
              <p className="text-text-secondary">Хотите ещё быстрее? Используйте /quickstart команду</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button className="px-8 py-4 bg-gradient-to-r from-primary-telegram to-primary-electric text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-lg">
            Начать сейчас
          </button>
          <button className="px-8 py-4 border border-text-secondary text-text-primary font-bold rounded-lg hover:border-primary-telegram hover:text-primary-telegram transition-colors text-lg">
            Посмотреть демо-видео
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;