import React, { useState } from 'react';
import { X, Link, AlertCircle } from 'lucide-react';

interface AddUrlViewProps {
  onConfirm: (url: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const AddUrlView: React.FC<AddUrlViewProps> = ({ onConfirm, onBack, isLoading = false }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateAndSubmit = () => {
    const trimmedText = url.trim();
    
    // 1. Verificar se está vazio
    if (!trimmedText) {
      setError("Por favor, cole o link da receita.");
      return;
    }

    // Extrair URL do texto (caso o usuário cole "Olha essa receita: https://...")
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = trimmedText.match(urlRegex);
    let testUrl = matches ? matches[0] : trimmedText;

    // Se não encontrou http/https, tenta adicionar e ver se é um domínio válido
    if (!matches && !/^https?:\/\//i.test(testUrl)) {
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
      onConfirm(testUrl); // Passa a URL extraída e limpa
    } catch {
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center px-4">
      {/* Container Principal */}
      <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-[360px] h-auto p-6 relative animate-in zoom-in-95 duration-300 rounded-lg overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl flex flex-col justify-center">
        
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
          className="absolute top-4 right-4 p-2 text-brand-secondary hover:text-black dark:hover:text-white transition-colors bg-transparent"
        >
          <X size={24} strokeWidth={2} />
        </button>

        {/* Ícone de Link Superior */}
        <div className="flex justify-center mb-3">
          <Link size={34} className="text-brand-secondary" strokeWidth={1.5} />
        </div>

        {/* Título e Descrição */}
        <div className="text-center">
          <h2 className="font-amatic text-[30px] font-bold uppercase tracking-tight text-black dark:text-white leading-none mb-10">
            Importar Receita
          </h2>
          <p className="text-[13px] text-gray-500 font-sans leading-relaxed px-2 mb-10">
            Copie do seu navegador o link da receita e cole no espaço abaixo, que importaremos automaticamente os ingredientes e as instruções.
          </p>
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
              className={`w-full h-12 bg-white dark:bg-black/20 border-2 ${error ? 'border-red-500' : 'border-black dark:border-white/20'} px-3.5 text-[14px] font-sans outline-none rounded-md placeholder:text-gray-300 transition-all text-black dark:text-white`}
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
            className="w-full h-12 bg-black text-white rounded-md active:scale-95 transition-all disabled:bg-black disabled:opacity-80 disabled:pointer-events-none border-none shadow-md flex items-center justify-center"
          >
            <span className="font-mooli text-[14px]">
              Importar Receita
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};