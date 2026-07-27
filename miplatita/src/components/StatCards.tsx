import React from 'react';
import { formatARS, formatUSD } from '../formatCurrency';

interface StatCardsProps {
  totalGastosARS: number;
  totalGastosUSD: number;
  incomeARS: number;
  incomeUSD: number;
  totalPaidARS: number;
  totalPaidUSD: number;
  totalPendingARS: number;
  totalPendingUSD: number;
  savingsARS: number;
  savingsUSD: number;
}

function DualAmount({ ars, usd, strong = false, danger = false }: {
  ars: number;
  usd: number;
  strong?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <p
        className={`font-display font-extrabold tracking-tight tabular-nums leading-none truncate ${
          strong ? 'text-xl md:text-2xl' : 'text-base md:text-lg'
        } ${danger && ars < 0 ? 'text-[#cf2929]' : strong ? 'text-lime-volt' : 'text-forest-ink'}`}
      >
        {formatARS(ars)}
      </p>
      <p
        className={`font-display font-bold tracking-tight tabular-nums leading-none truncate text-sm md:text-base ${
          danger && usd < 0 ? 'text-[#cf2929]' : strong ? 'text-white/85' : 'text-fog'
        }`}
      >
        {formatUSD(usd)}
      </p>
    </div>
  );
}

/**
 * KPI cards — 2×2, ledgers ARS + USD en paralelo (sin conversión).
 */
export const StatCards: React.FC<StatCardsProps> = ({
  totalGastosARS,
  totalGastosUSD,
  incomeARS,
  incomeUSD,
  totalPaidARS,
  totalPaidUSD,
  totalPendingARS,
  totalPendingUSD,
  savingsARS,
  savingsUSD,
}) => {
  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-2 grid-rows-2 gap-2.5 md:gap-3 w-full h-full auto-rows-fr">
        {/* 1 — Total de gastos */}
        <div className="bg-forest-ink text-white rounded-2xl px-3.5 py-3 md:px-4 md:py-3.5 flex flex-col justify-between gap-2 min-h-[96px] md:min-h-[108px] h-full min-w-0">
          <span className="font-label-caps text-[10px] md:text-[11px] tracking-wide text-white/75">
            Total de gastos
          </span>
          <DualAmount ars={totalGastosARS} usd={totalGastosUSD} strong />
        </div>

        {/* 2 — Ingresos */}
        <div className="bg-white text-forest-ink border border-surface-container-high rounded-2xl px-3.5 py-3 md:px-4 md:py-3.5 flex flex-col justify-between gap-2 min-h-[96px] md:min-h-[108px] h-full min-w-0">
          <span className="font-label-caps text-[10px] md:text-[11px] tracking-wide text-fog">
            Ingresos
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="font-display text-xl md:text-2xl font-extrabold tracking-tight tabular-nums leading-none truncate text-forest-ink">
              {formatARS(incomeARS)}
            </p>
            <p className="font-display text-sm md:text-base font-bold tracking-tight tabular-nums leading-none truncate text-fog">
              {formatUSD(incomeUSD)}
            </p>
          </div>
        </div>

        {/* 3 — Pagos */}
        <div className="bg-white text-forest-ink border border-surface-container-high rounded-2xl px-3.5 py-3 md:px-4 md:py-3.5 flex flex-col justify-between gap-2 min-h-[96px] md:min-h-[108px] h-full min-w-0">
          <span className="font-label-caps text-[10px] md:text-[11px] tracking-wide text-fog">
            Pagos
          </span>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-2 min-w-0">
              <span className="text-[10px] md:text-[11px] font-semibold text-[#cf2929] shrink-0 pt-0.5">
                Pendientes
              </span>
              <div className="text-right min-w-0">
                <p className="font-display text-xs md:text-sm font-extrabold tabular-nums leading-none text-forest-ink truncate">
                  {formatARS(totalPendingARS)}
                </p>
                <p className="font-display text-[10px] md:text-xs font-bold tabular-nums leading-none text-fog truncate mt-0.5">
                  {formatUSD(totalPendingUSD)}
                </p>
              </div>
            </div>
            <div className="flex items-start justify-between gap-2 min-w-0">
              <span className="text-[10px] md:text-[11px] font-semibold text-[#008026] shrink-0 pt-0.5">
                Pagados
              </span>
              <div className="text-right min-w-0">
                <p className="font-display text-xs md:text-sm font-extrabold tabular-nums leading-none text-forest-ink truncate">
                  {formatARS(totalPaidARS)}
                </p>
                <p className="font-display text-[10px] md:text-xs font-bold tabular-nums leading-none text-fog truncate mt-0.5">
                  {formatUSD(totalPaidUSD)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 — Ahorro */}
        <div className="bg-white text-forest-ink border border-surface-container-high rounded-2xl px-3.5 py-3 md:px-4 md:py-3.5 flex flex-col justify-between gap-2 min-h-[96px] md:min-h-[108px] h-full min-w-0">
          <span className="font-label-caps text-[10px] md:text-[11px] tracking-wide text-fog">
            Ahorro
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <p
              className={`font-display text-xl md:text-2xl font-extrabold tracking-tight tabular-nums leading-none truncate ${
                savingsARS < 0 ? 'text-[#cf2929]' : 'text-forest-ink'
              }`}
            >
              {formatARS(savingsARS)}
            </p>
            <p
              className={`font-display text-sm md:text-base font-bold tracking-tight tabular-nums leading-none truncate ${
                savingsUSD < 0 ? 'text-[#cf2929]' : 'text-fog'
              }`}
            >
              {formatUSD(savingsUSD)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
