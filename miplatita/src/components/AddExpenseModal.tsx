import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, DollarSign, AlertTriangle } from 'lucide-react';
import { CATEGORY_ICONS } from '../data';
import { Expense, CurrencyCode } from '../types';

export type ExpenseFormData = {
  title: string;
  category: string;
  amount: number;
  currency: CurrencyCode;
  status: 'paid' | 'pending';
  iconName: string;
};

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  editingExpense?: Expense | null;
  onAddExpense: (expense: ExpenseFormData) => void;
  onUpdateExpense: (id: string, expense: ExpenseFormData) => void;
  onRegistered?: () => void;
  onUpdated?: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  categories,
  editingExpense = null,
  onAddExpense,
  onUpdateExpense,
  onRegistered,
  onUpdated,
}) => {
  const isEditing = Boolean(editingExpense);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('ARS');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'paid' | 'pending'>('pending');
  const [errorMsg, setErrorMsg] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    setErrorMsg('');
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(String(editingExpense.amount));
      setCurrency(editingExpense.currency);
      setCategory(editingExpense.category);
      setStatus(editingExpense.status);
    } else {
      setTitle('');
      setAmount('');
      setCurrency('ARS');
      setStatus('pending');
      const defaultCategory = categories.includes('Otros')
        ? 'Otros'
        : categories[0] || 'Otros';
      setCategory(defaultCategory);
    }
    setTimeout(() => titleRef.current?.focus(), 100);
  }, [isOpen, categories, editingExpense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const formattedTitle = title.trim();
    const numericAmount = parseFloat(amount.replace(',', '.'));

    if (!formattedTitle) {
      setErrorMsg('Ingresá el nombre del gasto');
      return;
    }

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg('Ingresá un monto mayor a 0');
      return;
    }

    if (!category) {
      setErrorMsg('Seleccioná una categoría');
      return;
    }

    const iconName = CATEGORY_ICONS[category] || 'CircleDollarSign';
    const payload: ExpenseFormData = {
      title: formattedTitle,
      category,
      amount: numericAmount,
      currency,
      status,
      iconName,
    };

    if (editingExpense) {
      onUpdateExpense(editingExpense.id, payload);
      onUpdated?.();
    } else {
      onAddExpense(payload);
      onRegistered?.();
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-forest-ink/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="bg-white border border-surface-container-high w-full max-w-lg relative overflow-hidden flex flex-col shadow-2xl z-10 rounded-t-[32px] sm:rounded-[32px]"
          >
            <div className="bg-white p-5 md:p-6 border-b border-surface-container-high flex justify-between items-center">
              <div>
                <span className="chip bg-lime-volt text-forest-ink font-label-caps mb-1.5 inline-flex">
                  Datos demo
                </span>
                <h3 className="font-section-title text-forest-ink md:text-[1.375rem]">
                  {isEditing ? 'Editar gasto' : 'Registrar Gasto'}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-fog hover:text-forest-ink bg-surface-container-low hover:bg-surface-container p-2 rounded-full transition-all duration-200 cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 stroke-[2.5px]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 md:p-6 flex flex-col gap-4">
              {errorMsg && (
                <div className="bg-[#cf2929]/5 border border-[#cf2929]/20 text-[#cf2929] px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="expense-title" className="font-label-caps text-fog tracking-wider">
                  Nombre del gasto
                </label>
                <input
                  ref={titleRef}
                  id="expense-title"
                  type="text"
                  placeholder="Ej: Supermercado, Netflix…"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={40}
                  className="ui-input w-full bg-surface-container-low border border-surface-container-high rounded-full px-4 text-forest-ink placeholder-fog/70 focus:outline-none focus:border-lime-volt focus:ring-2 focus:ring-lime-volt/20 transition-all"
                  autoComplete="off"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="font-label-caps text-fog tracking-wider">Moneda</span>
                <div className="grid grid-cols-2 gap-1 bg-surface-container-low p-1 rounded-full border border-surface-container-high">
                  <button
                    type="button"
                    onClick={() => setCurrency('ARS')}
                    className={`rounded-full font-label-caps transition-all cursor-pointer min-h-11 ${
                      currency === 'ARS'
                        ? 'bg-forest-ink text-white'
                        : 'text-fog hover:text-forest-ink'
                    }`}
                  >
                    ARS
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('USD')}
                    className={`rounded-full font-label-caps transition-all cursor-pointer min-h-11 ${
                      currency === 'USD'
                        ? 'bg-forest-ink text-white'
                        : 'text-fog hover:text-forest-ink'
                    }`}
                  >
                    USD
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="expense-amount" className="font-label-caps text-fog tracking-wider">
                  Monto ({currency === 'USD' ? 'US$' : '$ ARS'})
                </label>
                <div className="relative flex items-center">
                  <DollarSign className="absolute left-4 w-5 h-5 text-forest-ink pointer-events-none stroke-[2.5px]" />
                  <input
                    id="expense-amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="ui-input-hero w-full bg-surface-container-low border border-surface-container-high rounded-full pl-12 pr-5 text-forest-ink font-display focus:outline-none focus:border-lime-volt focus:ring-2 focus:ring-lime-volt/20 transition-all"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="expense-category" className="font-label-caps text-fog tracking-wider">
                  Categoría
                </label>
                <select
                  id="expense-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="ui-input w-full bg-surface-container-low border border-surface-container-high rounded-full px-4 text-forest-ink focus:outline-none focus:border-lime-volt focus:ring-2 focus:ring-lime-volt/20 transition-all cursor-pointer appearance-none"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23083400' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    backgroundSize: '14px',
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="font-label-caps text-fog tracking-wider">
                  Estado de pago
                </span>
                <div className="grid grid-cols-2 gap-1 bg-surface-container-low p-1 rounded-full border border-surface-container-high">
                  <button
                    type="button"
                    onClick={() => setStatus('paid')}
                    className={`rounded-full font-label-caps transition-all cursor-pointer min-h-11 ${
                      status === 'paid'
                        ? 'bg-forest-ink text-white'
                        : 'text-fog hover:text-forest-ink'
                    }`}
                  >
                    Pagado
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('pending')}
                    className={`rounded-full font-label-caps transition-all cursor-pointer min-h-11 ${
                      status === 'pending'
                        ? 'bg-forest-ink text-white'
                        : 'text-fog hover:text-forest-ink'
                    }`}
                  >
                    Se debe pagar
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full hover:bg-forest-ink/90">
                {isEditing ? 'Guardar cambios' : 'Registrar gasto'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
