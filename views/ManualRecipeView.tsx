
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Save, X, ImagePlus, Check, Edit3, Sparkles } from 'lucide-react';
import { Recipe } from '../types';

interface ManualRecipeViewProps {
  initialRecipe?: Recipe;
  onSave: (recipe: Omit<Recipe, 'id'>) => void;
  onBack: () => void;
  isPreview?: boolean;
}

export const ManualRecipeView: React.FC<ManualRecipeViewProps> = ({ initialRecipe, onSave, onBack, isPreview }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<{title?: boolean, ingredients?: boolean, instructions?: boolean}>({});
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialRecipe) {
      setTitle(initialRecipe.title || '');
      setCategory(initialRecipe.category || '');
      setPrepTime(initialRecipe.prepTime || '');
      setCookTime(initialRecipe.cookTime || '');
      setServings(initialRecipe.servings || '');
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
    onSave({ title: title.toUpperCase(), category: category.toUpperCase() || 'GERAL', prepTime, cookTime, servings, ingredients: ingredientList, instructions: instructionList, imageUrl });
  };

  const labelClass = "block text-[11px] font-inter text-gray-400 mb-3 uppercase tracking-[0.18em] font-bold";
  const inputBaseClass = "w-full bg-[#fcfcfc] dark:bg-black/20 border border-gray-100 dark:border-white/5 p-4.5 text-[14px] font-inter focus:border-black dark:focus:border-white/30 outline-none rounded-md transition-all text-black dark:text-white shadow-sm";

  return (
    <div className="min-h-screen bg-[#f7f7f7] dark:bg-[#0a0a0a] animate-in fade-in duration-500 flex flex-col">
      <header className="pt-16 pb-12 px-6 text-center relative sticky top-0 bg-[#f7f7f7] dark:bg-[#0a0a0a] z-30">
        <button onClick={onBack} className="absolute left-6 top-1/2 -translate-y-1/2 p-2 -ml-2 text-black dark:text-white active:scale-90 transition-transform">
          <ArrowLeft size={22} />
        </button>
        <h2 className="font-amatic font-bold text-[34px] uppercase tracking-tight text-black dark:text-white leading-none">
          {isPreview ? 'Revisar' : initialRecipe ? 'Editar' : 'Nova Receita'}
        </h2>
        {isPreview && <Sparkles size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-secondary" />}
      </header>

      <div className="flex-1 flex flex-col">
        {/* Área da Imagem com mais respiro */}
        <div className="px-8 mb-12">
          <div className="relative group">
            {imageUrl ? (
              <div className="relative w-full aspect-[4/5] bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <button onClick={removeImage} className="absolute top-4 right-4 w-9 h-9 bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md active:scale-90 transition-transform shadow-lg"><X size={18} /></button>
              </div>
            ) : (
              <button onClick={() => fileInputRef.current?.click()} className="w-full aspect-[4/5] border border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-black dark:hover:border-white transition-all bg-white dark:bg-white/5 shadow-inner">
                <ImagePlus size={32} strokeWidth={1.5} />
                <span className="text-[12px] font-bold uppercase tracking-[0.2em]">Adicionar Foto</span>
              </button>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          </div>
        </div>

        {/* Container Branco (Sheet) para os Inputs - Espaçamento vertical ampliado para formato retrato */}
        <div className="flex-1 bg-white dark:bg-[#121212] rounded-t-[50px] px-8 pt-20 pb-72 shadow-[0_-12px_40px_rgb(0,0,0,0.03)] dark:shadow-none border-t border-gray-50 dark:border-white/5">
          <div className="max-w-md mx-auto space-y-12">
            <div className="space-y-10">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                <label className={labelClass}>Título da Receita *</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Ex: Bolo de Chocolate Belga"
                  className={`${inputBaseClass} ${errors.title ? 'border-red-500 bg-red-50/10' : ''}`} 
                />
              </div>

              <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                <div>
                  <label className={labelClass}>Categoria</label>
                  <input 
                    type="text" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    placeholder="Doces"
                    className={inputBaseClass} 
                  />
                </div>
                <div>
                  <label className={labelClass}>Rendimento</label>
                  <input 
                    type="text" 
                    value={servings} 
                    onChange={(e) => setServings(e.target.value)} 
                    placeholder="12 fatias"
                    className={inputBaseClass} 
                  />
                </div>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                <label className={labelClass}>Ingredientes *</label>
                <textarea 
                  value={ingredients} 
                  onChange={(e) => setIngredients(e.target.value)} 
                  rows={8} 
                  placeholder="Liste um ingrediente por linha"
                  className={`${inputBaseClass} ${errors.ingredients ? 'border-red-500 bg-red-50/10' : ''} resize-none min-h-[200px] leading-relaxed`} 
                />
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-250">
                <label className={labelClass}>Modo de Preparo *</label>
                <textarea 
                  value={instructions} 
                  onChange={(e) => setInstructions(e.target.value)} 
                  rows={10} 
                  placeholder="Descreva o passo a passo..."
                  className={`${inputBaseClass} ${errors.instructions ? 'border-red-500 bg-red-50/10' : ''} resize-none min-h-[250px] leading-relaxed`} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé Fixo com Botão de Ação */}
      <div className="fixed bottom-0 left-0 w-full p-8 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-t border-gray-50 dark:border-white/5 z-40">
        <button onClick={handleSave} className="w-full bg-black dark:bg-white text-white dark:text-black py-5 flex items-center justify-center gap-3 rounded-2xl active:scale-[0.98] transition-all shadow-xl hover:shadow-2xl">
          <Check size={22} strokeWidth={2.5} />
          <span className="font-amatic text-[26px] font-bold tracking-widest uppercase">Salvar no Caderno</span>
        </button>
      </div>
    </div>
  );
};
