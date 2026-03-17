import React, { useRef } from 'react';
import { Camera, ImagePlus, X } from 'lucide-react';

interface ScanViewProps {
  onBack: () => void;
  onImageCaptured: (base64: string) => void;
}

export const ScanView: React.FC<ScanViewProps> = ({ onBack, onImageCaptured }) => {
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center px-3">
      {/* Container Principal */}
      <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-[360px] min-h-[480px] p-6 relative animate-in zoom-in-95 duration-300 rounded-lg overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl flex flex-col justify-center">
        
        {/* Botão Fechar */}
        <button 
          onClick={onBack}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors bg-gray-50 dark:bg-white/5 rounded-full"
        >
          <X size={20} />
        </button>

        {/* Ícone Superior */}
        <div className="flex justify-center mb-4 mt-2">
          <Camera size={32} className="text-brand-secondary" strokeWidth={1.5} />
        </div>

        {/* Título e Descrição */}
        <div className="text-center mb-6">
          <h2 className="font-amatic text-[30px] font-bold uppercase tracking-tight text-black leading-none mb-6">
            Digitalizar Foto
          </h2>
          <p className="text-[13px] text-gray-500 font-sans leading-relaxed px-2">
            Tire uma foto da sua receita ou selecione uma imagem da galeria para digitalizá-la automaticamente
          </p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => cameraInputRef.current?.click()}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 flex items-center justify-center gap-3 rounded-lg active:scale-95 transition-all shadow-md"
          >
            <Camera size={20} />
            <span className="font-mooli text-[13px]">Tirar Foto</span>
          </button>

          <button 
            onClick={() => galleryInputRef.current?.click()}
            className="w-full bg-white dark:bg-[#1e1e1e] text-black dark:text-white py-3 flex items-center justify-center gap-3 rounded-lg border-2 border-black dark:border-white/20 active:scale-95 transition-all shadow-sm"
          >
            <ImagePlus size={20} />
            <span className="font-mooli text-[13px]">Escolher da Galeria</span>
          </button>
        </div>

        <div className="mt-8 mb-2 bg-[#f7f7f7] dark:bg-white/5 p-3 rounded-lg text-center border border-gray-100 dark:border-white/5">
          <h3 className="font-amatic text-[20px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300 mb-0.5">Como funciona?</h3>
          <p className="text-[11px] text-gray-500 font-sans leading-snug">Nossa IA irá analisar a imagem e extrair automaticamente os ingredientes e o modo de preparo.</p>
        </div>

        <input type="file" ref={cameraInputRef} onChange={handleFileChange} accept="image/*" capture="environment" className="hidden" />
        <input type="file" ref={galleryInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </div>
    </div>
  );
};