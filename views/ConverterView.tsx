
import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';

const SectionTitle = ({ children }: { children?: React.ReactNode }) => (
  <h3 className="font-amatic text-[21px] mt-2 mb-6 text-black dark:text-white uppercase leading-none tracking-widest border-none font-bold text-center">
    {children}
  </h3>
);

const IngredientTable = ({ title, items }: { title: string, items: { label: string, value: string }[] }) => (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-2 px-1">
      <span className="text-black dark:text-white text-[14px] leading-none select-none">♥︎</span>
      <h4 className="font-amatic text-[17px] text-black dark:text-white uppercase leading-none tracking-wider font-bold opacity-80">
        {title}
      </h4>
    </div>
    <div className="bg-white dark:bg-white/10 rounded-md overflow-hidden border border-gray-100 dark:border-white/5">
      {items.map((item, idx) => (
        <div key={idx} className="flex justify-between items-center px-5 py-2 border-b border-gray-50 dark:border-white/5 last:border-0">
          <span className="text-[12px] font-mooli text-black dark:text-white opacity-70">{item.label}</span>
          <span className="text-[12px] font-mooli text-black dark:text-white">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const CONVERSION_DATA = {
  'Farinha de Trigo': { cup: 120, tbsp: 7.5 },
  'Açúcar Refinado': { cup: 180, tbsp: 12 },
  'Açúcar Cristal': { cup: 200, tbsp: 14 },
  'Açúcar de Confeiteiro': { cup: 140, tbsp: 10 },
  'Açúcar Mascavo': { cup: 150, tbsp: 11 },
  'Manteiga / Gordura': { cup: 200, tbsp: 20 },
  'Mel / Melado': { cup: 300, tbsp: 18 },
  'Chocolate em Pó': { cup: 90, tbsp: 6 },
  'Amido de Milho': { cup: 150, tbsp: 9 },
  'Líquidos (Água/Leite)': { cup: 240, tbsp: 15 },
  'Oleaginosas': { cup: 140, tbsp: 10 },
};

type ActiveSection = 'equivalencias' | 'medidas' | 'calculadora' | null;

export const ConverterView: React.FC = () => {
  const [amount, setAmount] = useState<string>('1');
  const [ingredient, setIngredient] = useState<keyof typeof CONVERSION_DATA>('Farinha de Trigo');
  const [fromUnit, setFromUnit] = useState<'cup' | 'tbsp'>('cup');
  const [result, setResult] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);

  useEffect(() => {
    const val = parseFloat(amount) || 0;
    const factor = CONVERSION_DATA[ingredient][fromUnit];
    setResult(val * factor);
  }, [amount, ingredient, fromUnit]);

  const isLiquid = ingredient.includes('Líquidos');

  const toggleSection = (section: ActiveSection) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const btnBaseClass = "flex-1 py-3.5 transition-all flex flex-col items-center justify-center text-center px-1 rounded-md active:scale-[0.98]";

  const tableRows = [
    { cup: '1 copo tipo "requeijão"', spoon: null, ml: '250ml' },
    { cup: '1 copo americano', spoon: null, ml: '200ml' },
    { cup: '1 cálice de vinho', spoon: null, ml: '100ml' },
    { divider: true },
    { cup: '1 xícara', spoon: '16 colheres (sopa)', ml: '240ml' },
    { cup: '3/4 xícara', spoon: '12 colheres (sopa)', ml: '180ml' },
    { cup: '2/3 xícara', spoon: '10 col. (sopa) + 2 col. (chá)', ml: '160ml' },
    { cup: '1/2 xícara', spoon: '8 colheres (sopa)', ml: '120ml' },
    { cup: '1/3 xícara', spoon: '5 col. (sopa) + 1 col. (chá)', ml: '80ml' },
    { cup: '1/4 xícara', spoon: '4 colheres (sopa)', ml: '60ml' },
    { divider: true },
    { cup: null, spoon: '1 colher (café)', ml: '2,5ml' },
    { cup: null, spoon: '1 colher (chá)', ml: '5ml' },
    { cup: null, spoon: '1 colher (sobremesa)', ml: '7,5ml' },
    { cup: null, spoon: '1 colher (sopa)', ml: '15ml' },
  ];

  return (
    <div className="bg-[#f2f2f2] dark:bg-[#0a0a0a] min-h-screen pb-32 animate-in fade-in duration-500 overflow-x-hidden">
      <header className="pt-12 pb-8 px-6 flex flex-col items-center text-center">
        <h2 className="font-amatic font-bold text-[40px] uppercase tracking-tight text-black dark:text-white leading-none text-center">
          Conversão de Medidas
        </h2>
      </header>

      {/* Dicas de Medição */}
      <section className="px-8 mb-10 space-y-6 text-center animate-in fade-in duration-700">
        <div className="space-y-4">
          <p className="text-[13px] font-mooli leading-relaxed text-black dark:text-white opacity-80">
            Para maior precisão da medição dos ingredientes secos, peneire sempre antes de medir e nunca comprima o ingrediente a ser medido.
          </p>
          <div className="flex justify-center">
            <span className="text-black dark:text-white text-[20px] leading-none select-none">♥︎</span>
          </div>
          <p className="text-[13px] font-mooli leading-relaxed text-black dark:text-white opacity-80">
            Para conferir a medição dos ingredientes líquidos, deve-se colocar o recipiente em uma superfície plana e verificar o nível na altura dos olhos.
          </p>
          <div className="flex justify-center">
            <span className="text-black dark:text-white text-[20px] leading-none select-none">♥︎</span>
          </div>
          <p className="text-[13px] font-mooli leading-relaxed text-black dark:text-white opacity-80">
            Para medir ingredientes em forma de gordura sólida, deve-se retirar o ingrediente da geladeira com antecedência para que sejam medidas em temperatura ambiente. Ao ser colocado no recipiente a ser medido, deve-se fazer uma pequena pressão para retirar o ar.
          </p>
        </div>
      </section>

      <div className="px-6">
        <section className="flex w-full gap-2 mb-10">
          <button 
            onClick={() => toggleSection('equivalencias')}
            className={`${btnBaseClass} ${
              activeSection === 'equivalencias' ? 'bg-black text-white shadow-md' : 'bg-white text-black dark:bg-white/10 dark:text-white border border-gray-100 dark:border-white/5'
            }`}
          >
            <span className="font-amatic text-[15px] font-bold uppercase tracking-widest leading-none">Equivalências</span>
          </button>

          <button 
            onClick={() => toggleSection('medidas')}
            className={`${btnBaseClass} ${
              activeSection === 'medidas' ? 'bg-black text-white shadow-md' : 'bg-white text-black dark:bg-white/10 dark:text-white border border-gray-100 dark:border-white/5'
            }`}
          >
            <span className="font-amatic text-[15px] font-bold uppercase tracking-widest leading-none">Medidas</span>
          </button>

          <button 
            onClick={() => toggleSection('calculadora')}
            className={`${btnBaseClass} ${
              activeSection === 'calculadora' ? 'bg-black text-white shadow-md' : 'bg-white text-black dark:bg-white/10 dark:text-white border border-gray-100 dark:border-white/5'
            }`}
          >
            <span className="font-amatic text-[15px] font-bold uppercase tracking-widest leading-none">Calculadora</span>
          </button>
        </section>

        {activeSection === 'equivalencias' && (
          <section className="animate-in slide-in-from-top-4 duration-300">
            <SectionTitle>Equivalências</SectionTitle>
            
            <div className="bg-white dark:bg-white/10 rounded-md overflow-hidden p-4 border border-gray-100 dark:border-white/5">
              <div className="grid grid-cols-[1.2fr_1.8fr_0.8fr] mb-4 px-2 text-center">
                <span className="text-[11px] font-mooli uppercase tracking-widest text-gray-400">Copo/Xícara</span>
                <span className="text-[11px] font-mooli uppercase tracking-widest text-gray-400">Colher</span>
                <span className="text-[11px] font-mooli uppercase tracking-widest text-gray-400">ML</span>
              </div>
              
              <div className="space-y-1">
                {tableRows.map((row, i) => {
                  if (row.divider) return <div key={i} className="h-[1px] bg-gray-50 dark:bg-white/5 my-2 mx-2" />;
                  
                  return (
                    <div key={i} className="grid grid-cols-[1.2fr_1.8fr_0.8fr] items-center px-2 py-0.5 text-center">
                      <div className="text-[11px] font-mooli text-black dark:text-white opacity-80 leading-tight">
                        {row.cup || <div className="text-center"><span className="text-black dark:text-white text-[11px]">♥︎</span></div>}
                      </div>
                      <div className="text-[11px] font-mooli text-black dark:text-white opacity-80 leading-tight px-1 whitespace-nowrap">
                        {row.spoon || <div className="text-center"><span className="text-black dark:text-white text-[11px]">♥︎</span></div>}
                      </div>
                      <div className="text-[11px] font-mooli text-black dark:text-white">
                        {row.ml}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'medidas' && (
          <section className="pt-2 animate-in slide-in-from-top-4 duration-300">
            <SectionTitle>Medidas (por ingredientes)</SectionTitle>
            
            <IngredientTable title="Líquido (Água, Suco, Leite, Buttermilk, Café, Óleo)" items={[
              { label: "1 xícara", value: "240ml" },
              { label: "1/2 xícara", value: "120ml" },
              { label: "1/3 xícara", value: "80ml" },
              { label: "1/4 xícara", value: "60ml" },
              { label: "1 colher (sopa)", value: "15ml" },
            ]} />

            <IngredientTable title="Manteiga / Gordura Vegetal" items={[
              { label: "1 xícara", value: "200g" },
              { label: "1/2 xícara", value: "100g" },
              { label: "1/3 xícara", value: "67g" },
              { label: "1/4 xícara", value: "50g" },
              { label: "1 colher (sopa)", value: "20g" },
            ]} />

            <IngredientTable title="Mel / Glucose / Melado" items={[
              { label: "1 xícara", value: "300g" },
              { label: "1/2 xícara", value: "150g" },
              { label: "1/3 xícara", value: "100g" },
              { label: "1/4 xícara", value: "75g" },
              { label: "1 colher (sopa)", value: "18g" },
            ]} />

            <IngredientTable title="Farinha de Trigo" items={[
              { label: "1 xícara", value: "120g" },
              { label: "1/2 xícara", value: "60g" },
              { label: "1/3 xícara", value: "40g" },
              { label: "1/4 xícara", value: "30g" },
              { label: "1 colher (sopa)", value: "7,5g" },
            ]} />

            <IngredientTable title="Amido de Milho" items={[
              { label: "1 xícara", value: "150g" },
              { label: "1/2 xícara", value: "75g" },
              { label: "1/3 xícara", value: "50g" },
              { label: "1/4 xícara", value: "38g" },
              { label: "1 colher (sopa)", value: "9g" },
            ]} />

            <IngredientTable title="Chocolate em Pó / Cacau em Pó" items={[
              { label: "1 xícara", value: "90g" },
              { label: "1/2 xícara", value: "45g" },
              { label: "1/3 xícara", value: "30g" },
              { label: "1/4 xícara", value: "23g" },
              { label: "1 colher (sopa)", value: "6g" },
            ]} />

            <IngredientTable title="Açúcar Refinado" items={[
              { label: "1 xícara", value: "180g" },
              { label: "1/2 xícara", value: "90g" },
              { label: "1/3 xícara", value: "60g" },
              { label: "1/4 xícara", value: "45g" },
              { label: "1 colher (sopa)", value: "12g" },
            ]} />

            <IngredientTable title="Açúcar Cristal" items={[
              { label: "1 xícara", value: "200g" },
              { label: "1/2 xícara", value: "100g" },
              { label: "1/3 xícara", value: "67g" },
              { label: "1/4 xícara", value: "50g" },
              { label: "1 colher (sopa)", value: "14g" },
            ]} />

            <IngredientTable title="Açúcar de Confeiteiro" items={[
              { label: "1 xícara", value: "140g" },
              { label: "1/2 xícara", value: "70g" },
              { label: "1/3 xícara", value: "37g" },
              { label: "1/4 xícara", value: "35g" },
              { label: "1 colher (sopa)", value: "10g" },
            ]} />

            <IngredientTable title="Açúcar Mascavo" items={[
              { label: "1 xícara", value: "150g" },
              { label: "1/2 xícara", value: "75g" },
              { label: "1/3 xícara", value: "50g" },
              { label: "1/4 xícara", value: "38g" },
              { label: "1 colher (sopa)", value: "11g" },
            ]} />

            <IngredientTable title="Oleaginosas (Nozes, Castanhas...)" items={[
              { label: "1 xícara", value: "140g" },
              { label: "1/2 xícara", value: "70g" },
              { label: "1/3 xícara", value: "47g" },
              { label: "1/4 xícara", value: "35g" },
              { label: "1 colher (sopa)", value: "10g" },
            ]} />

            <IngredientTable title="Fermento Químico / Bicarbonato" items={[
              { label: "1 colher (sopa)", value: "14g" },
              { label: "1 colher (chá)", value: "5g" },
            ]} />

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="text-black dark:text-white text-[14px] leading-none select-none">♥︎</span>
                <h4 className="font-amatic text-[17px] text-black dark:text-white uppercase leading-none tracking-wider font-bold opacity-80">
                  Fermento Biológico Seco / Fresco
                </h4>
              </div>
              <div className="bg-white dark:bg-white/10 p-4 rounded-md border border-gray-100 dark:border-white/5 text-[12px] font-mooli leading-relaxed text-black dark:text-white opacity-80 text-center">
                1 tablete (15g) de fermento biológico fresco equivale a 1/2 colher de sopa (5g) de fermento biológico seco
              </div>
            </div>
          </section>
        )}

        {activeSection === 'calculadora' && (
          <section className="mt-4 mb-12 bg-white dark:bg-white/10 p-7 rounded-md animate-in slide-in-from-top-4 duration-300 border border-gray-100 dark:border-white/5">
            <SectionTitle>Calculadora</SectionTitle>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[9px] font-mooli font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Ingrediente</label>
                <select 
                  value={ingredient}
                  onChange={(e) => setIngredient(e.target.value as any)}
                  className="w-full bg-[#fcfcfc] dark:bg-black/20 border border-gray-50 dark:border-white/5 p-4 rounded-md font-mooli text-[13px] outline-none text-black dark:text-white appearance-none cursor-pointer"
                >
                  {Object.keys(CONVERSION_DATA).map(ing => (
                    <option key={ing} value={ing}>{ing}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[9px] font-mooli font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Quantidade</label>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#fcfcfc] dark:bg-black/20 border border-gray-50 dark:border-white/5 p-4 rounded-md font-mooli text-[13px] outline-none text-black dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[9px] font-mooli font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Unidade</label>
                  <select 
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value as any)}
                    className="w-full bg-[#fcfcfc] dark:bg-black/20 border border-gray-50 dark:border-white/5 p-4 rounded-md font-mooli text-[13px] outline-none text-black dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="cup">Xícara</option>
                    <option value="tbsp">Colher</option>
                  </select>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50 dark:border-white/5 flex flex-col items-center">
                <span className="text-[9px] font-mooli font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Resultado</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-amatic text-[52px] font-bold text-black dark:text-white leading-none">
                    {result % 1 === 0 ? result : result.toFixed(1).replace('.', ',')}
                  </span>
                  <span className="font-amatic text-[24px] font-bold text-black opacity-30 uppercase tracking-widest">
                    {isLiquid ? 'ml' : 'gramas'}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
