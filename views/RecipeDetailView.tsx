
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, Plus, Minus, X, Share2, FileText, FileDown, 
  Edit3, CookingPot, Popcorn, FileEdit,
  MoreVertical, Printer, ExternalLink, Trash2,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Recipe } from '../types';
import { jsPDF } from 'jspdf';

interface RecipeDetailViewProps {
  recipe: Recipe;
  onBack: () => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateNotes?: (notes: string) => void;
  accentColor?: string;
}

type TabType = 'ingredients' | 'instructions';

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({ recipe, onBack, onToggleFavorite, onEdit, onDelete, onUpdateNotes, accentColor = '#BD715D' }) => {
  const { t } = useTranslation();
  const [multiplier, setMultiplier] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isMultiplierOpen, setIsMultiplierOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('ingredients');

  const formatNumber = (num: number) => {
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
  };

  const scaleIngredient = (text: string, factor: number) => {
    if (factor === 1) return text;
    const numberRegex = /(\d+[/.,]\d+|\d+)/g;
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
    const scaledIngredients = recipe.ingredients.map(ing => {
      if (ing.startsWith('# ')) return `\n*${ing.substring(2).toUpperCase()}:*`;
      return `♥︎ ${scaleIngredient(ing, multiplier)}`;
    });
    
    const formattedInstructions = recipe.instructions.map((inst, idx) => `*${idx + 1} -* ${inst}`);

    const text = `*${recipe.title.toUpperCase()}*\n\n` + 
                 `\`\`\`${t('Ingredientes').toUpperCase()}:\`\`\`\n\n` + 
                 `${scaledIngredients.join('\n')}\n\n` + 
                 `\`\`\`${t('Instruções').toUpperCase()}:\`\`\`\n\n` + 
                 `${formattedInstructions.join('\n')}`;

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
    doc.text(`${t('Rendimento')}: ${multiplier}x`, 20, 30);
    
    doc.setFontSize(16);
    doc.text(`${t('Ingredientes')}:`, 20, 45);
    doc.setFontSize(12);
    
    let currentY = 55;
    recipe.ingredients.forEach((ing) => {
      if (ing.startsWith('# ')) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        currentY += 5;
        doc.text(ing.substring(2).toUpperCase(), 20, currentY);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        currentY += 7;
      } else {
        doc.text(`♥︎ ${scaleIngredient(ing, multiplier)}`, 25, currentY);
        currentY += 7;
      }
    });

    const startPrepY = currentY + 10;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`${t('Instruções')}:`, 20, startPrepY);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    let instructionY = startPrepY + 10;
    recipe.instructions.forEach((step, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${step}`, 170);
      doc.text(lines, 20, instructionY);
      instructionY += lines.length * 7 + 3;
    });

    doc.save(`${recipe.title}.pdf`);
    setShowShareMenu(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ingredients':
        return (
          <div key="ingredients" className="animate-in fade-in zoom-in-95 duration-300 px-2 relative">
            <div className="flex items-start justify-between gap-4">
              <ul className="space-y-3 flex-1">
                {recipe.ingredients.map((ing, i) => {
                  if (ing.startsWith('# ')) {
                    return (
                      <li 
                        key={i} 
                        className={`${i === 0 ? 'pb-1 -mt-1' : 'pt-4 pb-1'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
                        style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
                      >
                        <span className="font-amatic text-[24px] font-bold text-black dark:text-white uppercase tracking-tight leading-none">{ing.substring(2)}</span>
                      </li>
                    );
                  }
                  return (
                    <li 
                      key={i} 
                      className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500"
                      style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
                    >
                      <span className="text-black dark:text-white text-[14px] shrink-0 font-serif leading-none mt-0.5">♥︎</span>
                      <span className="font-mooli text-[13px] font-normal text-black dark:text-gray-200 leading-snug">{scaleIngredient(ing, multiplier)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            {/* Multiplicador Lateral */}
            <div 
              className={`absolute -right-7 top-0 z-50 flex items-start transition-transform duration-300 ease-in-out ${isMultiplierOpen ? '-translate-x-3' : 'translate-x-full'}`}
            >
              <button 
                onClick={() => setIsMultiplierOpen(!isMultiplierOpen)}
                title={isMultiplierOpen ? t('Fechar multiplicador') : t('Abrir multiplicador')}
                className="absolute right-full top-0 text-white py-3 px-3 rounded-l-xl flex flex-col items-center justify-center gap-2 h-36 transition-all"
                style={{ 
                  backgroundColor: `color-mix(in srgb, ${accentColor}, white 30%)`,
                  boxShadow: `-4px 0 10px color-mix(in srgb, ${accentColor}, transparent 90%)`
                }}
              >
                {isMultiplierOpen ? <ChevronRight size={16} strokeWidth={2.5} /> : <ChevronLeft size={16} strokeWidth={2.5} />}
                <span className="font-patrick text-[14px] tracking-widest uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                  {t('Multiplicador')}
                </span>
              </button>

              <div className="bg-white dark:bg-[#1A1A1A] shadow-[0_0_25px_rgba(0,0,0,0.1)] border-y border-l border-gray-100 dark:border-gray-800 p-3 flex flex-col items-center gap-4 w-16 rounded-l-2xl relative top-[72px] -translate-y-1/2">
                <button 
                  onClick={() => setMultiplier(m => Math.max(0.5, m - 0.5))} 
                  title={t('Diminuir porções')}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all active:scale-95 bg-black shadow-sm" 
                >
                  <Minus size={16} strokeWidth={2.5} />
                </button>
                <span className="font-patrick text-[20px] font-normal text-black dark:text-white">
                  {multiplier}x
                </span>
                <button 
                  onClick={() => setMultiplier(m => m + 0.5)} 
                  title={t('Aumentar porções')}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all active:scale-95 bg-black shadow-sm" 
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        );
      case 'instructions':
        return (
          <div key="instructions" className="animate-in fade-in zoom-in-95 duration-300 space-y-8 px-2">
            <div className="space-y-4">
              {recipe.instructions.map((step, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
                >
                  <div 
                    className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center font-patrick text-white text-[14px] mt-0.5 -ml-1.5"
                    style={{ backgroundColor: accentColor }}
                  >
                    {i + 1}
                  </div>
                  <p className="font-mooli text-[13px] font-normal text-black dark:text-gray-200 leading-relaxed text-left">{step}</p>
                </div>
              ))}
            </div>
            <div className="pt-6">
              <h3 className="font-amatic font-bold text-[24px] uppercase tracking-tight mb-3 text-black dark:text-white flex items-center gap-2 leading-none">
                <FileEdit size={20} strokeWidth={1.5} />
                {t('Notas')}
              </h3>
              <textarea
                value={recipe.notes || ''}
                onChange={(e) => onUpdateNotes && onUpdateNotes(e.target.value)}
                placeholder={t('Adicione suas anotações aqui...')}
                className="w-full min-h-[120px] p-4 bg-white dark:bg-[#121212] rounded-md resize-none font-sans text-[14px] text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white transition-all placeholder:text-gray-400 border border-transparent"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] dark:bg-[#121212] pb-12 relative">
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
            title={t('Voltar')}
            className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-black shadow-md active:scale-95 transition-transform"
          >
            <ArrowLeft size={22} strokeWidth={2} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(true)} 
              title={t('Mais opções')}
              className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-black shadow-md active:scale-95 transition-transform"
            >
              <MoreVertical size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Bottom Right Overlay (Favorite) */}
        <div className="absolute bottom-10 right-5 z-10">
          <button 
            onClick={onToggleFavorite} 
            title={recipe.isFavorite ? t('Remover dos favoritos') : t('Adicionar aos favoritos')}
            className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            <span className={`text-[26px] leading-none mt-0.5 ${recipe.isFavorite ? 'text-black' : 'text-gray-300'}`}>
              ♥︎
            </span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-20 -mt-6 bg-[#f2f2f2] dark:bg-[#1e1e1e] rounded-t-[24px] px-5 pt-8 pb-6 min-h-[400px]">
        
        {/* Fixed Title Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-2">
            <h2 className="font-amatic font-bold text-[30px] text-black leading-tight">
              {recipe.title}
            </h2>
          </div>
          
          {recipe.date && (
            <div className="text-gray-500 dark:text-gray-400 text-sm font-mooli mb-4">
              {new Date(recipe.date).toLocaleDateString('pt-BR')}
            </div>
          )}
          
          {(recipe.mainCategory || recipe.category || (recipe.tags && recipe.tags.length > 0)) && (
            <div className="flex justify-center mt-4 px-5 pb-2">
              <div className="flex flex-row gap-2 overflow-x-auto no-scrollbar">
                {recipe.mainCategory && (
                  <span className="flex-shrink-0 px-4 py-1.5 bg-[#1A1A1A] dark:bg-white text-white dark:text-black text-[11px] font-mooli rounded-full lowercase tracking-wider">
                    {recipe.mainCategory.replace(/_/g, ' ')}
                  </span>
                )}
                {recipe.category && (
                  <span className="flex-shrink-0 px-4 py-1.5 bg-[#1A1A1A] dark:bg-white text-white dark:text-black text-[11px] font-mooli rounded-full lowercase tracking-wider">
                    {recipe.category.replace(/_/g, ' ')}
                  </span>
                )}
                {recipe.tags && recipe.tags.map(tag => (
                  <span key={tag} className="flex-shrink-0 px-4 py-1.5 bg-[#1A1A1A] dark:bg-white text-white dark:text-black text-[11px] font-mooli rounded-full lowercase tracking-wider">
                    {tag.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab('ingredients')}
            title={t('Ver ingredientes')}
            className={`flex-1 pb-3 text-center font-rubik text-[13px] uppercase tracking-wider transition-colors ${
              activeTab === 'ingredients' 
                ? 'font-bold text-black dark:text-white border-b-2 border-black dark:border-white' 
                : 'font-normal text-gray-400 border-b-2 border-transparent hover:text-gray-600'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Popcorn size={16} />
              <span>{t('Ingredientes')}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            title={t('Ver instruções')}
            className={`flex-1 pb-3 text-center font-rubik text-[13px] uppercase tracking-wider transition-colors ${
              activeTab === 'instructions' 
                ? 'font-bold text-black dark:text-white border-b-2 border-black dark:border-white' 
                : 'font-normal text-gray-400 border-b-2 border-transparent hover:text-gray-600'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CookingPot size={16} />
              <span>{t('Instruções')}</span>
            </div>
          </button>
        </div>

        {renderTabContent()}
      </div>

      {showShareMenu && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0" onClick={() => setShowShareMenu(false)} />
          <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-[360px] aspect-[4/5] p-6 relative animate-in zoom-in-95 duration-300 rounded-lg border border-gray-100 dark:border-white/10 shadow-2xl flex flex-col justify-center">
            
            <button 
              onClick={() => setShowShareMenu(false)} 
              title={t('Fechar')}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors bg-gray-50 dark:bg-white/5 rounded-full z-10"
            >
              <X size={20} />
            </button>
            
            <h2 className="font-amatic text-[30px] font-bold text-center mb-10 text-black dark:text-white uppercase tracking-tight leading-none">
              {t('Compartilhar')}
            </h2>
            
            <div className="space-y-4 flex flex-col justify-center">
              <button onClick={shareAsText} className="w-full flex items-center gap-4 p-4 bg-[#f7f7f7] dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-[0.98] text-left rounded-md border-none group">
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <FileText size={28} className="text-brand-secondary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-amatic text-[24px] leading-none uppercase text-black dark:text-white tracking-tight font-bold">{t('WhatsApp / Texto')}</p>
                  <p className="text-[13px] text-gray-400 font-sans mt-1 opacity-80">{t('Copiar conteúdo formatado')}</p>
                </div>
              </button>
              
              <button onClick={shareAsPdf} className="w-full flex items-center gap-4 p-4 bg-[#f7f7f7] dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-[0.98] text-left rounded-md border-none group">
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <FileDown size={28} className="text-brand-secondary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-amatic text-[24px] leading-none uppercase text-black dark:text-white tracking-tight font-bold">{t('Documento PDF')}</p>
                  <p className="text-[13px] text-gray-400 font-sans mt-1 opacity-80">{t('Exportar para impressão')}</p>
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
                <Edit3 size={22} style={{ color: accentColor }} strokeWidth={1.5} />
                <span className="font-rubik text-[16px] text-black dark:text-white">{t('Editar Receita')}</span>
              </button>
              <button onClick={() => { setShowMenu(false); setShowShareMenu(true); }} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left">
                <Share2 size={22} style={{ color: accentColor }} strokeWidth={1.5} />
                <span className="font-rubik text-[16px] text-black dark:text-white">{t('Compartilhar')}</span>
              </button>
              <button onClick={() => { setShowMenu(false); window.print(); }} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left">
                <Printer size={22} style={{ color: accentColor }} strokeWidth={1.5} />
                <span className="font-rubik text-[16px] text-black dark:text-white">{t('Impressão')}</span>
              </button>
              {recipe.sourceUrl && (
                <button onClick={() => { setShowMenu(false); window.open(recipe.sourceUrl, '_blank'); }} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left">
                  <ExternalLink size={22} style={{ color: accentColor }} strokeWidth={1.5} />
                  <span className="font-rubik text-[16px] text-black dark:text-white">{t('Ver receita original')}</span>
                </button>
              )}
              <button onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors text-left">
                <Trash2 size={22} className="text-red-500" strokeWidth={1.5} />
                <span className="font-rubik text-[16px] text-red-500">{t('Excluir Receita')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center px-3">
          <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-[360px] min-h-[280px] p-6 relative animate-in zoom-in-95 duration-300 rounded-lg overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl flex flex-col justify-center text-center">
            <div className="flex justify-center mb-3 text-brand-secondary">
              <Trash2 size={34} strokeWidth={1.5} />
            </div>
            <div className="mb-6">
              <h2 className="font-amatic text-[30px] font-bold uppercase tracking-tight text-black dark:text-white leading-none">
                {t('Excluir Receita')}
              </h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-[14px] font-sans mb-6">
              {t('Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita.')}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 h-12 bg-[#f2f2f2] dark:bg-white/5 text-black dark:text-white font-mooli text-[14px] rounded-md hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                {t('Cancelar')}
              </button>
              <button 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDelete();
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
