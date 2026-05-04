import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PrivacyPolicyViewProps {
  onBack: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-[#121212] min-h-screen animate-in fade-in duration-500 flex flex-col">
      <header className="pt-12 pb-6 px-5 flex items-center justify-between sticky top-0 bg-white dark:bg-[#121212] z-10">
        <div className="w-11" /> {/* Spacer for centering left side */}
        <h2 className="font-amatic font-bold text-[30px] uppercase tracking-tight text-black dark:text-white leading-none absolute left-1/2 -translate-x-1/2">
          {t('Política de privacidade')}
        </h2>
        <button onClick={onBack} className="w-11 h-11 flex items-center justify-center -mr-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-colors text-brand-secondary active:scale-90 z-10">
          <X size={24} strokeWidth={2} />
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 px-5 pt-4 pb-10 max-w-2xl mx-auto w-full font-mooli text-[14px] text-black dark:text-white/90 leading-relaxed space-y-6 text-justify">
        <div className="text-center text-[13px] opacity-50 -mt-2 mb-8">
          <p>Última atualização: 29 de Abril de 2026</p>
        </div>
        <section>
          <p>
            Sua privacidade é importante para nós. Esta Política de Privacidade explica como o aplicativo <span className="text-brand-secondary font-bold">The Recipes • Lab</span> coleta, usa e protege seus dados pessoais. Cumprimos o Regulamento (UE) 2016/679 do Parlamento Europeu e do Conselho, de 27 de abril de 2016 (<span className="font-bold">Regulamento Geral sobre a Proteção de Dados - RGPD</span>) e da restante legislação de proteção de dados pessoais. Ao utilizar o aplicativo <span className="text-brand-secondary font-bold">The Recipes • Lab</span>, você concorda com estas práticas. Caso não concorde, recomendamos que não utilize o app.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-[14px] mb-2 uppercase tracking-wide">1. Dados Coletados</h3>
          <p>
            Nosso aplicativo coleta informações que você insere voluntariamente, como receitas, fotos de pratos e preferências de categorias. Esses dados são armazenados localmente no seu navegador e, caso você opte por sincronizar, em nossos servidores seguros.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-[14px] mb-2 uppercase tracking-wide">2. Uso das Informações</h3>
          <p>
            As informações coletadas são utilizadas exclusivamente para:
          </p>
          <ul className="list-disc ml-5 mt-2 space-y-1 text-left">
            <li>Personalizar sua experiência no aplicativo;</li>
            <li>Gerenciar seu livro de receitas digital;</li>
            <li>Melhorar as funcionalidades e o desempenho do app.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-[14px] mb-2 uppercase tracking-wide">3. Armazenamento e Segurança</h3>
          <p>
            Utilizamos tecnologias de ponta para garantir que seus dados estejam protegidos contra acessos não autorizados. No entanto, lembre-se que nenhum método de transmissão pela internet é 100% seguro.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-[14px] mb-2 uppercase tracking-wide">4. Compartilhamento de Dados</h3>
          <p>
            Não vendemos ou alugamos seus dados pessoais a terceiros. Seus dados só são compartilhados se houver obrigação legal ou para o funcionamento técnico essencial do serviço (como provedores de nuvem).
          </p>
        </section>

        <section>
          <h3 className="font-bold text-[14px] mb-2 uppercase tracking-wide">5. Seus Direitos</h3>
          <p>
            Você tem o direito de acessar, corrigir ou excluir seus dados a qualquer momento através das configurações do aplicativo ou entrando em contato com nosso suporte.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-[14px] mb-2 uppercase tracking-wide">6. Alterações nesta Política</h3>
          <p>
            Podemos atualizar nossa Política de Privacidade ocasionalmente. Recomendamos que você revise esta página periodicamente para se manter informado sobre como estamos protegendo suas informações.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyView;
