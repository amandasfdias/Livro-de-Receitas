
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, X, ImagePlus, Check, Edit3, ChevronDown, Plus, Utensils, CakeSlice, Coffee, Leaf, Wheat, ChefHat, Cookie, Pizza, Croissant, Apple, Banana, Beef, Beer, Candy, Carrot, Cherry, Citrus, CookingPot, CupSoda, Dessert, Donut, Drumstick, Egg, EggFried, Fish, GlassWater, Grape, IceCreamCone, Martini, Milk, Nut, Popcorn, Salad, Sandwich, Soup, UtensilsCrossed, Wine, Tag, Shrimp, Shell, Droplet, HandPlatter, Microwave, Wand, Cake, Globe, Plane, Heart, Star } from 'lucide-react';
import { Recipe, CustomCategory } from '../types';
import { ImageCropper } from '../components/ImageCropper';
import { Pancakes } from '../components/icons/Pancakes';
import { PicnicBasket } from '../components/icons/PicnicBasket';
import { Burger } from '../components/icons/Burger';
import { Strawberry } from '../components/icons/Strawberry';
import { Bacon } from '../components/icons/Bacon';
import { Sausage } from '../components/icons/Sausage';
import { Champagne } from '../components/icons/Champagne';
import { Plate } from '../components/icons/Plate';
import { Nuts } from '../components/icons/Nuts';

interface ManualRecipeViewProps {
  initialRecipe?: Recipe;
  onSave: (recipe: Omit<Recipe, 'id'>) => void;
  onBack: () => void;
  isPreview?: boolean;
  customCategories?: CustomCategory[];
  categoryOverrides?: Record<string, { label?: string; iconName?: string }>;
  categoryOrder?: string[];
  onAddCategory?: (label: string, iconName?: string, isMain?: boolean, isTag?: boolean) => void;
  hiddenCategories?: string[];
}

const CATEGORIES = [
  { id: 'CAFE_DA_MANHA', label: 'Café da Manhã', iconName: 'Coffee' },
  { id: 'APERITIVOS', label: 'Aperitivos', iconName: 'Utensils' },
  { id: 'SALADAS', label: 'Saladas', iconName: 'Salad' },
  { id: 'SOPAS', label: 'Sopas', iconName: 'Soup' },
  { id: 'MASSAS', label: 'Massas', iconName: 'UtensilsCrossed' },
  { id: 'CARNE_VERMELHA', label: 'Carne Vermelha', iconName: 'Beef' },
  { id: 'FRANGO', label: 'Frango', iconName: 'Drumstick' },
  { id: 'PEIXE', label: 'Peixe', iconName: 'Fish' },
  { id: 'MOLHOS', label: 'Molhos', iconName: 'CookingPot' },
  { id: 'ACOMPANHAMENTOS', label: 'Acompanhamentos', iconName: 'Carrot' },
  { id: 'SOBREMESAS', label: 'Sobremesas', iconName: 'Dessert' },
  { id: 'BEBIDAS', label: 'Bebidas', iconName: 'Coffee' },
  { id: 'OUTROS', label: 'Outros', iconName: 'ChefHat' }
];

