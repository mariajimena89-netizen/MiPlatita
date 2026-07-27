# localStorage — claves y efectos secundarios

## Claves
| Key | Contenido |
|-----|-----------|
| `miplatita_expenses` | JSON array Expense[] |
| `miplatita_categories` | JSON string[] |
| `miplatita_budget` | string numérica |
| `miplatita_tab` | ActiveTab |

## Gotchas
- **Datos viejos persisten** — cambios en `INITIAL_EXPENSES` no se ven hasta reset en Perfil o limpiar storage.
- **Testing registro** — si no aparece gasto demo, puede ser cache; probar incógnito o "Restaurar datos demo".
- **Sin validación schema** — JSON corrupto puede romper parse; App no tiene fallback robusto.

## Reset rápido (dev)
DevTools → Application → Local Storage → borrar keys `miplatita_*`

## Archivo fuente
`miplatita/src/App.tsx` — useEffect de persistencia
