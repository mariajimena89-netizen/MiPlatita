# Dashboard: preview de gastos sin análisis por rubro

**Fecha:** 2026-07-22  
**Estado:** Implementado

## Decisión

En Dashboard:
- `ExpenseTable` en `variant="preview"`: últimos 6 gastos, sin buscador/filtros
- CTA **Ver más** → `setActiveTab('gastos')`
- Se elimina `CategoryAnalysis` del Dashboard

En Gastos:
- `ExpenseTable` en `variant="full"`: lista completa + filtros + buscador

## Razonamiento

Dashboard más liviano; detalle y filtros viven en la tab Gastos. Análisis por rubro queda en tab Análisis (`AnalisisView`).

## Archivos

- `miplatita/src/App.tsx`
- `miplatita/src/components/ExpenseTable.tsx`
