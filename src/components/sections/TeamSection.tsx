import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import { staggerContainer, fadeInUp } from '../../lib/motionPresets';

const TeamSection: React.FC = () => {
  return (
    <section className="py-20 bg-bg-secondary">
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
            Фаза 100: Поддержка
          </motion.h2>
          <motion.p 
            className="text-2xl text-text-secondary max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Не расход, а аренда элитного R&D
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px] max-w-5xl mx-auto">
          {/* Left side: Hiring */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <Card variant="default" className="h-full p-8">
              <h3 className="text-2xl font-bold text-center mb-6 text-red-500">Нанять 1 AI-инженера</h3>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-red-500 mb-2">$10,000-15,000/мес</div>
                <div className="text-text-secondary">стоимость</div>
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">👤</div>
                <div className="text-xl font-bold text-text-primary">1 человек</div>
                <div className="text-text-secondary mt-2">получаете</div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-text-secondary">Болезни</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-text-secondary">Отпуска</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-text-secondary">Увольнения</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-text-secondary">Риски: высокие</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right side: Renting */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <Card variant="glass" className="h-full p-8 border-2 border-green-500 relative overflow-hidden min-h-[538px]">
              <div className="absolute top-[24px] right-[-7px] bg-gradient-to-r from-primary-coral to-primary-teal text-white text-xs px-4 py-1 font-bold transform rotate-45 translate-x-4 -translate-y-2">
                Наш выбор
              </div>
              <h3 className="text-2xl font-bold text-center mb-6 text-green-500">Арендовать AI-Spetsnaz</h3>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-green-500 mb-2">$12,500/мес</div>
                <div className="text-text-secondary">стоимость</div>
              </div>
              <div className="text-center mb-6">
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="text-2xl">👨‍💻</div>
                  <div className="text-2xl">👨‍💻</div>
                  <div className="text-2xl">👨‍💻</div>
                  <div className="text-2xl">👨‍💻</div>
                </div>
                <div className="text-xl font-bold text-text-primary">Команда 4 специалиста</div>
                <div className="text-text-secondary mt-2">получаете</div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-text-secondary">1 Архитектор</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-text-secondary">3 Сеньора</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-text-secondary">Гарантия SLA</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-text-secondary">Риски: 0</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Team visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-r from-primary-purple/10 to-primary-blue/10 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-center mb-6">Наша команда</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[25px]">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">👤</span>
                </div>
                <div className="text-sm">Архитектор</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">👤</span>
                </div>
                <div className="text-sm">Сеньор</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">👤</span>
                </div>
                <div className="text-sm">Сеньор</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">👤</span>
                </div>
                <div className="text-sm">Сеньор</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;