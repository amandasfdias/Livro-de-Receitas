import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SettingsViewProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  units: string;
  onUnitsChange: (units: string) => void;
  showMainCategories: boolean;
  onShowMainCategoriesChange: (val: boolean) => void;
  showSecondaryCategories: boolean;
  onShowSecondaryCategoriesChange: (val: boolean) => void;
  hideRecipeMetadata: boolean;
  onHideRecipeMetadataChange: (val: boolean) => void;
  hideRecipeCount: boolean;
  onHideRecipeCountChange: (val: boolean) => void;
  usePhotosForCategories: boolean;
  onUsePhotosForCategoriesChange: (val: boolean) => void;
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
  showMainCategories,
  onShowMainCategoriesChange,
  showSecondaryCategories,
  onShowSecondaryCategoriesChange,
  hideRecipeMetadata,
  onHideRecipeMetadataChange,
  hideRecipeCount,
  onHideRecipeCountChange,
  usePhotosForCategories,
  onUsePhotosForCategoriesChange,
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
      <header className="pt-12 pb-6 px-5 flex items-center justify-between sticky top-0 bg-white dark:bg-[#121212] z-10">
        <button onClick={onBack} className="w-11 h-11 flex items-center justify-center -ml-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-colors text-brand-secondary active:scale-90 z-10">
          <ArrowLeft size={24} strokeWidth={2} />
        </button>
        <h2 className="font-amatic font-bold text-[30px] uppercase tracking-tight text-black dark:text-white leading-none absolute left-1/2 -translate-x-1/2">
          {t('Configurações')}
        </h2>
        <button onClick={handleSave} className="w-11 h-11 flex items-center justify-center -mr-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full text-brand-secondary active:scale-90 transition-all z-10">
          <Check size={24} strokeWidth={2} />
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

      <div className="px-5 space-y-10 mt-2">
        <section>
          <label className={labelClass}>{t('Língua do App')}</label>
          <div className="grid grid-cols-1 gap-2">
            {LANGUAGES.map((lang) => (
              <button key={lang.id} onClick={() => onLanguageChange(lang.id)} className={`${itemClass} ${language === lang.id ? 'bg-black text-white' : 'bg-[#f2f2f2] dark:bg-white/5 text-black dark:text-white'}`}>
                <span className={`font-mooli text-[14px] ${language === lang.id ? 'font-bold' : 'font-normal'}`}>{lang.label}</span>
                {language === lang.id && <CheckCircle2 size={18} />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className={labelClass}>{t('Sistema de Medida')}</label>
          <div className="flex flex-col gap-2">
            {[
              { id: 'metric', label: t('Métrico'), sub: 'gramas, kg, ml, °C' },
              { id: 'imperial', label: t('Imperial'), sub: 'ounces, lbs, fl oz, °F' }
            ].map((option) => (
              <button key={option.id} onClick={() => onUnitsChange(option.id)} className={`${itemClass} ${units === option.id ? 'bg-black text-white' : 'bg-[#f2f2f2] dark:bg-white/5 text-black dark:text-white'}`}>
                <div className="flex flex-col items-start">
                  <span className={`font-mooli text-[14px] ${units === option.id ? 'font-bold' : 'font-normal'}`}>{option.label}</span>
                  {option.sub && <span className={`font-rubik text-[12px] uppercase mt-0.5 ${units === option.id ? 'text-gray-400' : 'text-gray-400'}`}>{option.sub}</span>}
                </div>
                {units === option.id && <CheckCircle2 size={18} />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className={labelClass}>{t('Configurar Página Principal')}</label>
          <div className="flex flex-col gap-2">
            <div className={`${itemClass} bg-[#f2f2f2] dark:bg-white/5 text-black dark:text-white`}>
              <span className="font-mooli text-[14px]">{t('Mostrar categorias principais')}</span>
              <button
                onClick={() => onShowMainCategoriesChange(!showMainCategories)}
                className={`shrink-0 w-12 h-6 rounded-full transition-colors duration-300 relative ${showMainCategories ? 'bg-brand-secondary' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${showMainCategories ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className={`${itemClass} bg-[#f2f2f2] dark:bg-white/5 text-black dark:text-white`}>
              <span className="font-mooli text-[14px]">{t('Mostrar categorias secundárias')}</span>
              <button
                onClick={() => onShowSecondaryCategoriesChange(!showSecondaryCategories)}
                className={`shrink-0 w-12 h-6 rounded-full transition-colors duration-300 relative ${showSecondaryCategories ? 'bg-brand-secondary' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${showSecondaryCategories ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className={`${itemClass} bg-[#f2f2f2] dark:bg-white/5 text-black dark:text-white`}>
              <span className="font-mooli text-[14px]">{t('Ocultar categorias / etiquetas da lista de receitas')}</span>
              <button
                onClick={() => onHideRecipeMetadataChange(!hideRecipeMetadata)}
                className={`shrink-0 w-12 h-6 rounded-full transition-colors duration-300 relative ${hideRecipeMetadata ? 'bg-brand-secondary' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${hideRecipeMetadata ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className={`${itemClass} bg-[#f2f2f2] dark:bg-white/5 text-black dark:text-white`}>
              <span className="font-mooli text-[14px]">{t('Trocar ícones por fotos no grid Minhas Coleções')}</span>
              <button
                onClick={() => onUsePhotosForCategoriesChange(!usePhotosForCategories)}
                className={`shrink-0 w-12 h-6 rounded-full transition-colors duration-300 relative ${usePhotosForCategories ? 'bg-brand-secondary' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${usePhotosForCategories ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className={`${itemClass} bg-[#f2f2f2] dark:bg-white/5 text-black dark:text-white`}>
              <span className="font-mooli text-[14px]">{t('Ocultar contagem de receitas no grid Minhas Coleções')}</span>
              <button
                onClick={() => onHideRecipeCountChange(!hideRecipeCount)}
                className={`shrink-0 w-12 h-6 rounded-full transition-colors duration-300 relative ${hideRecipeCount ? 'bg-brand-secondary' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${hideRecipeCount ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </section>

        <div className="flex justify-center pt-2 pb-2">
          <span className="text-black dark:text-white text-lg">♥︎</span>
        </div>
      </div>
    </div>
  );
};