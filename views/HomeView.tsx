
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Recipe } from '../types.ts';

interface HomeViewProps {
  recipes: Recipe[];
  onSelectRecipe: (r: Recipe) => void;
  onStart?: () => void;
  onLogin?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStart, onLogin }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center min-h-[calc(100dvh-3.5rem)] bg-[#f2f2f2] dark:bg-[#0a0a0a] px-5 pb-4 animate-in fade-in duration-1000">
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg w-full pb-24">
        <h1 className="font-amatic text-[64px] md:text-[92px] text-black dark:text-white leading-none uppercase tracking-[0.05em] mb-4 flex flex-wrap justify-center gap-x-3 md:gap-x-5">
          <span className="font-normal opacity-80">{t('The')}</span>
          <span className="font-bold">{t('Recipes')}</span>
          <span className="text-[0.6em] self-center opacity-40 mx-[-0.2em]">•</span>
          <span className="font-bold [text-shadow:_0.8px_0_0_currentColor]">{t('Lab')}</span>
        </h1>

        <p className="font-mooli text-[13px] md:text-[15px] text-gray-400 dark:text-gray-500 tracking-[0.2em] mb-12 opacity-80">
          {t('as suas receitas favoritas num só lugar')}
        </p>

        <div className="w-28 h-28 md:w-36 md:h-36 opacity-90">
          <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full h-full stroke-black dark:stroke-white" 
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M50 94 L9 54 L5 22 L28 5 L48 16 L74 5 L95 22 L91 54 Z" />
            <path d="M48 16 L49 26 L50 94" />
            <path d="M48 16 L49 26 L50 94" />
            <path d="M5 22 L49 26 L95 22" />
            <path d="M5 22 L50 94" />
            <path d="M95 22 L50 94" />
          </svg>
        </div>
      </div>

      <div className="w-full max-w-xs flex flex-col items-center gap-4 pb-2">
        {onStart && (
          <button 
            onClick={onStart}
            className="w-full max-w-[140px] bg-black dark:bg-white text-white dark:text-black py-2.5 px-5 rounded-full font-mooli font-medium text-[13px] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10 dark:shadow-white/5"
          >
            {t('Começar')}
          </button>
        )}
        
        {onLogin && (
          <p className="text-[13px] font-mooli text-gray-400 dark:text-gray-500">
            {t('Já tem uma conta?')} {' '}
            <button 
              onClick={onLogin}
              className="text-black dark:text-white font-bold hover:underline"
            >
              {t('Entrar')}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
