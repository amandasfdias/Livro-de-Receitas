
import React, { useState } from 'react';
import { ChefHat, Cookie, Pizza, Croissant, Coffee, Leaf } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeBookViewProps {
  recipes: Recipe[];
  onSelectRecipe: (r: Recipe) => void;
  onToggleFavorite: (id: string) => void;
}

type FilterType = 'DOCE' | 'SALGADO' | 'PANIFICACAO' | 'BEBIDA' | 'FIT' | null;

export const RecipeBookView: React.FC<RecipeBookViewProps> = ({ recipes, onSelectRecipe, onToggleFavorite }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  const getCategoryIcon = (category: string = '') => {
    const cat = category.toUpperCase();
    if (cat.includes('DOCE') || cat.includes('SOBREMESA')) return <Cookie size={14} />;
    if (cat.includes('SALGADO') || cat.includes('ALMOÇO') || cat.includes('JANTAR')) return <Pizza size={14} />;
    if (cat.includes('PÃO') || cat.includes('PANIFICAÇÃO') || cat.includes('MASSA')) return <Croissant size={14} />;
    if (cat.includes('BEBIDA') || cat.includes('SUCO') || cat.includes('CAFÉ') || cat.includes('DRINK')) return <Coffee size={14} />;
    if (cat.includes('FIT') || cat.includes('SAUDÁVEL') || cat.includes('DIET')) return <Leaf size={14} />;
    return <ChefHat size={14} />;
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (!activeFilter) return true;
    const cat = (recipe.category || '').toUpperCase();
    if (activeFilter === 'DOCE') return cat.includes('DOCE') || cat.includes('SOBREMESA') || cat.includes('DOCES');
    if (activeFilter === 'SALGADO') return cat.includes('SALGADO') || cat.includes('ALMOÇO') || cat.includes('JANTAR') || cat.includes('SALGADAS') || cat.includes('LANCHE');
    if (activeFilter === 'PANIFICACAO') return cat.includes('PÃO') || cat.includes('PANIFICAÇÃO') || cat.includes('MASSA') || cat.includes('PADARIA');
    if (activeFilter === 'BEBIDA') return cat.includes('BEBIDA') || cat.includes('SUCO') || cat.includes('CAFÉ') || cat.includes('DRINK') || cat.includes('CHÁ');
    if (activeFilter === 'FIT') return cat.includes('FIT') || cat.includes('SAUDÁVEL') || cat.includes('HEALTHY') || cat.includes('DIET') || cat.includes('LEVE');
    return true;
  });

  const filters: { id: FilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'DOCE', label: 'Doces', icon: <Cookie size={16} /> },
    { id: 'SALGADO', label: 'Salgadas', icon: <Pizza size={16} /> },
    { id: 'PANIFICACAO', label: 'Padaria', icon: <Croissant size={16} /> },
    { id: 'BEBIDA', label: 'Bebidas', icon: <Coffee size={16} /> },
    { id: 'FIT', label: 'Fit', icon: <Leaf size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7] dark:bg-[#0a0a0a] text-black transition-colors duration-300">
      <header className="pt-20 pb-14 px-6 text-center">
        <h2 className="font-amatic font-bold text-[42px] uppercase tracking-tight text-black dark:text-white leading-none">
          Minhas Receitas
        </h2>
      </header>

      <div className="px-6 mb-8">
        <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-6 px-6">
          {filters.map((filter) => (
            <button 
              key={filter.id}
              onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
              className={`
                flex items-center gap-2 px-5 py-2 rounded-md transition-all duration-300 active:scale-95 whitespace-nowrap shrink-0 border border-gray-100 dark:border-white/5 shadow-sm
                ${activeFilter === filter.id 
                  ? 'bg-black text-white' 
                  : 'bg-white dark:bg-white/5 text-black dark:text-white'}
              `}
            >
              {filter.icon}
              <span className="font-amatic font-bold text-[18px] tracking-widest uppercase">{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pb-24 px-6">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map(recipe => (
            <div 
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe)}
              className="relative flex gap-4 p-4 bg-white dark:bg-white/5 rounded-md cursor-pointer active:scale-[0.98] transition-all group border border-gray-100 dark:border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm"
            >
              <div className="w-[80px] h-[80px] bg-[#f7f7f7] dark:bg-[#121212] rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-50 dark:border-white/5">
                {recipe.imageUrl ? (
                  <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="opacity-20 text-black dark:text-white">
                    <ChefHat size={32} strokeWidth={1.5} />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center flex-grow pr-8">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="opacity-30 text-black dark:text-white">{getCategoryIcon(recipe.category)}</span>
                  <h3 className="font-amatic font-bold text-[22px] leading-tight uppercase text-black dark:text-white">
                    {recipe.title}
                  </h3>
                </div>
                {recipe.category && (
                  <div className="mt-0.5">
                    <span className="inline-block px-3 py-0.5 bg-[#f7f7f7] dark:bg-black/40 text-black dark:text-white text-[9px] font-sans opacity-60 rounded-md lowercase tracking-tight border border-gray-100 dark:border-white/5">
                      {recipe.category}
                    </span>
                  </div>
                )}
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(recipe.id);
                }}
                className={`absolute top-4 right-4 p-2 -m-2 transition-all duration-300 active:scale-125 z-10 ${recipe.isFavorite ? 'text-black dark:text-white opacity-100' : 'opacity-20 hover:opacity-100 dark:text-white'}`}
              >
                <span className={`text-[20px] leading-none transition-transform duration-300 block ${recipe.isFavorite ? 'scale-110' : 'scale-100'}`}>
                  {recipe.isFavorite ? '♥︎' : '♥︎'}
                </span>
              </button>
            </div>
          ))
        ) : (
          <div className="py-20 text-center opacity-40 font-amatic text-2xl uppercase tracking-widest text-black dark:text-white">
            Nenhuma receita encontrada
          </div>
        )}
      </div>
    </div>
  );
};
