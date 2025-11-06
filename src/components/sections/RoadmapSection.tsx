import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Clock, Calendar, Rocket, Zap } from 'lucide-react';
import VotingModal from '../common/VotingModal';

const RoadmapSection: React.FC = () => {
  const { t } = useTranslation('roadmap');
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);

  const quarters = t('quarters', { returnObjects: true }) as { label: string; status: string; features: { title: string; description: string }[] }[];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'planned': return <Calendar className="w-5 h-5 text-yellow-500" />;
      case 'future': return <Zap className="w-5 h-5 text-purple-500" />;
      case 'vision': return <Rocket className="w-5 h-5 text-indigo-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'planned': return 'bg-yellow-500';
      case 'future': return 'bg-purple-500';
      case 'vision': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <section id="roadmap" className="py-20 bg-gradient-to-b from-bg-primary to-bg-secondary">
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

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary-telegram to-primary-electric"></div>
          
          <div className="space-y-20">
            {quarters.map((quarter, index) => (
              <motion.div 
                key={quarter.label}
                className={`flex flex-col lg:flex-row items-center gap-12`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} lg:w-1/2`}>
                  <div className="glass rounded-2xl p-8 border border-border/50">
                    <div className="flex items-center mb-6">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${getStatusColor(quarter.status)} bg-opacity-20`}>
                        {getStatusIcon(quarter.status)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-text-primary">{quarter.label}</h3>
                        <span className="text-text-secondary capitalize">{t(`statuses.${quarter.status}`)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {quarter.features.map((feature) => (
                        <div key={feature.title} className="flex items-start p-4 bg-bg-tertiary/50 rounded-xl hover:bg-bg-tertiary transition-colors">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 mt-1 ${getStatusColor(quarter.status)} bg-opacity-20`}>
                            {getStatusIcon(quarter.status)}
                          </div>
                          <div>
                            <h4 className="font-medium text-text-primary">{feature.title}</h4>
                            <p className="text-text-secondary text-sm">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} lg:w-1/2 flex justify-center`}>
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-primary-telegram flex items-center justify-center text-white font-bold text-lg z-10">
                      {quarter.label}
                    </div>
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full ${getStatusColor(quarter.status)} opacity-20`}></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature Voting Teaser */}
        <motion.div 
          className="mt-20 bg-gradient-to-r from-primary-mint/10 to-primary-neon/10 rounded-2xl p-8 border border-border/50 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="text-2xl mr-2">💡</div>
            <h3 className="text-xl font-bold text-text-primary">{t('feature_voting.title')}</h3>
          </div>
          <button 
            onClick={() => setIsVotingModalOpen(true)}
            className="px-6 py-3 bg-primary-telegram text-white rounded-lg font-medium hover:bg-primary-electric transition-colors"
          >
            {t('feature_voting.button')}
          </button>
        </motion.div>



        <VotingModal isOpen={isVotingModalOpen} onClose={() => setIsVotingModalOpen(false)} />
      </div>
    </section>
  );
};

export default RoadmapSection;