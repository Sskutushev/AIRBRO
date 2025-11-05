import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import { staggerContainer, fadeInUp } from '../../lib/motionPresets';

const ModelSection: React.FC = () => {
  return (
    <section className="py-20 bg-white" id="guarantees">
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
            Модель "Skin in the Game"
          </motion.h2>
          <motion.p 
            className="text-2xl text-text-secondary max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Мы ставим на кон свою шкуру
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Phase 0 - Audit */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mt-[70px]"
          >
            <Card variant="default" className="p-8 h-full">
              <h3 className="text-2xl font-bold text-text-primary mb-4">Фаза 0 (Аудит)</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Стоимость:</span>
                  <span className="font-bold">$1,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Срок:</span>
                  <span className="font-bold">2 недели</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Результат:</span>
                  <span className="font-bold">Экономия на $X</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-green-600 font-bold">✓ Гарантия: Если не найдём — возврат</div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Phase 10 - MVP Options */}
          <div className="space-y-6">
            {/* Standard Option - Not Recommended */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card variant="default" className="p-6 border-2 border-gray-300 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-text-primary">Вариант А: "Стандарт"</h3>
                  <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">Не рекомендуем</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Стоимость:</span>
                    <span className="font-bold">$100,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Риск:</span>
                    <span className="font-bold text-red-500">Вы платите заранее</span>
                  </div>
                  <div className="pt-2">
                    <div className="text-gray-500 text-sm">Цвет: серый/красноватый</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Partnership Option - Our Choice */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card variant="glass" className="p-6 border-2 border-green-500 relative overflow-hidden">
                <div className="absolute top-[15px] right-[-25px] bg-gradient-to-r from-primary-coral to-primary-teal text-white text-xs px-4 py-1 font-bold transform rotate-45 translate-x-0 -translate-y-0">
                  Наш выбор
                </div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-text-primary">Вариант Б: "Партнёрство"</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Стоимость:</span>
                    <span className="font-bold text-green-600">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Риск:</span>
                    <span className="font-bold text-green-600">Мы не заработаем, пока вы не сэкономите</span>
                  </div>
                  <div className="pt-2">
                    <div className="text-green-600 font-bold">Условие: % от доказанной экономии 12-18 мес</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Flow diagram visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-primary-purple/10 to-primary-blue/10 p-8 rounded-2xl"
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-text-primary">Как работает экономия</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
            <div className="text-2xl font-bold">Вы экономите</div>
            <div className="text-4xl">→</div>
            <div className="text-2xl font-bold text-green-600">Мы получаем</div>
            <div className="text-4xl">→</div>
            <div className="text-2xl font-bold text-blue-600">Ваша чистая экономия</div>
          </div>
          <div className="mt-8 text-center">
            <div className="text-xl">Пример: $17,500 экономия → $8,750 нам → $8,750 ваша чистая экономия</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModelSection;