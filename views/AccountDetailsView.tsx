
import React, { useState, useRef, useEffect } from 'react';
import { Camera, User, ArrowLeft, ChevronDown, Check, CheckCircle2, Mail, CloudUpload, LogOut, Trash2, AlertTriangle, X } from 'lucide-react';

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
  onEmailLogin: () => void;
  onSave: (data: AccountDetails) => void;
  onBack: () => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
}

const COUNTRIES = [
  "Afeganistão", "África do Sul", "Albânia", "Alemanha", "Andorra", "Angola", "Antígua e Barbuda", "Arábia Saudita", "Argélia", "Argentina", "Armênia", "Austrália", "Áustria", "Azerbaijão", "Bahamas", "Bangladesh", "Barbados", "Bahrein", "Bélgica", "Belize", "Benim", "Bielorrússia", "Bolívia", "Bósnia e Herzegovina", "Botsuana", "Brasil", "Brunei", "Bulgária", "Burkina Faso", "Burundi", "Butão", "Cabo Verde", "Camarões", "Camboja", "Canadá", "Catar", "Cazaquistão", "Chade", "Chile", "China", "Chipre", "Colômbia", "Comores", "Congo-Brazzaville", "Congo-Kinshasa", "Coreia do Norte", "Coreia do Sul", "Costa do Marfim", "Costa Rica", "Croácia", "Cuba", "Dinamarca", "Djibuti", "Dominica", "Egito", "El Salvador", "Emirados Árabes Unidos", "Equador", "Eritreia", "Eslováquia", "Eslovênia", "Espanha", "Essuatíni", "Estados Unidos", "Estônia", "Etiópia", "Fiji", "Filipinas", "Finlândia", "França", "Gabão", "Gâmbia", "Gana", "Geórgia", "Granada", "Grécia", "Guatemala", "Guiana", "Guiné", "Guiné Equatorial", "Guiné-Bissau", "Haiti", "Honduras", "Hungria", "Iêmen", "Ilhas Marshall", "Índia", "Indonésia", "Irã", "Iraque", "Irlanda", "Islândia", "Israel", "Itália", "Jamaica", "Japão", "Jordânia", "Kiribati", "Kuwait", "Laos", "Lesoto", "Letônia", "Líbano", "Libéria", "Líbia", "Liechtenstein", "Lituânia", "Luxemburgo", "Macedônia do Norte", "Madagascar", "Malásia", "Malaui", "Maldivas", "Mali", "Malta", "Marrocos", "Maurício", "Mauritânia", "México", "Mianmar", "Micronésia", "Moçambique", "Moldávia", "Mônaco", "Mongólia", "Montenegro", "Namíbia", "Nauru", "Nepal", "Nicarágua", "Níger", "Nigéria", "Noruega", "Nova Zelândia", "Omã", "Países Baixos", "Palau", "Panamá", "Papua Nova Guiné", "Paquistão", "Paraguai", "Peru", "Polônia", "Portugal", "Quênia", "Quirguistão", "Reino Unido", "República Centro-Africana", "República Dominicana", "Romênia", "Ruanda", "Rússia", "Samoa", "San Marino", "Santa Lúcia", "São Cristóvão e Neves", "São Tomé e Príncipe", "São Vicente e Granadinas", "Seicheles", "Senegal", "Serra Leoa", "Sérvia", "Singapura", "Síria", "Somália", "Sri Lanka", "Sudão", "Sudão do Sul", "Suécia", "Suíça", "Suriname", "Tailândia", "Tajiquistão", "Tanzânia", "Tchequia", "Timor-Leste", "Togo", "Tonga", "Trinidad e Tobago", "Tunísia", "Turcomenistão", "Turquia", "Tuvalu", "Ucrânia", "Uganda", "Uruguai", "Uzbequistão", "Vanuatu", "Vaticano", "Venezuela", "Vietnã", "Zâmbia", "Zimbábue"
];

