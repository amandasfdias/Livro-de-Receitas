import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Sun, Moon, Monitor, CheckCircle2, Check } from 'lucide-react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface AppearanceViewProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  onBack: () => void;
  onSave: () => void;
}

const PRESET_COLORS = [
  { name: 'Terracota', value: '#bd715d' },
  { name: 'Floresta', value: '#5D8A66' },
  { name: 'Oceano', value: '#366899' },
  { name: 'Malva', value: '#CC88B6' },
  { name: 'Cimento', value: '#9E9E9E' },
  { name: 'Tijolo', value: '#C04657' },
  { name: 'Amora', value: '#C54B8C' },
  { name: 'Aveia', value: '#B69680' },
  { name: 'Lavanda', value: '#9D9DCC' },
  { name: 'Turquesa', value: '#5F9EA0' },
];

export const AppearanceView: React.FC<AppearanceViewProps> = ({
  currentTheme,
  onThemeChange,
  currentColor,
  onColorChange,
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

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] animate-in fade-in duration-500">
      <header className="pt-12 pb-6 px-6 flex items-center justify-between sticky top-0 bg-white dark:bg-[#121212] z-10">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-md transition-colors text-black dark:text-white active:scale-90 z-10">
          <ArrowLeft size={22} />
        </button>
        <h2 className="font-amatic font-bold text-[30px] uppercase tracking-tight text-black dark:text-white leading-none absolute left-1/2 -translate-x-1/2 mt-1">
          {t('Aparência')}
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
          <label className="block text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400 mb-4">{t('Modo de Visualização')}</label>
          <div className="space-y-3">
            {[
              { id: 'light', label: t('Claro'), icon: <Sun size={20} /> },
              { id: 'dark', label: t('Escuro'), icon: <Moon size={20} /> },
              { id: 'system', label: t('Sistema'), icon: <Monitor size={20} /> }
            ].map((option) => (
              <button key={option.id} onClick={() => onThemeChange(option.id as ThemeMode)} className={`w-full flex items-center justify-between p-4 rounded-md transition-all ${currentTheme === option.id ? 'bg-black text-white' : 'bg-[#f7f7f7] dark:bg-white/5 text-black dark:text-white'}`}>
                <div className="flex items-center gap-4">{option.icon}<span className="font-mooli text-[14px] font-bold">{option.label}</span></div>
                {currentTheme === option.id && <CheckCircle2 size={18} />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400 mb-4">{t('Cores do App')}</label>
          <div className="grid grid-cols-5 gap-4">
            {PRESET_COLORS.map((color) => (
              <button key={color.value} onClick={() => onColorChange(color.value)} className="flex flex-col items-center gap-2 group">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentColor === color.value ? 'ring-2 ring-offset-2 ring-black dark:ring-white scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: color.value }}>
                  {currentColor === color.value && <CheckCircle2 size={20} className="text-white mix-blend-difference" />}
                </div>
                <span className="text-[10px] font-rubik font-medium uppercase tracking-[0.1em] text-gray-400 text-center">{color.name}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};