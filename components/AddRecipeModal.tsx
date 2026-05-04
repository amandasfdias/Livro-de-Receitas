import React from 'react';
import { Link, Edit3, Camera, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AddRecipeModalProps {
  onClose: () => void;
  onSelectMethod: (method: 'URL' | 'MANUAL' | 'SCAN') => void;
}

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ onClose, onSelectMethod }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center px-4">
      {/* Container Principal do Modal - Flutuante e arredondado */}
      <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-[360px] h-[400px] p-6 relative animate-in zoom-in-95 duration-300 rounded-lg border border-gray-100 dark:border-white/10 shadow-2xl flex flex-col justify-center">
        
        {/* Botão Fechar */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-brand-secondary hover:text-black dark:hover:text-white transition-colors bg-transparent"
        >
          <X size={24} strokeWidth={2} />
        </button>

        {/* Título Principal */}
        <h2 className="font-amatic text-[30px] font-bold text-center mb-10 text-black dark:text-white uppercase tracking-tight leading-none">
          {t('Nova Receita')}
        </h2>

        {/* Lista de Opções */}
        <div className="space-y-4 flex flex-col justify-center">
          {/* Opção: COLAR URL */}
          <button 
            onClick={() => onSelectMethod('URL')}
            className="w-full flex items-center gap-4 p-4 bg-[#f2f2f2] dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-[0.98] text-left rounded-md border-none group"
          >
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <Link size={28} className="text-brand-secondary" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col justify-center pt-1">
              <p className="font-amatic text-[24px] leading-none uppercase text-black dark:text-white tracking-tight font-bold">{t('COLAR URL')}</p>
              <p className="text-[13px] text-gray-400 font-sans mt-0.5 opacity-80">{t('Importe uma receita de um site')}</p>
            </div>
          </button>

          {/* Opção: ADICIONAR MANUALMENTE */}
          <button 
            onClick={() => onSelectMethod('MANUAL')}
            className="w-full flex items-center gap-4 p-4 bg-[#f2f2f2] dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-[0.98] text-left rounded-md border-none group"
          >
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <Edit3 size={28} className="text-brand-secondary" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col justify-center pt-1">
              <p className="font-amatic text-[24px] leading-none uppercase text-black dark:text-white tracking-tight font-bold">{t('ADICIONAR MANUALMENTE')}</p>
              <p className="text-[13px] text-gray-400 font-sans mt-0.5 opacity-80">{t('Escreva sua própria receita')}</p>
            </div>
          </button>

          {/* Opção: DIGITALIZAR FOTO */}
          <button 
            onClick={() => onSelectMethod('SCAN')}
            className="w-full flex items-center gap-4 p-4 bg-[#f2f2f2] dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-[0.98] text-left rounded-md border-none group"
          >
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <Camera size={28} className="text-brand-secondary" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col justify-center pt-1">
              <p className="font-amatic text-[24px] leading-none uppercase text-black dark:text-white tracking-tight font-bold">{t('DIGITALIZAR FOTO')}</p>
              <p className="text-[13px] text-gray-400 font-sans mt-0.5 opacity-80">{t('Escaneie com a câmera')}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};