export const AccountDetailsView: React.FC<AccountDetailsViewProps> = ({ 
  initialData, 
  isLoggedIn,
  onSave, 
  onBack,
  onGoogleLogin,
  onEmailLogin,
  onLogout,
  onDeleteAccount
}) => {
  const [formData, setFormData] = useState<AccountDetails>(initialData);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const genderDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
        setIsDateDropdownOpen(false);
      }
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target as Node)) {
        setIsGenderDropdownOpen(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [birthYear, birthMonth, birthDay] = formData.birthDate ? formData.birthDate.split('-') : ['', '', ''];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

  const handleSave = () => {
    onSave(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

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

  const labelClass = "block text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400 mb-4";
  const inputClass = "w-full bg-[#f7f7f7] dark:bg-white/5 py-4 px-4 text-[14px] font-mooli font-normal rounded-sm outline-none border border-transparent focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-black dark:text-white placeholder:text-gray-400";
  const selectClass = "w-full bg-[#f7f7f7] dark:bg-white/5 py-4 px-4 text-[14px] font-mooli font-normal rounded-sm outline-none border border-transparent focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all appearance-none cursor-pointer text-black dark:text-white";

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] animate-in fade-in duration-500 flex flex-col">
      <header className="pt-12 pb-6 px-6 flex items-center justify-between sticky top-0 bg-white dark:bg-[#121212] z-10">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-sm transition-colors text-black dark:text-white active:scale-90 z-10">
          <ArrowLeft size={22} />
        </button>
        <h2 className="font-amatic font-bold text-[30px] uppercase tracking-tight text-black dark:text-white leading-none absolute left-1/2 -translate-x-1/2 mt-1">
          Editar Conta
        </h2>
        <button 
          onClick={handleSave} 
          className="p-2 -mr-2 text-brand-secondary active:scale-90 transition-transform z-10"
        >
          <Check size={26} strokeWidth={2.5} />
        </button>
      </header>

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full shadow-xl animate-in fade-in zoom-in duration-300 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-brand-secondary" />
            <span className="font-mooli text-[13px] font-normal">Alterações salvas com sucesso</span>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center mt-2 mb-10">
        <div className="relative">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 bg-[#f7f7f7] dark:bg-white/5 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
          >
            {formData.photo ? (
              <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={40} strokeWidth={1.5} className="text-black dark:text-white" />
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center active:scale-90 transition-transform border-2 border-white dark:border-[#121212]"
          >
            <Camera size={14} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
        </div>
        <p className="text-gray-400 text-[10px] font-rubik font-medium uppercase tracking-[0.1em] mt-4">Alterar Foto</p>
      </div>

      <div className="flex-1 px-6 space-y-8 max-w-md mx-auto w-full">
        <section>
          <label className={labelClass}>Nome</label>
          <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className={inputClass} placeholder="Seu nome completo" />
        </section>
        
        <section>
          <label className={labelClass}>Nome de usuário</label>
          <div className="relative flex items-center w-full bg-[#f7f7f7] dark:bg-white/5 rounded-sm border border-transparent focus-within:border-black dark:focus-within:border-white focus-within:ring-1 focus-within:ring-black dark:focus-within:ring-white transition-all text-black dark:text-white group">
            <span className="pl-4 pr-0.5 text-[14px] font-mooli font-normal text-gray-400 transition-colors">@</span>
            <input 
              type="text" 
              value={formData.username.replace(/^@/, '')} 
              onChange={(e) => {
                const val = e.target.value.replace(/^@/, '');
                handleChange('username', val ? '@' + val : '');
              }} 
              className="w-full bg-transparent py-4 pr-4 pl-0.5 text-[14px] font-mooli font-normal outline-none placeholder:text-gray-400" 
              placeholder="usuario" 
            />
          </div>
        </section>
        
        <section>
          <label className={labelClass}>Data de nascimento</label>
          <div className="relative" ref={dateDropdownRef}>
            <button
              type="button"
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              className={`${inputClass} flex items-center justify-between text-left`}
            >
              <span className={formData.birthDate ? 'text-black dark:text-white' : 'text-gray-400'}>
                {formData.birthDate ? formData.birthDate.split('-').reverse().join('/') : 'DD/MM/AAAA'}
              </span>
              <ChevronDown 
                className={`text-gray-400 transition-transform duration-300 ${isDateDropdownOpen ? 'rotate-180' : ''}`} 
                size={20} 
              />
            </button>
            
            <div 
              className={`absolute z-20 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-sm shadow-lg overflow-hidden transition-all duration-300 origin-top ${
                isDateDropdownOpen 
                  ? 'opacity-100 scale-y-100 translate-y-0' 
                  : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="flex h-48 divide-x divide-gray-100 dark:divide-white/10">
                <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {days.map(d => (
                    <button
                      key={`day-${d}`}
                      type="button"
                      onClick={() => handleChange('birthDate', `${birthYear || '2000'}-${birthMonth || '01'}-${d}`)}
                      className={`w-full px-2 py-2 text-center text-[14px] font-mooli transition-colors hover:bg-[#f7f7f7] dark:hover:bg-white/5 ${
                        birthDay === d ? 'text-black dark:text-white font-bold bg-[#f7f7f7] dark:bg-white/5' : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {months.map(m => (
                    <button
                      key={`month-${m}`}
                      type="button"
                      onClick={() => handleChange('birthDate', `${birthYear || '2000'}-${m}-${birthDay || '01'}`)}
                      className={`w-full px-2 py-2 text-center text-[14px] font-mooli transition-colors hover:bg-[#f7f7f7] dark:hover:bg-white/5 ${
                        birthMonth === m ? 'text-black dark:text-white font-bold bg-[#f7f7f7] dark:bg-white/5' : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {years.map(y => (
                    <button
                      key={`year-${y}`}
                      type="button"
                      onClick={() => handleChange('birthDate', `${y}-${birthMonth || '01'}-${birthDay || '01'}`)}
                      className={`w-full px-2 py-2 text-center text-[14px] font-mooli transition-colors hover:bg-[#f7f7f7] dark:hover:bg-white/5 ${
                        birthYear === y ? 'text-black dark:text-white font-bold bg-[#f7f7f7] dark:bg-white/5' : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section>
          <label className={labelClass}>Gênero</label>
          <div className="relative" ref={genderDropdownRef}>
            <button
              type="button"
              onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
              className={`${inputClass} flex items-center justify-between text-left`}
            >
              <span className={formData.gender ? 'text-black dark:text-white' : 'text-gray-400'}>
                {formData.gender || 'Selecione'}
              </span>
              <ChevronDown 
                className={`text-gray-400 transition-transform duration-300 ${isGenderDropdownOpen ? 'rotate-180' : ''}`} 
                size={20} 
              />
            </button>
            
            <div 
              className={`absolute z-20 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-sm shadow-lg overflow-hidden transition-all duration-300 origin-top ${
                isGenderDropdownOpen 
                  ? 'opacity-100 scale-y-100 translate-y-0' 
                  : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="py-2 flex flex-col">
                {['Masculino', 'Feminino', 'Outro', 'Prefiro não dizer'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      handleChange('gender', option);
                      setIsGenderDropdownOpen(false);
                    }}
                    className={`px-4 py-3 text-left text-[14px] font-mooli transition-colors hover:bg-[#f7f7f7] dark:hover:bg-white/5 ${
                      formData.gender === option 
                        ? 'text-black dark:text-white font-bold bg-[#f7f7f7] dark:bg-white/5' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <label className={labelClass}>Localidade</label>
          <div className="relative" ref={locationDropdownRef}>
            <button
              type="button"
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className={`${inputClass} flex items-center justify-between text-left`}
            >
              <span className={formData.location ? 'text-black dark:text-white' : 'text-gray-400'}>
                {formData.location || 'Selecione seu país'}
              </span>
              <ChevronDown 
                className={`text-gray-400 transition-transform duration-300 ${isLocationDropdownOpen ? 'rotate-180' : ''}`} 
                size={20} 
              />
            </button>
            
            <div 
              className={`absolute z-20 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-sm shadow-lg overflow-hidden transition-all duration-300 origin-top ${
                isLocationDropdownOpen 
                  ? 'opacity-100 scale-y-100 translate-y-0' 
                  : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="py-2 flex flex-col max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                {COUNTRIES.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => {
                      handleChange('location', country);
                      setIsLocationDropdownOpen(false);
                    }}
                    className={`px-4 py-3 text-left text-[14px] font-mooli transition-colors hover:bg-[#f7f7f7] dark:hover:bg-white/5 ${
                      formData.location === country 
                        ? 'text-black dark:text-white font-bold bg-[#f7f7f7] dark:bg-white/5' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col items-center justify-center space-y-3 pb-2 pt-4">
            <CloudUpload className="text-[#333333] dark:text-gray-400" size={36} strokeWidth={2} />
            <p className="font-rubik text-center text-[13px] text-[#BD715D] px-4 leading-relaxed">
              Faça login ou crie uma conta para manter suas receitas seguras e sincronizadas em todos os seus dispositivos.
            </p>
          </div>
          <button 
            onClick={onGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3.5 border border-gray-200 dark:border-white/10 rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 focus:bg-[#f7f7f7] dark:focus:bg-white/5 transition-all active:scale-95 focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-mooli text-black dark:text-white">Entrar com Google</span>
          </button>

          <button 
            onClick={onEmailLogin}
            className="w-full flex items-center justify-center gap-3 py-3.5 border border-gray-200 dark:border-white/10 rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 focus:bg-[#f7f7f7] dark:focus:bg-white/5 transition-all active:scale-95 focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white"
          >
            <Mail size={18} className="text-black dark:text-white" />
            <span className="font-mooli text-black dark:text-white">Entrar com E-mail</span>
          </button>
        </section>

        <div className="flex justify-center pt-8 pb-2">
          <span className="text-black dark:text-white text-lg">♥︎</span>
        </div>
      </div>
    </div>
  );
};
