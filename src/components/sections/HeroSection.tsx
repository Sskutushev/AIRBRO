import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import CountUp from '../common/CountUp';
import Modal from '../common/Modal';
import { useTheme } from '../../context/ThemeContext';

const HeroSection: React.FC = () => {
  const { t } = useTranslation('hero');
  const { theme } = useTheme();
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-bg-primary to-bg-secondary pt-20">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-telegram/10 via-primary-electric/10 to-primary-neon/10 animate-gradient-shift"></div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Left content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('title')}
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-text-secondary mb-10 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                variant="gradient-primary"
                size="xl"
                className="text-lg px-8 py-4"
                glow={true}
                onClick={() => {
                  window.open('https://t.me/aipostmaster_bot', '_blank');
                }}
              >
                {t('cta.primary')}
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="text-lg px-8 py-4 border-text-secondary text-text-primary hover:border-primary-telegram hover:text-primary-telegram"
                onClick={() => setShowVideoModal(true)}
              >
                {t('cta.secondary')} →
              </Button>
            </motion.div>

            {/* Additional "Start Small" Button */}
            <motion.div
              className="mt-4 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="inline-flex flex-col items-center lg:items-start">
                <div className="text-text-secondary text-sm mb-2">{t('low_barrier')}</div>
                <Button
                  variant="ghost"
                  size="md"
                  className="text-primary-telegram hover:bg-primary-telegram/10 px-0 underline"
                  onClick={() => {
                    // Scroll to packages section
                    const element = document.getElementById('pricing');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {t('start_small_cta')}
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 max-w-xs mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-telegram">
                  <CountUp end={500} suffix="+" />
                </div>
                <div className="text-text-secondary text-sm">{t('stats.businesses')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-electric">
                  <CountUp end={50} suffix="K+" />
                </div>
                <div className="text-text-secondary text-sm">{t('stats.posts')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-neon">
                  <CountUp end={4.8} />
                </div>
                <div className="text-text-secondary text-sm">{t('stats.rating')}</div>
              </div>
            </motion.div>
          </div>

          {/* Right content - 3D Visual */}
          <div className="w-full lg:w-1/2 flex justify-center mt-8 lg:mt-0">
            <motion.div
              className="relative w-[320px] h-[320px] sm:w-[370px] sm:h-[370px] md:w-[420px] md:h-[420px] lg:w-[470px] lg:h-[470px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <video
                src={theme === 'dark' ? '/images/Heroblack.mp4' : '/images/HeroWhite.mp4'}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-2xl relative z-10"
              />

              {/* Floating particles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-primary-electric/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
                  style={{
                    width: `${20 + i * 10}px`,
                    height: `${20 + i * 10}px`,
                    top: `${20 + i * 15}%`,
                    left: `${10 + i * 15}%`,
                  }}
                  animate={{
                    y: [0, -20 - i * 5, 0],
                    x: [0, 10 + i * 5, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 6 + i * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.5,
                  }}
                >
                  <div className="text-white text-xs">💬</div>
                </motion.div>
              ))}

              {/* Gradient mesh effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-mint/20 via-primary-electric/20 to-primary-neon/20 animate-gradient-x"></div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="hidden md:flex absolute bottom-[45px] left-1/2 transform -translate-x-1/2 flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <span className="text-text-tertiary text-sm mb-2">{t('scroll_down')}</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-primary-telegram flex justify-center p-1">
              <div className="w-1 h-3 bg-primary-telegram rounded-full animate-pulse"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Modal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)}>
        <div className="relative pt-[56.25%] w-full">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </Modal>
    </section>
  );
};

export default HeroSection;
