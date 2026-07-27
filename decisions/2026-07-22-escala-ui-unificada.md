# Escala UI unificada (espaciados, tipo, chips, botones, filtros)

**Fecha:** 2026-07-22  
**Estado:** Implementado

## Decisión

Adoptar utilidades en `index.css` y aplicarlas en todas las pantallas para eliminar tamaños ad-hoc (`text-[9px]`, botones 32–56px mezclados).

## Escala

- Labels 12px · meta 12px · body UI 14px
- Primario h-48/44 · secundario h-40 · filtros h-40
- Chips `chip` / `chip-lg` · texto CTA blanco sobre forest-ink
- Gaps de tab: 24→32 md

## Archivos

- `miplatita/src/index.css`
- App, MainMetric, StatCards, ExpenseTable, AddExpenseModal, AnalisisView, PerfilView
- `skills/cambios-ui-design-system.md`, `Contexto/decisiones.md`
