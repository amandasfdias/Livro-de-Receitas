
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Save, X, ImagePlus, Check, Edit3, Sparkles, ChevronDown } from 'lucide-react';
import { Recipe, CustomCategory } from '../types';

interface ManualRecipeViewProps {
  initialRecipe?: Recipe;
  onSave: (recipe: Omit<Recipe, 'id'>) => void;
  onBack: () => void;
  isPreview?: boolean;
  customCategories?: CustomCategory[];
}

const CATEGORIES = [
  { id: 'SALGADO', label: 'Salgado' },
  { id: 'DOCE', label: 'Doce' },
  { id: 'BEBIDA', label: 'Bebida' },
  { id: 'FIT', label: 'Fit' },
  { id: 'PADARIA', label: 'Padaria' },
  { id: 'OUTROS', label: 'Outros' }
];

export const ManualRecipeView: React.FC<ManualRecipeViewProps> = ({ initialRecipe, onSave, onBack, isPreview, customCategories = [] }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<{title?: boolean, ingredients?: boolean, instructions?: boolean}>({});
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const allCategories = [
    ...CATEGORIES.filter(c => c.id !== 'OUTROS'),
    ...customCategories,
    { id: 'OUTROS', label: 'Outros' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (initialRecipe) {
      setTitle(initialRecipe.title || '');
      setCategory(initialRecipe.category || '');
      setIngredients(Array.isArray(initialRecipe.ingredients) ? initialRecipe.ingredients.join('\n') : '');
      setInstructions(Array.isArray(initialRecipe.instructions) ? initialRecipe.instructions.join('\n') : '');
      setImageUrl(initialRecipe.imageUrl);
    }
  }, [initialRecipe]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageUrl(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    setHasAttemptedSave(true);
    if (!title.trim() || !ingredients.trim() || !instructions.trim()) {
      setErrors({ title: !title.trim(), ingredients: !ingredients.trim(), instructions: !instructions.trim() });
      return;
    }
    const ingredientList = ingredients.split('\n').filter(i => i.trim() !== '');
    const instructionList = instructions.split('\n').filter(i => i.trim() !== '');
    onSave({ title: title.toUpperCase(), category: category.toUpperCase() || 'GERAL', ingredients: ingredientList, instructions: instructionList, imageUrl });
  };

  const labelClass = "block text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400 mb-4";
  const inputBaseClass = "w-full bg-[#f7f7f7] dark:bg-white/5 py-4 px-4 text-[14px] font-mooli font-normal rounded-md outline-none border border-transparent focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-black dark:text-white placeholder:text-gray-400";

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] animate-in fade-in duration-500 flex flex-col">
      <header className="pt-12 pb-6 px-6 flex items-center justify-between sticky top-0 bg-white dark:bg-[#121212] z-10">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-md transition-colors text-black dark:text-white active:scale-90 z-10">
          <ArrowLeft size={22} />
        </button>
        <h2 className="font-amatic font-bold text-[30px] uppercase tracking-tight text-black dark:text-white leading-none absolute left-1/2 -translate-x-1/2 mt-1">
          {initialRecipe ? 'Editar Receita' : 'Adicionar Receita'}
        </h2>
        <button 
          onClick={handleSave} 
          className="p-2 -mr-2 text-brand-secondary active:scale-90 transition-transform z-10"
        >
          <Check size={26} strokeWidth={2.5} />
        </button>
      </header>

      <div className="flex-1 px-6 space-y-8 max-w-md mx-auto w-full pb-24">

        <div>
          <label className={labelClass}>Título da Receita</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Ex: Bolo de Chocolate"
            className={`${inputBaseClass} ${errors.title ? 'ring-2 ring-red-500' : ''}`} 
          />
        </div>

        <div>
          <label className={labelClass}>Categoria</label>
          <div className="relative" ref={categoryDropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className={`${inputBaseClass} flex items-center justify-between text-left`}
            >
              <span className={category ? 'text-black dark:text-white' : 'text-gray-400'}>
                {category ? allCategories.find(c => c.id === category)?.label || category : 'Selecione uma categoria'}
              </span>
              <ChevronDown 
                className={`text-gray-400 transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} 
                size={20} 
              />
            </button>
            
            <div 
              className={`absolute z-20 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-xl shadow-lg overflow-hidden transition-all duration-300 origin-top ${
                isCategoryDropdownOpen 
                  ? 'opacity-100 scale-y-100 translate-y-0' 
                  : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="py-2 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full flex flex-col">
                {allCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.id);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={`px-4 py-3 text-left text-[14px] font-mooli transition-colors hover:bg-[#f7f7f7] dark:hover:bg-white/5 ${
                      category === cat.id 
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
          <label className={labelClass}>Ingredientes</label>
          <textarea 
            value={ingredients} 
            onChange={(e) => setIngredients(e.target.value)} 
            rows={5} 
            placeholder="Liste os ingredientes, um por linha"
            className={`${inputBaseClass} ${errors.ingredients ? 'ring-2 ring-red-500' : ''} resize-none`} 
          />
        </div>

        <div>
          <label className={labelClass}>Instruções</label>
          <textarea 
            value={instructions} 
            onChange={(e) => setInstructions(e.target.value)} 
            rows={5} 
            placeholder="Descreva o passo a passo"
            className={`${inputBaseClass} ${errors.instructions ? 'ring-2 ring-red-500' : ''} resize-none`} 
          />
        </div>

      </div>
    </div>
  );
};
