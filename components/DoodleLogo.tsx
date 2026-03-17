
import React from 'react';

export const DoodleLogo: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'lg' }) => {
  const isLarge = size === 'lg';
  const dimensions = isLarge ? 'w-40 h-40 md:w-56 md:h-56' : 'w-24 h-24';

  return (
    <div className={`flex flex-col items-center justify-center select-none ${isLarge ? 'scale-110 md:scale-125' : ''}`}>
      <div className={`${dimensions} opacity-90`}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full stroke-black dark:stroke-white" 
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Contorno Externo */}
          <path d="M50 94 L9 54 L5 22 L28 5 L48 16 L74 5 L95 22 L91 54 Z" />
          {/* Linha Central */}
          <path d="M48 16 L49 26 L50 94" />
          {/* Linhas Horizontais */}
          <path d="M5 22 L49 26 L95 22" />
          {/* Linhas Diagonais */}
          <path d="M5 22 L50 94" />
          <path d="M95 22 L50 94" />
        </svg>
      </div>
    </div>
  );
};

