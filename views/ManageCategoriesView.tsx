import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, ChefHat, Cookie, Pizza, Croissant, Coffee, Leaf, ArrowLeft, Check, CheckCircle2, BookOpen, Heart, Star, GripHorizontal, Pencil, Eye, EyeOff, X, Apple, Banana, Beef, Beer, CakeSlice, Candy, Carrot, Cherry, Citrus, CookingPot, CupSoda, Dessert, Donut, Drumstick, Egg, EggFried, Fish, GlassWater, Grape, IceCreamCone, Martini, Milk, Nut, Popcorn, Salad, Sandwich, Soup, Utensils, UtensilsCrossed, Wheat, Wine, Tag, Shrimp, Shell, HandPlatter, Microwave, Wand, Cake, Globe, Plane } from 'lucide-react';
import { CustomCategory, Recipe } from '../types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Pancakes } from '../components/icons/Pancakes';
import { PicnicBasket } from '../components/icons/PicnicBasket';
import { Burger } from '../components/icons/Burger';
import { Strawberry } from '../components/icons/Strawberry';
import { Bacon } from '../components/icons/Bacon';
import { Sausage } from '../components/icons/Sausage';
import { Champagne } from '../components/icons/Champagne';
import { Plate } from '../components/icons/Plate';
import { Nuts } from '../components/icons/Nuts';

interface ManageCategoriesViewProps {
  onBack: () => void;
  customCategories: CustomCategory[];
  hiddenCategories: string[];
  categoryOrder?: string[];
  categoryOverrides?: Record<string, { label?: string; iconName?: string }>;
  recipes: Recipe[];
  onAddCategory: (label: string, iconName?: string, isMain?: boolean, isTag?: boolean) => void;
  onDeleteCategory: (id: string) => void;
  onToggleDefaultCategory: (id: string) => void;
  onUpdateCategory?: (id: string, updates: { label?: string; iconName?: string }) => void;
  onReorderCategories?: (newOrder: string[]) => void;
}

