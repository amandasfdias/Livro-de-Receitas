
import React, { useState, useRef } from 'react';
import { Camera, User, ArrowLeft, Check, Smartphone } from 'lucide-react';

interface AccountDetails {
  name: string;
  email: string;
  username: string;
  birthDate: string;
  gender: string;
  location: string;
  photo?: string;
}

interface AccountDetailsViewProps {
  initialData: AccountDetails;
  isLoggedIn: boolean;
  loginProvider?: string | null;
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  onSave: (data: AccountDetails) => void;
  onBack: () => void;
}

export const AccountDetailsView: React.FC<AccountDetailsViewProps> = ({ 
  initialData, 
  onGoogleLogin, 
  onAppleLogin, 
  onSave, 
  onBack 
}) => {
  const [formData, setFormData] = useState<AccountDetails>(initialData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof AccountDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const labelClass = "block text-[10px] font-inter font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1";
  const inputClass = "w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 py-4 px-5 text-[14px] font-inter rounded-md outline-none focus:border-black dark:focus:border-white transition-all text-black dark:text-white placeholder:text-gray-300";
  const selectClass = "w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 py-4 px-5 text-[14px] font-inter rounded-md outline-none focus:border-black dark:focus:border-white transition-all appearance-none cursor-pointer text-black dark:text-white";

  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-[#0a0a0a] animate-in fade-in duration-500 flex flex-col pb-32">
      <header className="pt-12 pb-8 px-6 text-center relative sticky top-0 bg-[#f9f9f9] dark:bg-[#0a0a0a] z-10">
        <button onClick={onBack} className="absolute left-6 top-1/2 -translate-y-1/2 p-2 -ml-2 text-black dark:text-white active:scale-90 transition-transform">
          <ArrowLeft size={22}/>
        </button>
        <h2 className="font-amatic font-bold text-[30px] uppercase tracking-tight text-black dark:text-white leading-none">
          Editar Conta
        </h2>
        <button 
          onClick={() => onSave(formData)} 
          className="absolute right-6 top-1/2 -translate-y-1/2 p-2 -mr-2 text-black dark:text-white active:scale-90 transition-transform"
        >
          <Check size={24} strokeWidth={2} />
        </button>
      </header>

      <div className="flex flex-col items-center mt-6 mb-8">
        <div className="relative">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-28 h-28 bg-white dark:bg-white/5 rounded-full flex items-center justify-center overflow-hidden cursor-pointer border border-gray-100 dark:border-white/10"
          >
            {formData.photo ? (
              <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-gray-300" />
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 w-9 h-9 bg-black text-white rounded-full flex items-center justify-center active:scale-90 transition-transform border-2 border-white"
          >
            <Camera size={16} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
        </div>
      </div>

      <div className="flex-1 px-8 space-y-8 max-w-md mx-auto w-full">
        <div className="space-y-5">
          <div className="space-y-1">
            <label className={labelClass}>Nome Completo</label>
            <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className={inputClass} placeholder="Seu nome" />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Nick de Usuário</label>
            <input type="text" value={formData.username} onChange={(e) => handleChange('username', e.target.value)} className={inputClass} placeholder="@usuario" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Nascimento</label>
              <input type="date" value={formData.birthDate} onChange={(e) => handleChange('birthDate', e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Sexo</label>
              <select value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)} className={selectClass}>
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Localidade</label>
            <input type="text" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} className={inputClass} placeholder="Ex: São Paulo, Brasil" />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <button onClick={onGoogleLogin} className="w-full flex items-center justify-center gap-3 py-4 border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            <span className="font-inter text-[13px] font-bold uppercase tracking-widest text-black dark:text-white">Google</span>
          </button>
          <button onClick={onAppleLogin} className="w-full flex items-center justify-center gap-3 py-4 border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
            <Smartphone size={18} className="text-black dark:text-white" />
            <span className="font-inter text-[11px] font-bold uppercase tracking-widest text-black dark:text-white">Apple</span>
          </button>
        </div>

        <button onClick={() => onSave(formData)} className="w-full py-5 bg-black text-white dark:bg-white dark:text-black rounded-md font-amatic text-[24px] font-bold uppercase tracking-widest active:scale-95 transition-all">
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};