const getIconComponent = (iconName?: string, fallback?: React.ReactNode, size: number = 28) => {
  if (!iconName) return fallback;
  
  const iconProps = { size, strokeWidth: 1.5 };
  
  switch (iconName) {
    case 'Pizza': return <Pizza {...iconProps} />;
    case 'Cookie': return <Cookie {...iconProps} />;
    case 'Croissant': return <Croissant {...iconProps} />;
    case 'Coffee': return <Coffee {...iconProps} />;
    case 'Leaf': return <Leaf {...iconProps} />;
    case 'Apple': return <Apple {...iconProps} />;
    case 'Banana': return <Banana {...iconProps} />;
    case 'Beef': return <Beef {...iconProps} />;
    case 'Beer': return <Beer {...iconProps} />;
    case 'CakeSlice': return <CakeSlice {...iconProps} />;
    case 'Candy': return <Candy {...iconProps} />;
    case 'Carrot': return <Carrot {...iconProps} />;
    case 'Cherry': return <Cherry {...iconProps} />;
    case 'Citrus': return <Citrus {...iconProps} />;
    case 'CookingPot': return <CookingPot {...iconProps} />;
    case 'CupSoda': return <CupSoda {...iconProps} />;
    case 'Dessert': return <Dessert {...iconProps} />;
    case 'Donut': return <Donut {...iconProps} />;
    case 'Drumstick': return <Drumstick {...iconProps} />;
    case 'Egg': return <Egg {...iconProps} />;
    case 'EggFried': return <EggFried {...iconProps} />;
    case 'Fish': return <Fish {...iconProps} />;
    case 'GlassWater': return <GlassWater {...iconProps} />;
    case 'Grape': return <Grape {...iconProps} />;
    case 'IceCreamCone': return <IceCreamCone {...iconProps} />;
    case 'Martini': return <Martini {...iconProps} />;
    case 'Milk': return <Milk {...iconProps} />;
    case 'Nut': return <Nut {...iconProps} />;
    case 'Popcorn': return <Popcorn {...iconProps} />;
    case 'Salad': return <Salad {...iconProps} />;
    case 'Sandwich': return <Sandwich {...iconProps} />;
    case 'Soup': return <Soup {...iconProps} />;
    case 'Utensils': return <Utensils {...iconProps} />;
    case 'UtensilsCrossed': return <UtensilsCrossed {...iconProps} />;
    case 'Wheat': return <Wheat {...iconProps} />;
    case 'Wine': return <Wine {...iconProps} />;
    case 'Shrimp': return <Shrimp {...iconProps} />;
    case 'Shell': return <Shell {...iconProps} />;
    case 'HandPlatter': return <HandPlatter {...iconProps} />;
    case 'Microwave': return <Microwave {...iconProps} />;
    case 'Wand': return <Wand {...iconProps} />;
    case 'Cake': return <Cake {...iconProps} />;
    case 'Globe': return <Globe {...iconProps} />;
    case 'Plane': return <Plane {...iconProps} />;
    case 'Pancakes': return <Pancakes {...iconProps} />;
    case 'PicnicBasket': return <PicnicBasket {...iconProps} />;
    case 'Burger': return <Burger {...iconProps} />;
    case 'Strawberry': return <Strawberry {...iconProps} />;
    case 'Bacon': return <Bacon {...iconProps} />;
    case 'Sausage': return <Sausage {...iconProps} />;
    case 'Champagne': return <Champagne {...iconProps} />;
    case 'Plate': return <Plate {...iconProps} />;
    case 'Nuts': return <Nuts {...iconProps} />;
    case 'Heart': return <Heart {...iconProps} />;
    case 'Star': return <Star {...iconProps} />;
    case 'Droplet': return <Droplet {...iconProps} />;
    case 'Tag': return <Tag {...iconProps} />;
    default: return fallback || <ChefHat {...iconProps} />;
  }
};

