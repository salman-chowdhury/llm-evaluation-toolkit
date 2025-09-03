import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32
  };

  return (
    <div className={`loading-spinner ${className}`} role="status" aria-label={text}>
      <Loader2 size={sizeMap[size]} className="animate-spin" aria-hidden="true" />
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;