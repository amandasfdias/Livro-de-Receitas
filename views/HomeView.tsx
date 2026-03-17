
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Recipe } from '../types.ts';
import { Logo } from '../components/Logo';

interface HomeViewProps {
  recipes: Recipe[];
  onSelectRecipe: (r: Recipe) => void;
}

export const HomeView: React.FC<HomeViewProps> = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9f9f9] dark:bg-[#0a0a0a] px-8 animate-in fade-in duration-1000">
      <div className="flex flex-col items-center text-center">
        <h1 className="font-amatic font-bold text-[64px] md:text-[92px] text-black dark:text-white leading-none uppercase tracking-[0.05em] mb-10">
          {t('My Recipes Book')}
        </h1>

        <div className="w-28 h-28 md:w-40 md:h-40 opacity-90">
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

        <p className="font-mooli text-[13px] md:text-[15px] text-gray-400 dark:text-gray-500 tracking-[0.2em] mt-12 opacity-80">
          {t('suas receitas favoritas em um só lugar')}
        </p>
      </div>
    </div>
  );
};
