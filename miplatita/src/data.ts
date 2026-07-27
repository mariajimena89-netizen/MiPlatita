import { Expense } from './types';

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    title: 'Alquiler Departamento',
    category: 'Vivienda',
    amount: 850,
    currency: 'ARS',
    period: '2026-07',
    date: 'Hoy, 09:00 AM',
    status: 'paid',
    iconName: 'Home',
  },
  {
    id: 'exp-2',
    title: 'Membresía Netflix',
    category: 'Ocio',
    amount: 15,
    currency: 'USD',
    period: '2026-07',
    date: 'Hace 2 días',
    status: 'pending',
    iconName: 'Tv',
  },
  {
    id: 'exp-3',
    title: 'Seguro del Coche',
    category: 'Transporte',
    amount: 120,
    currency: 'ARS',
    period: '2026-07',
    date: 'Ayer',
    status: 'paid',
    iconName: 'Car',
  },
  {
    id: 'exp-4',
    title: 'Internet Fibra 1GB',
    category: 'Servicios',
    amount: 45,
    currency: 'ARS',
    period: '2026-07',
    date: '10 Jul 2026',
    status: 'paid',
    iconName: 'Zap',
  },
  {
    id: 'exp-5',
    title: 'Supermercado Semanal',
    category: 'Alimentación',
    amount: 230,
    currency: 'ARS',
    period: '2026-07',
    date: '08 Jul 2026',
    status: 'paid',
    iconName: 'ShoppingBag',
  },
  {
    id: 'exp-6',
    title: 'Plan Teléfono Móvil',
    category: 'Servicios',
    amount: 25,
    currency: 'ARS',
    period: '2026-07',
    date: '05 Jul 2026',
    status: 'pending',
    iconName: 'Smartphone',
  },
  {
    id: 'exp-7',
    title: 'Membresía del Gimnasio',
    category: 'Salud',
    amount: 40,
    currency: 'ARS',
    period: '2026-07',
    date: '01 Jul 2026',
    status: 'pending',
    iconName: 'Activity',
  },
  {
    id: 'exp-8',
    title: 'ChatGPT Plus',
    category: 'Servicios',
    amount: 20,
    currency: 'USD',
    period: '2026-07',
    date: '03 Jul 2026',
    status: 'paid',
    iconName: 'Zap',
  },
];

export const AVAILABLE_CATEGORIES = [
  'Vivienda',
  'Transporte',
  'Ocio',
  'Servicios',
  'Alimentación',
  'Salud',
  'Otros'
];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
  Vivienda: { bg: 'bg-[#ffbd89]/20', text: 'text-[#083400]', accent: 'bg-[#ffbd89]' },
  Transporte: { bg: 'bg-[#ffd5f0]/20', text: 'text-[#083400]', accent: 'bg-[#ffd5f0]' },
  Ocio: { bg: 'bg-[#ffea4b]/20', text: 'text-[#083400]', accent: 'bg-[#ffea4b]' },
  Servicios: { bg: 'bg-[#87ea5c]/20', text: 'text-[#083400]', accent: 'bg-[#87ea5c]' },
  Alimentación: { bg: 'bg-[#0097c7]/20', text: 'text-[#0097c7]', accent: 'bg-[#0097c7]' },
  Salud: { bg: 'bg-[#008026]/20', text: 'text-[#008026]', accent: 'bg-[#008026]' },
  Otros: { bg: 'bg-[#58717a]/20', text: 'text-[#58717a]', accent: 'bg-[#58717a]' },
};

export const CATEGORY_ICONS: Record<string, string> = {
  Vivienda: 'Home',
  Transporte: 'Car',
  Ocio: 'Tv',
  Servicios: 'Zap',
  Alimentación: 'ShoppingBag',
  Salud: 'Activity',
  Otros: 'CircleDollarSign',
};

/** Ingresos demo por ledger (sin conversión). */
export const INITIAL_INCOME_ARS = 2000;
export const INITIAL_INCOME_USD = 100;
