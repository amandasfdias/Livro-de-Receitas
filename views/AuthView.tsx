
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, UserCircle2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { signInWithGoogle, supabase } from '../services/supabaseService';

interface AuthViewProps {
  onLoginSuccess: () => void;
  onContinueAsGuest: () => void;
  onBack?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess, onContinueAsGuest, onBack }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error("As senhas não coincidem.");
        }
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        alert("Verifique seu e-mail para confirmar o cadastro!");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro na autenticação.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Erro ao entrar com Google.");
    }
  };

  const inputClass = "w-full bg-accent border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white p-4 pl-12 text-[14px] font-sans outline-none rounded-md transition-all text-black dark:text-white placeholder:opacity-50";

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white flex flex-col items-center justify-center p-8 animate-in fade-in duration-700 relative">
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-12 left-6 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-colors"
        >
          <ArrowRight className="rotate-180" size={24} />
        </button>
      )}
      <div className="w-full max-w-sm space-y-10">
        <Logo size="lg" />

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-amatic font-bold text-[30px] uppercase tracking-tight leading-none">
              {isSignUp ? 'Criar sua conta' : 'Bem-vindo de volta'}
            </h2>
            <p className="text-[11px] opacity-40 font-sans uppercase tracking-[0.2em]">
              {isSignUp ? 'Junte-se ao nosso estúdio criativo' : 'Acesse seu livro de receitas pessoal'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-black dark:text-white" size={18} />
              <input 
                type="email" 
                placeholder="E-mail" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-black dark:text-white" size={18} />
              <input 
                type="password" 
                placeholder="Senha" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            {isSignUp && (
              <div className="relative animate-in slide-in-from-top-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-black dark:text-white" size={18} />
                <input 
                  type="password" 
                  placeholder="Confirmar Senha" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-500 p-3 bg-red-500/10 rounded-md animate-in shake duration-300">
                <AlertCircle size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 flex items-center justify-center gap-3 rounded-md active:scale-95 transition-all border-none"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span className="font-amatic text-[22px] font-bold tracking-widest uppercase">
                    {isSignUp ? 'Cadastrar' : 'Entrar'}
                  </span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute w-full h-[1px] bg-gray-100 dark:bg-white/10"></div>
            <span className="relative bg-white dark:bg-[#0a0a0a] px-4 text-[9px] font-bold opacity-30 uppercase tracking-[0.3em]">Ou entre com</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 py-3 border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-rubik text-[11px] font-medium uppercase tracking-widest">Google</span>
            </button>

            <button 
              onClick={onContinueAsGuest}
              className="flex items-center justify-center gap-3 py-3 border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95"
            >
              <UserCircle2 size={18} className="opacity-60" />
              <span className="font-rubik text-[11px] font-medium uppercase tracking-widest">Convidado</span>
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-4 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[11px] opacity-40 hover:opacity-100 font-sans font-bold uppercase tracking-[0.15em] transition-opacity"
          >
            {isSignUp ? 'Já tem uma conta? Entrar' : 'Não tem uma conta? Criar agora'}
          </button>
        </div>
      </div>
    </div>
  );
};
