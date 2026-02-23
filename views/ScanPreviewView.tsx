import React from 'react';
import { Check, X, Camera, RefreshCw, AlertCircle } from 'lucide-react';

interface ScanPreviewViewProps {
  imageUrl: string;
  onConfirm: () => void;
  onDiscard: () => void;
  onRetake: () => void;
}

export const ScanPreviewView: React.FC<ScanPreviewViewProps> = ({ imageUrl, onConfirm, onDiscard, onRetake }) => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-[#121212] z-[60] flex flex-col animate-in fade-in duration-300">
      <header className="pt-12 pb-8 px-6 text-center relative sticky top-0 bg-white dark:bg-[#121212] z-10">
        <button 
          onClick={onDiscard} 
          className="absolute left-6 top-1/2 -translate-y-1/2 p-2 -ml-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="font-amatic font-bold text-[30px] uppercase tracking-tight text-black dark:text-white leading-none">
          Revisar Foto
        </h2>
        <button 
          onClick={onRetake}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-2 -mr-2 text-brand-secondary active:scale-90 transition-transform"
        >
          <RefreshCw size={20} />
        </button>
      </header>

      <div className="flex-1 p-6 flex flex-col items-center bg-[#F1EDE4] dark:bg-white/5 overflow-y-auto">
        {/* Camera-like Viewfinder Container */}
        <div className="relative w-full max-w-sm aspect-[3/4] bg-white dark:bg-[#1e1e1e] rounded-md overflow-hidden border-4 border-white dark:border-white/10 group">
          <img src={imageUrl} alt="Scan preview" className="w-full h-full object-cover" />
          
          {/* Viewfinder corners */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/80 rounded-tl-sm" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/80 rounded-tr-sm" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/80 rounded-bl-sm" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/80 rounded-br-sm" />

          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          
          {/* Decorative scanning line effect - More subtle */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-brand-secondary shadow-[0_0_15px_var(--brand-secondary)] animate-[scan_4s_ease-in-out_infinite] opacity-60" />
        </div>
        
        {/* Quality Checklist */}
        <div className="mt-8 w-full max-w-sm space-y-4">
          <div className="bg-white/50 dark:bg-white/5 p-5 rounded-md border border-white/50 dark:border-white/5">
            <h4 className="font-inter text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 flex items-center gap-2">
              <AlertCircle size={12} /> Checklist de Qualidade
            </h4>
            <ul className="space-y-2">
              {[
                "O texto está nítido e legível?",
                "Toda a receita aparece na foto?",
                "A iluminação está uniforme?",
              ].map((tip, i) => (
                <li key={i} className="flex items-center gap-3 text-[11px] text-gray-500 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary/40" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          
          <button 
            onClick={onRetake}
            className="w-full py-4 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-secondary hover:bg-brand-secondary/5 rounded-md transition-colors"
          >
            <Camera size={14} /> Tentar outra foto
          </button>
        </div>
      </div>

      <footer className="p-8 pb-12 flex gap-4 bg-white dark:bg-[#121212] border-t border-gray-50 dark:border-white/5">
        <button 
          onClick={onDiscard}
          className="flex-1 py-4 flex items-center justify-center gap-2 rounded-md border border-gray-100 dark:border-white/10 active:scale-95 transition-all"
        >
          <span className="font-amatic text-[20px] tracking-wider uppercase text-gray-400">Cancelar</span>
        </button>
        
        <button 
          onClick={onConfirm}
          className="flex-1 bg-black dark:bg-brand-secondary text-white py-4 flex items-center justify-center gap-2 rounded-md active:scale-95 transition-all border-none"
        >
          <Check size={18} />
          <span className="font-amatic text-[20px] tracking-wider uppercase">Processar IA</span>
        </button>
      </footer>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 5%; }
          50% { top: 95%; }
        }
      `}</style>
    </div>
  );
};