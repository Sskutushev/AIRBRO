import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient-primary' | 'gradient-cta' | 'white';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  glow?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  glow = false, 
  loading = false, 
  children, 
  className = '', 
  ...props 
}) => {
  const baseClasses = "font-semibold rounded-lg transition-all duration-300 flex items-center justify-center";

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };

  const variantClasses = {
    primary: "bg-gradient-to-r from-primary-telegram to-primary-electric text-white hover:opacity-90",
    'gradient-primary': "bg-gradient-to-r from-primary-telegram to-primary-electric text-white",
    'gradient-cta': "bg-gradient-to-r from-accent-coral to-primary-violet text-white",
    secondary: "bg-white text-primary-telegram border border-primary-telegram hover:bg-primary-telegram/10",
    outline: "border border-text-secondary text-text-secondary hover:border-primary-telegram hover:text-primary-telegram",
    ghost: "text-text-secondary hover:bg-bg-secondary",
    white: "bg-white text-text-primary hover:bg-gray-50"
  };

  const glowClass = glow ? "shadow-glow animate-glow-pulse" : "";

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${glowClass} ${className} ${
    loading ? 'opacity-70 cursor-not-allowed' : ''
  }`;

  return (
    <motion.button
      className={classes}
      whileHover={loading ? {} : { scale: 1.03 }}
      whileTap={loading ? {} : { scale: 0.98 }}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;