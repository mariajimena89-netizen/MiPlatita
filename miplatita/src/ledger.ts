import { Expense, CurrencyCode } from './types';
import { DEFAULT_PERIOD } from './period';

/** Migra gastos viejos sin `currency`/`period`. */
export function normalizeExpenses(raw: unknown): Expense[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const e = item as Partial<Expense> & { amount?: number };
    const currency: CurrencyCode =
      e.currency === 'USD' || e.currency === 'ARS' ? e.currency : 'ARS';
    return {
      id: String(e.id ?? `exp-${Date.now()}`),
      title: String(e.title ?? 'Gasto'),
      category: String(e.category ?? 'Otros'),
      amount: typeof e.amount === 'number' ? e.amount : 0,
      currency,
      period: typeof e.period === 'string' && /^\d{4}-\d{2}$/.test(e.period)
        ? e.period
        : DEFAULT_PERIOD,
      date: String(e.date ?? ''),
      status: e.status === 'paid' || e.status === 'pending' ? e.status : 'pending',
      iconName: String(e.iconName ?? 'CircleDollarSign'),
    };
  });
}

export function sumAmount(expenses: Expense[], currency: CurrencyCode): number {
  return expenses
    .filter((e) => e.currency === currency)
    .reduce((sum, e) => sum + e.amount, 0);
}

export function sumAmountByStatus(
  expenses: Expense[],
  currency: CurrencyCode,
  status: 'paid' | 'pending',
): number {
  return expenses
    .filter((e) => e.currency === currency && e.status === status)
    .reduce((sum, e) => sum + e.amount, 0);
}

export function percentageOf(spent: number, income: number): number {
  if (income <= 0) return 0;
  return Math.round((spent / income) * 100);
}