export const ManualRecipeView: React.FC<ManualRecipeViewProps> = ({ 
  initialRecipe, 
  onSave, 
  onBack, 
  customCategories = [], 
  categoryOverrides = {}, 
  categoryOrder = [], 
  onAddCategory,
  hiddenCategories = []
}) => {
  const [title, setTitle] = useState(initialRecipe?.title || '');
  const [mainCategory, setMainCategory] = useState(initialRecipe?.mainCategory || '');
  const [category, setCategory] = useState(initialRecipe?.category || '');
  const [tags, setTags] = useState<string[]>(initialRecipe?.tags || []);
  const [ingredientGroups, setIngredientGroups] = useState<{subtitle: string, ingredients: string}[]>(() => {
    if (initialRecipe?.ingredients && Array.isArray(initialRecipe.ingredients)) {
      const groups: {subtitle: string, ingredients: string}[] = [];
      let currentGroup = { subtitle: '', ingredients: '' };
      
      initialRecipe.ingredients.forEach(ing => {
        if (ing.startsWith('# ')) {
          if (currentGroup.subtitle || currentGroup.ingredients) {
            groups.push({ ...currentGroup });
          }
          currentGroup = { subtitle: ing.substring(2), ingredients: '' };
        } else {
          currentGroup.ingredients += (currentGroup.ingredients ? '\n' : '') + ing;
        }
      });
      
      if (currentGroup.subtitle || currentGroup.ingredients) {
        groups.push(currentGroup);
      }
      return groups.length > 0 ? groups : [{ subtitle: '', ingredients: '' }];
    }
    return [{ subtitle: '', ingredients: '' }];
  });
  const [instructions, setInstructions] = useState(() => {
    return Array.isArray(initialRecipe?.instructions) ? initialRecipe.instructions.join('\n') : '';
  });
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialRecipe?.imageUrl);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [errors, setErrors] = useState<{title?: boolean, ingredients?: boolean, instructions?: boolean}>({});
  
  const [isMainCategoryDropdownOpen, setIsMainCategoryDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  
  const mainCategoryDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const tagsDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mainCategoryDropdownRef.current && !mainCategoryDropdownRef.current.contains(event.target as Node)) {
        setIsMainCategoryDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target as Node)) {
        setIsTagsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const defaultMainCategories = [
    { id: 'SALGADOS', label: 'Salgados', iconName: 'Pizza' },
    { id: 'DOCES', label: 'Doces', iconName: 'CakeSlice' },
    { id: 'PANIFICACAO', label: 'Panificação', iconName: 'Croissant' },
    { id: 'BEBIDAS', label: 'Bebidas', iconName: 'Coffee' },
    { id: 'FIT', label: 'Fit', iconName: 'Apple' },
  ];

  const defaultMainCategoryIds = new Set(defaultMainCategories.map(c => c.id));

  const mainCategories = [
    ...defaultMainCategories.map(c => ({
      id: c.id,
      label: categoryOverrides?.[c.id]?.label || c.label,
      iconName: categoryOverrides?.[c.id]?.iconName || c.iconName
    })),
    ...customCategories.filter(c => c.isMain && !defaultMainCategoryIds.has(c.id)).map(c => ({
      id: c.id,
      label: categoryOverrides?.[c.id]?.label || c.label,
      iconName: categoryOverrides?.[c.id]?.iconName || 'ChefHat'
    }))
  ];

  if (categoryOrder && categoryOrder.length > 0) {
    mainCategories.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a.id);
      const indexB = categoryOrder.indexOf(b.id);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }

  const defaultCategoryIds = new Set(CATEGORIES.map(c => c.id));

  const allCategories = [
    ...CATEGORIES.filter(c => c.id !== 'OUTROS' && c.id !== 'BEBIDAS' && !hiddenCategories.includes(c.id)).map(c => ({
      id: c.id,
      label: categoryOverrides?.[c.id]?.label || c.label,
      iconName: categoryOverrides?.[c.id]?.iconName || c.iconName
    })),
    ...customCategories.filter(c => !c.isMain && !c.isTag && !defaultCategoryIds.has(c.id) && !hiddenCategories.includes(c.id)).map(c => ({
      id: c.id,
      label: categoryOverrides?.[c.id]?.label || c.label,
      iconName: categoryOverrides?.[c.id]?.iconName || 'ChefHat'
    }))
  ];

  if (categoryOrder && categoryOrder.length > 0) {
    allCategories.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a.id);
      const indexB = categoryOrder.indexOf(b.id);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }
  
  const defaultTags = [
    { id: 'VEGETARIANA', label: 'Vegetariana', iconName: 'Tag' },
    { id: 'LOW_CARB', label: 'Low Carb', iconName: 'Tag' },
    { id: 'SEM_GLUTEN', label: 'Sem Glúten', iconName: 'Tag' },
    { id: 'SEM_ACUCAR', label: 'Sem Açúcar', iconName: 'Tag' },
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

  const handleSaveNewTag = () => {
    if (newTagName.trim() && onAddCategory) {
      onAddCategory(newTagName.trim(), 'Tag', false, true);
      const newTagId = newTagName.trim().toUpperCase().replace(/\s+/g, '_');
      setTags([...tags, newTagId]);
      setNewTagName('');
      setIsAddingTag(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setImageUrl(croppedImage);
    setTempImageSrc(null);
  };

  const handleCropCancel = () => {
    setTempImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageUrl(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    const isIngredientsEmpty = ingredientGroups.every(g => !g.ingredients.trim());

    if (!title.trim() || isIngredientsEmpty || !instructions.trim()) {
      setErrors({ title: !title.trim(), ingredients: isIngredientsEmpty, instructions: !instructions.trim() });
      if (!title.trim() || isIngredientsEmpty) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const ingredientList = ingredientGroups.flatMap(g => [
        ...(g.subtitle.trim() ? [`# ${g.subtitle.trim()}`] : []),
        ...g.ingredients.split('\n').filter(i => i.trim() !== '')
      ]);

    const instructionList = instructions.split('\n').filter(i => i.trim() !== '');
    onSave({ 
      title: title.toUpperCase(), 
      mainCategory: mainCategory.toUpperCase() || undefined,
      category: category.toUpperCase() || 'GERAL', 
      tags: tags,
      ingredients: ingredientList, 
      instructions: instructionList, 
      imageUrl
    });
  };

  const labelClass = "block text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400 mb-2";
  const inputBaseClass = "w-full bg-[#f2f2f2] dark:bg-white/5 py-4 px-4 text-[14px] font-mooli font-normal rounded-md outline-none border border-transparent focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-black dark:text-white placeholder:text-gray-400";

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] animate-in fade-in duration-500 flex flex-col">
      <header className="pt-12 pb-6 px-5 flex items-center justify-between sticky top-0 bg-white dark:bg-[#121212] z-10">
        <button onClick={onBack} className="w-11 h-11 flex items-center justify-center -ml-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-colors text-brand-secondary active:scale-90 z-10">
          <ArrowLeft size={24} strokeWidth={2} />
        </button>
        <h2 className="font-amatic font-bold text-[30px] uppercase tracking-tight text-black dark:text-white leading-none absolute left-1/2 -translate-x-1/2">
          {initialRecipe ? 'Editar Receita' : 'Adicionar Receita'}
        </h2>
        <button 
          onClick={handleSave} 
          className="w-11 h-11 flex items-center justify-center -mr-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full text-brand-secondary active:scale-90 transition-all z-10"
        >
          <Check size={24} strokeWidth={2} />
        </button>
      </header>

      <div className="flex-1 px-5 pt-6 space-y-8 max-w-md mx-auto w-full">

        {/* Image Upload */}
        <div>
          <label className={labelClass}>Foto da Receita</label>
          <div 
            className="w-full aspect-square bg-[#f2f2f2] dark:bg-white/5 rounded-md flex flex-col items-center justify-center cursor-pointer relative overflow-hidden border border-transparent hover:border-black dark:hover:border-white hover:ring-1 hover:ring-black dark:hover:ring-white transition-all group"
            onClick={() => fileInputRef.current?.click()}
          >
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="Recipe" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-mooli text-sm flex items-center gap-2">
                    <Edit3 size={16} /> Trocar foto
                  </span>
                </div>
                <button 
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-colors"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                <ImagePlus size={32} strokeWidth={1.5} className="mb-3" />
                <span className="font-mooli text-sm">Adicionar foto</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Título da Receita</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: false });
            }} 
            placeholder="Ex: Bolo de Chocolate"
            className={`${inputBaseClass} ${errors.title ? 'ring-2 ring-red-500' : ''}`} 
          />
          {errors.title && <span className="text-red-500 text-xs mt-1 block font-sans">O título da receita é obrigatório</span>}
        </div>

        <div>
          <label className={labelClass}>Categoria Principal</label>
          <div className="relative" ref={mainCategoryDropdownRef}>
            <button
              type="button"
              onClick={() => setIsMainCategoryDropdownOpen(!isMainCategoryDropdownOpen)}
              className={`${inputBaseClass} flex items-center justify-between text-left`}
            >
              <span className={mainCategory ? 'text-black dark:text-white' : 'text-gray-400'}>
                {mainCategories.find(c => c.id === mainCategory)?.label || 'Selecione'}
              </span>
              <ChevronDown 
                className={`text-gray-400 transition-transform duration-300 ${isMainCategoryDropdownOpen ? 'rotate-180' : ''}`} 
                size={20} 
              />
            </button>
            
            <div 
              className={`absolute z-20 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-md shadow-lg overflow-hidden transition-all duration-300 origin-top ${
                isMainCategoryDropdownOpen 
                  ? 'opacity-100 scale-y-100 translate-y-0' 
                  : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="py-2 flex flex-col max-h-60 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    setMainCategory('');
                    setIsMainCategoryDropdownOpen(false);
                  }}
                  className={`px-4 py-3 text-left text-[14px] font-mooli transition-colors hover:bg-[#f7f7f7] dark:hover:bg-white/5 ${
                    !mainCategory 
                      ? 'text-black dark:text-white font-bold bg-[#f7f7f7] dark:bg-white/5' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Nenhuma
                </button>
                {mainCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setMainCategory(cat.id);
                      setIsMainCategoryDropdownOpen(false);
                    }}
                    className={`px-4 py-3 text-left text-[14px] font-mooli transition-colors hover:bg-[#f7f7f7] dark:hover:bg-white/5 ${
                      mainCategory === cat.id 
                        ? 'text-black dark:text-white font-bold bg-[#f7f7f7] dark:bg-white/5' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Categoria Secundária</label>
          <div className="relative" ref={categoryDropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className={`${inputBaseClass} flex items-center justify-between text-left`}
            >
              <span className={category ? 'text-black dark:text-white' : 'text-gray-400'}>
                {allCategories.find(c => c.id === category)?.label || 'Selecione'}
              </span>
              <ChevronDown 
                className={`text-gray-400 transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} 
                size={20} 
              />
            </button>
            
            <div 
              className={`absolute z-20 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-md shadow-lg overflow-hidden transition-all duration-300 origin-top ${
                isCategoryDropdownOpen 
                  ? 'opacity-100 scale-y-100 translate-y-0' 
                  : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="py-2 flex flex-col max-h-60 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    setCategory('');
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`px-4 py-3 text-left text-[14px] font-mooli transition-colors hover:bg-[#f7f7f7] dark:hover:bg-white/5 ${
                    !category 
                      ? 'text-black dark:text-white font-bold bg-[#f7f7f7] dark:bg-white/5' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Nenhuma
                </button>
                {allCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.id);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={`px-4 py-3 text-left text-[14px] font-mooli transition-colors hover:bg-[#f7f7f7] dark:hover:bg-white/5 flex items-center gap-3 ${
                      category === cat.id 
                        ? 'text-black dark:text-white font-bold bg-[#f7f7f7] dark:bg-white/5' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      {getIconComponent(cat.iconName, <ChefHat size={16} />, 16)}
                    </div>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Etiquetas</label>
          <div className="relative" ref={tagsDropdownRef}>
            <button
              type="button"
              onClick={() => setIsTagsDropdownOpen(!isTagsDropdownOpen)}
              className={`${inputBaseClass} flex items-center justify-between text-left`}
            >
              <span className={tags.length > 0 ? 'text-black dark:text-white' : 'text-gray-400'}>
                {tags.length > 0 
                  ? tags.map(t => allTags.find(tag => tag.id === t)?.label || t).join(', ')
                  : 'Selecione as etiquetas'}
              </span>
              <ChevronDown 
                className={`text-gray-400 transition-transform duration-300 ${isTagsDropdownOpen ? 'rotate-180' : ''}`} 
                size={20} 
              />
            </button>
            
            <div 
              className={`absolute z-20 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-md shadow-lg overflow-hidden transition-all duration-300 origin-top ${
                isTagsDropdownOpen 
                  ? 'opacity-100 scale-y-100 translate-y-0' 
                  : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="py-2 flex flex-col max-h-60 overflow-y-auto">
                {allTags.length === 0 ? (
                  <div className="px-4 py-3 text-[14px] font-mooli text-gray-500 text-center">
                    Nenhuma etiqueta criada. Crie em "Organizar Receitas".
                  </div>
                ) : (
                  allTags.map((tag) => {
                    const isSelected = tags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setTags(tags.filter(t => t !== tag.id));
                          } else {
                            setTags([...tags, tag.id]);
                          }
                        }}
                        className={`px-4 py-3 text-left text-[14px] font-mooli transition-colors hover:bg-[#f7f7f7] dark:hover:bg-white/5 flex items-center justify-between ${
                          isSelected 
                            ? 'text-black dark:text-white font-bold bg-[#f7f7f7] dark:bg-white/5' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 flex items-center justify-center">
                            {getIconComponent(tag.iconName, <Tag size={16} />, 16)}
                          </div>
                          {tag.label}
                        </div>
                        {isSelected && <Check size={16} className="text-brand-primary" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400">Ingredientes</label>
          </div>
          
          <div className="space-y-6">
            {ingredientGroups.map((group, index) => (
              <div key={index} className="space-y-4 relative group">
                {ingredientGroups.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newGroups = [...ingredientGroups];
                      newGroups.splice(index, 1);
                      setIngredientGroups(newGroups);
                    }}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100 z-10"
                  >
                    <X size={16} />
                  </button>
                )}
                <div>
                  <input 
                    type="text" 
                    value={group.subtitle} 
                    onChange={(e) => {
                      const newGroups = [...ingredientGroups];
                      newGroups[index].subtitle = e.target.value;
                      setIngredientGroups(newGroups);
                    }} 
                    placeholder="Ex: Massa (Opcional)"
                    className={`${inputBaseClass} ${group.subtitle ? 'text-[16px] font-bold' : 'text-[14px] font-mooli'} ${ingredientGroups.length > 1 ? 'pr-12' : ''}`} 
                  />
                </div>
                <div>
                  <textarea 
                    value={group.ingredients} 
                    onChange={(e) => {
                      const newGroups = [...ingredientGroups];
                      newGroups[index].ingredients = e.target.value;
                      setIngredientGroups(newGroups);
                      if (errors.ingredients) setErrors({ ...errors, ingredients: false });
                    }} 
                    rows={4} 
                    placeholder="Liste os ingredientes, um por linha"
                    className={`${inputBaseClass} resize-none ${errors.ingredients && !group.ingredients.trim() ? 'ring-2 ring-red-500' : ''}`} 
                  />
                  {errors.ingredients && !group.ingredients.trim() && <span className="text-red-500 text-xs mt-1 block font-sans">Os ingredientes são obrigatórios</span>}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setIngredientGroups([...ingredientGroups, { subtitle: '', ingredients: '' }])}
              className="w-full flex items-center justify-center gap-1 py-3 border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95 text-gray-500 dark:text-gray-400 font-mooli text-[14px]"
            >
              <Plus size={18} />
              adicionar nova parte (Ex: Cobertura)
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass}>Instruções</label>
          <textarea 
            value={instructions} 
            onChange={(e) => {
              setInstructions(e.target.value);
              if (errors.instructions) setErrors({ ...errors, instructions: false });
            }} 
            rows={5} 
            placeholder="Descreva o passo a passo"
            className={`${inputBaseClass} ${errors.instructions ? 'ring-2 ring-red-500' : ''} resize-none`} 
          />
          {errors.instructions && <span className="text-red-500 text-xs mt-1 block font-sans">As instruções são obrigatórias</span>}
        </div>

        <div className="flex justify-center pt-8 pb-2">
          <span className="text-black dark:text-white text-lg">♥︎</span>
        </div>
      </div>

      {tempImageSrc && (
        <ImageCropper
          imageSrc={tempImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      {isAddingTag && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-rubik font-medium text-gray-900 dark:text-white">Nova Etiqueta</h3>
              <button 
                onClick={() => setIsAddingTag(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400 mb-2">Nome da Etiqueta</label>
                <input 
                  autoFocus
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Ex: Sem Lactose"
                  className="w-full bg-[#f2f2f2] dark:bg-white/5 py-4 px-4 text-[14px] font-mooli font-normal rounded-md outline-none border border-transparent focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-black dark:text-white placeholder:text-gray-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveNewTag();
                  }}
                />
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-white/[0.02] flex gap-3">
              <button 
                onClick={() => setIsAddingTag(false)}
                className="flex-1 py-3 text-[14px] font-mooli text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveNewTag}
                disabled={!newTagName.trim()}
                className="flex-1 py-3 bg-black text-white rounded-md font-mooli text-[14px] shadow-lg shadow-black/20 hover:bg-black/90 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
