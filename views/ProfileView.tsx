
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User, Palette, Settings, 
  ChevronRight,
  BookOpen,
  Shield, FileText, Info, LogOut
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
  onNavigateToCategories: () => void;
  onNavigateToPrivacy: () => void;
  onLogout: () => void;
}

const MenuItem = ({ icon, label, subtitle, onClick, disabled = false, hideArrow = false }: { icon: React.ReactNode, label: string, subtitle?: string, onClick?: () => void, disabled?: boolean, hideArrow?: boolean }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center justify-between pl-1 pr-5 py-2.5 bg-white dark:bg-[#121212] active:bg-gray-50 dark:active:bg-white/5 transition-colors group border-b border-gray-100 dark:border-white/5 last:border-b-0 ${disabled ? 'opacity-40' : ''}`}
  >
    <div className="flex items-center gap-3">
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
    {!hideArrow && <ChevronRight size={20} strokeWidth={1.5} className="text-gray-400 dark:text-gray-500" />}
  </button>
);

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  userName, 
  userPhoto,
  userHandle,
  isGuest,
  onNavigateToDetails,
  onNavigateToAppearance,
  onNavigateToSettings,
  onNavigateToCategories,
  onNavigateToPrivacy,
  onLogout
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-[#f2f2f2] dark:bg-[#0a0a0a] animate-in fade-in duration-500 min-h-screen pt-[116px]">
      <div className="fixed top-0 left-0 w-full h-[80px] bg-white dark:bg-[#121212] z-40 px-5 flex items-center shadow-md shadow-black/5 dark:shadow-black/40">
        <div className="relative flex items-center justify-center w-full">
          <h2 className="font-amatic font-bold text-[37px] uppercase tracking-tight text-black dark:text-white leading-none text-center drop-shadow-sm mt-4">
            {t('Minha conta')}
          </h2>
        </div>
      </div>
      
      <div className="px-5 max-w-md mx-auto w-full pb-1 space-y-4">
        {/* Bloco de Perfil */}
        <div className="flex flex-col items-center justify-center gap-3 pb-6 text-center">
          <div className="shrink-0">
            <div className="w-[88px] h-[88px] flex items-center justify-center overflow-hidden rounded-full border-2 border-brand-secondary p-1">
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#c4c4c4] dark:bg-white/10 text-white">
                {userPhoto ? (
                  <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} strokeWidth={1.5} />
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <p className="text-black dark:text-white font-amatic font-bold text-[28px] uppercase leading-none tracking-tight text-center">
              {userName || 'Fulano da Silva'}
            </p>
            <p className="text-gray-400 font-sans text-[15px] font-medium mt-1 text-center">
              {userHandle ? (userHandle.startsWith('@') ? userHandle : `@${userHandle}`) : '@nickname'}
            </p>
          </div>
        </div>

        {/* Menu Principal */}
        <div className="bg-white dark:bg-[#121212] rounded-md overflow-hidden">
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
            icon={<BookOpen />} 
            label={t("Livro de Receitas")} 
            subtitle={t("Contagem e Organizar Receitas")}
            onClick={onNavigateToCategories} 
          />
          <MenuItem 
            icon={<Settings />} 
            label={t("Configurações")} 
            subtitle={t("Idioma e sistema de medidas")}
            onClick={onNavigateToSettings} 
          />
          <MenuItem 
            icon={<Shield />} 
            label={t("Política de Privacidade")} 
            onClick={onNavigateToPrivacy} 
          />
          <MenuItem 
            icon={<FileText />} 
            label={t("Termos e Condições")} 
            onClick={() => {}} 
          />
          <MenuItem 
            icon={<Info />} 
            label={t("Sobre")} 
            subtitle={t("Versão app 1.0")}
            onClick={() => {}} 
            hideArrow
          />
          {!isGuest && (
            <MenuItem 
              icon={<LogOut />} 
              label={t("Sair")} 
              onClick={onLogout}
              hideArrow
            />
          )}
        </div>

        <div className="flex flex-col items-center justify-center pt-12 pb-2 text-gray-400 dark:text-gray-500">
          <span className="text-black dark:text-white text-lg mb-2">♥︎</span>
          <p className="font-mooli text-[13px] mb-1.5">Cuore | Bake &amp; Craft Studio</p>
          <div className="flex items-center gap-1.5 font-mooli text-[11px]">
            <span>&copy; 2026</span>
            <span className="text-[8px]">&bull;</span>
            <span>{t("Todos os direitos reservados")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
