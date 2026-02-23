
import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, Minus, X, Share2, FileText, FileDown, 
  Edit3, Utensils, Star, Play, Info, List, ChefHat,
  Calendar, ShoppingCart, Clock
} from 'lucide-react';
import { Recipe } from '../types';
import { jsPDF } from 'jspdf';

interface RecipeDetailViewProps {
  recipe: Recipe;
  onBack: () => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
}

type TabType = 'about' | 'ingredients' | 'instructions';

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({ recipe, onBack, onToggleFavorite, onEdit }) => {
  const [multiplier, setMultiplier] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('about');

  const formatNumber = (num: number) => {
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
  };

  const scaleIngredient = (text: string, factor: number) => {
    if (factor === 1) return text;
    const numberRegex = /(\d+[\/.,]\d+|\d+)/g;
    return text.replace(numberRegex, (match) => {
      if (match.includes('/')) {
        const [num, den] = match.split('/').map(Number);
        if (isNaN(num) || isNaN(den)) return match;
        const val = (num / den) * factor;
        return formatNumber(val);
      }
      const val = Number(match.replace(',', '.')) * factor;
      if (isNaN(val)) return match;
      return formatNumber(val);
    });
  };

  const shareAsText = async () => {
    const scaledIngredients = recipe.ingredients.map(ing => scaleIngredient(ing, multiplier));
    const text = `🍳 ${recipe.title}\n📍 Ingredientes (${multiplier}x):\n${scaledIngredients.join('\n')}\n👨‍🍳 Modo de Preparo:\n${recipe.instructions.join('\n')}`;
    if (navigator.share) {
      await navigator.share({ title: recipe.title, text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Receita copiada!');
    }
    setShowShareMenu(false);
  };

  const shareAsPdf = async () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(recipe.title, 20, 20);
    doc.setFontSize(12);
    doc.text(`Rendimento: ${multiplier}x`, 20, 30);
    
    doc.setFontSize(16);
    doc.text("Ingredientes:", 20, 45);
    doc.setFontSize(12);
    recipe.ingredients.forEach((ing, i) => {
      doc.text(`♥︎ ${scaleIngredient(ing, multiplier)}`, 25, 55 + (i * 7));
    });

    const startPrepY = 65 + (recipe.ingredients.length * 7);
    doc.setFontSize(16);
    doc.text("Modo de Preparo:", 20, startPrepY);
    doc.setFontSize(12);
    recipe.instructions.forEach((step, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${step}`, 170);
      doc.text(lines, 20, startPrepY + 10 + (i * 15));
    });

    doc.save(`${recipe.title}.pdf`);
    setShowShareMenu(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center">
              <h2 className="font-amatic text-[32px] text-black dark:text-white mb-6 uppercase tracking-tight leading-tight">
                {recipe.title}
              </h2>
              
              <div className="flex justify-around mb-8 px-2">
                {[
                  { icon: <ChefHat size={18} />, label: 'Cook', color: 'bg-black dark:bg-[#1e1e1e]' },
                  { icon: <Calendar size={18} />, label: 'Plan', color: 'bg-black dark:bg-[#1e1e1e]' },
                  { icon: <ShoppingCart size={18} />, label: 'Shop', color: 'bg-black dark:bg-[#1e1e1e]' },
                  { icon: <Star size={18} />, label: 'Rate', color: 'bg-black dark:bg-[#1e1e1e]' },
                  { icon: <Edit3 size={18} />, label: 'Edit', color: 'bg-black dark:bg-[#1e1e1e]', onClick: onEdit },
                ].map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={item.onClick}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div className={`${item.color} w-10 h-10 rounded-md flex items-center justify-center text-white active:scale-90 transition-transform`}>
                      {item.icon}
                    </div>
                    <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="flex flex-col items-center gap-1 p-3 bg-[#f7f7f7] dark:bg-white/5 rounded-md border border-gray-100 dark:border-white/5">
                  <Utensils size={14} className="text-black" />
                  <span className="text-[10px] font-inter text-gray-400 uppercase tracking-widest">Porções</span>
                  <span className="text-[12px] font-bold text-black dark:text-white">{(Number(recipe.servings) || 4) * multiplier}</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-3 bg-[#f7f7f7] dark:bg-white/5 rounded-md border border-gray-100 dark:border-white/5">
                  <Play size={14} fill="black" className="text-black" />
                  <span className="text-[10px] font-inter text-gray-400 uppercase tracking-widest">Preparo</span>
                  <span className="text-[12px] font-bold text-black dark:text-white">{recipe.prepTime || '15'}m</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-3 bg-[#f7f7f7] dark:bg-white/5 rounded-md border border-gray-100 dark:border-white/5">
                  <Clock size={14} className="text-black" />
                  <span className="text-[10px] font-inter text-gray-400 uppercase tracking-widest">Cozimento</span>
                  <span className="text-[12px] font-bold text-black dark:text-white">{recipe.cookTime || '30'}m</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={onEdit}
                  className="w-full bg-black text-white py-4 flex items-center justify-center gap-2 rounded-md active:scale-95 transition-all"
                >
                  <Edit3 size={16} />
                  <span className="font-amatic text-[18px] tracking-widest uppercase">Editar esta receita</span>
                </button>

                <button 
                  onClick={shareAsPdf}
                  className="w-full bg-gray-100 dark:bg-[#333] text-black dark:text-white py-4 flex items-center justify-center gap-2 rounded-md active:scale-95 transition-all mb-4"
                >
                  <FileDown size={16} />
                  <span className="font-amatic text-[18px] tracking-widest uppercase">Copiar PDF</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'ingredients':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-amatic text-3xl uppercase tracking-tight text-black dark:text-white">Ingredientes</h2>
              <div className="flex items-center bg-[#f7f7f7] dark:bg-white/5 px-2 py-1 rounded-md">
                <button onClick={() => setMultiplier(m => Math.max(0.5, m - 0.5))} className="w-7 h-7 bg-white dark:bg-black/40 rounded-sm flex items-center justify-center text-black dark:text-white border border-gray-100 dark:border-white/5"><Minus size={14} /></button>
                <span className="font-inter text-[12px] font-bold min-w-[35px] text-center px-1 text-black dark:text-white">{multiplier}x</span>
                <button onClick={() => setMultiplier(m => m + 0.5)} className="w-7 h-7 bg-white dark:bg-black/40 rounded-sm flex items-center justify-center text-black dark:text-white border border-gray-100 dark:border-white/5"><Plus size={14} /></button>
              </div>
            </div>
            <div className="bg-[#f7f7f7] dark:bg-white/5 p-6 rounded-md">
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-black dark:text-white text-[15px] shrink-0 font-serif leading-none mt-0.5">♥︎</span>
                    <span className="font-inter text-[14px] text-black dark:text-gray-200 leading-snug">{scaleIngredient(ing, multiplier)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'instructions':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
            <h2 className="font-amatic text-3xl uppercase tracking-tight mb-4 text-black dark:text-white">Modo de Preparo</h2>
            {recipe.instructions.map((step, i) => (
              <div key={i} className="bg-[#f7f7f7] dark:bg-white/5 p-6 flex gap-4 rounded-md">
                <div className="w-8 h-8 shrink-0 bg-black rounded-sm flex items-center justify-center font-inter text-white font-bold text-[11px]">{i + 1}</div>
                <p className="font-inter text-[14px] text-black dark:text-gray-200 leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] pb-32">
      <header className="bg-white dark:bg-[#121212] border-b border-gray-50 dark:border-white/5 px-4 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-1">
          <button onClick={onBack} className="flex items-center text-black dark:text-white text-[14px] font-semibold uppercase tracking-widest active:opacity-50 transition-opacity">
            <ArrowLeft size={18} className="mr-1" /> Voltar
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onEdit} className="text-black dark:text-white active:scale-90 transition-transform">
            <Edit3 size={18} />
          </button>
          <button onClick={() => setShowShareMenu(true)} className="text-black dark:text-white active:scale-90 transition-transform">
            <Share2 size={18} />
          </button>
        </div>
      </header>

      {/* Hero Image Section - Edge to Edge */}
      <div className="relative w-full h-[380px] overflow-hidden">
        <img 
          src={recipe.imageUrl || `https://picsum.photos/seed/${recipe.id}/600/800`} 
          className="w-full h-full object-cover"
          alt={recipe.title}
        />
        
        <div className="absolute inset-0 bg-black/5" />

        <button 
          onClick={onToggleFavorite}
          className="absolute bottom-6 right-6 w-12 h-12 bg-white/90 dark:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-black active:scale-90 transition-transform border border-gray-100 dark:border-white/10"
        >
          <span className="text-[26px] leading-none mb-1">
            {recipe.isFavorite ? '♥︎' : '♥︎'}
          </span>
        </button>
      </div>

      {/* Content Section */}
      <div className="px-5 -mt-6 relative z-10">
        <div className="bg-white dark:bg-[#1e1e1e] rounded-t-[32px] p-6 pb-12 min-h-[400px]">
          {renderTabContent()}
        </div>
      </div>

      <button 
        onClick={() => setShowShareMenu(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-black text-white rounded-md flex items-center justify-center z-30 active:scale-95 transition-transform"
      >
        <div className="flex flex-col gap-0.5 items-center">
          <div className="w-1 h-1 bg-white rounded-full" />
          <div className="w-1 h-1 bg-white rounded-full" />
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
      </button>

      <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#121212] border-t border-gray-100 dark:border-white/5 px-6 h-20 flex items-center justify-between z-40">
        {[
          { id: 'about', label: 'Sobre', icon: <Info size={20} /> },
          { id: 'ingredients', label: 'Ingredientes', icon: <ChefHat size={20} /> },
          { id: 'instructions', label: 'Preparo', icon: <List size={20} /> },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex flex-col items-center gap-1.5 min-w-[80px] transition-colors ${activeTab === tab.id ? 'text-black font-bold' : 'text-gray-300 dark:text-gray-600'}`}
          >
            {tab.icon}
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{tab.label}</span>
          </button>
        ))}
      </nav>

      {showShareMenu && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowShareMenu(false)} />
          <div className="relative bg-white dark:bg-[#1e1e1e] w-full max-w-lg p-8 animate-in slide-in-from-bottom duration-300 rounded-t-lg border-t border-gray-100 dark:border-white/10">
            <div className="w-12 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full mx-auto mb-8" />
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="font-amatic text-3xl uppercase tracking-tight text-black dark:text-white">Compartilhar</h3>
              <button onClick={() => setShowShareMenu(false)} className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={shareAsText} className="flex items-center gap-4 p-5 bg-[#f7f7f7] dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors group">
                <div className="w-10 h-10 bg-black text-white rounded-sm flex items-center justify-center shrink-0"><FileText size={18} /></div>
                <div className="text-left"><p className="font-bold text-[11px] uppercase tracking-widest text-black dark:text-white">WhatsApp / Texto</p><p className="text-[10px] text-gray-500 font-inter uppercase">Copiar conteúdo formatado</p></div>
              </button>
              <button onClick={shareAsPdf} className="flex items-center gap-4 p-5 bg-[#f7f7f7] dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors group">
                <div className="w-10 h-10 bg-black text-white rounded-sm flex items-center justify-center shrink-0"><FileDown size={18} /></div>
                <div className="text-left"><p className="font-bold text-[11px] uppercase tracking-widest text-black dark:text-white">Documento PDF</p><p className="text-[10px] text-gray-500 font-inter uppercase">Exportar para impressão</p></div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
