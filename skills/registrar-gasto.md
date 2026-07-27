# Skill: Registrar gasto (feature)

## Archivos
1. `AddExpenseModal.tsx`
2. `App.tsx` — handleAddExpense, toast, handleSetExpenseStatus
3. `ExpenseTable.tsx` — Confirmar pago / Marcar pendiente
4. `decisions/2026-07-22-registro-gasto-minimo.md`

## Flujo
Nombre + monto + categoría + estado → prepend expenses → toast

## Invariantes
- Tag de estado no es clickeable
- Fecha no se muestra en la fila
- CTA explícito para confirmar pago
