import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, ImagePlus, X } from 'lucide-react';

interface ScanViewProps {
  onBack: () => void;
  onImageCaptured: (base64: string) => void;
}

export const ScanView: React.FC<ScanViewProps> = ({ onBack, onImageCaptured }) => {
  const { t } = useTranslation();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageCaptured(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset inputs so the same file can be selected again
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center px-4">
      {/* Container Principal */}
      <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-[360px] h-auto p-6 relative animate-in zoom-in-95 duration-300 rounded-lg overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl flex flex-col justify-center">
        
        {/* Botão Fechar */}
        <button 
          onClick={onBack}
          className="absolute top-4 right-4 p-2 text-brand-secondary hover:text-black dark:hover:text-white transition-colors bg-transparent"
        >
          <X size={24} strokeWidth={2} />
        </button>

        {/* Ícone Superior */}
        <div className="flex justify-center mb-3">
          <Camera size={34} className="text-brand-secondary" strokeWidth={1.5} />
        </div>

        {/* Título e Descrição */}
        <div className="text-center">
          <h2 className="font-amatic text-[30px] font-bold uppercase tracking-tight text-black dark:text-white leading-none mb-10">
            {t('Digitalizar Foto')}
          </h2>
          <p className="text-[14px] text-gray-500 font-sans leading-relaxed px-2 mb-10">
            {t('Tire uma foto da sua receita (onde deve aparecer a lista de ingredientes e as instruções) ou selecione uma imagem da galeria, para que possamos digitalizá-la automaticamente.')}
          </p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => cameraInputRef.current?.click()}
            className="w-full h-12 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center gap-3 rounded-md active:scale-95 transition-all shadow-md"
          >
            <Camera size={20} />
            <span className="font-mooli text-[14px]">{t('Tirar Foto')}</span>
          </button>

          <button 
            onClick={() => galleryInputRef.current?.click()}
            className="w-full h-12 bg-white dark:bg-[#1e1e1e] text-black dark:text-white flex items-center justify-center gap-3 rounded-md border-2 border-black dark:border-white/20 active:scale-95 transition-all shadow-sm"
          >
            <ImagePlus size={20} />
            <span className="font-mooli text-[14px]">{t('Escolher da Galeria')}</span>
          </button>
        </div>

        <input type="file" ref={cameraInputRef} onChange={handleFileChange} accept="image/*" capture="environment" className="hidden" />
        <input type="file" ref={galleryInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </div>
    </div>
  );
};