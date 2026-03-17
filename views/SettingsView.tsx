import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SettingsViewProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  units: string;
  onUnitsChange: (units: string) => void;
  onBack: () => void;
  onSave: () => void;
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
  onBack,
  onSave
}) => {
  const { t } = useTranslation();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    onSave();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const labelClass = "block text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400 mb-4";
  const itemClass = "w-full flex items-center justify-between p-4 rounded-md transition-all duration-300";

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] animate-in fade-in duration-500">
      <header className="pt-12 pb-6 px-6 flex items-center justify-between sticky top-0 bg-white dark:bg-[#121212] z-10">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-md transition-colors text-black dark:text-white active:scale-90 z-10">
          <ArrowLeft size={22} />
        </button>
        <h2 className="font-amatic font-bold text-[30px] uppercase tracking-tight text-black dark:text-white leading-none absolute left-1/2 -translate-x-1/2 mt-1">
          {t('Configurações')}
        </h2>
        <button onClick={handleSave} className="p-2 -mr-2 text-brand-secondary active:scale-90 transition-transform z-10">
          <Check size={26} strokeWidth={2.5} />
        </button>
      </header>

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full shadow-xl animate-in fade-in zoom-in duration-300 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-brand-secondary" />
            <span className="font-mooli text-[13px] font-normal">{t('Alterações salvas com sucesso')}</span>
          </div>
        </div>
      )}

      <div className="px-6 space-y-10 pb-20 mt-2">
        <section>
          <label className={labelClass}>{t('Língua do App')}</label>
          <div className="grid grid-cols-1 gap-2">
            {LANGUAGES.map((lang) => (
              <button key={lang.id} onClick={() => onLanguageChange(lang.id)} className={`${itemClass} ${language === lang.id ? 'bg-black text-white' : 'bg-[#f7f7f7] dark:bg-white/5 text-black dark:text-white'}`}>
                <span className="font-mooli text-[14px] font-bold">{lang.label}</span>
                {language === lang.id && <CheckCircle2 size={18} />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className={labelClass}>{t('Sistema de Medida')}</label>
          <div className="flex flex-col gap-2">
            {[
              { id: 'metric', label: t('Métrico') },
              { id: 'imperial', label: t('Imperial') }
            ].map((option) => (
              <button key={option.id} onClick={() => onUnitsChange(option.id)} className={`${itemClass} ${units === option.id ? 'bg-black text-white' : 'bg-[#f7f7f7] dark:bg-white/5 text-black dark:text-white'}`}>
                <span className="font-mooli text-[14px] font-bold">{option.label}</span>
                {units === option.id && <CheckCircle2 size={18} />}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};