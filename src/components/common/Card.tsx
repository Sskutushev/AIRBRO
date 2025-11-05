import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'gradient';
  hover?: boolean;
  delay?: number;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hover = false,
  delay = 0,
  className = '',
  onClick
}) => {
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    glass: 'bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 shadow-lg',
    gradient: 'bg-gradient-to-br from-primary-purple to-primary-blue text-white'
  };

  const baseClasses = `
    ${variantClasses[variant]} 
    rounded-2xl p-6 shadow-md
    transition-all duration-300
    ${hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''}
    ${className}
  `;

  const cardElement = (
    <div 
      className={baseClasses}
      onClick={onClick}
    >
      {children}
    </div>
  );

  // Apply animation based on whether hover is enabled
  if (hover) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
      >
        {cardElement}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {cardElement}
    </motion.div>
  );
};

export default Card;