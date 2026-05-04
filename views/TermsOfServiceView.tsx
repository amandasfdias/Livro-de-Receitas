
import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TermsOfServiceViewProps {
  onBack: () => void;
}

export const TermsOfServiceView: React.FC<TermsOfServiceViewProps> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-[#121212] min-h-screen animate-in fade-in duration-500 flex flex-col">
      <header className="pt-12 pb-6 px-5 flex items-center justify-between sticky top-0 bg-white dark:bg-[#121212] z-10">
        <div className="w-11" /> {/* Spacer for centering left side */}
        <h2 className="font-amatic font-bold text-[30px] uppercase tracking-tight text-black dark:text-white leading-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
          {t('Termos e Condições de Uso')}
        </h2>
        <button onClick={onBack} className="w-11 h-11 flex items-center justify-center -mr-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-colors text-brand-secondary active:scale-90 z-10">
          <X size={24} strokeWidth={2} />
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 px-5 pt-4 pb-10 max-w-2xl mx-auto w-full font-mooli text-[14px] text-black dark:text-white/90 leading-relaxed space-y-6 text-justify">
        <div className="text-center text-[13px] opacity-50 -mt-2 mb-8">
          <p>{t('Última atualização: Maio de 2026')}</p>
        </div>
        <section>
          <h3 className="font-bold text-[14px] mb-2 uppercase tracking-wide">{t('1. Aceitação dos Termos')}</h3>
          <p>
            {t('Ao acessar e usar este aplicativo, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.')}
          </p>
        </section>

        <section>
          <h3 className="font-bold text-[14px] mb-2 uppercase tracking-wide">{t('2. Uso do Serviço')}</h3>
          <p>
            {t('O "The Recipes" é uma plataforma para gerenciar receitas pessoais. Você é responsável por manter a confidencialidade de sua conta e senha.')}
          </p>
        </section>

        <section>
          <h3 className="font-bold text-[14px] mb-2 uppercase tracking-wide">{t('3. Propriedade Intelectual')}</h3>
          <p>
            {t('O conteúdo que você adiciona é seu. No entanto, o design, código e marca do aplicativo são de nossa propriedade exclusiva.')}
          </p>
        </section>

        <section>
          <h3 className="font-bold text-[14px] mb-2 uppercase tracking-wide">{t('4. Limitação de Responsabilidade')}</h3>
          <p>
            {t('O serviço é fornecido "como está". Não garantimos que o serviço será ininterrupto ou livre de erros.')}
          </p>
        </section>

        <section>
          <h3 className="font-bold text-[14px] mb-2 uppercase tracking-wide">{t('5. Alterações nos Termos')}</h3>
          <p>
            {t('Reservamo-nos o direito de modificar estes termos a qualquer momento. O uso continuado do aplicativo constitui aceitação dos novos termos.')}
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServiceView;
