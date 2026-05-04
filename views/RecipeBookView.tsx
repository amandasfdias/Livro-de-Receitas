
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChefHat, BookOpen, Cookie, Pizza, Croissant, Coffee, Leaf, Search, X, Apple, Banana, Beef, Beer, CakeSlice, Candy, Carrot, Cherry, Citrus, CookingPot, CupSoda, Dessert, Donut, Drumstick, Egg, EggFried, Fish, GlassWater, Grape, IceCreamCone, Martini, Milk, Nut, Popcorn, Salad, Sandwich, Soup, Utensils, UtensilsCrossed, Wheat, Wine, Filter, Tag, Eraser, Camera, Heart, Star, Clock, Shrimp, Shell, Droplet, HandPlatter, Microwave, Wand, Cake, Globe, Plane, ImagePlus } from 'lucide-react';
import { Recipe, CustomCategory } from '../types';
import { Pancakes } from '../components/icons/Pancakes';
import { PicnicBasket } from '../components/icons/PicnicBasket';
import { Burger } from '../components/icons/Burger';
import { Strawberry } from '../components/icons/Strawberry';
import { Bacon } from '../components/icons/Bacon';
import { Sausage } from '../components/icons/Sausage';
import { Champagne } from '../components/icons/Champagne';
import { Plate } from '../components/icons/Plate';
import { Nuts } from '../components/icons/Nuts';
import { ImageCropper } from '../components/ImageCropper';

interface RecipeBookViewProps {
  recipes: Recipe[];
  onSelectRecipe: (r: Recipe) => void;
  onToggleFavorite: (id: string) => void;
  customCategories?: CustomCategory[];
  hiddenCategories?: string[];
  categoryOrder?: string[];
  categoryOverrides?: Record<string, { label?: string; iconName?: string }>;
  onAddCategory?: (label: string, iconName?: string) => void;
  onDeleteCategory?: (id: string) => void;
  showMainCategories?: boolean;
  showSecondaryCategories?: boolean;
  hideRecipeMetadata?: boolean;
  hideRecipeCount?: boolean;
  usePhotosForCategories?: boolean;
  categoryPhotos?: Record<string, string | { url: string; isDark: boolean; isTransparent?: boolean }>;
  categoryFontSize?: number;
  accentColor?: string;
  onCategoryPhotoChange?: (categoryId: string, photo: string | { url: string; isDark: boolean; isTransparent?: boolean }) => void;
}

type FilterType = string | null;

