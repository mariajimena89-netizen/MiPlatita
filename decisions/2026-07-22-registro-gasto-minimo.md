# Registro de gasto (nombre + monto + categoría + estado)

**Fecha:** 2026-07-22 (act. 2026-07-24)  
**Estado:** Implementado

## Campos del modal

1. **Nombre del gasto** (obligatorio)
2. **Monto $ ARS** (obligatorio)
3. **Categoría**
4. **Estado** Pagado / Se debe pagar
5. CTA único «Registrar gasto»

## Lista de gastos (fila)

- Sin fecha visible
- Tag estado = solo lectura (no click)
- CTA **Confirmar pago** / **Marcar pendiente**
- Mobile: lista · Desktop: tabla (icono solo desktop)

## Archivos

AddExpenseModal, ExpenseTable, App.tsx
