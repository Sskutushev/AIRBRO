import React, { useState } from 'react';
import Modal from '../common/Modal';

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

interface SolutionDetailModalProps {
  solution: SolutionData | null;
  isOpen: boolean;
  onClose: () => void;
}

const SolutionDetailModal: React.FC<SolutionDetailModalProps> = ({ solution, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('solution');

  if (!solution) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          <div className="w-full md:w-[500px] h-[250px] flex-shrink-0">
            <img 
              src={solution.icon} 
              alt={solution.name} 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 w-full">
            <h2 className="text-3xl font-bold text-text-primary mb-2">{solution.name}</h2>
            <div className="text-xl text-primary-coral mb-4">{solution.category}</div>
            <div className="mb-4">
              <div className="text-lg font-bold text-text-secondary">Проблема:</div>
              <div className="text-lg text-text-primary">{solution.problem}</div>
            </div>
            <div className="mb-4">
              <div className="text-lg font-bold text-text-secondary">Решение:</div>
              <div className="text-lg text-text-primary">{solution.solution}</div>
            </div>
            <div className="mb-4">
              <div className="text-lg font-bold text-text-secondary">Результат:</div>
              <div className="text-lg text-text-primary">{solution.result}</div>
            </div>
            <div className="text-2xl font-bold text-primary-teal">{solution.metric}</div>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <div className="flex flex-wrap space-x-4">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'solution' 
                  ? 'text-primary-coral border-b-2 border-primary-coral' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setActiveTab('solution')}
            >
              Решение
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'benefits' 
                  ? 'text-primary-coral border-b-2 border-primary-coral' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setActiveTab('benefits')}
            >
              Преимущества
            </button>
          </div>
        </div>

        {activeTab === 'solution' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">Проблема на рынке</h3>
              <p className="text-text-secondary text-lg leading-relaxed">{solution.description}</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">Подробное решение</h3>
              <p className="text-text-secondary text-lg leading-relaxed">{solution.solutionDetails}</p>
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div>
            <h3 className="text-2xl font-bold text-text-primary mb-6">Преимущества</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {solution.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-coral mr-3 mt-1">✓</span>
                  <span className="text-text-secondary">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SolutionDetailModal;