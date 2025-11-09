import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Card from '../components/common/Card';
import SolutionDetailModal from '../components/sections/SolutionDetailModal';
import { solutionsData } from '../lib/solutionsData';
import { staggerContainer, fadeInUp } from '../lib/motionPresets';

// Определим интерфейс локально
interface SolutionData {
  id: string;
  name: string;
  icon: string;
  category: string;
  problem: string;
  solution: string;
  result: string;
  metric: string;
  description: string;
  solutionDetails: string;
  benefits: string[];
}

const SolutionsPage: React.FC = () => {
  const [selectedSolution, setSelectedSolution] = useState<SolutionData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  // Прокрутка к верху страницы при загрузке
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const openSolutionDetail = (solutionId: string) => {
    const solution = solutionsData.find((s) => s.id === solutionId);
    if (solution) {
      setSelectedSolution(solution);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary pt-20 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <Link
            to="/#products"
            className="flex items-center text-primary-coral font-bold mb-8 hover:underline"
          >
            <span className="mr-2">←</span> Назад к решениям
          </Link>

          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h1 className="text-5xl font-bold mb-6 gradient-text" variants={fadeInUp}>
              Наши Решения
            </motion.h1>
            <motion.p
              className="text-2xl text-text-secondary max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Специализированные AI-агенты для решения конкретных бизнес-задач
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {solutionsData.map((solution, index) => (
            <motion.div
              key={solution.id}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                variant="glass"
                hover={true}
                className="h-full p-8 flex flex-col cursor-pointer"
                onClick={() => openSolutionDetail(solution.id)}
              >
                <div className="w-24 h-24 mb-6 self-center flex items-center justify-center">
                  <img
                    src={solution.icon}
                    alt={solution.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-center text-text-primary">
                  {solution.name}
                </h3>
                <div className="text-primary-coral text-center mb-4">{solution.category}</div>

                <div className="mb-4">
                  <div className="font-semibold text-text-secondary mb-1">Проблема:</div>
                  <div className="text-text-primary">{solution.problem}</div>
                </div>

                <div className="mb-4">
                  <div className="font-semibold text-text-secondary mb-1">Решение:</div>
                  <div className="text-text-primary">{solution.solution}</div>
                </div>

                <div className="mb-4">
                  <div className="font-semibold text-text-secondary mb-1">Результат:</div>
                  <div className="text-text-primary">{solution.result}</div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-200">
                  <div className="text-center font-bold text-primary-teal">{solution.metric}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {selectedSolution && (
          <SolutionDetailModal
            solution={selectedSolution}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default SolutionsPage;
