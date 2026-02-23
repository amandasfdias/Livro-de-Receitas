
import React from 'react';
import { 
  User, Palette, Settings, 
  ChevronRight, UserRound
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

const MenuItem = ({ icon, label, onClick, disabled = false }: { icon: React.ReactNode, label: string, onClick?: () => void, disabled?: boolean }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-[#121212] active:bg-gray-50 dark:active:bg-white/5 transition-colors group border-b border-gray-100 dark:border-white/5 last:border-b-0 ${disabled ? 'opacity-40' : ''}`}
  >
    <div className="flex items-center gap-4">
      <div className="text-black dark:text-white opacity-90 group-active:scale-90 transition-transform">
        {React.cloneElement(icon as React.ReactElement, { size: 20, strokeWidth: 1.5 })}
      </div>
      <span className="font-mooli text-[15px] font-bold text-black dark:text-white">
        {label}
      </span>
    </div>
    <ChevronRight size={18} strokeWidth={1} className="text-black/30 dark:text-white/30" />
  </button>
);

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  userName, 
  userPhoto,
  userHandle,
  onNavigateToDetails,
  onNavigateToAppearance,
  onNavigateToSettings,
}) => {
  return (
    <div className="bg-[#f7f7f7] dark:bg-[#0a0a0a] animate-in fade-in duration-500 min-h-screen">
      <header className="pt-20 pb-14 px-3 text-center">
        <h2 className="font-amatic font-bold text-[42px] uppercase tracking-tight text-black dark:text-white leading-none">
          Minha Conta
        </h2>
      </header>
      
      <div className="px-3 max-w-md mx-auto space-y-8">
        {/* Bloco de Perfil */}
        <button 
          onClick={onNavigateToDetails}
          className="w-full flex items-center gap-5 p-2 bg-transparent rounded-md active:scale-[0.98] transition-all group"
        >
          <div className="shrink-0">
            <div className="w-24 h-24 flex items-center justify-center overflow-hidden rounded-full">
              {userPhoto ? (
                <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserRound size={56} className="text-black dark:text-white opacity-90" strokeWidth={1} />
              )}
            </div>
          </div>

          <div className="flex flex-col text-left">
            <p className="text-black dark:text-white font-amatic text-[32px] font-bold uppercase leading-none tracking-tight">
              {userName}
            </p>
            {userHandle && (
              <p className="text-gray-400 font-mooli text-[13px] mt-1 opacity-60">
                @{userHandle.replace('@', '')}
              </p>
            )}
          </div>
        </button>

        {/* Lista de Opções */}
        <div className="bg-white dark:bg-[#121212] rounded-md overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm">
          <MenuItem 
            icon={<User />} 
            label="Dados da Conta" 
            onClick={onNavigateToDetails} 
          />
          <MenuItem 
            icon={<Palette />} 
            label="Aparência" 
            onClick={onNavigateToAppearance} 
          />
          <MenuItem 
            icon={<Settings />} 
            label="Configurações" 
            onClick={onNavigateToSettings} 
          />
        </div>

        {/* Rodapé Clean - Ícones removidos como solicitado */}
        <div className="pt-12 flex flex-col items-center gap-6">
          <p className="text-[9px] font-mooli uppercase tracking-[0.3em] opacity-30 text-black dark:text-white">
            Cuore Studio v1.0
          </p>
        </div>
      </div>
    </div>
  );
};
