
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChefHat, Cookie, Pizza, Croissant, Coffee, Leaf, Search, X, Camera, Plus } from 'lucide-react';
import { Recipe, CustomCategory } from '../types';

interface RecipeBookViewProps {
  recipes: Recipe[];
  onSelectRecipe: (r: Recipe) => void;
  onToggleFavorite: (id: string) => void;
  customCategories?: CustomCategory[];
  hiddenCategories?: string[];
  onAddCategory?: (label: string) => void;
  onDeleteCategory?: (id: string) => void;
}

type FilterType = string | null;

export const RecipeBookView: React.FC<RecipeBookViewProps> = ({ recipes, onSelectRecipe, onToggleFavorite, customCategories = [], hiddenCategories = [], onAddCategory, onDeleteCategory }) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<{id: string, label: string} | null>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem('category_images');
    if (saved) {
      setCategoryImages(JSON.parse(saved));
    }
  }, []);

  const handleImageUpload = (categoryId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = { ...categoryImages, [categoryId]: reader.result as string };
        setCategoryImages(newImages);
        localStorage.setItem('category_images', JSON.stringify(newImages));
      };
      reader.readAsDataURL(file);
    }
  };

  const getCategoryIcon = (category: string = '') => {
    const cat = category.toUpperCase();
    if (cat.includes('DOCE') || cat.includes('SOBREMESA')) return <Cookie size={14} />;
    if (cat.includes('SALGADO') || cat.includes('ALMOÇO') || cat.includes('JANTAR')) return <Pizza size={14} />;
    if (cat.includes('PÃO') || cat.includes('PANIFICAÇÃO') || cat.includes('MASSA')) return <Croissant size={14} />;
    if (cat.includes('BEBIDA') || cat.includes('SUCO') || cat.includes('CAFÉ') || cat.includes('DRINK')) return <Coffee size={14} />;
    if (cat.includes('FIT') || cat.includes('SAUDÁVEL') || cat.includes('DIET')) return <Leaf size={14} />;
    return <ChefHat size={14} />;
  };

  const isRecipeInCategory = (recipe: Recipe, filterId: FilterType) => {
    if (!filterId) return true;
    const cat = (recipe.category || '').toUpperCase();
    if (filterId === 'DOCE') return cat.includes('DOCE') || cat.includes('SOBREMESA') || cat.includes('DOCES');
    if (filterId === 'SALGADO') return cat.includes('SALGADO') || cat.includes('ALMOÇO') || cat.includes('JANTAR') || cat.includes('SALGADAS') || cat.includes('LANCHE');
    if (filterId === 'PANIFICACAO') return cat.includes('PÃO') || cat.includes('PANIFICAÇÃO') || cat.includes('MASSA') || cat.includes('PADARIA');
    if (filterId === 'BEBIDA') return cat.includes('BEBIDA') || cat.includes('SUCO') || cat.includes('CAFÉ') || cat.includes('DRINK') || cat.includes('CHÁ');
    if (filterId === 'FIT') return cat.includes('FIT') || cat.includes('SAUDÁVEL') || cat.includes('HEALTHY') || cat.includes('DIET') || cat.includes('LEVE');
    return cat === filterId;
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          recipe.ingredients?.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!activeFilter) return matchesSearch;
    return matchesSearch && isRecipeInCategory(recipe, activeFilter);
  });

  const getRecipeCount = (filterId: FilterType) => {
    return recipes.filter(r => isRecipeInCategory(r, filterId)).length;
  };

  const filters: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: 'SALGADO', label: t('Salgados'), icon: <Pizza size={24} /> },
    { id: 'DOCE', label: t('Doces'), icon: <Cookie size={24} /> },
    { id: 'PANIFICACAO', label: t('Padaria'), icon: <Croissant size={24} /> },
    { id: 'BEBIDA', label: t('Bebidas'), icon: <Coffee size={24} /> },
    { id: 'FIT', label: t('Fit'), icon: <Leaf size={24} /> },
  ].filter(f => !hiddenCategories.includes(f.id));

  const allFilters = [
    ...filters,
    ...customCategories.map(c => ({ id: c.id, label: c.label, icon: <ChefHat size={24} /> }))
  ];

  const handlePointerDown = (filter: {id: string, label: string}) => {
    isLongPress.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setCategoryToDelete(filter);
    }, 600);
  };

  const handlePointerUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleCardClick = (filterId: string) => {
    if (isLongPress.current) {
      isLongPress.current = false;
      return;
    }
    setActiveFilter(filterId);
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim() && onAddCategory) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <div 
      onClick={() => onSelectRecipe(recipe)}
      className="relative flex gap-4 p-4 bg-white dark:bg-white/5 rounded-xl cursor-pointer active:scale-[0.98] transition-all group border border-gray-100 dark:border-white/5 shadow-sm"
    >
      <div className="w-[80px] h-[80px] bg-[#f7f7f7] dark:bg-[#121212] rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-50 dark:border-white/5">
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
          <h3 className="font-amatic font-bold text-[22px] leading-tight uppercase text-black dark:text-white line-clamp-2">
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
        <span className={`text-[28px] leading-none transition-transform duration-300 block ${recipe.isFavorite ? 'scale-110' : 'scale-100'}`}>
          ♥︎
        </span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f7f7] dark:bg-[#0a0a0a] text-black transition-colors duration-300 flex flex-col pt-16">
      <div className="fixed top-0 left-0 w-full h-16 bg-black z-40 px-6 flex items-center justify-start">
        <div className="w-10 h-10 opacity-90">
          <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full h-full stroke-white" 
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M50 94 L9 54 L5 22 L28 5 L48 16 L74 5 L95 22 L91 54 Z" />
            <path d="M48 16 L49 26 L50 94" />
            <path d="M5 22 L49 26 L95 22" />
            <path d="M5 22 L50 94" />
            <path d="M95 22 L50 94" />
          </svg>
        </div>
      </div>
      <div className="flex-grow pb-24">
        <header className="pt-8 pb-6 px-6">
        <h2 className="font-amatic font-bold text-[40px] uppercase tracking-tight text-black dark:text-white leading-none text-center mb-6">
          {t('Minhas Receitas')}
        </h2>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BD715D]" size={20} />
          <input 
            type="text"
            placeholder={t('Pesquisar receitas...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#1e1e1e] pl-12 pr-4 py-3.5 rounded-md outline-none text-[15px] font-sans border border-gray-100 dark:border-white/5 text-black dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white">
              <X size={16} />
            </button>
          )}
        </div>
      </header>

      {!activeFilter && !searchQuery ? (
        <>
          <div className="px-6 mb-10">
            <h3 className="font-amatic text-[24px] font-bold uppercase tracking-widest mb-4 dark:text-white">{t('Categorias')}</h3>
            <div className="grid grid-cols-2 gap-4">
              {allFilters.map(filter => {
                const count = getRecipeCount(filter.id);
                return (
                  <div 
                    key={filter.id}
                    onPointerDown={() => handlePointerDown(filter)}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    onClick={() => handleCardClick(filter.id)}
                    className="relative h-32 rounded-xl overflow-hidden cursor-pointer group shadow-sm bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-white/5 select-none"
                  >
                    {categoryImages[filter.id] ? (
                      <img src={categoryImages[filter.id]} alt={filter.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-600 transition-transform duration-500 group-hover:scale-110">
                        {filter.icon}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-white font-amatic text-[22px] font-bold tracking-wider leading-none">{filter.label}</h4>
                      <p className="text-white/80 text-[11px] font-sans mt-1">{count} {count === 1 ? t('receita') : t('receitas')}</p>
                    </div>

                    <label 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10 hover:bg-black/60"
                    >
                      <Camera size={14} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(filter.id, e)}
                      />
                    </label>
                  </div>
                );
              })}
              
              {isAddingCategory ? (
                <div className="relative h-32 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center p-3 gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
                    placeholder={t('Nome...')}
                    className="w-full bg-[#f7f7f7] dark:bg-white/5 py-2 px-3 text-[14px] font-mooli font-normal rounded-md outline-none border border-transparent focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-black dark:text-white placeholder:text-gray-400 text-center"
                  />
                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={() => setIsAddingCategory(false)}
                      className="flex-1 py-1.5 text-[12px] font-mooli text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                    >
                      {t('Cancelar')}
                    </button>
                    <button 
                      onClick={handleCreateCategory}
                      disabled={!newCategoryName.trim()}
                      className="flex-1 py-1.5 text-[12px] font-mooli bg-black text-white dark:bg-white dark:text-black rounded-md disabled:opacity-50"
                    >
                      {t('Salvar')}
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => setIsAddingCategory(true)}
                  className="relative h-32 rounded-xl overflow-hidden cursor-pointer group shadow-sm bg-white dark:bg-[#1e1e1e] border border-dashed border-gray-300 dark:border-white/20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <Plus size={24} className="text-gray-400" />
                  <span className="font-amatic text-[20px] font-bold text-gray-500 dark:text-gray-400">{t('Nova Categoria')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="px-6">
            <h3 className="font-amatic text-[24px] font-bold uppercase tracking-widest mb-4 dark:text-white">{t('Últimas Adicionadas')}</h3>
            <div className="space-y-4">
              {recipes.slice(0, 5).map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="px-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-amatic text-[28px] font-bold uppercase tracking-widest dark:text-white">
              {searchQuery ? t('Resultados da busca') : filters.find(f => f.id === activeFilter)?.label}
            </h3>
            {activeFilter && (
              <button 
                onClick={() => setActiveFilter(null)} 
                className="text-[12px] font-sans text-black dark:text-white uppercase tracking-wider border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 px-4 py-2 active:scale-95 transition-all focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white"
              >
                {t('Limpar Filtro')}
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            ) : (
              <div className="py-20 text-center opacity-40 font-amatic text-2xl uppercase tracking-widest text-black dark:text-white">
                {t('Nenhuma receita encontrada')}
              </div>
            )}
          </div>
        </div>
      )}
      </div>

      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-[20px] font-amatic font-bold text-black dark:text-white mb-2">
              {t('Excluir Categoria')}
            </h3>
            <p className="text-[14px] font-sans text-gray-600 dark:text-gray-400 mb-6">
              {t('Tem certeza que deseja excluir a categoria')} "{categoryToDelete.label}"? {t('As receitas desta categoria não serão excluídas.')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 py-3 rounded-xl font-mooli text-[14px] font-bold text-black dark:text-white bg-[#f7f7f7] dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                {t('Cancelar')}
              </button>
              <button
                onClick={() => {
                  if (onDeleteCategory) onDeleteCategory(categoryToDelete.id);
                  setCategoryToDelete(null);
                }}
                className="flex-1 py-3 rounded-xl font-mooli text-[14px] font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                {t('Excluir')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
