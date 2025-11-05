import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
  elevation?: 'sm' | 'md' | 'lg';
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  border = true, 
  elevation = 'md' 
}) => {
  const elevationClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  const borderClass = border ? 'border border-border' : '';
  const bgClass = 'bg-bg-primary/80 backdrop-blur-xl';

  return (
    <div className={`
      ${bgClass} 
      ${borderClass} 
      ${elevationClasses[elevation]} 
      rounded-2xl 
      p-6 
      relative
      ${className}
    `}>
      {children}
    </div>
  );
};

export default GlassCard;