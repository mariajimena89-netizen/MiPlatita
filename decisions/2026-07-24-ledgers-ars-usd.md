# 2026-07-24 — Ledgers paralelos ARS / USD

## Decisión
Gastos e ingresos en **dos monedas independientes** (sin conversión).

## Modelo
- Cada gasto: `amount` + `currency: 'ARS' | 'USD'`
- Ingresos: `incomeARS` + `incomeUSD`
- Totales y % se calculan **por ledger**, nunca mezclando monedas

## UI
- Tabla / Análisis: tabs ARS | USD (listados separados)
- Card verde: % ARS hero + línea secundaria USD
- KPIs: cada card muestra ARS + USD en paralelo
- Modal: selector de moneda + un monto
- Perfil: editar ambos ingresos

## Persistencia
- `miplatita_income_ars`, `miplatita_income_usd`
- Migración: gastos sin `currency` → ARS
