/** Período mensual `YYYY-MM` — vista activa sin conversión de monedas. */

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const DEFAULT_PERIOD = '2026-07';

export function formatPeriodLabel(periodKey: string): string {
  const [y, m] = periodKey.split('-').map(Number);
  if (!y || !m || m < 1 || m > 12) return periodKey;
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

/** Opciones: 12 meses antes y 12 después del centro (default julio 2026). */
export function buildPeriodOptions(
  centerKey: string = DEFAULT_PERIOD,
  monthsBefore = 12,
  monthsAfter = 12,
): { value: string; label: string }[] {
  const [cy, cm] = centerKey.split('-').map(Number);
  const center = new Date(cy, cm - 1, 1);
  const options: { value: string; label: string }[] = [];

  for (let i = -monthsBefore; i <= monthsAfter; i++) {
    const d = new Date(center.getFullYear(), center.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    options.push({ value, label: formatPeriodLabel(value) });
  }

  return options;
}

export type PeriodIncome = { ars: number; usd: number };
export type PeriodIncomeMap = Record<string, PeriodIncome>;
