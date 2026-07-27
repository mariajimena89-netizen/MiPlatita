import React from 'react';
import { motion } from 'motion/react';
import { formatARS, formatUSD } from '../formatCurrency';

interface MainMetricProps {
  spentARS: number;
  incomeARS: number;
  percentageARS: number;
  spentUSD: number;
  incomeUSD: number;
  percentageUSD: number;
}

export const MainMetric: React.FC<MainMetricProps> = ({
  spentARS,
  incomeARS,
  percentageARS,
  spentUSD,
  incomeUSD,
  percentageUSD,
}) => {
  const barWidth = Math.min(100, Math.max(0, percentageARS));
  const availableARS = Math.max(0, 100 - percentageARS);

  return (
    <div
      id="main-metric-card"
      className="w-full h-full bg-lime-volt text-forest-ink p-5 md:p-8 relative overflow-hidden flex flex-col justify-between gap-4 md:gap-6 rounded-[24px] md:rounded-[40px]"
    >
      <div className="absolute right-[-32px] bottom-[-36px] opacity-[0.07] pointer-events-none select-none font-display text-[100px] md:text-[130px] font-black tracking-tighter leading-none">
        PLATITA
      </div>

      <div className="flex flex-col gap-1 relative z-10">
        <h1 className="font-display text-[56px] md:text-[80px] font-extrabold tracking-tighter leading-none text-forest-ink">
          {percentageARS}%
        </h1>
        <p className="type-body-ui md:text-base font-semibold max-w-lg text-forest-ink/90">
          {formatARS(spentARS)} de {formatARS(incomeARS)} del presupuesto
        </p>
        <p className="text-xs md:text-sm font-semibold text-forest-ink/70 tabular-nums">
          {percentageUSD}% · {formatUSD(spentUSD)} de {formatUSD(incomeUSD)}
        </p>
      </div>

      <div className="flex flex-col gap-1.5 w-full relative z-10">
        <div className="w-full h-4 md:h-5 bg-forest-ink/10 rounded-full overflow-hidden p-0.5 border border-forest-ink/15">
          <motion.div
            className="h-full bg-forest-ink rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${barWidth}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <span className="font-label-caps text-forest-ink/80 px-0.5">
          {percentageARS >= 100
            ? 'Presupuesto ARS completo'
            : `${availableARS}% disponible ARS`}
        </span>
      </div>
    </div>
  );
};
