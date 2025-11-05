import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  gradient?: boolean;
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  icon: Icon,
  gradient = false,
  glow = false,
  className = '',
  disabled = false
}) => {
  // Define size classes
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg'
  };

  // Define variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-coral to-primary-gold text-white',
    secondary: 'bg-white text-primary-coral border border-primary-coral',
    ghost: 'text-primary-coral hover:bg-primary-coral hover:text-white',
    cta: 'bg-gradient-to-r from-primary-coral to-primary-teal text-white'
  };

  // Combine classes
  const classes = `
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${gradient ? 'bg-gradient-to-r from-primary-coral to-primary-teal' : ''} 
    ${glow ? 'shadow-lg shadow-primary-coral/30' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:scale-95'}
    font-bold rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2
    ${className}
  `;

  const buttonContent = (
    <button 
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );

  return (
    <motion.div
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className="inline-block"
    >
      {buttonContent}
    </motion.div>
  );
};

export default Button;