export type CurrencyCode = 'ARS' | 'USD';

export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  currency: CurrencyCode;
  /** Mes contable `YYYY-MM` */
  period: string;
  date: string;
  status: 'paid' | 'pending';
  iconName: string; // Lucide icon identifier
}

export interface Category {
  id: string;
  name: string;
  percentage: number;
  color: string; // hex or tailwind class
  limit?: number;
}

export type ActiveTab = 'dashboard' | 'gastos' | 'analisis' | 'perfil';
