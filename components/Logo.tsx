import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'lg' }) => {
  const isLarge = size === 'lg';
  
  return (
    <div className="flex flex-col items-center justify-center select-none group">
      <div className="relative flex items-end">
        {/* Texto "cuore" usando a fonte Dancing Script (importada no index.html) */}
        <span className={`logo-cursive text-black dark:text-white leading-[0.8] ${isLarge ? 'text-[120px]' : 'text-5xl'}`}>
          cuore
        </span>
        
        {/* Coração Geométrico (SVG replicando o estilo da foto) */}
        <div className={`ml-1 mb-4 ${isLarge ? 'w-16 h-16' : 'w-8 h-8'}`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-black dark:stroke-white" strokeWidth="2.5">
            {/* Contorno Externo do Coração Geométrico */}
            <path d="M50 85L15 50L30 20L50 35L70 20L85 50L50 85Z" />
            {/* Linhas Internas Geométricas */}
            <path d="M15 50L50 35M85 50L50 35" />
            <path d="M50 35V85" />
            <path d="M30 20V50M70 20V50" />
            <path d="M15 50L30 50M85 50L70 50" />
            <path d="M30 50L50 85L70 50L30 50" />
          </svg>
        </div>
      </div>
      
      {/* Subtítulo "bake & craft studio" */}
      <p className={`font-sans text-black dark:text-white font-medium uppercase tracking-[0.25em] ${isLarge ? 'text-[14px] mt-2' : 'text-[7px] mt-0.5'}`}>
        bake & craft studio
      </p>
    </div>
  );
};