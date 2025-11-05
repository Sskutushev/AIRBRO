import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, Rocket, Zap } from 'lucide-react';

const RoadmapSection: React.FC = () => {
  const roadmapItems = [
    {
      quarter: "Q1 2025",
      title: "AI PostMaster V2",
      description: "Улучшенная персонализация, больше стилей контента, поддержка нескольких языков",
      icon: <Target className="w-6 h-6" />,
      status: "completed"
    },
    {
      quarter: "Q2 2025", 
      title: "Conversation Bot",
      description: "AI-помощник для обслуживания клиентов 24/7, FAQ-автоматизация",
      icon: <Zap className="w-6 h-6" />,
      status: "in-progress"
    },
    {
      quarter: "Q3 2025",
      title: "Booking Bot",
      description: "Автоматизация бронирования и записи на приём для сервисных бизнесов",
      icon: <Calendar className="w-6 h-6" />,
      status: "planned"
    },
    {
      quarter: "Q4 2025",
      title: "Feedback Bot",
      description: "Сбор отзывов и управление репутацией на Google, Яндекс, 2GIS",
      icon: <Zap className="w-6 h-6" />,
      status: "planned"
    },
    {
      quarter: "2026",
      title: "Video Inventory Agent",
      description: "Автоматизация управления инвентарём через компьютерное зрение",
      icon: <Rocket className="w-6 h-6" />,
      status: "planned"
    }
  ];

  return (
    <section id="roadmap" className="py-20 bg-gradient-to-b from-bg-secondary to-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Что дальше
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Наши планы по развитию экосистемы для вашего бизнеса
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary-electric to-primary-violet hidden md:block"></div>
          
          <div className="space-y-12">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="inline-block bg-white p-4 rounded-xl shadow-lg">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-primary-electric/10 rounded-lg flex items-center justify-center text-primary-electric mr-3">
                        {item.icon}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.status === 'completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status === 'completed' ? 'Готово' : 
                         item.status === 'in-progress' ? 'В разработке' : 'Запланировано'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">{item.title}</h3>
                    <p className="text-text-secondary">{item.description}</p>
                  </div>
                </div>
                
                <div className="w-16 h-16 rounded-full bg-white border-4 border-primary-coral flex items-center justify-center shadow-lg z-10">
                  <div className="w-3 h-3 bg-primary-coral rounded-full"></div>
                </div>
                
                <div className="w-full md:w-5/12">
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <span className="text-primary-coral font-bold">{item.quarter}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;