import React, { useState, useEffect, useRef } from 'react';
import { X, Hourglass } from 'lucide-react';

interface ScanPreviewViewProps {
  imageUrl: string;
  onScanExecute: () => Promise<void>;
  onScanReady: boolean;
  onTransitionComplete: () => void;
  onDiscard: () => void;
}

const MESSAGES = [
  "Identificando...",
  "Analisando a receita...",
  "Organizando a lista de ingredientes...",
  "Verificando as instruções em detalhes...",
  "Processando..."
];

export const ScanPreviewView: React.FC<ScanPreviewViewProps> = ({ 
  imageUrl, 
  onScanExecute, 
  onScanReady, 
  onTransitionComplete,
  onDiscard 
}) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const hasTriggeredScan = useRef(false);

  // Start scan automatically on mount
  useEffect(() => {
    if (!hasTriggeredScan.current) {
      hasTriggeredScan.current = true;
      onScanExecute();
    }
  }, [onScanExecute]);

  // Message and progress loop
  useEffect(() => {
    // Each message takes about 2.5 seconds (total ~12.5s)
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < MESSAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 2500);

    // Progress bar fills over the same period
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 0.8;
        setIsAnimationFinished(true);
        return 100;
      });
    }, 100);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  // Check for transition compatibility
  useEffect(() => {
    if (isAnimationFinished && onScanReady) {
      // Small delay for the "Processando..." to be seen
      const timer = setTimeout(() => {
        onTransitionComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isAnimationFinished, onScanReady, onTransitionComplete]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center animate-in fade-in duration-300" onClick={onDiscard}>
      <div 
        className="bg-white dark:bg-[#1a1a1a] w-full sm:max-w-md sm:rounded-[32px] rounded-t-[32px] h-[85vh] sm:h-auto sm:max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-500 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto px-6 pb-0 pt-6 flex flex-col items-center no-scrollbar relative">
          <div className="w-full flex items-center justify-center relative mb-8">
            <h2 className="font-amatic font-bold text-[30px] uppercase tracking-tight text-black dark:text-white leading-none">
              Importando sua Receita...
            </h2>
            <button 
              onClick={onDiscard}
              className="absolute right-0 text-brand-secondary hover:opacity-70 transition-opacity"
            >
              <X size={24} strokeWidth={2} />
            </button>
          </div>

          <div className="w-full max-w-sm mb-5">
            <div className="px-4">
              <p className="font-mooli text-[14px] text-gray-500 font-normal leading-relaxed text-center">
                Certifique-se de que a imagem esteja legível e com boa iluminação e que apareça toda a lista de ingredientes e modo de preparo.
              </p>
            </div>
          </div>
          
          {/* Camera-like Viewfinder Container */}
          <div className="relative w-full max-w-sm aspect-[3/2] bg-white dark:bg-[#1e1e1e] rounded-md overflow-hidden border-2 border-black dark:border-white/20 group flex items-center justify-center shrink-0 mb-5">
            <img 
              src={imageUrl} 
              alt="Scan preview" 
              className="w-full h-full object-cover"
            />
            
            {/* Viewfinder corners */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-black/80 dark:border-white/80 rounded-tl-sm" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-black/80 dark:border-white/80 rounded-tr-sm" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-black/80 dark:border-white/80 rounded-bl-sm" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-black/80 dark:border-white/80 rounded-br-sm" />

            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            
            {/* Decorative scanning line effect - Neon effect */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-secondary shadow-[0_0_10px_var(--brand-secondary),0_0_20px_var(--brand-secondary)] animate-[scan_3s_ease-in-out_infinite] z-20 opacity-90" />
          </div>

          <div className="w-full max-w-sm mb-0">
            <div className="bg-[#f8f8f8] dark:bg-white/5 rounded-md py-2.5 px-4 flex flex-col items-center justify-center text-center">
              <span className="font-mooli font-bold text-[15px] text-black dark:text-white leading-tight mb-0.5">
                Aguarde só um instante!
              </span>
              <span className="font-rubik text-[14px] text-[#71767b] dark:text-gray-400 font-normal">
                Isso leva cerca de 1 a 2 minutos
              </span>
            </div>
            
            <div className="flex justify-center mt-8">
              <Hourglass 
                size={26} 
                className="text-black dark:text-white animate-[hourglass-flip_2.5s_ease-in-out_infinite]"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <div className="w-full max-w-sm mb-1">
            <div className="px-4">
              <p className="font-mooli text-[15px] text-brand-secondary font-bold leading-relaxed text-center min-h-[40px] flex items-center justify-center">
                {MESSAGES[messageIndex]}
              </p>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full max-w-sm px-6 pb-0 flex flex-col items-center gap-2">
            <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-secondary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Percentage Counter */}
            <span className="font-patrick text-[22px] text-black dark:text-white leading-none">
              {Math.min(100, Math.floor(progress))}%
            </span>
          </div>
        </div>

        <style>{`
          @keyframes scan {
            0%, 100% { top: 5%; }
            50% { top: 95%; }
          }
          @keyframes hourglass-flip {
            0% { transform: rotate(0deg); }
            40% { transform: rotate(0deg); }
            50% { transform: rotate(180deg); }
            90% { transform: rotate(180deg); }
            100% { transform: rotate(360deg); }
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
};
