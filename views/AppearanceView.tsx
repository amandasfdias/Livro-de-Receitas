import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Sun, Moon, Monitor, CheckCircle2, Check } from 'lucide-react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface AppearanceViewProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  keepScreenOn: boolean;
  onKeepScreenOnChange: (val: boolean) => void;
  categoryFontSize: number;
  onCategoryFontSizeChange: (size: number) => void;
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
  keepScreenOn,
  onKeepScreenOnChange,
  categoryFontSize,
  onCategoryFontSizeChange,
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
      <header className="pt-12 pb-6 px-5 flex items-center justify-between sticky top-0 bg-white dark:bg-[#121212] z-10">
        <button onClick={onBack} className="w-11 h-11 flex items-center justify-center -ml-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-colors text-brand-secondary active:scale-90 z-10">
          <ArrowLeft size={24} strokeWidth={2} />
        </button>
        <h2 className="font-amatic font-bold text-[30px] uppercase tracking-tight text-black dark:text-white leading-none absolute left-1/2 -translate-x-1/2">
          {t('Aparência')}
        </h2>
        <button onClick={handleSave} className="w-11 h-11 flex items-center justify-center -mr-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full text-brand-secondary active:scale-90 transition-all z-10">
          <Check size={24} strokeWidth={2} />
        </button>
      </header>

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full shadow-xl animate-in fade-in zoom-in duration-300 flex items-center gap-2">
            <CheckCircle2 size={18} style={{ color: currentColor }} />
            <span className="font-mooli text-[13px] font-normal">{t('Alterações salvas com sucesso')}</span>
          </div>
        </div>
      )}

      <div className="px-5 space-y-10 mt-2">
        <section>
          <label className="block text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400 mb-4">{t('Modo de Visualização')}</label>
          <div className="space-y-3">
            {[
              { id: 'light', label: t('Claro'), icon: <Sun size={20} /> },
              { id: 'dark', label: t('Escuro'), icon: <Moon size={20} /> },
              { id: 'system', label: t('Sistema'), icon: <Monitor size={20} /> }
            ].map((option) => (
              <button key={option.id} onClick={() => onThemeChange(option.id as ThemeMode)} className={`w-full flex items-center justify-between p-4 rounded-md transition-all ${currentTheme === option.id ? 'bg-black text-white' : 'bg-[#f2f2f2] dark:bg-white/5 text-black dark:text-white'}`}>
                <div className="flex items-center gap-4">{option.icon}<span className={`font-mooli text-[14px] ${currentTheme === option.id ? 'font-bold' : 'font-normal'}`}>{option.label}</span></div>
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
                <span className="text-[10px] font-rubik font-medium uppercase tracking-[0.1em] text-gray-400 text-center">{t(color.name)}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400 mb-4">{t('Comportamento')}</label>
          <div className="flex flex-col gap-2">
            <div className="w-full flex items-center justify-between p-4 rounded-md transition-all duration-300 bg-[#f2f2f2] dark:bg-white/5 text-black dark:text-white">
              <span className="font-mooli text-[14px]">{t('Mantenha a tela ligada ao visualizar receitas')}</span>
              <button
                onClick={() => onKeepScreenOnChange(!keepScreenOn)}
                className={`shrink-0 w-12 h-6 rounded-full transition-colors duration-300 relative`}
                style={{ backgroundColor: keepScreenOn ? currentColor : 'rgb(209, 213, 219)' }}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${keepScreenOn ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </section>

        <section>
          <label className="block text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400 mb-4">{t('Tamanho da Fonte')} (títulos das categorias)</label>
          <div className="flex flex-col gap-2">
            <div className="w-full flex items-center justify-between p-4 rounded-md transition-all duration-300 bg-[#f2f2f2] dark:bg-white/5 text-black dark:text-white gap-6">
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mooli text-[14px]">{t('Zoom do texto')}</span>
              </div>
              
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full h-10 flex items-center">
                  {/* Track Background */}
                  <div className="absolute left-0 right-0 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                  
                  {/* Track Filled */}
                  <div 
                    className="absolute left-0 h-1.5 rounded-full"
                    style={{ 
                      width: `${((categoryFontSize - 9) / (13 - 9)) * 100}%`,
                      backgroundColor: currentColor 
                    }}
                  />
                  
                  {/* Ticks */}
                  <div className="absolute left-0 right-0 flex justify-between items-center pointer-events-none">
                    {[9, 10, 11, 12, 13].map((s) => (
                      <div 
                        key={s} 
                        className={`w-1.5 h-3.5 rounded-sm`}
                        style={{ backgroundColor: s <= categoryFontSize ? currentColor : 'rgb(209, 213, 219)' }}
                      />
                    ))}
                  </div>
                  
                  {/* Visual Thumb */}
                  <div 
                    className="absolute w-5 h-5 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.2)] pointer-events-none top-1/2 -translate-y-1/2"
                    style={{ left: `calc(${((categoryFontSize - 9) / (13 - 9)) * 100}% - 10px)` }}
                  />
                  
                  {/* Invisible Input */}
                  <input 
                    type="range"
                    min="9"
                    max="13"
                    step="1"
                    value={categoryFontSize}
                    onChange={(e) => onCategoryFontSizeChange(parseInt(e.target.value, 10))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <span className="font-mooli text-[14px] text-gray-400 w-10 text-right shrink-0">{categoryFontSize}px</span>
              </div>
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