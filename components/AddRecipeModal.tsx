import React from 'react';
import { Link, Edit3, Camera, X } from 'lucide-react';

interface AddRecipeModalProps {
  onClose: () => void;
  onSelectMethod: (method: 'URL' | 'MANUAL' | 'SCAN') => void;
}

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ onClose, onSelectMethod }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center px-3">
      {/* Container Principal do Modal - Bordas mais próximas do limite da tela e título compacto */}
      <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-[420px] p-6 pt-8 pb-8 relative animate-in zoom-in-95 duration-300 rounded-none border border-gray-100 dark:border-white/10 shadow-2xl">
        
        {/* Botão Fechar */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Título Principal - Espaçamento reduzido */}
        <h2 className="font-amatic text-[30px] font-bold text-center mb-6 text-black dark:text-white uppercase tracking-tight leading-none">
          Nova Receita
        </h2>

        {/* Lista de Opções - Mantendo arredondamento apenas nos botões internos */}
        <div className="space-y-3">
          {/* Opção: COLAR URL */}
          <button 
            onClick={() => onSelectMethod('URL')}
            className="w-full flex items-center gap-4 p-4 bg-[#f7f7f7] dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-[0.98] text-left rounded-[14px] border-none group"
          >
            <div className="w-12 h-12 bg-white dark:bg-[#121212] flex items-center justify-center shrink-0 rounded-full border border-gray-100 dark:border-white/5">
              <Link size={20} className="text-black dark:text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-amatic text-[22px] leading-none uppercase text-black dark:text-white tracking-tight font-bold">COLAR URL</p>
              <p className="text-[13px] text-gray-400 font-sans mt-0.5 opacity-80">Importe uma receita de um site</p>
            </div>
          </button>

          {/* Opção: ADICIONAR MANUALMENTE */}
          <button 
            onClick={() => onSelectMethod('MANUAL')}
            className="w-full flex items-center gap-4 p-4 bg-[#f7f7f7] dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-[0.98] text-left rounded-[14px] border-none group"
          >
            <div className="w-12 h-12 bg-white dark:bg-[#121212] flex items-center justify-center shrink-0 rounded-full border border-gray-100 dark:border-white/5">
              <Edit3 size={20} className="text-black dark:text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-amatic text-[22px] leading-none uppercase text-black dark:text-white tracking-tight font-bold">ADICIONAR MANUALMENTE</p>
              <p className="text-[13px] text-gray-400 font-sans mt-0.5 opacity-80">Escreva sua própria receita</p>
            </div>
          </button>

          {/* Opção: DIGITALIZAR FOTO */}
          <button 
            onClick={() => onSelectMethod('SCAN')}
            className="w-full flex items-center gap-4 p-4 bg-[#f7f7f7] dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-[0.98] text-left rounded-[14px] border-none group"
          >
            <div className="w-12 h-12 bg-white dark:bg-[#121212] flex items-center justify-center shrink-0 rounded-full border border-gray-100 dark:border-white/5">
              <Camera size={20} className="text-black dark:text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-amatic text-[22px] leading-none uppercase text-black dark:text-white tracking-tight font-bold">DIGITALIZAR FOTO</p>
              <p className="text-[13px] text-gray-400 font-sans mt-0.5 opacity-80">Escaneie uma receita com a câmera</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};