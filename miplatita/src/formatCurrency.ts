/** Formato de moneda para ledgers paralelos ARS / USD (sin conversión). */

export type CurrencyCode = 'ARS' | 'USD';

export function formatARS(
  amount: number,
  options?: { compact?: boolean }
): string {
  const formatted = amount.toLocaleString('es-AR', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return `$${formatted}`;
}

export function formatUSD(
  amount: number,
  options?: { compact?: boolean }
): string {
  const formatted = amount.toLocaleString('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return `US$${formatted}`;
}

export function formatMoney(amount: number, currency: CurrencyCode): string {
  return currency === 'USD' ? formatUSD(amount) : formatARS(amount);
}
