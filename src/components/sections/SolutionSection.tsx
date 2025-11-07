import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Check, MessageCircle, Calendar, BarChart3, Smartphone, Layers, Brain } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SolutionSection: React.FC = () => {
  const { t } = useTranslation('solution');
  const { theme } = useTheme();

  const benefits = t('benefits', { returnObjects: true }) as { title: string; description: string; highlights: string[]; icon: string }[];
  const comparisonData = t('comparison.data', { returnObjects: true }) as { feature: string; freelancer: string; corp: string; aibro: string }[];

  const icons: { [key: string]: React.ReactNode } = {
    MessageCircle: <MessageCircle className="w-8 h-8" />,
    Calendar: <Calendar className="w-8 h-8" />,
    BarChart3: <BarChart3 className="w-8 h-8" />,
    Smartphone: <Smartphone className="w-8 h-8" />,
    Layers: <Layers className="w-8 h-8" />,
    Brain: <Brain className="w-8 h-8" />,
  };

  return (
    <section className="py-20 bg-gradient-to-b from-bg-secondary to-bg-primary" id="solution">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text">
            {t('title')}
          </h2>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="space-y-20">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={benefit.title}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className={`lg:w-1/2`}>
                <div className="bg-gradient-to-br from-primary-telegram/10 to-primary-electric/10 p-8 rounded-2xl">
                  <div className="w-16 h-16 bg-primary-telegram/10 rounded-xl flex items-center justify-center text-primary-telegram mb-6">
                    {icons[benefit.icon] || <MessageCircle className="w-8 h-8" />}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-text-primary">{benefit.title}</h3>
                  <p className="text-text-secondary mb-6">{benefit.description}</p>
                  <ul className="space-y-3">
                    {benefit.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-primary-electric mt-1 mr-3 flex-shrink-0" />
                        <span className="text-text-secondary">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={`lg:w-1/2`}>
                {index === 0 ? (
                  <img
                    src={theme === 'dark' ? '/images/решения.png' : '/images/решениябелый.png'}
                    alt={`${t('visualization')}: ${benefit.title}`}
                    className="w-full h-80 object-contain rounded-xl"
                  />
                ) : index === 1 ? (
                  <img
                    src={'/images/решения1.png'}
                    alt={`${t('visualization')}: ${benefit.title}`}
                    className="w-full h-80 object-contain rounded-xl"
                  />
                ) : (
                  <img
                    src={'/images/решения2.png'}
                    alt={`${t('visualization')}: ${benefit.title}`}
                    className="w-full h-80 object-contain rounded-xl"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
          <div className="mt-32 overflow-x-auto">
            <h3 className="text-3xl font-bold text-center mb-12 text-text-primary">
              {t('comparison.title')}
            </h3>
            {/* Desktop/Tablet version - table */}
            <div className="hidden md:block w-full">
              <table className="w-full border-collapse table-fixed">
                <thead>
                  <tr className="bg-bg-tertiary">
                    <th className="p-4 text-left text-text-primary font-semibold w-[40%]">{t('comparison.headers.feature')}</th>
                    <th className="p-4 text-center text-amber-600 font-semibold w-[20%]">{t('comparison.headers.freelancer')}</th>
                    <th className="p-4 text-center text-blue-600 font-semibold w-[20%]">{t('comparison.headers.corp')}</th>
                    <th className="p-4 text-center text-primary-telegram font-semibold w-[20%]">{t('comparison.headers.aibro')}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, idx) => (
                    <motion.tr 
                      key={idx}
                      className="border-b border-border hover:bg-bg-tertiary transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                    >
                      <td className="p-4 font-medium text-text-primary break-words">{row.feature}</td>
                      <td className="p-4 text-center text-text-secondary break-words">{row.freelancer}</td>
                      <td className="p-4 text-center text-text-secondary break-words">{row.corp}</td>
                      <td className="p-4 text-center text-primary-telegram font-medium break-words">{row.aibro}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile version - cards */}
            <div className="md:hidden space-y-6">
              {comparisonData.map((row, idx) => (
                <motion.div
                  key={idx}
                  className="bg-bg-tertiary rounded-xl p-4 border border-border"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <div className="font-medium text-text-primary mb-4">{row.feature}</div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                      <span className="text-amber-600 font-medium">{t('comparison.headers.freelancer')}</span>
                      <span className="text-text-secondary text-right">{row.freelancer}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                      <span className="text-blue-600 font-medium">{t('comparison.headers.corp')}</span>
                      <span className="text-text-secondary text-right">{row.corp}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary-telegram/20 to-primary-electric/20 rounded-lg">
                      <span className="text-primary-telegram font-medium">{t('comparison.headers.aibro')}</span>
                      <span className="text-primary-telegram text-right">{row.aibro}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        {/* CTA Banner */}
        <motion.div 
          className="mt-16 sm:mt-20 w-full max-w-[90vw] sm:max-w-[calc(100%-500px)] mx-auto bg-[#334155]/70 rounded-[20px] p-4 sm:p-8 text-center text-white backdrop-blur-[15px]"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-[#00DDFD]">{t('cta.title')}</h3>
          <button 
            className="bg-[#00DDFD] text-white font-bold px-6 py-2 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg hover:bg-[#00DDFD]/80 transition-colors w-full max-w-[300px]"
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {t('cta.button')}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;