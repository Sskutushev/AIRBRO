import React from 'react';
import { motion } from 'framer-motion';
import CountUp from '../common/CountUp';
import { staggerContainer, fadeInUp } from '../../lib/motionPresets';

const CaseSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
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
            Математика нашего партнёрства
          </motion.h2>
          <motion.p className="text-2xl text-text-secondary max-w-3xl mx-auto" variants={fadeInUp}>
            Реальный кейс автоматизации
          </motion.p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Flowchart */}
          <div className="flex flex flex-wrap justify-center items-center gap-[30px] mb-8">
            {/* Step 1: Сейчас */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-[260px] h-[300px] flex flex-col items-center p-4 border border-gray-200 rounded-2xl bg-white shadow-md"
            >
              <div className="w-[260px] h-[150px] mb-4 flex items-center justify-center">
                <div className="text-6xl">📊</div>
              </div>
              <h3 className="font-bold text-xl mb-4 text-center w-full">Сейчас</h3>
              <div className="text-center w-full">
                <div className="text-3xl font-bold text-red-500 mb-2">
                  <CountUp end={20} />
                </div>
                <div className="text-sm mb-3">человек в бухгалтерии</div>
                <div className="text-xl font-bold text-red-500 mb-2">
                  <CountUp end={25000} prefix="$" />
                </div>
                <div className="text-sm">ФОТ/мес</div>
              </div>
            </motion.div>

            <div className="flex items-center justify-center">
              <img src="/images/arrow.svg" alt="arrow" className="w-12 h-12" />
            </div>

            {/* Step 2: Audit */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-[260px] h-[300px] flex flex-col items-center p-4 border border-gray-200 rounded-2xl bg-white shadow-md"
            >
              <div className="w-[260px] h-[150px] mb-4 flex items-center justify-center">
                <div className="text-6xl">🔍</div>
              </div>
              <h3 className="font-bold text-xl mb-4 text-center w-full">Аудит</h3>
              <div className="text-center w-full">
                <div className="text-3xl font-bold text-yellow-500 mb-2">
                  <CountUp end={14} />
                </div>
                <div className="text-sm mb-3">человек — рутина</div>
                <div className="text-xl font-bold text-yellow-500 mb-2">
                  <CountUp end={17500} prefix="$" />
                </div>
                <div className="text-sm">потенциал/мес</div>
              </div>
            </motion.div>

            <div className="flex items-center justify-center">
              <img src="/images/arrow.svg" alt="arrow" className="w-12 h-12" />
            </div>

            {/* Step 3: Внедрение */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-[260px] h-[300px] flex flex-col items-center p-4 border border-gray-200 rounded-2xl bg-white shadow-md"
            >
              <div className="w-[260px] h-[150px] mb-4 flex items-center justify-center">
                <div className="text-6xl">🤖</div>
              </div>
              <h3 className="font-bold text-xl mb-4 text-center w-full">Внедрение</h3>
              <div className="text-center w-full">
                <div className="text-xl font-bold text-green-500 mb-2">$0</div>
                <div className="text-sm mb-3">AI-Бухгалтер</div>
                <div className="text-lg font-bold text-green-500 mb-2">45 дней</div>
                <div className="text-sm">срок</div>
              </div>
            </motion.div>
          </div>

          <div className="flex flex flex-wrap justify-center items-center gap-[30px] mb-12">
            {/* Step 4: Результат */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-[260px] h-[300px] flex flex-col items-center p-4 border border-gray-200 rounded-2xl bg-white shadow-md"
            >
              <div className="w-[260px] h-[150px] mb-4 flex items-center justify-center">
                <div className="text-6xl">📈</div>
              </div>
              <h3 className="font-bold text-xl mb-4 text-center w-full">Результат</h3>
              <div className="text-center w-full">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  <CountUp end={14} />
                </div>
                <div className="text-sm mb-3">автоматизация ставок</div>
                <div className="text-xl font-bold text-green-500 mb-2">
                  <CountUp end={17500} prefix="$" />
                </div>
                <div className="text-sm">экономия/мес</div>
              </div>
            </motion.div>

            <div className="flex items-center justify-center">
              <img src="/images/arrow.svg" alt="arrow" className="w-12 h-12" />
            </div>

            {/* Step 5: Распределение */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="w-[260px] h-[300px] flex flex-col items-center p-4 border border-gray-200 rounded-2xl bg-white shadow-md"
            >
              <div className="w-[260px] h-[150px] mb-4 flex items-center justify-center">
                <div className="text-6xl">🥧</div>
              </div>
              <h3 className="font-bold text-xl mb-4 text-center w-full">Распределение</h3>
              <div className="text-center w-full">
                <div className="text-lg font-bold text-blue-500 mb-2">
                  <CountUp end={8750} prefix="$" />
                  <span className="text-sm">/мес</span>
                </div>
                <div className="text-sm mb-3">вам</div>
                <div className="text-lg font-bold text-purple-500 mb-2">
                  <CountUp end={8750} prefix="$" />
                  <span className="text-sm">/мес</span>
                </div>
                <div className="text-sm">нам (50% × 12 мес)</div>
              </div>
            </motion.div>
          </div>

          {/* Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-r from-bg-primary to-bg-secondary p-8 rounded-2xl"
          >
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-text-primary">Прежде</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Бухгалтерия</span>
                    <span className="font-bold">
                      <CountUp end={20} /> человек
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>ФОТ</span>
                    <span className="font-bold text-red-500">
                      <CountUp end={25000} prefix="$" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Экономия</span>
                    <span className="font-bold text-red-500">
                      <CountUp end={0} prefix="$" />
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-text-primary">После</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Бухгалтерия</span>
                    <span className="font-bold text-green-500">
                      <CountUp end={6} /> человек
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>ФОТ</span>
                    <span className="font-bold text-green-500">
                      <CountUp end={7500} prefix="$" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Экономия</span>
                    <span className="font-bold text-green-500">
                      <CountUp end={17500} prefix="$" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-col items-center gap-4">
                <div className="text-xl font-bold">
                  Пример: $17500 экономия → $8750 нам → $8750 ваша чистая экономия
                </div>
                <div className="flex justify-between items-center w-full">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      <CountUp end={8750} prefix="$" />
                    </div>
                    <div className="text-text-secondary">ваша чистая экономия</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">
                      <CountUp end={8750} prefix="$" />
                    </div>
                    <div className="text-text-secondary">нам</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CaseSection;