export const RecipeBookView: React.FC<RecipeBookViewProps> = ({ 
  recipes, 
  onSelectRecipe, 
  onToggleFavorite, 
  customCategories = [], 
  hiddenCategories = [], 
  categoryOrder = [], 
  categoryOverrides = {}, 
  onDeleteCategory,
  showMainCategories = true,
  showSecondaryCategories = true,
  hideRecipeMetadata = false,
  hideRecipeCount = false,
  usePhotosForCategories = false,
  categoryPhotos = {},
  categoryFontSize = 11,
  accentColor = '#bd715d',
  onCategoryPhotoChange
}) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [activeTab, setActiveTab] = useState<'TODAS' | 'FAVORITAS' | 'RECENTES' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [forceListView, setForceListView] = useState(false);
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'A_Z' | 'Z_A' | 'NEWEST' | 'OLDEST'>('NEWEST');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedImageUrl: string, isDark: boolean, isTransparent: boolean) => {
    if (editingCategoryId) {
      onCategoryPhotoChange?.(editingCategoryId, { url: croppedImageUrl, isDark, isTransparent });
    }
    setTempImageSrc(null);
    setEditingCategoryId(null);
  };

  const handleCropCancel = () => {
    setTempImageSrc(null);
    setEditingCategoryId(null);
  };
  const [selectedMainCategories, setSelectedMainCategories] = useState<string[]>([]);
  const [selectedSecondaryCategories, setSelectedSecondaryCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [categoryToDelete, setCategoryToDelete] = useState<{id: string, label: string} | null>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const clearFilters = () => {
    setSortOrder('NEWEST');
    setShowOnlyFavorites(false);
    setSelectedMainCategories([]);
    setSelectedSecondaryCategories([]);
    setSelectedTags([]);
    setForceListView(false);
  };

  const isRecipeInCategory = (recipe: Recipe, filterId: FilterType) => {
    if (!filterId) return true;
    const cat = (recipe.category || '').toUpperCase();
    const mainCat = (recipe.mainCategory || '').toUpperCase();
    
    if (filterId === 'SALGADOS') return mainCat === 'SALGADOS' || cat.includes('SALGADO');
    if (filterId === 'DOCES') return mainCat === 'DOCES' || cat.includes('DOCE');
    if (filterId === 'PANIFICACAO') return mainCat === 'PANIFICACAO' || cat.includes('PÃO') || cat.includes('PANIFICAÇÃO');
    if (filterId === 'FIT') return mainCat === 'FIT' || cat.includes('FIT');
    
    if (filterId === 'CAFE_DA_MANHA') return cat.includes('CAFÉ') || cat.includes('MANHÃ') || cat.includes('BREAKFAST');
    if (filterId === 'APERITIVOS') return cat.includes('APERITIVO') || cat.includes('ENTRADA') || cat.includes('PETISCO');
    if (filterId === 'SALADAS') return cat.includes('SALADA');
    if (filterId === 'SOPAS') return cat.includes('SOPA') || cat.includes('CALDO') || cat.includes('CREME');
    if (filterId === 'MASSAS') return cat.includes('MASSA') || cat.includes('MACARRÃO') || cat.includes('LASANHA') || cat.includes('PIZZA');
    if (filterId === 'CARNE_VERMELHA') return cat.includes('CARNE') || cat.includes('BOVINA') || cat.includes('BIFE') || cat.includes('ASSADO');
    if (filterId === 'FRANGO') return cat.includes('FRANGO') || cat.includes('AVE');
    if (filterId === 'PEIXE') return cat.includes('PEIXE') || cat.includes('FRUTOS DO MAR') || cat.includes('CAMARÃO');
    if (filterId === 'MOLHOS') return cat.includes('MOLHO') || cat.includes('DIP');
    if (filterId === 'ACOMPANHAMENTOS') return cat.includes('ACOMPANHAMENTO') || cat.includes('ARROZ') || cat.includes('FEIJÃO') || cat.includes('FAROFA') || cat.includes('PURÊ');
    if (filterId === 'SOBREMESAS') return cat.includes('SOBREMESA') || cat.includes('DOCE') || cat.includes('BOLO') || cat.includes('TORTA');
    if (filterId === 'BEBIDAS') return mainCat === 'BEBIDAS' || cat.includes('BEBIDA') || cat.includes('SUCO') || cat.includes('CAFÉ') || cat.includes('DRINK') || cat.includes('CHÁ');
    
    return cat === filterId || mainCat === filterId;
  };

  const normalizeString = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const defaultTags = [
    { id: 'VEGETARIANA', label: t('Vegetariana'), iconName: 'Tag' },
    { id: 'LOW_CARB', label: t('Low Carb'), iconName: 'Tag' },
    { id: 'SEM_GLUTEN', label: t('Sem Glúten'), iconName: 'Tag' },
    { id: 'SEM_ACUCAR', label: t('Sem Açúcar'), iconName: 'Tag' },
  ];

  const defaultTagIds = new Set(defaultTags.map(c => c.id));

  const allTags = [
    ...defaultTags.filter(c => !hiddenCategories.includes(c.id)).map(c => ({
      id: c.id,
      label: categoryOverrides?.[c.id]?.label || c.label,
      iconName: 'Tag'
    })),
    ...customCategories.filter(c => c.isTag && !defaultTagIds.has(c.id) && !hiddenCategories.includes(c.id)).map(c => ({
      id: c.id,
      label: categoryOverrides?.[c.id]?.label || c.label,
      iconName: 'Tag'
    }))
  ];

  const filteredRecipes = [...recipes].filter(recipe => {
    // 1. Search Query
    if (searchQuery) {
      const queryWords = normalizeString(searchQuery).split(/\s+/).filter(w => w.length > 0);
      const matchesSearch = queryWords.every(queryWord => {
        const matchesTitle = normalizeString(recipe.title).includes(queryWord);
        const matchesIngredients = recipe.ingredients?.some(i => normalizeString(i).includes(queryWord));
        const matchesCategory = (recipe.category && normalizeString(recipe.category).includes(queryWord)) || 
                                (recipe.mainCategory && normalizeString(recipe.mainCategory).includes(queryWord));
        return matchesTitle || matchesIngredients || matchesCategory;
      });
      if (!matchesSearch) return false;
    }

    // 2. Active Filter (from horizontal scroll/grid)
    if (activeFilter && activeFilter !== 'ALL') {
      if (!isRecipeInCategory(recipe, activeFilter)) return false;
    }

    // 3. Advanced Filters (from modal)
    if (showOnlyFavorites && !recipe.isFavorite) return false;
    
    // 4. Tab Filters
    if (activeTab === 'FAVORITAS' && !recipe.isFavorite) return false;

    if (selectedMainCategories.length > 0) {
      if (!recipe.mainCategory || !selectedMainCategories.includes(recipe.mainCategory)) return false;
    }
    
    if (selectedSecondaryCategories.length > 0) {
      if (!recipe.category || !selectedSecondaryCategories.includes(recipe.category)) return false;
    }
    
    if (selectedTags.length > 0) {
      if (!recipe.tags || !selectedTags.some(tag => recipe.tags?.includes(tag))) return false;
    }

    return true;
  });

  if (sortOrder === 'A_Z' || activeTab === 'TODAS') {
    filteredRecipes.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOrder === 'Z_A') {
    filteredRecipes.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortOrder === 'OLDEST') {
    filteredRecipes.reverse();
  } else if (activeTab === 'RECENTES') {
    // Already sorted by newest by default or can be explicitly sorted if IDs are timestamps
  }

  const getRecipeCount = (filterId: FilterType) => {
    return recipes.filter(r => isRecipeInCategory(r, filterId)).length;
  };

  const getIconComponent = (iconName?: string, fallback?: React.ReactNode) => {
    if (!iconName) return fallback;
    switch (iconName) {
      case 'Pizza': return <Pizza size={24} />;
      case 'Cookie': return <Cookie size={24} />;
      case 'Croissant': return <Croissant size={24} />;
      case 'Coffee': return <Coffee size={24} />;
      case 'Leaf': return <Leaf size={24} />;
      case 'Apple': return <Apple size={24} />;
      case 'Banana': return <Banana size={24} />;
      case 'Beef': return <Beef size={24} />;
      case 'Beer': return <Beer size={24} />;
      case 'CakeSlice': return <CakeSlice size={24} />;
      case 'Candy': return <Candy size={24} />;
      case 'Carrot': return <Carrot size={24} />;
      case 'Cherry': return <Cherry size={24} />;
      case 'Citrus': return <Citrus size={24} />;
      case 'CookingPot': return <CookingPot size={24} />;
      case 'CupSoda': return <CupSoda size={24} />;
      case 'Dessert': return <Dessert size={24} />;
      case 'Donut': return <Donut size={24} />;
      case 'Drumstick': return <Drumstick size={24} />;
      case 'Egg': return <Egg size={24} />;
      case 'EggFried': return <EggFried size={24} />;
      case 'Fish': return <Fish size={24} />;
      case 'GlassWater': return <GlassWater size={24} />;
      case 'Grape': return <Grape size={24} />;
      case 'IceCreamCone': return <IceCreamCone size={24} />;
      case 'Martini': return <Martini size={24} />;
      case 'Milk': return <Milk size={24} />;
      case 'Nut': return <Nut size={24} />;
      case 'Popcorn': return <Popcorn size={24} />;
      case 'Salad': return <Salad size={24} />;
      case 'Sandwich': return <Sandwich size={24} />;
      case 'Soup': return <Soup size={24} />;
      case 'Utensils': return <Utensils size={24} />;
      case 'UtensilsCrossed': return <UtensilsCrossed size={24} />;
      case 'Wheat': return <Wheat size={24} />;
      case 'Wine': return <Wine size={24} />;
      case 'Shrimp': return <Shrimp size={24} />;
      case 'Shell': return <Shell size={24} />;
      case 'HandPlatter': return <HandPlatter size={24} />;
      case 'Microwave': return <Microwave size={24} />;
      case 'Wand': return <Wand size={24} />;
      case 'Cake': return <Cake size={24} />;
      case 'Globe': return <Globe size={24} />;
      case 'Plane': return <Plane size={24} />;
      case 'Pancakes': return <Pancakes size={24} />;
      case 'PicnicBasket': return <PicnicBasket size={24} />;
      case 'Burger': return <Burger size={24} />;
      case 'Strawberry': return <Strawberry size={24} />;
      case 'Bacon': return <Bacon size={24} />;
      case 'Sausage': return <Sausage size={24} />;
      case 'Champagne': return <Champagne size={24} />;
      case 'Plate': return <Plate size={24} />;
      case 'Nuts': return <Nuts size={24} />;
      case 'Heart': return <Heart size={24} />;
      case 'Star': return <Star size={24} />;
      case 'Droplet': return <Droplet size={24} />;
      case 'Tag': return <Tag size={24} />;
      default: return <ChefHat size={24} />;
    }
  };

  const filters: { id: string; label: string; icon: React.ReactNode; isMain: boolean }[] = [
    { id: 'SALGADOS', label: categoryOverrides['SALGADOS']?.label || t('Salgados'), icon: getIconComponent(categoryOverrides['SALGADOS']?.iconName, <Pizza size={24} />), isMain: true },
    { id: 'DOCES', label: categoryOverrides['DOCES']?.label || t('Doces'), icon: getIconComponent(categoryOverrides['DOCES']?.iconName, <CakeSlice size={24} />), isMain: true },
    { id: 'PANIFICACAO', label: categoryOverrides['PANIFICACAO']?.label || t('Panificação'), icon: getIconComponent(categoryOverrides['PANIFICACAO']?.iconName, <Croissant size={24} />), isMain: true },
    { id: 'BEBIDAS', label: categoryOverrides['BEBIDAS']?.label || t('Bebidas'), icon: getIconComponent(categoryOverrides['BEBIDAS']?.iconName, <Coffee size={24} />), isMain: true },
    { id: 'FIT', label: categoryOverrides['FIT']?.label || t('Fit'), icon: getIconComponent(categoryOverrides['FIT']?.iconName, <Apple size={24} />), isMain: true },
    { id: 'CAFE_DA_MANHA', label: categoryOverrides['CAFE_DA_MANHA']?.label || t('Café da Manhã'), icon: getIconComponent(categoryOverrides['CAFE_DA_MANHA']?.iconName, <Pancakes size={24} />), isMain: false },
    { id: 'APERITIVOS', label: categoryOverrides['APERITIVOS']?.label || t('Aperitivos'), icon: getIconComponent(categoryOverrides['APERITIVOS']?.iconName, <Utensils size={24} />), isMain: false },
    { id: 'SALADAS', label: categoryOverrides['SALADAS']?.label || t('Saladas'), icon: getIconComponent(categoryOverrides['SALADAS']?.iconName, <Salad size={24} />), isMain: false },
    { id: 'SOPAS', label: categoryOverrides['SOPAS']?.label || t('Sopas'), icon: getIconComponent(categoryOverrides['SOPAS']?.iconName, <Soup size={24} />), isMain: false },
    { id: 'MASSAS', label: categoryOverrides['MASSAS']?.label || t('Massas'), icon: getIconComponent(categoryOverrides['MASSAS']?.iconName, <UtensilsCrossed size={24} />), isMain: false },
    { id: 'CARNE_VERMELHA', label: categoryOverrides['CARNE_VERMELHA']?.label || t('Carne Vermelha'), icon: getIconComponent(categoryOverrides['CARNE_VERMELHA']?.iconName, <Beef size={24} />), isMain: false },
    { id: 'FRANGO', label: categoryOverrides['FRANGO']?.label || t('Frango'), icon: getIconComponent(categoryOverrides['FRANGO']?.iconName, <Drumstick size={24} />), isMain: false },
    { id: 'PEIXE', label: categoryOverrides['PEIXE']?.label || t('Peixe'), icon: getIconComponent(categoryOverrides['PEIXE']?.iconName, <Fish size={24} />), isMain: false },
    { id: 'MOLHOS', label: categoryOverrides['MOLHOS']?.label || t('Molhos'), icon: getIconComponent(categoryOverrides['MOLHOS']?.iconName, <CookingPot size={24} />), isMain: false },
    { id: 'ACOMPANHAMENTOS', label: categoryOverrides['ACOMPANHAMENTOS']?.label || t('Acompanhamentos'), icon: getIconComponent(categoryOverrides['ACOMPANHAMENTOS']?.iconName, <Carrot size={24} />), isMain: false },
    { id: 'SOBREMESAS', label: categoryOverrides['SOBREMESAS']?.label || t('Sobremesas'), icon: getIconComponent(categoryOverrides['SOBREMESAS']?.iconName, <Dessert size={24} />), isMain: false },
  ].filter(f => !hiddenCategories.includes(f.id));

  const filterIds = new Set(filters.map(f => f.id));

  const allFilters = [
    ...filters,
    ...customCategories
      .filter(c => !hiddenCategories.includes(c.id) && !c.isTag && !filterIds.has(c.id))
      .map(c => ({ id: c.id, label: categoryOverrides[c.id]?.label || c.label, icon: getIconComponent(categoryOverrides[c.id]?.iconName, <ChefHat size={24} />), isMain: !!c.isMain }))
  ];

  if (categoryOrder && categoryOrder.length > 0) {
    allFilters.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a.id);
      const indexB = categoryOrder.indexOf(b.id);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }

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

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <div 
      onClick={() => onSelectRecipe(recipe)}
      className="relative flex gap-4 px-4 py-3 bg-white dark:bg-white/5 rounded-md cursor-pointer active:scale-[0.98] transition-all group border border-transparent shadow-sm"
    >
      <div className="w-[80px] h-[80px] rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <Camera size={24} strokeWidth={1} className="text-white" />
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center flex-grow pr-8">
        <div className={`flex items-center gap-2 ${!hideRecipeMetadata && (recipe.mainCategory || recipe.category || (recipe.tags && recipe.tags.length > 0)) ? 'mb-1.5' : ''}`}>
          <h3 className="font-amatic font-bold text-[22px] leading-tight uppercase text-black dark:text-white line-clamp-2">
            {recipe.title}
          </h3>
        </div>
        {!hideRecipeMetadata && (recipe.mainCategory || recipe.category || (recipe.tags && recipe.tags.length > 0)) && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {recipe.mainCategory && (
              <span className="inline-block px-3 py-0.5 bg-[#f2f2f2] dark:bg-black/40 text-black dark:text-white text-[9px] font-sans rounded-md lowercase tracking-tight border border-gray-100 dark:border-white/5">
                {categoryOverrides[recipe.mainCategory]?.label || t(recipe.mainCategory.replace(/_/g, ' '))}
              </span>
            )}
            {showSecondaryCategories && recipe.category && (
              <span className="inline-block px-3 py-0.5 bg-[#f2f2f2] dark:bg-black/40 text-black dark:text-white text-[9px] font-sans rounded-md lowercase tracking-tight border border-gray-100 dark:border-white/5">
                {categoryOverrides[recipe.category]?.label || t(recipe.category.replace(/_/g, ' '))}
              </span>
            )}
            {recipe.tags && recipe.tags.map(tag => (
              <span key={tag} className="inline-block px-3 py-0.5 bg-[#f2f2f2] dark:bg-black/40 text-black dark:text-white text-[9px] font-sans rounded-md lowercase tracking-tight border border-gray-100 dark:border-white/5">
                {categoryOverrides[tag]?.label || t(tag.replace(/_/g, ' '))}
              </span>
            ))}
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

  const isCategorySelected = (activeFilter && activeFilter !== 'ALL') || activeTab !== null || forceListView;

  return (
    <div className={`min-h-screen bg-[#f2f2f2] dark:bg-[#0a0a0a] text-black transition-all duration-300 flex flex-col ${isCategorySelected ? 'pt-[140px]' : 'pt-[210px]'}`}>
      <div className="fixed top-0 left-0 w-full z-40 bg-white dark:bg-[#121212] shadow-md shadow-black/5 dark:shadow-black/40 transition-all duration-300">
        {!isCategorySelected && !searchQuery && (
          <div className="relative h-[80px] px-5 flex items-center pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-center w-full">
              <h2 className="font-amatic font-bold text-[37px] uppercase tracking-tight text-black dark:text-white leading-none text-center pointer-events-auto drop-shadow-sm mt-4">
                {t('Livro de receitas')}
              </h2>
            </div>
          </div>
        )}
        <div className={`relative px-5 pb-2 transition-all duration-300 ${isCategorySelected || searchQuery ? 'pt-5' : 'pt-2'}`}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={20} style={{ color: accentColor }} />
            <input 
              type="text"
              placeholder={t('Pesquisar receitas...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f2f2f2] dark:bg-white/5 pl-12 pr-[4.5rem] py-3.5 rounded-md outline-none text-[15px] font-sans border border-transparent text-black dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm"
            />
            {searchQuery && (
              <button 
                type="button" 
                onPointerDown={(e) => {
                  e.preventDefault();
                  setSearchQuery('');
                }}
                onClick={() => setSearchQuery('')} 
                className="absolute right-10 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-black dark:hover:text-white z-10"
              >
                <X size={16} />
              </button>
            )}
            <button 
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setIsFilterModalOpen(true);
              }}
              onClick={() => setIsFilterModalOpen(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:opacity-80 transition-colors z-10"
              style={{ color: accentColor }}
            >
              <Filter size={20} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* Tabs Menu */}
        <div className="flex justify-center gap-8 px-5 py-2">
          <button
            onClick={() => {
              setActiveTab('TODAS');
              setActiveFilter('ALL');
            }}
            className={`text-center font-rubik text-[12px] uppercase tracking-wider transition-all ${
              activeTab === 'TODAS' 
                ? 'font-bold text-black dark:text-white' 
                : 'font-normal text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <BookOpen size={14} />
              <span>{t('Todos')}</span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('FAVORITAS');
              setActiveFilter('ALL');
            }}
            className={`text-center font-rubik text-[12px] uppercase tracking-wider transition-all ${
              activeTab === 'FAVORITAS' 
                ? 'font-bold text-black dark:text-white' 
                : 'font-normal text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Heart size={14} />
              <span>{t('Favoritos')}</span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('RECENTES');
              setActiveFilter('ALL');
            }}
            className={`text-center font-rubik text-[12px] uppercase tracking-wider transition-all ${
              activeTab === 'RECENTES' 
                ? 'font-bold text-black dark:text-white' 
                : 'font-normal text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Clock size={14} />
              <span>{t('Recentes')}</span>
            </div>
          </button>
        </div>
      </div>
      <div className="flex-grow pb-12">

      {(!activeFilter || activeFilter === 'ALL') && !searchQuery && !activeTab && !forceListView ? (
        <>
          {(showMainCategories || showSecondaryCategories) && (
            <div className="px-5 mb-10 mt-4">
              <h3 className="font-amatic text-[30px] font-bold uppercase tracking-tight leading-none mb-4 dark:text-white">{t('Minhas Coleções')}</h3>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {allFilters.filter(f => (showMainCategories && f.isMain) || (showSecondaryCategories && !f.isMain)).map(filter => {
                  const count = getRecipeCount(filter.id);
                  const photoData = categoryPhotos[filter.id];
                  const hasPhoto = usePhotosForCategories && !!photoData;
                  const photoUrl = typeof photoData === 'string' ? photoData : photoData?.url;
                  const isDark = typeof photoData === 'string' ? true : photoData?.isDark;
                  const isTransparent = typeof photoData === 'object' ? !!photoData?.isTransparent : false;
                  const textColorClass = (hasPhoto && !isTransparent) ? (isDark ? 'text-white' : 'text-black') : 'text-gray-800 dark:text-gray-100';

                  return (
                    <div 
                      key={filter.id}
                      onPointerDown={() => handlePointerDown(filter)}
                      onPointerUp={handlePointerUp}
                      onPointerLeave={handlePointerUp}
                      onClick={() => handleCardClick(filter.id)}
                      className={`relative aspect-square rounded-md cursor-pointer group border border-transparent select-none flex flex-col items-center justify-center ${isTransparent && usePhotosForCategories ? 'p-3 pb-0' : 'p-3 sm:p-4'} hover:shadow-md transition-shadow overflow-hidden ${(hasPhoto && isTransparent) ? 'bg-transparent shadow-none' : 'bg-white dark:bg-[#1e1e1e] shadow-sm'}`}
                    >
                      {hasPhoto && (
                        <img src={photoUrl} alt={filter.label} className="absolute inset-0 w-full h-full object-cover" />
                      )}

                      {!hideRecipeCount && count > 0 && (!isTransparent || !usePhotosForCategories) && (
                        <div 
                          className="absolute top-2 left-3 font-patrick text-[18px] sm:text-[20px] leading-none z-10"
                          style={{ color: accentColor }}
                        >
                          {count}
                        </div>
                      )}
                      
                      {usePhotosForCategories ? (
                        <div className={`flex-1 flex items-center justify-center w-full ${isTransparent ? 'mb-0' : 'mb-1 sm:mb-2'} z-10`}>
                          {!hasPhoto && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCategoryId(filter.id);
                                fileInputRef.current?.click();
                              }}
                              className="flex items-center justify-center text-black transition-colors"
                            >
                              <ImagePlus size={24} strokeWidth={1} />
                            </button>
                          )}
                          {hasPhoto && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCategoryId(filter.id);
                                fileInputRef.current?.click();
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Camera size={14} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className={`flex-1 flex items-center justify-center w-full ${isTransparent ? 'mb-0' : 'mb-1 sm:mb-2'} z-10`}>
                          <div className="text-gray-800 dark:text-gray-200 transition-transform duration-500 group-hover:scale-110">
                            {React.cloneElement(filter.icon as React.ReactElement, { size: 40, strokeWidth: 1 })}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center w-full mt-auto z-10">
                        <h4 
                          className={`font-sans font-bold uppercase tracking-wide leading-tight line-clamp-2 ${textColorClass}`}
                          style={{ fontSize: `${categoryFontSize}px` }}
                        >
                          {filter.id === 'ACOMPANHAMENTOS' && filter.label === 'Acompanhamentos' ? (
                            <>Acompanha-<br/>mentos</>
                          ) : (
                            filter.label
                          )}
                        </h4>
                        {isTransparent && usePhotosForCategories && !hideRecipeCount && count > 0 && (
                          <div 
                            className="font-mooli font-bold text-[10px] sm:text-[11px] leading-none mt-1"
                            style={{ color: accentColor }}
                          >
                            {count} {count === 1 ? t('receita') : t('receitas')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="px-5">
            <h3 className="font-amatic text-[30px] font-bold uppercase tracking-tight leading-none mb-4 dark:text-white">{t('Últimas receitas adicionadas')}</h3>
            {filteredRecipes.length > 0 ? (
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-1 flex flex-col gap-3 sm:gap-4">
                  {filteredRecipes.slice(0, 8).filter((_, i) => i % 2 === 0).map((recipe, i) => (
                    <div 
                      key={recipe.id} 
                      onClick={() => onSelectRecipe(recipe)}
                      className={`relative rounded-md overflow-hidden cursor-pointer group shadow-sm ${i % 2 === 0 ? 'aspect-[4/3]' : 'aspect-[4/5]'}`}
                    >
                      {recipe.imageUrl ? (
                        <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <Camera size={24} strokeWidth={1} className="text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                        <h4 className="text-white font-sans text-[14px] sm:text-[15px] leading-tight drop-shadow-md">
                          {recipe.title ? recipe.title.charAt(0).toUpperCase() + recipe.title.slice(1).toLowerCase() : ''}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex-1 flex flex-col gap-3 sm:gap-4">
                  {filteredRecipes.slice(0, 8).filter((_, i) => i % 2 === 1).map((recipe, i) => (
                    <div 
                      key={recipe.id} 
                      onClick={() => onSelectRecipe(recipe)}
                      className={`relative rounded-md overflow-hidden cursor-pointer group shadow-sm ${i % 2 === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}
                    >
                      {recipe.imageUrl ? (
                        <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <Camera size={24} strokeWidth={1} className="text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                        <h4 className="text-white font-sans text-[14px] sm:text-[15px] leading-tight drop-shadow-md">
                          {recipe.title ? recipe.title.charAt(0).toUpperCase() + recipe.title.slice(1).toLowerCase() : ''}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center opacity-40 font-amatic text-2xl uppercase tracking-widest text-black dark:text-white">
                {t('Nenhuma receita adicionada')}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="px-5 mt-2">
          <div className="relative flex items-center justify-center mb-4 min-h-[32px]">
            <h3 className="font-amatic text-[30px] font-bold uppercase tracking-tight leading-none dark:text-white text-center">
              {searchQuery ? t('Resultados da busca') : 
               activeTab === 'TODAS' ? t('Todas as receitas') :
               activeTab === 'FAVORITAS' ? t('Minhas receitas favoritas') :
               activeTab === 'RECENTES' ? t('Adicionadas recentemente') :
               filters.find(f => f.id === activeFilter)?.label || customCategories.find(c => c.id === activeFilter)?.label || t('Receitas Filtradas')}
            </h3>
            {(isCategorySelected || activeTab || forceListView) && (
              <button 
                onClick={() => {
                  setActiveFilter('ALL');
                  setActiveTab(null);
                  setForceListView(false);
                  clearFilters();
                }} 
                className="absolute right-0 w-10 h-10 flex items-center justify-center hover:opacity-80 active:scale-95 transition-all focus:outline-none"
                style={{ color: accentColor }}
                aria-label={t('Limpar Filtro')}
              >
                <Eraser size={24} strokeWidth={1.5} />
              </button>
            )}
          </div>
          
          <div className="space-y-3">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center px-3">
          <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-[360px] min-h-[280px] p-6 relative animate-in zoom-in-95 duration-300 rounded-lg overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl flex flex-col justify-center text-center">
            <div className="flex justify-center mb-3 text-brand-secondary">
              <Trash2 size={34} strokeWidth={1.5} />
            </div>
            <div className="mb-6">
              <h2 className="font-amatic text-[30px] font-bold uppercase tracking-tight text-black dark:text-white leading-none">
                {t('Excluir Categoria')}
              </h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-[14px] font-sans mb-6">
              {t('Tem certeza que deseja excluir a categoria')} "{categoryToDelete.label}"? {t('As receitas desta categoria não serão excluídas.')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 h-12 bg-[#f2f2f2] dark:bg-white/5 text-black dark:text-white font-mooli text-[14px] rounded-md hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                {t('Cancelar')}
              </button>
              <button
                onClick={() => {
                  if (onDeleteCategory) onDeleteCategory(categoryToDelete.id);
                  setCategoryToDelete(null);
                }}
                className="flex-1 h-12 bg-red-500 text-white font-mooli text-[14px] rounded-md hover:bg-red-600 transition-colors"
              >
                {t('Excluir')}
              </button>
            </div>
          </div>
        </div>
      )}

      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsFilterModalOpen(false)}>
          <div 
            className="bg-white dark:bg-[#1a1a1a] w-full sm:max-w-md sm:rounded-[32px] rounded-t-[32px] h-[85vh] sm:h-auto sm:max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 shrink-0 relative">
              <div className="w-10"></div>
              <h3 className="font-amatic text-[30px] font-bold uppercase tracking-tight text-black dark:text-white leading-none absolute left-1/2 -translate-x-1/2">
                {t('Filtrar Receitas')}
              </h3>
              <button 
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 -mr-2 transition-colors z-10"
                style={{ color: accentColor }}
              >
                <X size={24} strokeWidth={2} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-8 no-scrollbar">
              {/* Visualization */}
              <div>
                <h4 className="text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400 mb-4">
                  {t('Visualização')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowOnlyFavorites(false)}
                    className={`px-4 py-2 rounded-md text-[14px] font-mooli transition-colors ${
                      !showOnlyFavorites 
                        ? 'border-2 bg-transparent' 
                        : 'border border-gray-200 dark:border-white/10 text-black dark:text-white hover:opacity-80'
                    }`}
                    style={!showOnlyFavorites ? { borderColor: accentColor, color: accentColor } : {}}
                  >
                    {t('Todas')}
                  </button>
                  <button
                    onClick={() => setShowOnlyFavorites(true)}
                    className={`px-4 py-2 rounded-md text-[14px] font-mooli transition-colors ${
                      showOnlyFavorites 
                        ? 'border-2 bg-transparent' 
                        : 'border border-gray-200 dark:border-white/10 text-black dark:text-white hover:opacity-80'
                    }`}
                    style={showOnlyFavorites ? { borderColor: accentColor, color: accentColor } : {}}
                  >
                    {t('Favoritas')}
                  </button>
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <h4 className="text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400 mb-4">
                  {t('Ordenar por')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSortOrder('NEWEST')}
                    className={`px-4 py-2 rounded-md text-[14px] font-mooli transition-colors ${
                      sortOrder === 'NEWEST' 
                        ? 'border-2 bg-transparent' 
                        : 'border border-gray-200 dark:border-white/10 text-black dark:text-white hover:opacity-80'
                    }`}
                    style={sortOrder === 'NEWEST' ? { borderColor: accentColor, color: accentColor } : {}}
                  >
                    {t('Mais recentes')}
                  </button>
                  <button
                    onClick={() => setSortOrder('OLDEST')}
                    className={`px-4 py-2 rounded-md text-[14px] font-mooli transition-colors ${
                      sortOrder === 'OLDEST' 
                        ? 'border-2 bg-transparent' 
                        : 'border border-gray-200 dark:border-white/10 text-black dark:text-white hover:opacity-80'
                    }`}
                    style={sortOrder === 'OLDEST' ? { borderColor: accentColor, color: accentColor } : {}}
                  >
                    {t('Mais antigas')}
                  </button>
                  <button
                    onClick={() => setSortOrder('A_Z')}
                    className={`px-4 py-2 rounded-md text-[14px] font-mooli transition-colors ${
                      sortOrder === 'A_Z' 
                        ? 'border-2 bg-transparent' 
                        : 'border border-gray-200 dark:border-white/10 text-black dark:text-white hover:opacity-80'
                    }`}
                    style={sortOrder === 'A_Z' ? { borderColor: accentColor, color: accentColor } : {}}
                  >
                    {t('A-Z')}
                  </button>
                  <button
                    onClick={() => setSortOrder('Z_A')}
                    className={`px-4 py-2 rounded-md text-[14px] font-mooli transition-colors ${
                      sortOrder === 'Z_A' 
                        ? 'border-2 bg-transparent' 
                        : 'border border-gray-200 dark:border-white/10 text-black dark:text-white hover:opacity-80'
                    }`}
                    style={sortOrder === 'Z_A' ? { borderColor: accentColor, color: accentColor } : {}}
                  >
                    {t('Z-A')}
                  </button>
                </div>
              </div>

              {/* Main Categories */}
              <div>
                <h4 className="text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400 mb-4">
                  {t('Categoria Principal')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'SALGADOS', label: categoryOverrides['SALGADOS']?.label || t('Salgados') },
                    { id: 'DOCES', label: categoryOverrides['DOCES']?.label || t('Doces') },
                    { id: 'PANIFICACAO', label: categoryOverrides['PANIFICACAO']?.label || t('Panificação') },
                    { id: 'BEBIDAS', label: categoryOverrides['BEBIDAS']?.label || t('Bebidas') },
                    { id: 'FIT', label: categoryOverrides['FIT']?.label || t('Fit') },
                    ...customCategories.filter(c => c.isMain && !hiddenCategories.includes(c.id) && !['CAFE_DA_MANHA', 'SALGADOS', 'DOCES', 'PANIFICACAO', 'BEBIDAS', 'FIT'].includes(c.id)).map(c => ({ id: c.id, label: categoryOverrides[c.id]?.label || c.label }))
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        if (selectedMainCategories.includes(cat.id)) {
                          setSelectedMainCategories(selectedMainCategories.filter(id => id !== cat.id));
                        } else {
                          setSelectedMainCategories([...selectedMainCategories, cat.id]);
                        }
                      }}
                      className={`px-4 py-2 rounded-md text-[14px] font-mooli transition-colors ${
                        selectedMainCategories.includes(cat.id)
                          ? 'border-2 bg-transparent' 
                          : 'border border-gray-200 dark:border-white/10 text-black dark:text-white hover:opacity-80'
                      }`}
                      style={selectedMainCategories.includes(cat.id) ? { borderColor: accentColor, color: accentColor } : {}}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Secondary Categories */}
              <div>
                <h4 className="text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400 mb-4">
                  {t('Categoria Secundária')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'CAFE_DA_MANHA', label: categoryOverrides['CAFE_DA_MANHA']?.label || t('Café da Manhã') },
                    { id: 'APERITIVOS', label: categoryOverrides['APERITIVOS']?.label || t('Aperitivos') },
                    { id: 'SALADAS', label: categoryOverrides['SALADAS']?.label || t('Saladas') },
                    { id: 'SOPAS', label: categoryOverrides['SOPAS']?.label || t('Sopas') },
                    { id: 'MASSAS', label: categoryOverrides['MASSAS']?.label || t('Massas') },
                    { id: 'CARNE_VERMELHA', label: categoryOverrides['CARNE_VERMELHA']?.label || t('Carne Vermelha') },
                    { id: 'FRANGO', label: categoryOverrides['FRANGO']?.label || t('Frango') },
                    { id: 'PEIXE', label: categoryOverrides['PEIXE']?.label || t('Peixe') },
                    { id: 'MOLHOS', label: categoryOverrides['MOLHOS']?.label || t('Molhos') },
                    { id: 'ACOMPANHAMENTOS', label: categoryOverrides['ACOMPANHAMENTOS']?.label || t('Acompanhamentos') },
                    { id: 'SOBREMESAS', label: categoryOverrides['SOBREMESAS']?.label || t('Sobremesas') },
                    ...customCategories.filter(c => !c.isMain && !c.isTag && !hiddenCategories.includes(c.id) && !['CAFE_DA_MANHA', 'APERITIVOS', 'SALADAS', 'SOPAS', 'MASSAS', 'CARNE_VERMELHA', 'FRANGO', 'PEIXE', 'MOLHOS', 'ACOMPANHAMENTOS', 'SOBREMESAS'].includes(c.id)).map(c => ({ id: c.id, label: categoryOverrides[c.id]?.label || c.label }))
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        if (selectedSecondaryCategories.includes(cat.id)) {
                          setSelectedSecondaryCategories(selectedSecondaryCategories.filter(id => id !== cat.id));
                        } else {
                          setSelectedSecondaryCategories([...selectedSecondaryCategories, cat.id]);
                        }
                      }}
                      className={`px-4 py-2 rounded-md text-[14px] font-mooli transition-colors ${
                        selectedSecondaryCategories.includes(cat.id)
                          ? 'border-2 bg-transparent' 
                          : 'border border-gray-200 dark:border-white/10 text-black dark:text-white hover:opacity-80'
                      }`}
                      style={selectedSecondaryCategories.includes(cat.id) ? { borderColor: accentColor, color: accentColor } : {}}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {allTags.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400 mb-4">
                    {t('Etiquetas')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag.id}
                        onClick={() => {
                          if (selectedTags.includes(tag.id)) {
                            setSelectedTags(selectedTags.filter(id => id !== tag.id));
                          } else {
                            setSelectedTags([...selectedTags, tag.id]);
                          }
                        }}
                        className={`px-4 py-2 rounded-md text-[14px] font-mooli transition-colors ${
                          selectedTags.includes(tag.id)
                            ? 'border-2 bg-transparent' 
                            : 'border border-gray-200 dark:border-white/10 text-black dark:text-white hover:opacity-80'
                        }`}
                        style={selectedTags.includes(tag.id) ? { borderColor: accentColor, color: accentColor } : {}}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-white/10 shrink-0 bg-white dark:bg-[#1a1a1a] rounded-b-2xl flex gap-3">
              <button
                onClick={() => {
                  setIsFilterModalOpen(false);
                  setForceListView(true);
                }}
                className="flex-1 h-12 rounded-md font-mooli text-[14px] text-white bg-black dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-colors shadow-md shadow-black/20 dark:shadow-white/10 flex items-center justify-center"
              >
                {t('Exibir')} {filteredRecipes.length} {filteredRecipes.length === 1 ? t('resultado') : t('resultados')}
              </button>
              <button
                onClick={clearFilters}
                className="w-12 h-12 flex items-center justify-center text-white rounded-md hover:opacity-90 transition-all shadow-md shrink-0"
                style={{ 
                  backgroundColor: `color-mix(in srgb, ${accentColor}, white 30%)`, 
                  boxShadow: `0 4px 6px -1px color-mix(in srgb, ${accentColor}, transparent 80%), 0 2px 4px -1px color-mix(in srgb, ${accentColor}, transparent 90%)` 
                }}
                title={t('Limpar filtros')}
              >
                <Eraser size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageChange} 
        accept="image/*" 
        className="hidden" 
      />

      {tempImageSrc && (
        <ImageCropper
          imageSrc={tempImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};
