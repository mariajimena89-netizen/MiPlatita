import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Tag, 
  Sparkles,
  Home,
  Car,
  Tv,
  Zap,
  ShoppingBag,
  Activity,
  CircleDollarSign
} from 'lucide-react';
import { Expense } from '../types';
import { formatARS } from '../formatCurrency';

// Category icon helper mapping to lucide-react icons
const CategoryIcon: React.FC<{ name: string; className?: string }> = ({ name, className = "w-5 h-5" }) => {
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

interface CategoryAnalysisProps {
  expenses: Expense[];
  onAddCategory: (categoryName: string) => void;
  categories: string[];
}

export const CategoryAnalysis: React.FC<CategoryAnalysisProps> = ({
  expenses,
  onAddCategory,
  categories,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Calculate sum of all expenses
  const grandTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // 2. Count expenses and sum amounts per category
  const categoryTotals = categories.reduce((acc, cat) => {
    acc[cat] = { amount: 0, count: 0 };
    return acc;
  }, {} as Record<string, { amount: number; count: number }>);

  expenses.forEach(exp => {
    if (categoryTotals[exp.category] !== undefined) {
      categoryTotals[exp.category].amount += exp.amount;
      categoryTotals[exp.category].count += 1;
    } else {
      categoryTotals[exp.category] = { amount: exp.amount, count: 1 };
    }
  });

  // Calculate percentages and sort descending by amount
  const sortedCategories = (Object.keys(categoryTotals) as string[])
    .map((name) => {
      const { amount, count } = categoryTotals[name];
      const pct = grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0;
      return { name, amount, count, pct };
    })
    .sort((a, b) => b.amount - a.amount);

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

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Title section with aesthetic tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div className="flex flex-col">
          <span className="font-label-caps text-xs text-fog tracking-wider block mb-1">DISTRIBUCIÓN DE PLATITA</span>
          <h3 className="font-display font-black text-2xl md:text-3xl text-forest-ink leading-tight">
            Análisis por Rubro
          </h3>
        </div>
        
        {/* Dynamic overall stats pill */}
        <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full border border-surface-container-high w-fit">
          <Sparkles className="w-4 h-4 text-lime-volt" />
          <span className="font-label-caps text-xs text-forest-ink font-bold">
            {categories.length} Rubros Activos
          </span>
        </div>
      </div>

      {/* Grid of category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {sortedCategories.map((cat, index) => {
          const barWidth = `${cat.pct}%`;

          return (
            <motion.div
              key={cat.name}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-20px" }}
              whileHover={{ y: -4 }}
              className="group relative bg-white border border-surface-container-high hover:border-lime-volt rounded-3xl p-5 flex flex-col justify-between gap-5 transition-all duration-300"
              style={{ minHeight: '176px' }}
            >
              {/* Card top row */}
              <div className="flex justify-between items-start">
                {/* Icon in soft gray circle that turns lime-volt on hover */}
                <div className="w-10 h-10 rounded-full bg-surface-container-low group-hover:bg-lime-volt text-forest-ink flex items-center justify-center transition-colors duration-300">
                  <CategoryIcon name={cat.name} className="w-5 h-5 stroke-[2px]" />
                </div>
                
                {/* Strict Palette Percent Badge (#87ea5c with 2 grays) */}
                {cat.pct > 0 ? (
                  <span className="bg-lime-volt text-forest-ink font-label-caps text-xs px-2.5 py-1 rounded-full font-extrabold tracking-tight">
                    {cat.pct}%
                  </span>
                ) : (
                  <span className="bg-surface-container text-fog font-label-caps text-xs px-2.5 py-1 rounded-full font-bold tracking-tight">
                    0%
                  </span>
                )}
              </div>

              {/* Card body content */}
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-col">
                  <span className="font-display font-bold text-lg text-forest-ink leading-tight group-hover:text-forest-ink/90">
                    {cat.name}
                  </span>
                  <span className="text-xs font-semibold text-fog">
                    {cat.count === 0 
                      ? 'Sin gastos este mes' 
                      : cat.count === 1 
                        ? '1 gasto registrado' 
                        : `${cat.count} gastos registrados`
                    }
                  </span>
                </div>

                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-display font-black text-2xl text-forest-ink">
                    {formatARS(cat.amount)}
                  </span>
                </div>
              </div>

              {/* Strict Palette Custom Flat Bar Meter at the very bottom */}
              <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden p-0.5">
                {cat.amount > 0 ? (
                  <motion.div 
                    className="h-full rounded-full bg-lime-volt"
                    initial={{ width: 0 }}
                    animate={{ width: barWidth }}
                    transition={{ duration: 1, ease: "easeOut", delay: index * 0.05 }}
                  />
                ) : (
                  <div className="h-full rounded-full bg-transparent w-0"></div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Dynamic Interactive Category Adding Card */}
        <div className="w-full" style={{ minHeight: '176px' }}>
          <AnimatePresence mode="wait">
            {!isAdding ? (
              <motion.button
                key="add-button-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setIsAdding(true)}
                className="w-full h-full border-2 border-dashed border-surface-container-highest hover:border-lime-volt hover:bg-lime-volt/5 text-forest-ink rounded-3xl p-5 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer font-label-caps text-xs font-bold"
              >
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-surface-container-highest group-hover:border-lime-volt flex items-center justify-center">
                  <Plus className="w-5 h-5 text-forest-ink stroke-[3px]" />
                </div>
                AÑADIR RUBRO
              </motion.button>
            ) : (
              <motion.form
                key="add-form-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubmit}
                className="w-full h-full bg-white border border-lime-volt rounded-3xl p-5 flex flex-col justify-between gap-3"
              >
                <div className="flex items-center gap-2 text-forest-ink">
                  <Tag className="w-4 h-4 text-forest-ink" />
                  <span className="font-label-caps text-xs font-bold">NUEVO RUBRO</span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Ej: Suscripciones, Regalos..."
                    value={newCatName}
                    onChange={(e) => {
                      setNewCatName(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="w-full h-10 bg-surface-container-low border border-surface-container-high rounded-full px-4 text-sm text-forest-ink placeholder-fog focus:outline-none focus:border-lime-volt focus:ring-1 focus:ring-lime-volt"
                    maxLength={20}
                    autoFocus
                  />
                  
                  {errorMsg && (
                    <p className="text-xs text-[#cf2929] font-semibold">
                      {errorMsg}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setNewCatName('');
                      setErrorMsg('');
                    }}
                    className="px-3.5 py-1.5 bg-surface-container-low text-forest-ink rounded-full cursor-pointer hover:bg-surface-container-high font-label-caps text-xs transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-forest-ink hover:bg-forest-ink/90 text-white rounded-full cursor-pointer font-label-caps text-xs font-bold flex items-center gap-1 transition-colors"
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
  );
};
