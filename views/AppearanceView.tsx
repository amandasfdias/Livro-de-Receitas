import React from 'react';
import { ArrowLeft, Sun, Moon, Monitor, CheckCircle2, Check } from 'lucide-react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface AppearanceViewProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  onBack: () => void;
}

const PRESET_COLORS = [
  { name: 'Terracota', value: '#bd715d' },
  { name: 'Sálvia', value: '#5D8A66' },
  { name: 'Ardósia', value: '#5D718A' },
  { name: 'Lavanda', value: '#8A5D71' },
  { name: 'Carvão', value: '#333333' },
];

export const AppearanceView: React.FC<AppearanceViewProps> = ({
  currentTheme,
  onThemeChange,
  currentColor,
  onColorChange,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] animate-in fade-in duration-500">
      <header className="pt-12 pb-8 px-6 text-center relative sticky top-0 bg-white dark:bg-[#121212] z-10">
        <button onClick={onBack} className="absolute left-6 top-1/2 -translate-y-1/2 p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-md transition-colors text-black dark:text-white active:scale-90">
          <ArrowLeft size={22} />
        </button>
        <h2 className="font-amatic font-bold text-[30px] uppercase tracking-tight text-black dark:text-white leading-none">
          Aparência
        </h2>
        <button onClick={onBack} className="absolute right-6 top-1/2 -translate-y-1/2 p-2 -mr-2 text-brand-secondary active:scale-90 transition-transform">
          <Check size={24} strokeWidth={2.5} />
        </button>
      </header>

      <div className="px-6 space-y-10 pb-20">
        <section>
          <label className="block text-[10px] font-inter font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Modo de Visualização</label>
          <div className="space-y-3">
            {[
              { id: 'light', label: 'Claro', icon: <Sun size={20} /> },
              { id: 'dark', label: 'Escuro', icon: <Moon size={20} /> },
              { id: 'system', label: 'Sistema', icon: <Monitor size={20} /> }
            ].map((option) => (
              <button key={option.id} onClick={() => onThemeChange(option.id as ThemeMode)} className={`w-full flex items-center justify-between p-4 rounded-md transition-all ${currentTheme === option.id ? 'bg-black text-white' : 'bg-[#f7f7f7] dark:bg-white/5 text-black dark:text-white'}`}>
                <div className="flex items-center gap-4">{option.icon}<span className="font-inter text-[14px] font-medium">{option.label}</span></div>
                {currentTheme === option.id && <CheckCircle2 size={18} />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-[10px] font-inter font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Cores do App</label>
          <div className="grid grid-cols-5 gap-4">
            {PRESET_COLORS.map((color) => (
              <button key={color.value} onClick={() => onColorChange(color.value)} className="flex flex-col items-center gap-2 group">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentColor === color.value ? 'ring-2 ring-offset-2 ring-black dark:ring-white scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: color.value }}>
                  {currentColor === color.value && <CheckCircle2 size={20} className="text-white mix-blend-difference" />}
                </div>
                <span className="text-[9px] font-inter text-gray-400 uppercase tracking-tighter">{color.name}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};