const AVAILABLE_ICONS = [
  { name: 'Pizza', icon: <Pizza size={24} strokeWidth={1.5} /> },
  { name: 'Cookie', icon: <Cookie size={24} strokeWidth={1.5} /> },
  { name: 'Croissant', icon: <Croissant size={24} strokeWidth={1.5} /> },
  { name: 'Coffee', icon: <Coffee size={24} strokeWidth={1.5} /> },
  { name: 'Leaf', icon: <Leaf size={24} strokeWidth={1.5} /> },
  { name: 'ChefHat', icon: <ChefHat size={24} strokeWidth={1.5} /> },
  { name: 'Apple', icon: <Apple size={24} strokeWidth={1.5} /> },
  { name: 'Banana', icon: <Banana size={24} strokeWidth={1.5} /> },
  { name: 'Beef', icon: <Beef size={24} strokeWidth={1.5} /> },
  { name: 'Beer', icon: <Beer size={24} strokeWidth={1.5} /> },
  { name: 'CakeSlice', icon: <CakeSlice size={24} strokeWidth={1.5} /> },
  { name: 'Candy', icon: <Candy size={24} strokeWidth={1.5} /> },
  { name: 'Carrot', icon: <Carrot size={24} strokeWidth={1.5} /> },
  { name: 'Cherry', icon: <Cherry size={24} strokeWidth={1.5} /> },
  { name: 'Citrus', icon: <Citrus size={24} strokeWidth={1.5} /> },
  { name: 'CookingPot', icon: <CookingPot size={24} strokeWidth={1.5} /> },
  { name: 'CupSoda', icon: <CupSoda size={24} strokeWidth={1.5} /> },
  { name: 'Dessert', icon: <Dessert size={24} strokeWidth={1.5} /> },
  { name: 'Donut', icon: <Donut size={24} strokeWidth={1.5} /> },
  { name: 'Drumstick', icon: <Drumstick size={24} strokeWidth={1.5} /> },
  { name: 'Egg', icon: <Egg size={24} strokeWidth={1.5} /> },
  { name: 'EggFried', icon: <EggFried size={24} strokeWidth={1.5} /> },
  { name: 'Fish', icon: <Fish size={24} strokeWidth={1.5} /> },
  { name: 'GlassWater', icon: <GlassWater size={24} strokeWidth={1.5} /> },
  { name: 'Grape', icon: <Grape size={24} strokeWidth={1.5} /> },
  { name: 'IceCreamCone', icon: <IceCreamCone size={24} strokeWidth={1.5} /> },
  { name: 'Martini', icon: <Martini size={24} strokeWidth={1.5} /> },
  { name: 'Milk', icon: <Milk size={24} strokeWidth={1.5} /> },
  { name: 'Nut', icon: <Nut size={24} strokeWidth={1.5} /> },
  { name: 'Popcorn', icon: <Popcorn size={24} strokeWidth={1.5} /> },
  { name: 'Salad', icon: <Salad size={24} strokeWidth={1.5} /> },
  { name: 'Sandwich', icon: <Sandwich size={24} strokeWidth={1.5} /> },
  { name: 'Soup', icon: <Soup size={24} strokeWidth={1.5} /> },
  { name: 'Utensils', icon: <Utensils size={24} strokeWidth={1.5} /> },
  { name: 'UtensilsCrossed', icon: <UtensilsCrossed size={24} strokeWidth={1.5} /> },
  { name: 'Wheat', icon: <Wheat size={24} strokeWidth={1.5} /> },
  { name: 'Wine', icon: <Wine size={24} strokeWidth={1.5} /> },
  { name: 'Shrimp', icon: <Shrimp size={24} strokeWidth={1.5} /> },
  { name: 'Shell', icon: <Shell size={24} strokeWidth={1.5} /> },
  { name: 'HandPlatter', icon: <HandPlatter size={24} strokeWidth={1.5} /> },
  { name: 'Microwave', icon: <Microwave size={24} strokeWidth={1.5} /> },
  { name: 'Wand', icon: <Wand size={24} strokeWidth={1.5} /> },
  { name: 'Cake', icon: <Cake size={24} strokeWidth={1.5} /> },
  { name: 'Globe', icon: <Globe size={24} strokeWidth={1.5} /> },
  { name: 'Plane', icon: <Plane size={24} strokeWidth={1.5} /> },
  { name: 'Pancakes', icon: <Pancakes size={24} strokeWidth={1.5} /> },
  { name: 'PicnicBasket', icon: <PicnicBasket size={24} strokeWidth={1.5} /> },
  { name: 'Burger', icon: <Burger size={24} strokeWidth={1.5} /> },
  { name: 'Strawberry', icon: <Strawberry size={24} strokeWidth={1.5} /> },
  { name: 'Bacon', icon: <Bacon size={24} strokeWidth={1.5} /> },
  { name: 'Sausage', icon: <Sausage size={24} strokeWidth={1.5} /> },
  { name: 'Champagne', icon: <Champagne size={24} strokeWidth={1.5} /> },
  { name: 'Plate', icon: <Plate size={24} strokeWidth={1.5} /> },
  { name: 'Nuts', icon: <Nuts size={24} strokeWidth={1.5} /> },
  { name: 'Heart', icon: <Heart size={24} strokeWidth={1.5} /> },
  { name: 'Star', icon: <Star size={24} strokeWidth={1.5} /> },
];

interface CategoryItem {
  id: string;
  label: string;
  iconName: string;
  isDefault?: boolean;
  isMain?: boolean;
  isTag?: boolean;
}

