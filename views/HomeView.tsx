
import React from 'react';
import { Recipe } from '../types.ts';

interface HomeViewProps {
  recipes: Recipe[];
  onSelectRecipe: (r: Recipe) => void;
}

export const HomeView: React.FC<HomeViewProps> = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f7f7f7] dark:bg-[#0a0a0a] px-8 animate-in fade-in duration-1000">
      <div className="flex flex-col items-center text-center">
        {/* Título Principal em Destaque */}
        <h1 className="font-amatic font-bold text-[85px] md:text-[125px] text-black dark:text-white leading-none uppercase tracking-tighter">
          Cuore
        </h1>
        
        {/* Subtítulo Imediatamente Abaixo */}
        <h2 className="font-amatic font-bold text-[34px] md:text-[44px] text-black dark:text-white leading-none uppercase tracking-[0.12em] mt-1">
          Livro de Receitas
        </h2>
        
        {/* Slogan posicionado com a fonte Mooli, em negrito, minúsculo e um ponto maior (text-[11px] md:text-[12px]) */}
        <div className="pt-32">
          <p className="font-mooli text-[11px] md:text-[12px] text-gray-400 dark:text-gray-500 tracking-[0.35em] font-bold opacity-80">
            suas receitas em um só lugar
          </p>
        </div>

        {/* Detalhe de respiro visual no final */}
        <div className="pt-10 flex justify-center opacity-5">
          <div className="w-10 h-[1px] bg-black dark:bg-white"></div>
        </div>
      </div>
    </div>
  );
};
