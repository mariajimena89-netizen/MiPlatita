import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  PlusCircle, 
  Tag, 
  Home,
  Car,
  Tv,
  Zap,
  ShoppingBag,
  Activity,
  CircleDollarSign,
  PieChart
} from 'lucide-react';
import { Expense, CurrencyCode } from '../types';
import { formatMoney } from '../formatCurrency';

// Category icon helper mapping to lucide-react icons
const CategoryIcon: React.FC<{ name: string; className?: string }> = ({ name, className = "w-4 h-4" }) => {
  switch (name) {
    case 'Vivienda': return <Home className={className} />;
    case 'Transporte': return <Car className={className} />;
    case 'Ocio': return <Tv className={className} />;
    case 'Servicios': return <Zap className={className} />;
    case 'Alimentación': return <ShoppingBag className={className} />;
    case 'Salud': return <Activity className={className} />;
    default: return <CircleDollarSign className={className} />;
  }
};

interface AnalisisViewProps {
  expenses: Expense[];
  categories: string[];
  onAddCategory: (categoryName: string) => void;
}

export const AnalisisView: React.FC<AnalisisViewProps> = ({
  expenses,
  categories,
  onAddCategory,
}) => {
  const [ledgerCurrency, setLedgerCurrency] = useState<CurrencyCode>('ARS');
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const ledgerExpenses = expenses.filter((e) => e.currency === ledgerCurrency);

  // 1. Calculations (solo ledger activo, sin conversión)
  const grandTotal = ledgerExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Accumulate totals and counts
  const categoryTotals = categories.reduce((acc, cat) => {
    acc[cat] = { amount: 0, count: 0 };
    return acc;
  }, {} as Record<string, { amount: number; count: number }>);

  ledgerExpenses.forEach(exp => {
    if (categoryTotals[exp.category] !== undefined) {
      categoryTotals[exp.category].amount += exp.amount;
      categoryTotals[exp.category].count += 1;
    } else {
      categoryTotals[exp.category] = { amount: exp.amount, count: 1 };
    }
  });

  const sortedCategories = (Object.keys(categoryTotals) as string[])
    .map((name) => {
      const { amount, count } = categoryTotals[name];
      const pct = grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0;
      return { name, amount, count, pct };
    })
    .sort((a, b) => b.amount - a.amount);

  // Highlight metrics
  const highestSpendCategory = sortedCategories[0]?.amount > 0 ? sortedCategories[0] : null;
  const activeCategoriesCount = categories.length;
  const averageSpendPerCategory = activeCategoriesCount > 0 ? grandTotal / activeCategoriesCount : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = newCatName.trim();
    if (!formatted) return;

    if (categories.some(c => c.toLowerCase() === formatted.toLowerCase())) {
      setErrorMsg('La categoría ya existe');
      return;
    }

    onAddCategory(formatted);
    setNewCatName('');
    setIsAdding(false);
    setErrorMsg('');
  };

  return (
    <div className="flex flex-col gap-6 w-full py-2">
      <div className="px-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <h2 className="font-page-title text-forest-ink md:text-4xl leading-tight">
          Análisis de Gastos
        </h2>
        {expenses.length > 0 && (
          <div
            className="inline-flex bg-surface-container-low rounded-full p-0.5 border border-surface-container-high self-start"
            role="tablist"
            aria-label="Moneda del análisis"
          >
            {(['ARS', 'USD'] as const).map((code) => {
              const active = ledgerCurrency === code;
              return (
                <button
                  key={code}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setLedgerCurrency(code)}
                  className={`h-8 px-3.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                    active ? 'bg-forest-ink text-white' : 'text-fog hover:text-forest-ink'
                  }`}
                >
                  {code}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {ledgerExpenses.length === 0 ? (
        <div className="bg-white border border-surface-container-high rounded-[32px] p-8 text-center flex flex-col items-center justify-center gap-3">
          <PieChart className="w-10 h-10 text-fog stroke-[1.5px]" />
          <p className="font-section-title text-forest-ink">
            Sin datos en {ledgerCurrency}
          </p>
          <p className="type-meta max-w-sm leading-relaxed">
            Registrá un gasto en {ledgerCurrency} para ver el ranking por rubro.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-start w-full">
          
          <div className="lg:col-span-7 bg-white border border-surface-container-high rounded-[32px] p-5 md:p-7 flex flex-col gap-5">
            <div className="flex justify-between items-center pb-3 border-b border-surface-container gap-2">
              <span className="font-label-caps text-fog tracking-wider">Ranking de consumo</span>
              <span className="font-label-caps text-fog tracking-wider">Mayor → menor</span>
            </div>

            <div className="flex flex-col gap-5">
              {sortedCategories.map((cat, index) => {
                const barWidth = `${cat.pct}%`;
                const isHighest = index === 0 && cat.amount > 0;

                return (
                  <div key={cat.name} className="flex flex-col gap-2 group">
                    {/* Category Meta Row */}
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                          isHighest 
                            ? 'bg-lime-volt text-forest-ink' 
                            : 'bg-surface-container-low text-fog border border-surface-container-high'
                        }`}>
                          {index + 1}
                        </span>
                        
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isHighest ? 'bg-lime-volt/10 text-forest-ink' : 'bg-surface-container-low text-fog'}`}>
                          <CategoryIcon name={cat.name} className="w-3.5 h-3.5 stroke-[2px]" />
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-sm text-forest-ink leading-tight truncate">
                            {cat.name}
                          </span>
                          <span className="type-meta">
                            {cat.count} {cat.count === 1 ? 'gasto' : 'gastos'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-bold text-forest-ink tabular-nums">
                          {formatMoney(cat.amount, ledgerCurrency)}
                        </span>
                        <span className={`chip ${
                          isHighest ? 'bg-lime-volt text-forest-ink' : 'bg-surface-container-low text-fog'
                        }`}>
                          {cat.pct}%
                        </span>
                      </div>
                    </div>

                    {/* Clean Visual Indicator Bar (Strict colors: #87ea5c and 2 grays) */}
                    <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                      {cat.amount > 0 ? (
                        <motion.div 
                          className={`h-full rounded-full ${isHighest ? 'bg-lime-volt' : 'bg-fog'}`}
                          initial={{ width: 0 }}
                          animate={{ width: barWidth }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.05 }}
                        />
                      ) : (
                        <div className="h-full rounded-full bg-transparent w-0"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Derecha: promedio + rubros (sin card líder — ya está en ranking #1) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white border border-surface-container-high rounded-[28px] p-5 md:p-6 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="font-section-title text-forest-ink">
                  Promedio por rubro
                </h3>
                <div className="w-8 h-8 rounded-full bg-surface-container-low text-forest-ink flex items-center justify-center border border-surface-container-high">
                  <LineChart className="w-4 h-4 stroke-[2px]" />
                </div>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-black text-2xl text-forest-ink">
                  {formatMoney(Math.round(averageSpendPerCategory), ledgerCurrency)}
                </span>
                <span className="type-meta">/ rubro</span>
              </div>

              <div className="type-meta border-t border-surface-container pt-3 flex justify-between items-center">
                <span>Rubros activos</span>
                <span className="chip bg-surface-container text-forest-ink">
                  {activeCategoriesCount}
                </span>
              </div>
            </div>

            <div className="bg-white border border-surface-container-high rounded-[28px] p-5 md:p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-forest-ink">
                <Tag className="w-4 h-4 stroke-[2.5px]" />
                <span className="font-label-caps tracking-wider">Gestionar rubros</span>
              </div>

              <AnimatePresence mode="wait">
                {!isAdding ? (
                  <motion.button
                    key="add-category-trigger"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsAdding(true)}
                    className="btn-secondary w-full bg-surface-container-low text-forest-ink border border-surface-container-high hover:bg-surface-container"
                  >
                    <PlusCircle className="w-4 h-4 stroke-[2.5px]" />
                    Añadir rubro
                  </motion.button>
                ) : (
                  <motion.form
                    key="add-category-input-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex flex-col gap-1.5">
                      <input
                        type="text"
                        placeholder="Ej: Suscripciones, Regalos..."
                        value={newCatName}
                        onChange={(e) => {
                          setNewCatName(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        className="ui-input w-full bg-surface-container-low border border-surface-container-high rounded-full px-4 text-forest-ink placeholder-fog focus:outline-none focus:border-lime-volt focus:ring-2 focus:ring-lime-volt/20 transition-all"
                        maxLength={20}
                        autoFocus
                      />
                      {errorMsg && (
                        <span className="type-meta text-[#cf2929] px-1">
                          {errorMsg}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 justify-end items-center">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAdding(false);
                          setNewCatName('');
                          setErrorMsg('');
                        }}
                        className="h-10 px-3.5 text-fog hover:text-forest-ink font-label-caps cursor-pointer transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn-secondary hover:bg-forest-ink/90"
                      >
                        Guardar
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
