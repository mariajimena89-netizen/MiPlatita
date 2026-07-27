# Estado actual — MiPlatita

**Última actualización:** 2026-07-24

## Hecho ✅

| Área | Detalle |
|------|---------|
| App base | 4 tabs, estado central App.tsx, persistencia localStorage |
| Ledgers ARS/USD | Gastos con `currency`; ingresos duales; sin conversión entre monedas |
| Dashboard | MainMetric ARS+USD; StatCards duales; ExpenseTable tabs ARS\|USD |
| Tabla gastos | Tabs moneda + columnas Título/Categoría/Precio/Acciones |
| Editar gasto | Modal con selector ARS\|USD |
| Análisis | Tabs ARS\|USD, ranking por ledger |
| Perfil | Ingresos ARS + USD editables; preferencias “ARS + USD” |
| Design system | Tokens + escala UI unificada |
| Dev | `npm run dev` puerto 3000 |

## Pendiente 🔲

| Item | Notas |
|------|-------|
| ~~Unificar moneda~~ | Hecho: `formatARS` ($ / es-AR) en toda la UI |
| Pulir copy demo | Algunos textos generados por IA (Ficha 4D D3) |
| GEMINI_API_KEY | En .env.local si se usa @google/genai (no crítico para UI actual) |
| Tests | No hay suite de tests |

## Blockers 🚫

Ninguno activo.

## Datos demo actuales

- Presupuesto default: **$2.000** (UI con `formatARS` / $ ARS)
- 7 gastos iniciales en `data.ts` (~$1.325 total)
- Registro rápido crea: título "Gasto demo", rubro "Otros", estado pendiente

## Archivos calientes (cambian seguido)

- `miplatita/src/App.tsx`
- `miplatita/src/components/AddExpenseModal.tsx`
- `state/current.md` ← actualizar al cerrar sesión
