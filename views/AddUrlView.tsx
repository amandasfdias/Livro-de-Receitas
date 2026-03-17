import React, { useState } from 'react';
import { X, Link, Instagram, Facebook, Globe, Loader2, AlertCircle, Youtube } from 'lucide-react';

interface AddUrlViewProps {
  onConfirm: (url: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const AddUrlView: React.FC<AddUrlViewProps> = ({ onConfirm, onBack, isLoading = false }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateAndSubmit = () => {
    const trimmedUrl = url.trim();
    
    // 1. Verificar se está vazio
    if (!trimmedUrl) {
      setError("Por favor, cole o link da receita.");
      return;
    }

    // 2. Verificar se contém espaços (URLs válidas não têm espaços)
    if (trimmedUrl.includes(' ')) {
      setError("O link não deve conter espaços.");
      return;
    }

    let testUrl = trimmedUrl;
    // Adiciona protocolo se faltar para o construtor URL funcionar
    if (!/^https?:\/\//i.test(testUrl)) {
      testUrl = 'https://' + testUrl;
    }

    try {
      const parsed = new URL(testUrl);
      const hostname = parsed.hostname;
      
      // 3. Verificar se tem um ponto (mínimo site.com)
      if (!hostname.includes('.')) {
        setError("O link deve conter um domínio (ex: site.com).");
        return;
      }
      
      // 4. Verificar se as partes do domínio são válidas
      const parts = hostname.split('.');
      if (parts.some(part => part.length === 0)) {
        setError("O domínio informado parece estar incompleto.");
        return;
      }

      setError(null);
      onConfirm(trimmedUrl);
    } catch (e) {
      // 5. Erro genérico de parsing
      setError("O formato do link é inválido. Verifique o endereço.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      validateAndSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center px-3">
      {/* Container Principal */}
      <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-[360px] min-h-[480px] p-6 relative animate-in zoom-in-95 duration-300 rounded-lg overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl flex flex-col justify-center">
        
        {/* SVG Filter para efeito Hand Drawn */}
        <svg width="0" height="0" className="absolute">
          <filter id="sketchy" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        {/* Botão Fechar */}
        <button 
          onClick={onBack}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors bg-gray-50 dark:bg-white/5 rounded-full"
        >
          <X size={20} />
        </button>

        {/* Ícone de Link Superior */}
        <div className="flex justify-center mb-3 -mt-5">
          <Link size={32} className="text-brand-secondary" strokeWidth={1.5} />
        </div>

        {/* Título e Descrição */}
        <div className="text-center">
          <h2 className="font-amatic text-[30px] font-bold uppercase tracking-tight text-black leading-none mb-6">
            Importar Receita
          </h2>
          <p className="text-[13px] text-gray-500 font-sans leading-relaxed px-2 mb-3">
            Cole o link de uma receita e importaremos automaticamente os ingredientes e instruções.
          </p>
          <p className="text-[11px] text-gray-400 font-rubik leading-snug px-4">
            <strong>Dica:</strong> Funciona melhor quando a receita está incluída na descrição ou na legenda do vídeo.
          </p>
        </div>

        {/* Ícones de Plataformas */}
        <div className="grid grid-cols-5 px-2 my-7">
          <PlatformIcon icon={<Instagram size={26} strokeWidth={1.2} className="text-[#E1306C] opacity-90" />} label="Instagram" />
          <PlatformIcon icon={<Facebook size={26} strokeWidth={1.2} className="text-[#1877F2] opacity-90" />} label="Facebook" />
          <PlatformIcon icon={<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" className="text-black dark:text-white opacity-80"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.76-.54-1.43-1.25-1.92-2.07v7.34c.02 1.43-.39 2.85-1.19 4.03-.77 1.13-1.94 2.01-3.26 2.45-1.32.44-2.76.41-4.06-.09-1.3-.5-2.39-1.44-3.04-2.65-.65-1.21-.86-2.61-.61-3.96.25-1.35.96-2.58 1.99-3.48 1.03-.9 2.34-1.42 3.71-1.48v4.07c-.72.03-1.43.3-2.01.75-.58.45-.99 1.09-1.15 1.8-.16.71-.06 1.45.27 2.08.33.63.88 1.13 1.54 1.39.66.26 1.39.27 2.06.04.67-.23 1.26-.7 1.63-1.3.37-.6.54-1.3.49-1.99V0z"></path></svg>} label="TikTok" />
          <PlatformIcon icon={<Youtube size={26} strokeWidth={1.2} className="text-[#FF0000] opacity-90" />} label="YouTube" />
          <PlatformIcon icon={<Globe size={26} strokeWidth={1.2} className="text-gray-400" />} label="Sites" />
        </div>

        {/* Formulário de Input */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input 
              autoFocus
              type="text" 
              placeholder="https://exemplo.com/receita"
              value={url}
              onChange={(e) => { setUrl(e.target.value); if (error) setError(null); }}
              disabled={isLoading}
              className={`w-full bg-white dark:bg-black/20 border-2 ${error ? 'border-red-500' : 'border-black dark:border-white/20'} p-3.5 text-[14px] font-sans outline-none rounded-lg placeholder:text-gray-300 transition-all text-black dark:text-white`}
            />
            {error && (
              <div className="mt-2 flex items-center gap-1.5 text-red-500">
                <AlertCircle size={14} />
                <span className="text-[11px] font-bold uppercase tracking-wider">{error}</span>
              </div>
            )}
          </div>

          {/* Botão Importar Receita - Agora solidamente preto bg-black */}
          <button 
            type="submit"
            disabled={!url.trim() || isLoading}
            className="w-full bg-black text-white py-3 rounded-lg active:scale-95 transition-all disabled:bg-black disabled:pointer-events-none border-none shadow-md"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mx-auto" size={20} />
            ) : (
              <span className="font-mooli text-[13px]">
                Importar Receita
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const PlatformIcon: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-1.5">
    <div className="flex items-center justify-center" style={{ filter: 'url(#sketchy)' }}>
      {icon}
    </div>
    <span className="text-[10px] font-sans text-gray-400 font-medium">{label}</span>
  </div>
);