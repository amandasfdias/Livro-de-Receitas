
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TermsOfServiceViewProps {
  onBack: () => void;
}

export const TermsOfServiceView: React.FC<TermsOfServiceViewProps> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#f2f2f2] dark:bg-[#0a0a0a] text-black dark:text-white p-6 md:p-12 animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity font-mooli text-sm"
        >
          <ArrowLeft size={18} />
          {t('Voltar')}
        </button>

        <h1 className="font-amatic text-[42px] font-bold uppercase tracking-tight mb-8">
          {t('Termos de Uso')}
        </h1>

        <div className="space-y-6 font-mooli text-[13px] leading-relaxed opacity-80">
          <section>
            <h2 className="text-[15px] font-bold mb-3 uppercase tracking-wider">{t('1. Aceitação dos Termos')}</h2>
            <p>
              {t('Ao acessar e usar este aplicativo, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.')}
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-bold mb-3 uppercase tracking-wider">{t('2. Uso do Serviço')}</h2>
            <p>
              {t('O "The Recipes" é uma plataforma para gerenciar receitas pessoais. Você é responsável por manter a confidencialidade de sua conta e senha.')}
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-bold mb-3 uppercase tracking-wider">{t('3. Propriedade Intelectual')}</h2>
            <p>
              {t('O conteúdo que você adiciona é seu. No entanto, o design, código e marca do aplicativo são de nossa propriedade exclusiva.')}
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-bold mb-3 uppercase tracking-wider">{t('4. Limitação de Responsabilidade')}</h2>
            <p>
              {t('O serviço é fornecido "como está". Não garantimos que o serviço será ininterrupto ou livre de erros.')}
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-bold mb-3 uppercase tracking-wider">{t('5. Alterações nos Termos')}</h2>
            <p>
              {t('Reservamo-nos o direito de modificar estes termos a qualquer momento. O uso continuado do aplicativo constitui aceitação dos novos termos.')}
            </p>
          </section>

          <footer className="pt-8 border-t border-black/10 dark:border-white/10 opacity-40 italic">
            <p>{t('Última atualização: Maio de 2026')}</p>
          </footer>
        </div>
      </div>
    </div>
  );
};