export const ManageCategoriesView: React.FC<ManageCategoriesViewProps> = ({
  onBack,
  customCategories,
  hiddenCategories,
  categoryOrder = [],
  categoryOverrides = {},
  recipes,
  onAddCategory,
  onDeleteCategory,
  onToggleDefaultCategory,
  onUpdateCategory,
  onReorderCategories
}) => {
  const { t } = useTranslation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderedCategories, setOrderedCategories] = useState<CategoryItem[]>([]);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [isAddingMain, setIsAddingMain] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);

  const defaultMainCategories = useMemo(() => [
    { id: 'SALGADOS', label: t('Salgados'), iconName: 'Pizza', isDefault: true, isMain: true },
    { id: 'DOCES', label: t('Doces'), iconName: 'CakeSlice', isDefault: true, isMain: true },
    { id: 'PANIFICACAO', label: t('Panificação'), iconName: 'Croissant', isDefault: true, isMain: true },
    { id: 'BEBIDAS', label: t('Bebidas'), iconName: 'Coffee', isDefault: true, isMain: true },
    { id: 'FIT', label: t('Fit'), iconName: 'Apple', isDefault: true, isMain: true },
  ], [t]);

  const defaultCategories = useMemo(() => [
    { id: 'CAFE_DA_MANHA', label: t('Café da Manhã'), iconName: 'Pancakes', isDefault: true, isMain: false },
    { id: 'APERITIVOS', label: t('Aperitivos'), iconName: 'Utensils', isDefault: true },
    { id: 'SALADAS', label: t('Saladas'), iconName: 'Salad', isDefault: true },
    { id: 'SOPAS', label: t('Sopas'), iconName: 'Soup', isDefault: true },
    { id: 'MASSAS', label: t('Massas'), iconName: 'UtensilsCrossed', isDefault: true },
    { id: 'CARNE_VERMELHA', label: t('Carne Vermelha'), iconName: 'Beef', isDefault: true },
    { id: 'FRANGO', label: t('Frango'), iconName: 'Drumstick', isDefault: true },
    { id: 'PEIXE', label: t('Peixe'), iconName: 'Fish', isDefault: true },
    { id: 'MOLHOS', label: t('Molhos'), iconName: 'CookingPot', isDefault: true },
    { id: 'ACOMPANHAMENTOS', label: t('Acompanhamentos'), iconName: 'Carrot', isDefault: true },
    { id: 'SOBREMESAS', label: t('Sobremesas'), iconName: 'Dessert', isDefault: true },
  ], [t]);

  const defaultTags = useMemo(() => [
    { id: 'VEGETARIANA', label: t('Vegetariana'), iconName: 'Tag', isDefault: true, isTag: true },
    { id: 'LOW_CARB', label: t('Low Carb'), iconName: 'Tag', isDefault: true, isTag: true },
    { id: 'SEM_GLUTEN', label: t('Sem Glúten'), iconName: 'Tag', isDefault: true, isTag: true },
    { id: 'SEM_ACUCAR', label: t('Sem Açúcar'), iconName: 'Tag', isDefault: true, isTag: true },
  ], [t]);

  useEffect(() => {
    const defaultIds = new Set([
      ...defaultMainCategories.map(c => c.id),
      ...defaultCategories.map(c => c.id),
      ...defaultTags.map(c => c.id)
    ]);

    const all = [
      ...defaultMainCategories.map(c => ({
        ...c,
        label: categoryOverrides[c.id]?.label || c.label,
        iconName: categoryOverrides[c.id]?.iconName || c.iconName
      })),
      ...defaultCategories.map(c => ({
        ...c,
        label: categoryOverrides[c.id]?.label || c.label,
        iconName: categoryOverrides[c.id]?.iconName || c.iconName
      })),
      ...defaultTags.map(c => ({
        ...c,
        label: categoryOverrides[c.id]?.label || c.label,
        iconName: categoryOverrides[c.id]?.iconName || c.iconName
      })),
      ...customCategories.filter(c => !defaultIds.has(c.id)).map(c => ({
        ...c,
        label: categoryOverrides[c.id]?.label || c.label,
        iconName: categoryOverrides[c.id]?.iconName || c.iconName || 'ChefHat',
        isDefault: false,
        isMain: c.isMain,
        isTag: c.isTag
      }))
    ];

    if (categoryOrder && categoryOrder.length > 0) {
      all.sort((a, b) => {
        const indexA = categoryOrder.indexOf(a.id);
        const indexB = categoryOrder.indexOf(b.id);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    }

    setOrderedCategories(all);
  }, [customCategories, categoryOrder, categoryOverrides, t, defaultCategories, defaultMainCategories, defaultTags]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    let filteredItems: CategoryItem[] = [];
    if (source.droppableId === 'main-categories') {
      filteredItems = orderedCategories.filter(c => c.isMain);
    } else if (source.droppableId === 'categories') {
      filteredItems = orderedCategories.filter(c => !c.isMain && !c.isTag);
    } else if (source.droppableId === 'tags') {
      filteredItems = orderedCategories.filter(c => c.isTag && !hiddenCategories.includes(c.id));
    } else {
      return;
    }

    const [reorderedItem] = filteredItems.splice(source.index, 1);
    filteredItems.splice(destination.index, 0, reorderedItem);

    let filteredIndex = 0;
    const newOrderedCategories = orderedCategories.map(c => {
      if (source.droppableId === 'main-categories' && c.isMain) {
        return filteredItems[filteredIndex++];
      } else if (source.droppableId === 'categories' && !c.isMain && !c.isTag) {
        return filteredItems[filteredIndex++];
      } else if (source.droppableId === 'tags' && c.isTag && !hiddenCategories.includes(c.id)) {
        return filteredItems[filteredIndex++];
      }
      return c;
    });

    setOrderedCategories(newOrderedCategories);
    if (onReorderCategories) {
      onReorderCategories(newOrderedCategories.map(item => item.id));
    }
  };

  const getIconComponent = (iconName: string) => {
    const found = AVAILABLE_ICONS.find(i => i.name === iconName);
    return found ? found.icon : <ChefHat size={24} />;
  };

  const openEditModal = (category: CategoryItem) => {
    setEditingCategory(category);
    setEditLabel(category.label);
    setEditIcon(category.iconName);
  };

  const saveEdit = () => {
    if (editingCategory && onUpdateCategory) {
      onUpdateCategory(editingCategory.id, { label: editLabel, iconName: editIcon });
      setEditingCategory(null);
    }
  };

  const handleAddNew = () => {
    if (editLabel.trim()) {
      onAddCategory(editLabel.trim(), editIcon, isAddingMain, isAddingTag);
      setIsAdding(false);
      setIsAddingMain(false);
      setIsAddingTag(false);
      setEditLabel('');
    }
  };

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] animate-in fade-in duration-500 flex flex-col">
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full shadow-xl animate-in fade-in zoom-in duration-300 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-brand-secondary" />
            <span className="font-mooli text-[13px] font-normal">{t('Alterações salvas com sucesso')}</span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="pt-12 pb-2 px-5 flex items-center justify-between relative">
          <button onClick={onBack} className="w-11 h-11 flex items-center justify-center -ml-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-brand-secondary active:scale-90 z-10">
            <ArrowLeft size={24} strokeWidth={2} />
          </button>
          <h2 className="font-amatic font-bold text-[30px] uppercase tracking-tight text-black dark:text-white leading-none absolute left-1/2 -translate-x-1/2">
            {t('Organizar Receitas')}
          </h2>
          <button 
            onClick={handleSave} 
            className="w-11 h-11 flex items-center justify-center -mr-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-brand-secondary active:scale-90 transition-all z-10"
          >
            <Check size={24} strokeWidth={2} />
          </button>
        </div>

        <div className="px-6 py-6 flex items-center justify-center gap-6 bg-white dark:bg-[#121212] mb-4">
          <div className="flex flex-col items-center justify-center w-24">
            <div className="flex items-center justify-center gap-1 text-black dark:text-white">
              <BookOpen size={23} strokeWidth={1.5} className="text-gray-400 dark:text-gray-500 mt-1.5" />
              <span className="text-4xl font-patrick leading-none">{recipes.length}</span>
            </div>
            <span className="text-[11px] font-rubik uppercase tracking-widest text-gray-400 mt-1 text-center">{t('Receitas')}</span>
          </div>
          <div className="w-px h-12 bg-gray-100 dark:bg-white/10"></div>
          <div className="flex flex-col items-center justify-center w-24">
            <div className="flex items-center justify-center gap-1 text-black dark:text-white">
              <Heart size={23} strokeWidth={1.5} className="text-gray-400 dark:text-gray-500 mt-1.5" />
              <span className="text-4xl font-patrick leading-none">{recipes.filter(r => r.isFavorite).length}</span>
            </div>
            <span className="text-[11px] font-rubik uppercase tracking-widest text-gray-400 mt-1 text-center">{t('Favoritos')}</span>
          </div>
        </div>

        <div className="px-5 mt-8 mb-4 flex items-center justify-between">
          <h2 className="text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400">{t('Categorias Principais')}</h2>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="main-categories">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="rounded-md overflow-hidden mx-5 mb-6">
                {orderedCategories.filter(c => c.isMain).map((category, index) => {
                  const isHidden = hiddenCategories.includes(category.id);
                  
                  return (
                    <Draggable key={category.id} draggableId={category.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`w-full flex items-center justify-between pl-1 pr-1 py-2 bg-[#f2f2f2] dark:bg-[#0a0a0a] active:bg-gray-100 dark:active:bg-white/5 transition-colors group ${index === orderedCategories.filter(c => c.isMain).length - 1 ? 'border-b-0' : 'border-b border-white dark:border-white/5'} ${snapshot.isDragging ? 'shadow-lg z-50' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center text-brand-secondary group-active:scale-90 transition-transform">
                              {React.cloneElement(getIconComponent(category.iconName) as React.ReactElement, { size: 24, strokeWidth: 1.5 })}
                            </div>
                            
                            <div className={`flex flex-col text-left font-sans text-[16px] leading-tight ${isHidden ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
                              {category.label}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button onClick={() => openEditModal(category)} className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                              <Pencil size={20} strokeWidth={1.5} />
                            </button>
                            
                            <button 
                              onClick={() => onToggleDefaultCategory(category.id)} 
                              className={`p-2 transition-colors ${isHidden ? 'text-gray-300 dark:text-gray-600' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                            >
                              {isHidden ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                            </button>

                            <div {...provided.dragHandleProps} className="p-2 text-gray-400 cursor-grab active:cursor-grabbing">
                              <GripHorizontal size={20} strokeWidth={1.5} />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
                <button 
                  onClick={() => setIsAddingMain(true)}
                  className="w-full flex items-center gap-3 pl-1 pr-1 py-3 bg-[#f2f2f2] dark:bg-[#0a0a0a] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border-t border-white dark:border-white/5"
                >
                  <div className="w-10 h-10 flex items-center justify-center text-gray-400">
                    <Plus size={24} strokeWidth={1.5} />
                  </div>
                  <span className="font-sans text-[16px] text-gray-500">{t('Adicionar categoria principal')}</span>
                </button>
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="px-5 mt-8 mb-4 flex items-center justify-between">
          <h2 className="text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400">{t('Categorias Secundárias')}</h2>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="rounded-md overflow-hidden mx-5">
                {orderedCategories.filter(c => !c.isMain && !c.isTag).map((category, index) => {
                  const isHidden = hiddenCategories.includes(category.id);
                  
                  return (
                    <Draggable key={category.id} draggableId={category.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`w-full flex items-center justify-between pl-1 pr-1 py-2 bg-[#f2f2f2] dark:bg-[#0a0a0a] active:bg-gray-100 dark:active:bg-white/5 transition-colors group ${index === orderedCategories.filter(c => !c.isMain && !c.isTag).length - 1 ? 'border-b-0' : 'border-b border-white dark:border-white/5'} ${snapshot.isDragging ? 'shadow-lg z-50' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center text-brand-secondary group-active:scale-90 transition-transform">
                              {React.cloneElement(getIconComponent(category.iconName) as React.ReactElement, { size: 24, strokeWidth: 1.5 })}
                            </div>
                            
                            <div className={`flex flex-col text-left font-sans text-[16px] leading-tight ${isHidden ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
                              {category.label}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button onClick={() => openEditModal(category)} className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                              <Pencil size={20} strokeWidth={1.5} />
                            </button>
                            
                            <button 
                              onClick={() => onToggleDefaultCategory(category.id)} 
                              className={`p-2 transition-colors ${isHidden ? 'text-gray-300 dark:text-gray-600' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                            >
                              {isHidden ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                            </button>

                            <div {...provided.dragHandleProps} className="p-2 text-gray-400 cursor-grab active:cursor-grabbing">
                              <GripHorizontal size={20} strokeWidth={1.5} />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
                <button 
                  onClick={() => { setIsAdding(true); setEditLabel(''); setEditIcon('ChefHat'); }}
                  className="w-full flex items-center gap-3 pl-1 pr-1 py-3 bg-[#f2f2f2] dark:bg-[#0a0a0a] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border-t border-white dark:border-white/5"
                >
                  <div className="w-10 h-10 flex items-center justify-center text-gray-400">
                    <Plus size={24} strokeWidth={1.5} />
                  </div>
                  <span className="font-sans text-[16px] text-gray-500">{t('Adicionar categoria secundária')}</span>
                </button>
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="px-5 mt-8 mb-4 flex items-center justify-between">
          <h2 className="text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400">{t('Etiquetas')}</h2>
        </div>

        <div className="rounded-md overflow-hidden mx-5 bg-[#f2f2f2] dark:bg-[#0a0a0a]">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tags">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {orderedCategories.filter(c => c.isTag && !hiddenCategories.includes(c.id)).map((category, index) => {
                    return (
                      <Draggable key={category.id} draggableId={category.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`w-full flex items-center justify-between pl-1 pr-1 py-2 bg-[#f2f2f2] dark:bg-[#0a0a0a] active:bg-gray-100 dark:active:bg-white/5 transition-colors group border-b border-white dark:border-white/5 ${snapshot.isDragging ? 'shadow-lg z-50' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 flex items-center justify-center text-brand-secondary group-active:scale-90 transition-transform">
                                <Tag size={24} strokeWidth={1.5} />
                              </div>
                              
                              <div className={`flex flex-col text-left font-sans text-[16px] leading-tight text-gray-900 dark:text-gray-100`}>
                                {category.label}
                              </div>
                            </div>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setCategoryToDelete(category);
                              }}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={20} strokeWidth={1.5} />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <button 
            onClick={() => { setIsAddingTag(true); setEditLabel(''); setEditIcon('Tag'); }}
            className="w-full flex items-center gap-3 pl-1 pr-1 py-3 bg-[#f2f2f2] dark:bg-[#0a0a0a] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <div className="w-10 h-10 flex items-center justify-center text-gray-400">
              <Plus size={24} strokeWidth={1.5} />
            </div>
            <span className="font-sans text-[16px] text-gray-500">{t('Adicionar etiqueta')}</span>
          </button>
        </div>

        <div className="flex justify-center mt-8 pt-6 pb-2">
          <span className="text-black dark:text-white text-lg">♥︎</span>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {(editingCategory || isAdding || isAddingMain || isAddingTag) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center px-3">
          <div className={`bg-white dark:bg-[#1e1e1e] w-full max-w-[360px] ${(isAddingTag || editingCategory?.isTag) ? 'min-h-[280px]' : 'min-h-[480px]'} p-6 relative animate-in zoom-in-95 duration-300 rounded-lg overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl flex flex-col justify-center`}>
            
            <button 
              onClick={() => { setEditingCategory(null); setIsAdding(false); setIsAddingMain(false); setIsAddingTag(false); }}
              className="absolute top-4 right-4 p-2 text-brand-secondary hover:text-black dark:hover:text-white transition-colors bg-gray-50 dark:bg-white/5 rounded-full"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            <div className={`text-center ${isAddingTag ? 'mb-12' : editingCategory?.isTag ? 'mt-4 mb-6' : 'mb-6'}`}>
              <h2 className="font-amatic text-[30px] font-bold uppercase tracking-tight text-black leading-none">
                {isAddingTag ? t('Nova Etiqueta') : (isAdding || isAddingMain) ? t('Nova Categoria') : t('Editar Categoria')}
              </h2>
            </div>
            
            <div className="space-y-4 flex flex-col justify-center">
              <div>
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="w-full h-12 bg-[#f2f2f2] dark:bg-white/5 px-4 text-[14px] font-mooli font-normal rounded-md outline-none border border-transparent focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-black placeholder:text-gray-400"
                  placeholder={t('Nome da Categoria (ex: Sobremesas)')}
                  autoFocus
                />
              </div>

              {!(isAddingTag || editingCategory?.isTag) && (
                <div className="flex flex-col">
                  <label className="block text-[11px] font-rubik text-gray-400 uppercase tracking-wider mb-2 text-center">{t('Selecione um ícone')}</label>
                  
                  <div className="max-h-[220px] overflow-y-auto pr-1 -mr-1 scrollbar-hide">
                    <div className="grid grid-cols-5 gap-1">
                      {AVAILABLE_ICONS.map(icon => (
                        <button
                          key={icon.name}
                          type="button"
                          onClick={() => setEditIcon(icon.name)}
                          className={`aspect-square flex items-center justify-center rounded-md transition-all ${editIcon === icon.name ? 'text-brand-secondary scale-110' : 'bg-transparent text-black hover:scale-105'}`}
                        >
                          {React.cloneElement(getIconComponent(icon.name) as React.ReactElement, { size: 24, strokeWidth: 1.5 })}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            <div className="flex gap-3 items-center">
              <button 
                onClick={(isAdding || isAddingMain || isAddingTag) ? handleAddNew : saveEdit}
                disabled={!editLabel.trim()}
                className="flex-1 h-12 bg-black text-white rounded-md active:scale-95 transition-all disabled:bg-black disabled:pointer-events-none border-none shadow-md flex items-center justify-center"
              >
                <span className="font-mooli text-[14px]">
                  {t('Salvar')}
                </span>
              </button>
              {(!isAdding && !isAddingMain && !isAddingTag) && !editingCategory?.isDefault && (
                <button 
                  onClick={() => setCategoryToDelete(editingCategory)}
                  className="w-12 h-12 flex items-center justify-center text-[#d64545] bg-[#fff0f0] dark:bg-red-500/10 rounded-md hover:bg-[#ffe5e5] dark:hover:bg-red-500/20 transition-all active:scale-90 shadow-sm"
                >
                  <Trash2 size={22} strokeWidth={1.5} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )}

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center px-3">
          <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-[360px] min-h-[280px] p-6 relative animate-in zoom-in-95 duration-300 rounded-lg overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl flex flex-col justify-center text-center">
            <div className="flex justify-center mb-3 text-brand-secondary">
              <Trash2 size={34} strokeWidth={1.5} />
            </div>
            <div className="mb-6">
              <h2 className="font-amatic text-[30px] font-bold uppercase tracking-tight text-black dark:text-white leading-none">
                {t('Excluir')} {categoryToDelete.isTag ? t('Etiqueta') : t('Categoria')}
              </h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-[14px] font-sans mb-6">
              {t('Tem certeza que deseja excluir a')} {categoryToDelete.isTag ? t('etiqueta') : t('categoria')} "{categoryToDelete.label}"? {t('Esta ação não pode ser desfeita e ela será removida de todas as receitas.')}
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
                  onDeleteCategory(categoryToDelete.id);
                  setCategoryToDelete(null);
                  setEditingCategory(null);
                }}
                className="flex-1 h-12 bg-red-500 text-white font-mooli text-[14px] rounded-md hover:bg-red-600 transition-colors"
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

