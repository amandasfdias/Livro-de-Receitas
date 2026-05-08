
import React, { useState, useTransition } from 'react';
import { Loader2, AlertCircle, Check, X, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { signInWithGoogle, signInWithFacebook, signInWithSpotify, supabase } from '../services/supabaseService';

interface AuthViewProps {
  onLoginSuccess: () => void;
  onBack?: () => void;
  onViewTerms?: () => void;
  onViewPrivacy?: () => void;
  accentColor?: string;
  initialMode?: 'login' | 'signup';
}

export const AuthView: React.FC<AuthViewProps> = ({ 
  onLoginSuccess, 
  onBack, 
  onViewTerms,
  onViewPrivacy,
  accentColor = '#BD715D',
  initialMode = 'login' 
}) => {
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [showAgreementError, setShowAgreementError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [, startTransition] = useTransition();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && !agreed) {
      setError("Você precisa concordar com os termos para continuar.");
      setShowAgreementError(true);
      return;
    }
    setError(null);
    setShowAgreementError(false);
    setLoading(true);

    startTransition(async () => {
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
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            onLoginSuccess();
          }, 2000);
        } else {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (signInError) throw signInError;
          onLoginSuccess();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocorreu um erro na autenticação.");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar com Google.");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithFacebook();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar com Facebook.");
    }
  };

  const handleSpotifyLogin = async () => {
    try {
      await signInWithSpotify();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar com Spotify.");
    }
  };

  const labelClass = "block text-[10px] font-rubik font-medium uppercase tracking-[0.2em] text-gray-400 mb-1.5";
  const inputClass = "w-full bg-[#f2f2f2] dark:bg-white/5 py-3 px-4 text-[14px] font-mooli font-normal rounded-md outline-none border border-transparent focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-black dark:text-white placeholder:text-gray-400";
  const providerButtonClass = "w-full flex items-center justify-center gap-3 py-2.5 border-2 border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 focus:bg-[#f7f7f7] dark:focus:bg-white/5 transition-all active:scale-95 focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white";

  return (
    <div className="min-h-[100dvh] w-full bg-white dark:bg-[#0a0a0a] text-black dark:text-white flex flex-col items-center justify-start pt-6 pb-2 animate-in fade-in duration-700 relative">
      <div className="w-full max-w-md px-5 space-y-4 relative mx-auto flex flex-col flex-1">
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full shadow-xl animate-in fade-in zoom-in duration-300 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-brand-secondary" style={{ color: accentColor }} />
              <span className="font-mooli text-[13px] font-normal">Cadastro efetuado com sucesso</span>
            </div>
          </div>
        )}
        <div className="relative">
        </div>

        <div className="flex flex-col items-center -mt-2">
          <div className="w-16 h-16 opacity-90">
            <svg 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-full h-full stroke-black dark:stroke-white" 
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M50 94 L9 54 L5 22 L28 5 L48 16 L74 5 L95 22 L91 54 Z" />
              <path d="M48 16 L49 26 L50 94" />
              <path d="M48 16 L49 26 L50 94" />
              <path d="M5 22 L49 26 L95 22" />
              <path d="M5 22 L50 94" />
              <path d="M95 22 L50 94" />
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="flex items-center justify-center min-h-[40px] mb-1">
              <h2 className="font-amatic font-bold text-[34px] uppercase tracking-tight leading-none text-center">
                {isSignUp ? 'criar sua conta' : 'Iniciar Sessão'}
              </h2>
            </div>
            <p className="text-[13px] text-gray-500 font-sans leading-relaxed text-center">
              {isSignUp 
                ? 'Cadastre-se ou faça login para manter suas receitas salvas e sincronizadas em todos os lugares onde você cozinha.'
                : 'Bem-vindo de volta! Faça login para manter suas receitas seguras e sincronizadas em todos os seus dispositivos.'
              }
            </p>
          </div>

          <div className="space-y-4">
            <button 
              type="button"
              onClick={handleGoogleLogin}
              className={providerButtonClass}
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
              type="button"
              onClick={handleFacebookLogin}
              className={providerButtonClass}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#1877F2]">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="font-mooli text-black dark:text-white">Entrar com Facebook</span>
            </button>

            <button 
              type="button"
              onClick={handleSpotifyLogin}
              className={providerButtonClass}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#1DB954]">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.261 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span className="font-mooli text-black dark:text-white">Entrar com Spotify</span>
            </button>

            <div className="relative flex items-center gap-3 py-2">
              <div className="flex-1 h-[1px] bg-gray-200 dark:bg-white/10"></div>
              <span className="font-amatic font-bold text-[22px] opacity-40 uppercase tracking-widest leading-none">Ou</span>
              <div className="flex-1 h-[1px] bg-gray-200 dark:bg-white/10"></div>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-1">
              <label className={labelClass}>E-mail</label>
              <input 
                type="email" 
                placeholder="exemplo@email.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Senha</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
              {!isSignUp && (
                <div className="flex justify-end pt-1 text-black dark:text-gray-300">
                  <span className="text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:underline">
                    {t('Esqueceu a Senha?')}
                  </span>
                </div>
              )}
            </div>

            {isSignUp && (
              <div className="space-y-1 animate-in slide-in-from-top-2">
                <label className={labelClass}>Confirmar Senha</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-500 p-3 bg-red-500/10 rounded-md animate-in shake duration-300">
                <AlertCircle size={14} className="shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{error}</span>
              </div>
            )}

            {isSignUp && (
              <div className="flex items-start gap-3 pb-2 group cursor-pointer" onClick={() => {
                  setAgreed(!agreed);
                  if (!agreed) {
                    setShowAgreementError(false);
                    if (error === "Você precisa concordar com os termos para continuar.") {
                      setError(null);
                    }
                  }
                }}>
                <button
                  type="button"
                  className={`mt-0.5 shrink-0 w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-all ${
                    agreed 
                      ? 'bg-black border-black dark:bg-white dark:border-white' 
                      : showAgreementError
                        ? 'border-red-500 bg-red-50 dark:bg-red-500/10'
                        : 'border-gray-300 dark:border-white/20'
                  }`}
                >
                  {agreed && <Check size={14} strokeWidth={3} className="text-white dark:text-black" />}
                </button>
                <p className="text-[13px] text-gray-500 font-sans leading-relaxed text-left select-none">
                  {t('Ao se cadastrar, você concorda com os ')}
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onViewTerms?.(); }}
                    className="underline text-black dark:text-white hover:opacity-80 transition-opacity"
                  >
                    {t('termos de uso')}
                  </button>
                  {t(' e a ')}
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onViewPrivacy?.(); }}
                    className="underline text-black dark:text-white hover:opacity-80 transition-opacity"
                  >
                    {t('política de privacidade')}
                  </button>.
                </p>
              </div>
            )}

            <div className={`flex items-center gap-3 ${!isSignUp ? 'pt-6' : ''}`}>
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="w-12 h-12 flex items-center justify-center rounded-md active:scale-95 transition-all shadow-lg shadow-black/10 dark:shadow-black/20 border-none hover:brightness-[0.9] dark:hover:brightness-110"
                  style={{ backgroundColor: `color-mix(in srgb, ${accentColor}, white 30%)` }}
                >
                  <X size={20} strokeWidth={2.5} className="text-white" />
                </button>
              )}
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-black text-white py-2.5 min-h-[48px] flex items-center justify-center gap-3 rounded-md active:scale-95 transition-all border-none shadow-lg shadow-black/10 dark:shadow-black/20 hover:brightness-110 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <span className="font-mooli text-[16px] font-normal">
                    {isSignUp ? 'Cadastrar' : 'Entrar'}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className={`!mt-auto text-center ${!isSignUp ? 'pt-16 pb-0' : 'pt-10 pb-0'}`}>
          <p className="text-[14px] font-mooli text-gray-400 dark:text-gray-500">
            {isSignUp ? (
              <>
                {t('Já tem uma conta?')} {' '}
                <button 
                  onClick={() => setIsSignUp(false)}
                  className="text-black dark:text-white font-bold"
                >
                  {t('Entrar')}
                </button>
              </>
            ) : (
              <>
                {t('Não tem uma conta?')} {' '}
                <button 
                  onClick={() => setIsSignUp(true)}
                  className="text-black dark:text-white font-bold"
                >
                  {t('Criar agora')}
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
