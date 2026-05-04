import React from 'react';

interface PastaIconProps {
  size?: number | string;
  strokeWidth?: number | string;
  className?: string;
}

export const PastaIcon: React.FC<PastaIconProps> = ({ 
  size = 24, 
  strokeWidth = 1.5, 
  className = "" 
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M 4 8 C 4 6.5 5.5 6 6.5 7 L 10 9.5 L 10 14.5 L 6.5 17 C 5.5 18 4 17.5 4 16 Z" />
    <path d="M 20 8 C 20 6.5 18.5 6 17.5 7 L 14 9.5 L 14 14.5 L 17.5 17 C 18.5 18 20 17.5 20 16 Z" />
    <rect x="9" y="9" width="6" height="6" rx="2" />
  </svg>
);
