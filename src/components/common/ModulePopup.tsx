import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { moduleData } from '../../data/modules'; // Import the refactored moduleData

interface ModulePopupProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  moduleName: string;
  moduleIcon: string;
  tagline: string;
  price: string;
  status: string;
}

const ModulePopup: React.FC<ModulePopupProps> = ({
  isOpen,
  onClose,
  moduleId,
  moduleName,
  moduleIcon,
  tagline,
  price,
  status,
}) => {
  const { t } = useTranslation('modules'); // Use the 'modules' namespace
  const [activeTab, setActiveTab] = useState<'keyBenefits' | 'howItWorks' | 'useCases'>(
    'keyBenefits'
  );

  if (!isOpen) return null;

  const data = moduleData[moduleId as keyof typeof moduleData] || {
    keyBenefits: [],
    howItWorksKeys: [],
    useCasesKeys: [],
  };

  // Define types for benefit data
  interface BenefitItem {
    titleKey: string;
    descriptionKey: string;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'keyBenefits':
        return (
          <div className="space-y-3">
            {(data.keyBenefits as BenefitItem[]).map((benefit, index: number) => (
              <div key={index} className="p-3 bg-bg-tertiary/50 rounded-lg">
                <h4 className="font-semibold text-text-primary mb-1 text-sm sm:text-base">
                  {t(benefit.titleKey)}
                </h4>
                <p className="text-text-secondary text-xs sm:text-sm">
                  {t(benefit.descriptionKey)}
                </p>
              </div>
            ))}
          </div>
        );
      case 'howItWorks':
        return (
          <div className="space-y-2">
            {data.howItWorksKeys.map((key: string, index: number) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 mt-1 mr-2 w-5 h-5 rounded-full bg-primary-telegram/20 flex items-center justify-center">
                  <span className="text-primary-telegram text-xs">{index + 1}</span>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm">{t(key)}</p>
              </div>
            ))}
          </div>
        );
      case 'useCases':
        return (
          <ul className="space-y-1">
            {data.useCasesKeys.map((key: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-telegram mr-1 text-sm">•</span>
                <span className="text-text-secondary text-xs sm:text-sm">{t(key)}</span>
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/90 backdrop-blur-[80px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto bg-bg-primary rounded-2xl sm:rounded-3xl shadow-2xl border border-border"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '90vh' }}
          >
            <div className="p-4 sm:p-6">
              {/* Заголовок попапа с кнопкой закрытия в правом верхнем углу */}
              <div className="relative">
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 sm:top-2 sm:right-3 text-text-secondary hover:text-text-primary z-10 p-1"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6 pt-4 sm:pt-0">
                  <div className="flex flex-col sm:flex-row items-center text-center sm:text-left mb-2 sm:mb-0">
                    <span className="text-2xl sm:text-3xl mr-0 sm:mr-3 mb-1 sm:mb-0">
                      {moduleIcon}
                    </span>
                    <div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">
                        {moduleName}
                      </h2>
                      <p className="text-text-secondary text-xs sm:text-sm md:text-base">
                        {tagline}
                      </p>
                    </div>
                  </div>
                  <div className="text-center sm:text-right mt-1 sm:mt-0">
                    <div className="text-primary-telegram font-bold text-base sm:text-lg">
                      {price}
                    </div>
                    <div className="text-text-secondary text-xs sm:text-sm">{status}</div>
                  </div>
                </div>
              </div>

              {/* Вкладки */}
              <div className="flex flex-wrap justify-center border-b border-border mb-3 sm:mb-4 overflow-x-auto pb-1">
                <button
                  className={`px-2 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'keyBenefits'
                      ? 'text-primary-telegram border-b-2 border-primary-telegram'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                  onClick={() => setActiveTab('keyBenefits')}
                >
                  {t('modules.tabs.keyBenefits')}
                </button>
                <button
                  className={`px-2 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'howItWorks'
                      ? 'text-primary-telegram border-b-2 border-primary-telegram'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                  onClick={() => setActiveTab('howItWorks')}
                >
                  {t('modules.tabs.howItWorks')}
                </button>
                <button
                  className={`px-2 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'useCases'
                      ? 'text-primary-telegram border-b-2 border-primary-telegram'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                  onClick={() => setActiveTab('useCases')}
                >
                  {t('modules.tabs.useCases')}
                </button>
              </div>

              {/* Контент вкладок */}
              <div className="mb-4 sm:mb-6 max-h-[50vh] overflow-y-auto pr-2">
                {renderContent()}
              </div>

              {/* Кнопка CTA внизу */}
              <div className="sticky bottom-0 bg-bg-primary pt-3 sm:pt-4 border-t border-border">
                <button
                  onClick={() => {
                    onClose();
                    // Smooth scroll to contact section
                    const element = document.getElementById('contact');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full py-2 sm:py-3 bg-gradient-to-r from-primary-telegram to-primary-electric text-white rounded-lg font-bold hover:opacity-90 transition-opacity text-sm sm:text-base"
                >
                  {t('modules.ctaButton')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModulePopup;
