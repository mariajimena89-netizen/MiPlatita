import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Trash2,
  Pencil,
  RotateCcw,
  ArrowRight,
  Home,
  Car,
  Tv,
  Zap,
  ShoppingBag,
  Activity,
  Smartphone,
  CircleDollarSign,
} from 'lucide-react';
import { Expense, CurrencyCode } from '../types';
import { formatMoney } from '../formatCurrency';

const PREVIEW_LIMIT = 6;

const rowGridClass =
  'grid items-center gap-x-2 min-w-0 w-full [grid-template-columns:minmax(0,1.4fr)_minmax(0,0.7fr)_5.5rem_9.25rem]';

const IconRenderer: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-3.5 h-3.5' }) => {
  switch (name) {
    case 'Home': return <Home className={className} />;
    case 'Car': return <Car className={className} />;
    case 'Tv': return <Tv className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'ShoppingBag': return <ShoppingBag className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Smartphone': return <Smartphone className={className} />;
    default: return <CircleDollarSign className={className} />;
  }
};

interface ExpenseTableProps {
  expenses: Expense[];
  onConfirmPayment: (id: string) => void;
  onMarkPending: (id: string) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  onResetDemoData: () => void;
  onOpenAddExpense: () => void;
  variant?: 'preview' | 'full';
  onViewMore?: () => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  onConfirmPayment,
  onMarkPending,
  onEditExpense,
  onDeleteExpense,
  onResetDemoData,
  onOpenAddExpense,
  variant = 'full',
  onViewMore,
}) => {
  const isPreview = variant === 'preview';
  const [ledgerCurrency, setLedgerCurrency] = useState<CurrencyCode>('ARS');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const ledgerExpenses = expenses.filter((e) => e.currency === ledgerCurrency);
  const categoriesPresent: string[] = Array.from(new Set(ledgerExpenses.map(e => e.category)));

  const filteredExpenses = ledgerExpenses.filter(expense => {
    if (isPreview) return true;
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const visibleExpenses = isPreview
    ? filteredExpenses.slice(0, PREVIEW_LIMIT)
    : filteredExpenses;

  const currencyTabs = (
    <div
      className="inline-flex bg-surface-container-low rounded-full p-0.5 border border-surface-container-high"
      role="tablist"
      aria-label="Moneda del listado"
    >
      {(['ARS', 'USD'] as const).map((code) => {
        const active = ledgerCurrency === code;
        const count = expenses.filter((e) => e.currency === code).length;
        return (
          <button
            key={code}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => {
              setLedgerCurrency(code);
              setCategoryFilter('all');
            }}
            className={`h-8 px-3.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
              active ? 'bg-forest-ink text-white' : 'text-fog hover:text-forest-ink'
            }`}
          >
            {code}
            <span className={`ml-1.5 tabular-nums ${active ? 'text-white/70' : 'text-fog/70'}`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );

  const statusToggle = (expense: Expense, isPaid: boolean) => (
    <button
      type="button"
      role="switch"
      aria-checked={isPaid}
      onClick={() => (isPaid ? onMarkPending(expense.id) : onConfirmPayment(expense.id))}
      title={isPaid ? 'Marcar como pendiente' : 'Marcar como pagado'}
      className={`inline-flex items-center justify-center h-7 w-[4.75rem] rounded-full text-[11px] font-semibold transition-colors cursor-pointer active:scale-[0.98] shrink-0 ${
        isPaid
          ? 'bg-[#008026]/12 text-[#008026] border border-[#008026]/25 hover:bg-[#008026]/20'
          : 'bg-[#cf2929]/10 text-[#cf2929] border border-[#cf2929]/25 hover:bg-[#cf2929]/15'
      }`}
    >
      {isPaid ? 'Pagado' : 'Pendiente'}
    </button>
  );

  const rowActions = (expense: Expense, isPaid: boolean) => (
    <div className="flex items-center gap-1 shrink-0">
      {statusToggle(expense, isPaid)}
      <button
        type="button"
        onClick={() => onEditExpense(expense)}
        title="Editar"
        aria-label="Editar gasto"
        className="p-1.5 text-fog/70 hover:text-forest-ink rounded-full cursor-pointer"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onDeleteExpense(expense.id)}
        title="Eliminar"
        aria-label="Eliminar gasto"
        className="p-1.5 text-fog/70 hover:text-[#cf2929] rounded-full cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h3 className={isPreview
            ? 'font-section-title text-forest-ink md:text-[1.375rem]'
            : 'font-page-title text-forest-ink md:text-4xl'
          }>
            {isPreview ? 'Registro de Gastos' : 'Todos los gastos'}
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {expenses.length > 0 && currencyTabs}
          {!isPreview && expenses.length > 0 && (
            <button
              type="button"
              onClick={onResetDemoData}
              className="shrink-0 px-2.5 py-2 text-fog hover:text-forest-ink font-label-caps rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Restablecer
            </button>
          )}
        </div>
      </div>

      {!isPreview && ledgerExpenses.length > 0 && (
        <div className="w-full rounded-xl border border-surface-container-high bg-surface-container-low/70 p-3 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fog pointer-events-none" />
            <input
              id="gastos-search"
              type="text"
              placeholder="Buscar…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ui-filter-control w-full bg-white border border-surface-container-high rounded-full pl-9 pr-3 text-forest-ink placeholder-fog/70 focus:outline-none focus:border-lime-volt focus:ring-2 focus:ring-lime-volt/20 transition-all"
            />
          </div>

          <div className="flex gap-2 items-center">
            <div
              className="inline-flex flex-1 min-w-0 bg-white rounded-full p-0.5 border border-surface-container-high ui-filter-control items-center"
              role="group"
              aria-label="Filtrar por estado"
            >
              {(
                [
                  { id: 'all' as const, label: 'Todos' },
                  { id: 'paid' as const, label: 'Pagados' },
                  { id: 'pending' as const, label: 'Pendientes' },
                ]
              ).map((opt) => {
                const active = statusFilter === opt.id;
                const activeClass =
                  opt.id === 'paid'
                    ? 'bg-[#008026] text-white'
                    : opt.id === 'pending'
                      ? 'bg-[#cf2929] text-white'
                      : 'bg-forest-ink text-white';
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStatusFilter(opt.id)}
                    className={`flex-1 h-9 px-2 text-xs font-semibold rounded-full transition-all cursor-pointer text-center truncate ${
                      active ? activeClass : 'text-fog hover:text-forest-ink'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <select
              id="gastos-category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Categoría"
              className="ui-filter-control w-[38%] max-w-[148px] px-3 pr-8 bg-white border border-surface-container-high rounded-full text-forest-ink focus:outline-none focus:border-lime-volt focus:ring-2 focus:ring-lime-volt/20 cursor-pointer appearance-none transition-all shrink-0"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2358717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '12px',
              }}
            >
              <option value="all">Categoría</option>
              {categoriesPresent.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="bg-white border border-surface-container-high overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          {expenses.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-5 py-8 text-center flex flex-col items-center gap-4"
            >
              <div className="w-12 h-12 bg-lime-volt/20 rounded-full flex items-center justify-center text-forest-ink">
                <CircleDollarSign className="w-6 h-6 stroke-[2px]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-forest-ink">Sin gastos</h4>
                <p className="type-meta mt-1">Registrá uno para empezar.</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={onOpenAddExpense} className="btn-secondary hover:bg-forest-ink/90">
                  Registrar
                </button>
                <button
                  type="button"
                  onClick={onResetDemoData}
                  className="btn-secondary bg-surface-container text-forest-ink hover:bg-surface-container-high"
                >
                  Demo
                </button>
              </div>
            </motion.div>
          ) : ledgerExpenses.length === 0 ? (
            <motion.div
              key={`empty-${ledgerCurrency}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-7 text-center"
            >
              <p className="type-meta">
                No hay gastos en {ledgerCurrency}. Registrá uno en esa moneda.
              </p>
            </motion.div>
          ) : visibleExpenses.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-7 text-center"
            >
              <p className="type-meta">No hay gastos con esos filtros.</p>
            </motion.div>
          ) : (
            <>
              {/* Grilla fija: Título | Categoría | Precio | Acciones (misma en md+) */}
              <div key="expense-grid">
                <div
                  className={`hidden md:grid px-4 py-3 border-b border-surface-container-high bg-surface-container-low ${rowGridClass}`}
                >
                  <span className="font-label-caps text-[10px] text-fog tracking-wider">Título</span>
                  <span className="font-label-caps text-[10px] text-fog tracking-wider">Categoría</span>
                  <span className="font-label-caps text-[10px] text-fog tracking-wider text-right">Precio</span>
                  <span className="font-label-caps text-[10px] text-fog tracking-wider text-right pl-1">Acciones</span>
                </div>

                <ul className="divide-y divide-surface-container">
                  {visibleExpenses.map((expense) => {
                    const isPaid = expense.status === 'paid';
                    return (
                      <motion.li
                        key={expense.id}
                        layoutId={`expense-row-${expense.id}`}
                        className={`px-3 md:px-4 py-3 hover:bg-surface-container-low/40 ${rowGridClass}`}
                      >
                        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                          <div className="hidden md:flex w-7 h-7 rounded-full bg-surface-container-low items-center justify-center text-forest-ink shrink-0">
                            <IconRenderer name={expense.iconName} className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-[13px] font-semibold text-forest-ink truncate leading-tight min-w-0">
                            {expense.title}
                          </p>
                        </div>
                        <span className="text-[10px] text-fog truncate min-w-0">
                          {expense.category}
                        </span>
                        <span className="text-sm font-bold text-forest-ink tabular-nums text-right whitespace-nowrap">
                          {formatMoney(expense.amount, ledgerCurrency)}
                        </span>
                        <div className="flex justify-end min-w-0">
                          {rowActions(expense, isPaid)}
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>

      {isPreview && ledgerExpenses.length > 0 && onViewMore && (
        <div className="flex justify-center">
          <button type="button" onClick={onViewMore} className="btn-secondary hover:bg-forest-ink/90">
            Ver más
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5px]" />
          </button>
        </div>
      )}
    </div>
  );
};
