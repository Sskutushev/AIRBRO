import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import Button from '../common/Button';
import CountUp from '../common/CountUp';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-bg-primary via-white to-bg-secondary pt-20">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-electric/10 via-primary-violet/10 to-primary-gold/10 animate-gradient-shift"></div>
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        ></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Left content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              AIRBRO Business
              <br />
              <span className="text-text-primary">AI-операционная система для Telegram-бизнеса</span>
            </motion.h1>
            
            <motion.div
              className="text-xl md:text-2xl text-text-secondary mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <TypeAnimation
                sequence={[
                  'Автоматизируйте контент, поддержку и продажи через Telegram',
                  2000,
                  'Демократизируем AI-автоматизацию для малого бизнеса',
                  2000,
                  'Telegram-нативная экосистема для вашего бизнеса',
                  2000
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                style={{ display: 'inline-block' }}
                className="text-text-primary"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button 
                variant="cta" 
                size="lg" 
                className="text-lg px-8 py-4 mb-6"
                glow={true}
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Попробовать бесплатно
              </Button>
              <p className="text-text-secondary text-sm">
                72-часовой челлендж без рисков
              </p>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              className="flex justify-center items-center gap-6 mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-electric">
                  <CountUp end={72} suffix="ч" />
                </div>
                <div className="text-text-secondary text-sm">челлендж</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-violet">
                  <CountUp end={40} suffix="%" />
                </div>
                <div className="text-text-secondary text-sm">экономия времени</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-gold">
                  <CountUp end={500} suffix="+" />
                </div>
                <div className="text-text-secondary text-sm">довольных клиентов</div>
              </div>
            </motion.div>
          </div>
          
          {/* Right content - 3D Brain */}
          <div className="w-full lg:w-1/2 flex justify-center mt-8 lg:mt-0">
            <motion.div
              className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[370px] md:h-[370px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* 3D Brain Image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="/images/Hero3D.png" 
                  alt="AI Brain 3D" 
                  className="w-full h-full object-contain"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(0, 217, 255, 0.5))' }}
                />
              </div>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute top-10 left-10 w-16 h-16 rounded-full bg-primary-electric/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 10, 0, -10, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <div className="text-white text-lg">🤖</div>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-12 right-16 w-12 h-12 rounded-full bg-primary-violet/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
                animate={{ 
                  y: [0, 15, 0],
                  rotate: [0, -15, 0, 15, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <div className="text-white text-lg">💬</div>
              </motion.div>
              
              <motion.div 
                className="absolute top-1/3 right-8 w-10 h-10 rounded-full bg-primary-gold/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 20, 0, -20, 0]
                }}
                transition={{ 
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="text-white text-lg">📱</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-[45px] left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <span className="text-text-muted text-sm mb-2">Прокрутите вниз</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-primary-electric flex justify-center p-1">
              <div className="w-1 h-3 bg-primary-electric rounded-full animate-pulse"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;