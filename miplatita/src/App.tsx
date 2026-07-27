import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  Receipt, 
  PieChart, 
  User, 
  Plus, 
  CheckCircle2, 
} from 'lucide-react';

import { Expense, ActiveTab } from './types';
import {
  INITIAL_EXPENSES,
  AVAILABLE_CATEGORIES,
  INITIAL_INCOME_ARS,
  INITIAL_INCOME_USD,
} from './data';
import { MainMetric } from './components/MainMetric';
import { StatCards } from './components/StatCards';
import { ExpenseTable } from './components/ExpenseTable';
import { AddExpenseModal } from './components/AddExpenseModal';
import { AnalisisView } from './components/AnalisisView';
import { PerfilView } from './components/PerfilView';
import { AppLockScreen } from './components/AppLockScreen';
import { shouldShowLockScreen } from './authStorage';
import {
  normalizeExpenses,
  sumAmount,
  sumAmountByStatus,
  percentageOf,
} from './ledger';
import {
  DEFAULT_PERIOD,
  buildPeriodOptions,
  PeriodIncomeMap,
} from './period';

const PERIOD_OPTIONS = buildPeriodOptions(DEFAULT_PERIOD);

function loadIncomeMap(): PeriodIncomeMap {
  const raw = localStorage.getItem('miplatita_incomes_by_period');
  if (raw) {
    try {
      return JSON.parse(raw) as PeriodIncomeMap;
    } catch {
      /* fall through */
    }
  }
  const arsLegacy = localStorage.getItem('miplatita_income_ars')
    ?? localStorage.getItem('miplatita_budget');
  const usdLegacy = localStorage.getItem('miplatita_income_usd');
  return {
    [DEFAULT_PERIOD]: {
      ars: arsLegacy ? parseFloat(arsLegacy) : INITIAL_INCOME_ARS,
      usd: usdLegacy ? parseFloat(usdLegacy) : INITIAL_INCOME_USD,
    },
  };
}

