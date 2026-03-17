
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, Plus, Minus, X, Share2, FileText, FileDown, 
  Edit3, Utensils, Star, Play, Info, List, ChefHat,
  Calendar, ShoppingCart, Clock, Heart, MoreVertical, Printer, ExternalLink, Ban
} from 'lucide-react';
import { Recipe } from '../types';
import { jsPDF } from 'jspdf';

interface RecipeDetailViewProps {
  recipe: Recipe;
  onBack: () => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

type TabType = 'about' | 'ingredients' | 'instructions';

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({ recipe, onBack, onToggleFavorite, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [multiplier, setMultiplier] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
    const text = `🍳 ${recipe.title}\n📍 Ingredientes (${multiplier}x):\n${scaledIngredients.join('\n')}\n👨‍🍳 Instruções:\n${recipe.instructions.join('\n')}`;
    if (navigator.share) {
      await navigator.share({ title: recipe.title, text });
    } else {
      navigator.clipboard.writeText(text);
      alert(t('Receita copiada!'));
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
    doc.text("Instruções:", 20, startPrepY);
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
          <div key="about" className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-left">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-amatic font-bold text-[30px] text-black dark:text-white leading-tight pr-4">
                  {recipe.title}
                </h2>
                <button 
                  onClick={onToggleFavorite} 
                  className={`text-[32px] leading-none active:scale-95 transition-colors mt-0 flex-shrink-0 ${recipe.isFavorite ? 'text-black dark:text-white' : 'text-gray-300 dark:text-gray-600'}`}
                >
                  ♥︎
                </button>
              </div>
              
              {recipe.categories && recipe.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {recipe.categories.map((category) => (
                    <span 
                      key={category} 
                      className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-black dark:text-white text-[12px] font-sans rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'ingredients':
        return (
          <div key="ingredients" className="animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-amatic font-bold text-[28px] uppercase tracking-tight text-black dark:text-white">Ingredientes</h2>
              <div className="flex items-center bg-[#BD715D] p-1 rounded-full shadow-sm">
                <button onClick={() => setMultiplier(m => Math.max(0.5, m - 0.5))} className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black shadow-sm transition-transform active:scale-95"><Minus size={14} strokeWidth={2.5} /></button>
                <span className="font-patrick text-[18px] font-normal min-w-[54px] flex items-center justify-center text-white">{multiplier}x</span>
                <button onClick={() => setMultiplier(m => m + 0.5)} className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black shadow-sm transition-transform active:scale-95"><Plus size={14} strokeWidth={2.5} /></button>
              </div>
            </div>
            <ul className="space-y-3">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-black dark:text-white text-[15px] shrink-0 font-serif leading-none mt-0.5">♥︎</span>
                  <span className="font-mooli text-[14px] font-normal text-black dark:text-gray-200 leading-snug">{scaleIngredient(ing, multiplier)}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'instructions':
        return (
          <div key="instructions" className="animate-in fade-in zoom-in-95 duration-300 space-y-4">
            <h2 className="font-amatic font-bold text-[28px] uppercase tracking-tight mb-8 text-black dark:text-white">Instruções</h2>
            {recipe.instructions.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 shrink-0 bg-[#BD715D] rounded-full flex items-center justify-center font-patrick text-white text-[16px]">{i + 1}</div>
                <p className="font-mooli text-[14px] font-normal text-black dark:text-gray-200 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#121212] pb-32 relative">
      {/* Hero Image Section - Edge to Edge at the very top */}
      <div className="relative w-full h-[450px] overflow-hidden">
        <img 
          src={recipe.imageUrl || `https://picsum.photos/seed/${recipe.id}/600/800`} 
          className="w-full h-full object-cover"
          alt={recipe.title}
        />
        
        {/* Top Navigation Overlay */}
        <div className="absolute top-0 left-0 w-full p-5 flex justify-between items-start z-10 pt-6">
          <button 
            onClick={onBack} 
            className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-black shadow-md active:scale-95 transition-transform"
          >
            <ArrowLeft size={22} strokeWidth={2} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(true)} 
              className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-black shadow-md active:scale-95 transition-transform"
            >
              <MoreVertical size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-20 -mt-6 bg-[#F9F9F9] dark:bg-[#1e1e1e] rounded-t-[24px] px-6 pt-8 pb-12 min-h-[400px]">
        {renderTabContent()}
      </div>

      <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#121212] border-t border-gray-100 dark:border-white/5 px-6 h-20 flex items-center justify-between z-40">
        {[
          { id: 'about', label: 'Sobre', icon: <Info size={20} /> },
          { id: 'ingredients', label: 'Ingredientes', icon: <ChefHat size={20} /> },
          { id: 'instructions', label: 'Instruções', icon: <List size={20} /> },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex flex-col items-center gap-1.5 min-w-[80px] p-2 rounded-xl transition-all ${activeTab === tab.id ? 'text-white bg-[#BD715D] font-bold shadow-md' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
          >
            {tab.icon}
            <span className="font-rubik text-[10px] font-bold uppercase tracking-[0.2em]">{tab.label}</span>
          </button>
        ))}
      </nav>

      {showShareMenu && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0" onClick={() => setShowShareMenu(false)} />
          <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-[360px] aspect-[4/5] p-6 relative animate-in zoom-in-95 duration-300 rounded-lg border border-gray-100 dark:border-white/10 shadow-2xl flex flex-col justify-center">
            
            <button 
              onClick={() => setShowShareMenu(false)} 
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors bg-gray-50 dark:bg-white/5 rounded-full z-10"
            >
              <X size={20} />
            </button>
            
            <h2 className="font-amatic text-[30px] font-bold text-center mb-10 text-black dark:text-white uppercase tracking-tight leading-none">
              Compartilhar
            </h2>
            
            <div className="space-y-4 flex flex-col justify-center">
              <button onClick={shareAsText} className="w-full flex items-center gap-4 p-4 bg-[#f7f7f7] dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-[0.98] text-left rounded-md border-none group">
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <FileText size={28} className="text-brand-secondary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-amatic text-[24px] leading-none uppercase text-black dark:text-white tracking-tight font-bold">WhatsApp / Texto</p>
                  <p className="text-[13px] text-gray-400 font-sans mt-1 opacity-80">Copiar conteúdo formatado</p>
                </div>
              </button>
              
              <button onClick={shareAsPdf} className="w-full flex items-center gap-4 p-4 bg-[#f7f7f7] dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-[0.98] text-left rounded-md border-none group">
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <FileDown size={28} className="text-brand-secondary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-amatic text-[24px] leading-none uppercase text-black dark:text-white tracking-tight font-bold">Documento PDF</p>
                  <p className="text-[13px] text-gray-400 font-sans mt-1 opacity-80">Exportar para impressão</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      {showMenu && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowMenu(false)} />
          <div className="bg-white dark:bg-[#1e1e1e] w-full rounded-t-3xl pb-8 pt-6 px-4 relative animate-in slide-in-from-bottom-full duration-300 shadow-2xl">
            
            <div className="flex flex-col gap-2">
              <button onClick={() => { setShowMenu(false); onEdit(); }} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left">
                <Edit3 size={22} className="text-[#BD715D]" strokeWidth={1.5} />
                <span className="font-rubik text-[16px] text-black dark:text-white">Editar Receita</span>
              </button>
              <button onClick={() => { setShowMenu(false); setShowShareMenu(true); }} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left">
                <Share2 size={22} className="text-[#BD715D]" strokeWidth={1.5} />
                <span className="font-rubik text-[16px] text-black dark:text-white">Compartilhar</span>
              </button>
              <button onClick={() => { setShowMenu(false); window.print(); }} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left">
                <Printer size={22} className="text-[#BD715D]" strokeWidth={1.5} />
                <span className="font-rubik text-[16px] text-black dark:text-white">Impressão</span>
              </button>
              {recipe.sourceUrl && (
                <button onClick={() => { setShowMenu(false); window.open(recipe.sourceUrl, '_blank'); }} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left">
                  <ExternalLink size={22} className="text-[#BD715D]" strokeWidth={1.5} />
                  <span className="font-rubik text-[16px] text-black dark:text-white">Ver receita original</span>
                </button>
              )}
              <button onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors text-left">
                <Ban size={22} className="text-red-500" strokeWidth={1.5} />
                <span className="font-rubik text-[16px] text-red-500">Excluir Receita</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center px-4">
          <div className="absolute inset-0" onClick={() => setShowDeleteConfirm(false)} />
          <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-[320px] p-6 relative animate-in zoom-in-95 duration-300 rounded-2xl shadow-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <Ban size={24} className="text-red-500" strokeWidth={2} />
            </div>
            <h3 className="font-sans text-[18px] font-bold text-black dark:text-white mb-2">Excluir Receita</h3>
            <p className="font-sans text-[14px] text-gray-500 dark:text-gray-400 mb-6">
              Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl font-sans text-[14px] font-medium text-black dark:text-white bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDelete();
                }}
                className="flex-1 py-3 px-4 rounded-xl font-sans text-[14px] font-medium text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
