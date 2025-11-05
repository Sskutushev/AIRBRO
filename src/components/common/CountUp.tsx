import React, { useState, useEffect } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const CountUp: React.FC<CountUpProps> = ({ 
  end, 
  duration = 2, 
  prefix = '', 
  suffix = '', 
  className = '' 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const totalTime = duration * 1000;

    const animateCount = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / totalTime, 1);
      const currentCount = Math.floor(progress * end);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(end); // Ensure final value is reached
      }
    };

    requestAnimationFrame(animateCount);
  }, [end, duration]);

  return (
    <span className={className}>
      {prefix}{count}{suffix}
    </span>
  );
};

export default CountUp;