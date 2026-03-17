import React from 'react';
import { Link, Edit3, Camera, X } from 'lucide-react';

interface AddRecipeModalProps {
  onClose: () => void;
  onSelectMethod: (method: 'URL' | 'MANUAL' | 'SCAN') => void;
}

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ onClose, onSelectMethod }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center px-4">
      {/* Container Principal do Modal - Flutuante, arredondado e com proporção 4:5 */}
      <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-[360px] aspect-[4/5] p-6 relative animate-in zoom-in-95 duration-300 rounded-lg border border-gray-100 dark:border-white/10 shadow-2xl flex flex-col justify-center">
        
        {/* Botão Fechar */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors bg-gray-50 dark:bg-white/5 rounded-full"
        >
          <X size={20} />
        </button>

        {/* Título Principal */}
        <h2 className="font-amatic text-[30px] font-bold text-center mb-10 text-black uppercase tracking-tight leading-none">
          Nova Receita
        </h2>

        {/* Lista de Opções */}
        <div className="space-y-4 flex flex-col justify-center">
          {/* Opção: COLAR URL */}
          <button 
            onClick={() => onSelectMethod('URL')}
            className="w-full flex items-center gap-4 p-4 bg-[#f7f7f7] dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-[0.98] text-left rounded-md border-none group"
          >
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <Link size={28} className="text-brand-secondary" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-amatic text-[24px] leading-none uppercase text-black dark:text-white tracking-tight font-bold">COLAR URL</p>
              <p className="text-[13px] text-gray-400 font-sans mt-1 opacity-80">Importe uma receita de um site</p>
            </div>
          </button>

          {/* Opção: ADICIONAR MANUALMENTE */}
          <button 
            onClick={() => onSelectMethod('MANUAL')}
            className="w-full flex items-center gap-4 p-4 bg-[#f7f7f7] dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-[0.98] text-left rounded-md border-none group"
          >
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <Edit3 size={28} className="text-brand-secondary" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-amatic text-[24px] leading-none uppercase text-black dark:text-white tracking-tight font-bold">ADICIONAR MANUALMENTE</p>
              <p className="text-[13px] text-gray-400 font-sans mt-1 opacity-80">Escreva sua própria receita</p>
            </div>
          </button>

          {/* Opção: DIGITALIZAR FOTO */}
          <button 
            onClick={() => onSelectMethod('SCAN')}
            className="w-full flex items-center gap-4 p-4 bg-[#f7f7f7] dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-[0.98] text-left rounded-md border-none group"
          >
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <Camera size={28} className="text-brand-secondary" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-amatic text-[24px] leading-none uppercase text-black dark:text-white tracking-tight font-bold">DIGITALIZAR FOTO</p>
              <p className="text-[13px] text-gray-400 font-sans mt-1 opacity-80">Escaneie com a câmera</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};