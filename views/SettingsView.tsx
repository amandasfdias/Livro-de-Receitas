import React from 'react';
import { ArrowLeft, Globe, Scale, CheckCircle2, Check } from 'lucide-react';

interface SettingsViewProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  units: string;
  onUnitsChange: (units: string) => void;
  onBack: () => void;
}

const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'pt-BR', label: 'Português (Brasil)' },
  { id: 'pt-PT', label: 'Português (Portugal)' },
  { id: 'es', label: 'Español' },
  { id: 'fr', label: 'Français' },
  { id: 'it', label: 'Italiano' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  language,
  onLanguageChange,
  units,
  onUnitsChange,
  onBack
}) => {
  const labelClass = "block text-[10px] font-inter font-bold uppercase tracking-[0.2em] text-gray-400 mb-4";
  const itemClass = "w-full flex items-center justify-between p-4 rounded-md transition-all duration-300";

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] animate-in fade-in duration-500">
      <header className="pt-12 pb-8 px-6 text-center relative sticky top-0 bg-white dark:bg-[#121212] z-10">
        <button onClick={onBack} className="absolute left-6 top-1/2 -translate-y-1/2 p-2 -ml-2 text-black dark:text-white active:scale-90 transition-transform">
          <ArrowLeft size={22} />
        </button>
        <h2 className="font-amatic font-bold text-[30px] uppercase tracking-tight text-black dark:text-white leading-none">
          Configurações
        </h2>
        <button onClick={onBack} className="absolute right-6 top-1/2 -translate-y-1/2 p-2 -mr-2 text-brand-secondary active:scale-90 transition-transform">
          <Check size={24} strokeWidth={2.5} />
        </button>
      </header>

      <div className="px-6 space-y-12 pb-20">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Globe size={16} className="text-brand-secondary" />
            <label className={labelClass}>Língua do App</label>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {LANGUAGES.map((lang) => (
              <button key={lang.id} onClick={() => onLanguageChange(lang.id)} className={`${itemClass} ${language === lang.id ? 'bg-black text-white' : 'bg-[#f7f7f7] dark:bg-white/5 text-black dark:text-white'}`}>
                <span className="font-inter text-[14px] font-medium">{lang.label}</span>
                {language === lang.id && <CheckCircle2 size={18} />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Scale size={16} className="text-brand-secondary" />
            <label className={labelClass}>Sistema de Medida</label>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { id: 'metric', label: 'Métrico' },
              { id: 'imperial', label: 'Imperial' }
            ].map((option) => (
              <button key={option.id} onClick={() => onUnitsChange(option.id)} className={`${itemClass} ${units === option.id ? 'bg-black text-white' : 'bg-[#f7f7f7] dark:bg-white/5 text-black dark:text-white'}`}>
                <span className="font-inter text-[14px] font-medium">{option.label}</span>
                {units === option.id && <CheckCircle2 size={18} />}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};