# Moneda unificada a $ ARS

## Estado
Resuelto (2026-07-22). Toda la UI usa **$** con locale `es-AR`.

## Helper
`miplatita/src/formatCurrency.ts` → `formatARS(amount, { signed? })`

## Regla
No hardcodear `€` ni `de-DE`. Usar siempre `formatARS`.
