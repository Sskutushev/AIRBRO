import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide' | 'zoom';
  className?: string;
  delay?: number;
  y?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animation = 'fade',
  className = '',
  delay = 0,
  y = 50
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-100px"
  });

  const animations = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.6, delay } }
    },
    slide: {
      hidden: { opacity: 0, y },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } }
    },
    zoom: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay } }
    }
  };

  const currentAnimation = animations[animation];

  return (
    <motion.section
      ref={ref}
      variants={currentAnimation}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;