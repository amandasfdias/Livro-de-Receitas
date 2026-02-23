import React, { useRef } from 'react';
import { ArrowLeft, Camera, ImagePlus } from 'lucide-react';

interface ScanViewProps {
  onBack: () => void;
  onImageCaptured: (base64: string) => void;
}

export const ScanView: React.FC<ScanViewProps> = ({ onBack, onImageCaptured }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageCaptured(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] animate-in fade-in duration-500">
      <header className="pt-12 pb-8 px-6 text-center relative sticky top-0 bg-white dark:bg-[#0a0a0a] z-10">
        <button onClick={onBack} className="absolute left-6 top-1/2 -translate-y-1/2 p-2 -ml-2 text-black dark:text-white active:scale-90 transition-transform">
          <ArrowLeft size={22} />
        </button>
        <h2 className="font-amatic font-bold text-[30px] uppercase tracking-tight text-black dark:text-white leading-none">
          Digitalizar
        </h2>
      </header>

      <main className="px-8 space-y-10 pb-32">
        <p className="text-[16px] text-gray-500 font-sans leading-relaxed text-center">
          Tire uma foto ou selecione uma imagem de uma receita para digitalizá-la automaticamente.
        </p>

        <div className="space-y-4">
          <button 
            onClick={() => { fileInputRef.current?.setAttribute('capture', 'environment'); fileInputRef.current?.click(); }}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-5 flex items-center justify-center gap-3 rounded-[12px] active:scale-95 transition-all"
          >
            <Camera size={20} />
            <span className="font-sans font-bold text-[16px]">Tirar Foto</span>
          </button>

          <button 
            onClick={() => { fileInputRef.current?.removeAttribute('capture'); fileInputRef.current?.click(); }}
            className="w-full bg-white dark:bg-[#1e1e1e] text-black dark:text-white py-5 flex items-center justify-center gap-3 rounded-[12px] border border-gray-200 dark:border-white/10 active:scale-95 transition-all"
          >
            <ImagePlus size={20} />
            <span className="font-sans font-bold text-[16px]">Escolher da Galeria</span>
          </button>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

        <div className="bg-[#f7f7f7] dark:bg-white/5 p-10 rounded-[20px] text-center space-y-4 border border-gray-100 dark:border-white/5">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-white/50 dark:bg-white/10 rounded-full flex items-center justify-center border border-gray-100 dark:border-white/5">
              <Camera size={28} className="text-gray-400" strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="font-amatic text-[28px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">Como funciona?</h3>
          <p className="text-[14px] text-gray-500 font-sans leading-relaxed">Nossa IA irá analisar a imagem e extrair automaticamente os ingredientes e o modo de preparo.</p>
        </div>
      </main>
    </div>
  );
};