export default function App() {
  // --- STATE ---
  const [isLocked, setIsLocked] = useState(() => shouldShowLockScreen());

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    const saved = localStorage.getItem('miplatita_tab');
    return (saved as ActiveTab) || 'dashboard';
  });

  const [activePeriod, setActivePeriod] = useState<string>(() => {
    return localStorage.getItem('miplatita_period') || DEFAULT_PERIOD;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('miplatita_expenses');
    if (!saved) return INITIAL_EXPENSES;
    try {
      return normalizeExpenses(JSON.parse(saved));
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('miplatita_categories');
    return saved ? JSON.parse(saved) : AVAILABLE_CATEGORIES;
  });

  const [incomesByPeriod, setIncomesByPeriod] = useState<PeriodIncomeMap>(() => loadIncomeMap());

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [registrationToast, setRegistrationToast] = useState<'registered' | 'updated' | null>(null);

  const periodIncome = incomesByPeriod[activePeriod] ?? {
    ars: INITIAL_INCOME_ARS,
    usd: INITIAL_INCOME_USD,
  };
  const incomeARS = periodIncome.ars;
  const incomeUSD = periodIncome.usd;

  const periodExpenses = expenses.filter((e) => e.period === activePeriod);

  // --- PERSISTENCE EFFECT ---
  useEffect(() => {
    localStorage.setItem('miplatita_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('miplatita_period', activePeriod);
  }, [activePeriod]);

  useEffect(() => {
    localStorage.setItem('miplatita_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('miplatita_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('miplatita_incomes_by_period', JSON.stringify(incomesByPeriod));
    const current = incomesByPeriod[activePeriod];
    if (current) {
      localStorage.setItem('miplatita_income_ars', current.ars.toString());
      localStorage.setItem('miplatita_budget', current.ars.toString());
      localStorage.setItem('miplatita_income_usd', current.usd.toString());
    }
  }, [incomesByPeriod, activePeriod]);

  // --- FINANCIAL CALCULATIONS (periodo activo, ledgers paralelos) ---
  const spentARS = sumAmount(periodExpenses, 'ARS');
  const spentUSD = sumAmount(periodExpenses, 'USD');
  const paidARS = sumAmountByStatus(periodExpenses, 'ARS', 'paid');
  const paidUSD = sumAmountByStatus(periodExpenses, 'USD', 'paid');
  const pendingARS = sumAmountByStatus(periodExpenses, 'ARS', 'pending');
  const pendingUSD = sumAmountByStatus(periodExpenses, 'USD', 'pending');
  const percentageARS = percentageOf(spentARS, incomeARS);
  const percentageUSD = percentageOf(spentUSD, incomeUSD);

  // --- HANDLERS ---
  const handleSetExpenseStatus = (id: string, status: 'paid' | 'pending') => {
    setExpenses(prev => prev.map(exp => {
      if (exp.id !== id) return exp;
      return {
        ...exp,
        status,
        date: status === 'paid' ? 'Pagado hace poco' : 'Modificado hace poco',
      };
    }));
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const handleAddExpense = (newExpenseData: {
    title: string;
    category: string;
    amount: number;
    currency: 'ARS' | 'USD';
    status: 'paid' | 'pending';
    iconName: string;
  }) => {
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      title: newExpenseData.title,
      category: newExpenseData.category,
      amount: newExpenseData.amount,
      currency: newExpenseData.currency,
      period: activePeriod,
      date: 'Hoy, ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      status: newExpenseData.status,
      iconName: newExpenseData.iconName,
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const handleUpdateExpense = (
    id: string,
    data: {
      title: string;
      category: string;
      amount: number;
      currency: 'ARS' | 'USD';
      status: 'paid' | 'pending';
      iconName: string;
    },
  ) => {
    setExpenses(prev => prev.map(exp => {
      if (exp.id !== id) return exp;
      return {
        ...exp,
        title: data.title,
        category: data.category,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        iconName: data.iconName,
        date: 'Modificado hace poco',
      };
    }));
  };

  const handleOpenAddExpense = () => {
    setEditingExpense(null);
    setIsAddExpenseOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsAddExpenseOpen(true);
  };

  const handleCloseExpenseModal = () => {
    setIsAddExpenseOpen(false);
    setEditingExpense(null);
  };

  const handleAddCategory = (categoryName: string) => {
    if (!categories.includes(categoryName)) {
      setCategories(prev => [...prev, categoryName]);
    }
  };

  const handleResetDemoData = () => {
    setExpenses(INITIAL_EXPENSES);
    setCategories(AVAILABLE_CATEGORIES);
    setActivePeriod(DEFAULT_PERIOD);
    setIncomesByPeriod({
      [DEFAULT_PERIOD]: { ars: INITIAL_INCOME_ARS, usd: INITIAL_INCOME_USD },
    });
  };

  const handleUpdateIncomeARS = (value: number) => {
    setIncomesByPeriod((prev) => ({
      ...prev,
      [activePeriod]: {
        ars: value,
        usd: prev[activePeriod]?.usd ?? INITIAL_INCOME_USD,
      },
    }));
  };

  const handleUpdateIncomeUSD = (value: number) => {
    setIncomesByPeriod((prev) => ({
      ...prev,
      [activePeriod]: {
        ars: prev[activePeriod]?.ars ?? INITIAL_INCOME_ARS,
        usd: value,
      },
    }));
  };

  const handleChangePeriod = (periodKey: string) => {
    setActivePeriod(periodKey);
    setIncomesByPeriod((prev) => {
      if (prev[periodKey]) return prev;
      return {
        ...prev,
        [periodKey]: { ars: INITIAL_INCOME_ARS, usd: INITIAL_INCOME_USD },
      };
    });
  };

  const showExpenseToast = (kind: 'registered' | 'updated') => {
    setRegistrationToast(kind);
    window.setTimeout(() => setRegistrationToast(null), 2500);
  };

  if (isLocked) {
    return <AppLockScreen onUnlocked={() => setIsLocked(false)} />;
  }

  return (
    <div className="bg-surface min-h-screen text-on-surface font-sans flex flex-col selection:bg-lime-volt selection:text-forest-ink">
      
      {/* 1. Header Navigation Bar (Responsive layout) */}
      <header className="sticky top-0 z-40 bg-white border-b border-surface-container-high w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-3">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-lime-volt text-forest-ink rounded-full flex items-center justify-center font-display font-black text-sm">
              P
            </div>
            <h1 className="font-display font-black text-lg md:text-xl tracking-tighter text-forest-ink">
              MiPlatita
            </h1>
          </div>

          {/* Desktop Navigation Link Tabs */}
          <nav className="hidden md:flex items-center bg-surface-container-low border border-surface-container rounded-full p-0.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 lg:px-4 py-1.5 rounded-full font-label-caps text-[11px] transition-all cursor-pointer ${
                activeTab === 'dashboard' 
                  ? 'bg-forest-ink text-white shadow-none' 
                  : 'text-fog hover:text-forest-ink'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('gastos')}
              className={`px-3.5 lg:px-4 py-1.5 rounded-full font-label-caps text-[11px] transition-all cursor-pointer ${
                activeTab === 'gastos' 
                  ? 'bg-forest-ink text-white shadow-none' 
                  : 'text-fog hover:text-forest-ink'
              }`}
            >
              Gastos ({expenses.length})
            </button>
            <button
              onClick={() => setActiveTab('analisis')}
              className={`px-3.5 lg:px-4 py-1.5 rounded-full font-label-caps text-[11px] transition-all cursor-pointer ${
                activeTab === 'analisis' 
                  ? 'bg-forest-ink text-white shadow-none' 
                  : 'text-fog hover:text-forest-ink'
              }`}
            >
              Análisis
            </button>
            <button
              onClick={() => setActiveTab('perfil')}
              className={`px-3.5 lg:px-4 py-1.5 rounded-full font-label-caps text-[11px] transition-all cursor-pointer ${
                activeTab === 'perfil' 
                  ? 'bg-forest-ink text-white shadow-none' 
                  : 'text-fog hover:text-forest-ink'
              }`}
            >
              Perfil
            </button>
          </nav>

          {/* Quick Stats Summary / Actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={handleOpenAddExpense}
              className="btn-primary btn-primary-md hover:bg-forest-ink/90 !min-h-10 !px-4 text-[11px]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3px]" />
              Registrar gasto
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8 pb-24 md:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col gap-6 md:gap-8"
          >
            {activeTab === 'dashboard' && (
              /* --- DASHBOARD VIEW --- */
              <>
                {/* User Greeting & Period Header */}
                <div className="flex flex-row items-end justify-between gap-3 px-1">
                  <h2 className="font-page-title text-forest-ink md:text-4xl min-w-0">
                    Hola, Jime
                  </h2>
                  <div className="relative shrink-0 mb-1">
                    <select
                      id="dashboard-period"
                      aria-label="Período"
                      value={activePeriod}
                      onChange={(e) => handleChangePeriod(e.target.value)}
                      className="chip appearance-none cursor-pointer bg-surface-container-low text-forest-ink border border-surface-container-high pr-8 pl-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-lime-volt focus:ring-2 focus:ring-lime-volt/20 transition-all"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23083400' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 10px center',
                        backgroundSize: '12px',
                      }}
                    >
                      {PERIOD_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-stretch">
                  <div className="h-full">
                    <MainMetric
                      spentARS={spentARS}
                      incomeARS={incomeARS}
                      percentageARS={percentageARS}
                      spentUSD={spentUSD}
                      incomeUSD={incomeUSD}
                      percentageUSD={percentageUSD}
                    />
                  </div>
                  <div className="flex items-center h-full">
                    <StatCards
                      totalGastosARS={spentARS}
                      totalGastosUSD={spentUSD}
                      incomeARS={incomeARS}
                      incomeUSD={incomeUSD}
                      totalPaidARS={paidARS}
                      totalPaidUSD={paidUSD}
                      totalPendingARS={pendingARS}
                      totalPendingUSD={pendingUSD}
                      savingsARS={incomeARS - spentARS}
                      savingsUSD={incomeUSD - spentUSD}
                    />
                  </div>
                </div>

                {/* Preview: últimos 6 gastos + Ver más → tab Gastos */}
                <div className="w-full flex flex-col gap-6">
                  <ExpenseTable
                    variant="preview"
                    expenses={periodExpenses}
                    onConfirmPayment={(id) => handleSetExpenseStatus(id, 'paid')}
                    onMarkPending={(id) => handleSetExpenseStatus(id, 'pending')}
                    onEditExpense={handleEditExpense}
                    onDeleteExpense={handleDeleteExpense}
                    onResetDemoData={handleResetDemoData}
                    onOpenAddExpense={handleOpenAddExpense}
                    onViewMore={() => setActiveTab('gastos')}
                  />
                </div>
              </>
            )}

            {activeTab === 'gastos' && (
              /* --- GASTOS VIEW --- */
              <div className="w-full">
                <ExpenseTable
                  variant="full"
                  expenses={periodExpenses}
                  onConfirmPayment={(id) => handleSetExpenseStatus(id, 'paid')}
                  onMarkPending={(id) => handleSetExpenseStatus(id, 'pending')}
                  onEditExpense={handleEditExpense}
                  onDeleteExpense={handleDeleteExpense}
                  onResetDemoData={handleResetDemoData}
                  onOpenAddExpense={handleOpenAddExpense}
                />
              </div>
            )}

            {activeTab === 'analisis' && (
              /* --- ANALISIS VIEW --- */
              <AnalisisView
                expenses={periodExpenses}
                categories={categories}
                onAddCategory={handleAddCategory}
              />
            )}

            {activeTab === 'perfil' && (
              /* --- PERFIL VIEW --- */
              <PerfilView
                incomeARS={incomeARS}
                incomeUSD={incomeUSD}
                onUpdateIncomeARS={handleUpdateIncomeARS}
                onUpdateIncomeUSD={handleUpdateIncomeUSD}
                expensesCount={periodExpenses.length}
                activePeriod={activePeriod}
                periodOptions={PERIOD_OPTIONS}
                onChangePeriod={handleChangePeriod}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom nav mobile — tipografía/iconos compactos; desktop usa header */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-[58px] px-2 pb-1.5 pt-1 bg-white border-t border-surface-container-high shadow-[0_-4px_16px_rgba(8,52,0,0.05)] rounded-t-2xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors w-14 cursor-pointer ${
            activeTab === 'dashboard' ? 'text-forest-ink' : 'text-fog'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="text-[9px] font-semibold uppercase tracking-wide">Inicio</span>
        </button>
        
        <button
          onClick={() => setActiveTab('gastos')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors w-14 cursor-pointer ${
            activeTab === 'gastos' ? 'text-forest-ink' : 'text-fog'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span className="text-[9px] font-semibold uppercase tracking-wide">Gastos</span>
        </button>

        <button
          onClick={handleOpenAddExpense}
          className="w-11 h-11 bg-forest-ink text-white rounded-full flex items-center justify-center -translate-y-2.5 shadow-md border border-forest-ink active:scale-95 cursor-pointer shrink-0"
          aria-label="Registrar gasto"
        >
          <Plus className="w-5 h-5 stroke-[3px]" />
        </button>

        <button
          onClick={() => setActiveTab('analisis')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors w-14 cursor-pointer ${
            activeTab === 'analisis' ? 'text-forest-ink' : 'text-fog'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span className="text-[9px] font-semibold uppercase tracking-wide">Análisis</span>
        </button>

        <button
          onClick={() => setActiveTab('perfil')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors w-14 cursor-pointer ${
            activeTab === 'perfil' ? 'text-forest-ink' : 'text-fog'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[9px] font-semibold uppercase tracking-wide">Perfil</span>
        </button>
      </nav>

      {/* Add / Edit Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={handleCloseExpenseModal}
        categories={categories}
        editingExpense={editingExpense}
        onAddExpense={handleAddExpense}
        onUpdateExpense={handleUpdateExpense}
        onRegistered={() => showExpenseToast('registered')}
        onUpdated={() => showExpenseToast('updated')}
      />

      {/* Confirmación post-registro / edición */}
      <AnimatePresence>
        {registrationToast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-forest-ink text-white chip-lg shadow-lg pointer-events-none"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5px] text-lime-volt" />
            <span className="font-label-caps">
              {registrationToast === 'updated' ? 'Gasto actualizado' : 'Gasto registrado'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
