
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User, Palette, Settings, 
  ChevronRight, UserRound,
  CircleHelp, BookOpen, Heart
} from 'lucide-react';
import { Recipe } from '../types';

interface ProfileViewProps {
  recipes: Recipe[];
  userName: string;
  userPhoto?: string;
  userHandle?: string;
  isGuest: boolean;
  onUpdateProfile: (name: string, photo?: string) => void;
  onNavigateToDetails: () => void;
  onNavigateToAppearance: () => void;
  onNavigateToSettings: () => void;
  onLogout: () => void;
}

const MenuItem = ({ icon, label, subtitle, onClick, disabled = false }: { icon: React.ReactNode, label: string, subtitle?: string, onClick?: () => void, disabled?: boolean }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center justify-between px-5 py-4 bg-white dark:bg-[#121212] active:bg-gray-50 dark:active:bg-white/5 transition-colors group border-b border-gray-100 dark:border-white/5 last:border-b-0 ${disabled ? 'opacity-40' : ''}`}
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 flex items-center justify-center text-brand-secondary group-active:scale-90 transition-transform">
        {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: 1.5 })}
      </div>
      <div className="flex flex-col text-left">
        <span className="font-sans text-[16px] text-gray-900 dark:text-gray-100 leading-tight">
          {label}
        </span>
        {subtitle && (
          <span className="font-rubik text-[12px] uppercase text-gray-400 mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
    </div>
    <ChevronRight size={20} strokeWidth={1.5} className="text-gray-400 dark:text-gray-500" />
  </button>
);

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  recipes,
  userName, 
  userPhoto,
  userHandle,
  onNavigateToDetails,
  onNavigateToAppearance,
  onNavigateToSettings
}) => {
  const { t } = useTranslation();
  const savedCount = recipes.length;
  const favoriteCount = recipes.filter(r => r.isFavorite).length;

  return (
    <div className="bg-[#f4f4f4] dark:bg-[#0a0a0a] animate-in fade-in duration-500 min-h-screen pb-32">
      <header className="pt-12 pb-8 px-8 text-center">
        <h2 className="font-amatic font-bold text-[40px] uppercase tracking-tight text-black dark:text-white leading-none text-center">
          {t('Conta')}
        </h2>
      </header>
      
      <div className="px-5 max-w-md mx-auto space-y-6">
        {/* Bloco de Perfil */}
        <div className="flex items-center gap-5 pb-2">
          <div className="shrink-0">
            <div className="w-[72px] h-[72px] flex items-center justify-center overflow-hidden rounded-full border-2 border-brand-secondary p-1">
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#c4c4c4] dark:bg-white/10 text-white">
                {userPhoto ? (
                  <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={32} strokeWidth={1.5} />
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col text-left">
            <p className="text-black dark:text-white font-amatic font-bold text-[28px] uppercase leading-none tracking-tight">
              {userName || t('USUÁRIO')}
            </p>
            {userHandle && (
              <p className="text-gray-400 font-sans text-[14px] font-medium mt-0.5">
                {userHandle.startsWith('@') ? userHandle : `@${userHandle}`}
              </p>
            )}
          </div>
        </div>

        {/* Contadores */}
        <div className="grid grid-cols-2 gap-3 pb-2">
          <div className="bg-[#F6F3E9] dark:bg-[#1a1a1a] rounded-2xl py-3 flex flex-col items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-white dark:bg-[#2a2a2a] flex items-center justify-center text-black dark:text-white mb-1.5">
              <BookOpen size={16} strokeWidth={1.5} />
            </div>
            <span className="text-black dark:text-white font-amatic text-[28px] leading-none">{savedCount}</span>
            <span className="text-gray-500 font-sans text-[12px] mt-0.5">{t('Receitas')}</span>
          </div>
          
          <div className="bg-[#F6F3E9] dark:bg-[#1a1a1a] rounded-2xl py-3 flex flex-col items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-white dark:bg-[#2a2a2a] flex items-center justify-center text-black dark:text-white mb-1.5">
              <Heart size={16} strokeWidth={1.5} />
            </div>
            <span className="text-black dark:text-white font-amatic text-[28px] leading-none">{favoriteCount}</span>
            <span className="text-gray-500 font-sans text-[12px] mt-0.5">{t('Favoritos')}</span>
          </div>
        </div>

        {/* Menu Principal */}
        <div className="bg-white dark:bg-[#121212] rounded-xl overflow-hidden">
          <MenuItem 
            icon={<User />} 
            label={t("Conta")} 
            subtitle={t("Perfil, login e dados pessoais")}
            onClick={onNavigateToDetails} 
          />
          <MenuItem 
            icon={<Palette />} 
            label={t("Aparência")} 
            subtitle={t("Tema e cores do aplicativo")}
            onClick={onNavigateToAppearance} 
          />
          <MenuItem 
            icon={<Settings />} 
            label={t("Configurações")} 
            subtitle={t("Idioma e sistema de medidas")}
            onClick={onNavigateToSettings} 
          />
        </div>

        {/* Seção Sobre */}
        <div className="pt-2 space-y-3">
          <h3 className="px-2 text-[13px] font-sans font-semibold uppercase tracking-wider text-[#999999]">
            {t('Sobre')}
          </h3>
          
          <div className="bg-white dark:bg-[#121212] rounded-xl overflow-hidden">
            <MenuItem 
              icon={<CircleHelp />} 
              label={t("Ajuda")} 
              subtitle={t("Perguntas frequentes")}
              onClick={() => {}} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
