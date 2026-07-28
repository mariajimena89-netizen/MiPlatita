# AGENTS.md — MiPlatita

> Archivo central de control para agentes IA. Máx. ~300 líneas. Leer primero, siempre.

## Identidad

**MiPlatita** — app React de control de gastos personales (Interface School, Wave Delta).
Stack: React 19, Vite 6, Tailwind 4, motion, lucide-react. **Sin backend.** Datos mock + localStorage.
Código en `miplatita/`. Design system en `miplatita/design.md`.

## Propósito

Permitir registrar gastos rápido, ver métricas de presupuesto y analizar por rubro. Mobile-first. Demo académica, no producción.

## Reglas duras (invariantes)

1. **Respetar design system** — colores/tipografías solo de `miplatita/design.md` y `miplatita/src/index.css`. No inventar tokens.
2. **Reutilizar componentes** — no duplicar UI existente en `miplatita/src/components/`.
3. **No romper flujo S4** — Dashboard + registro de gasto + navegación 4 tabs (ver `miplatita/Contexto/Ficha_4d.md`).
4. **Sin backend** — persistencia solo localStorage. No APIs reales salvo spec explícita.
5. **Datos demo** — marcar como demo; no datos personales reales.
6. **Fuera de alcance por defecto** — login social, consejos financieros, features no pedidas.
7. **Commits/PRs** — solo si el usuario lo pide explícitamente.

## Reglas de oro (contexto y memoria)

- El context window es caro y volátil. **La memoria real vive en archivos.**
- **Nunca** cargar historial completo ni todos los archivos del proyecto.
- Cargar **solo** lo estrictamente necesario para la tarea actual.
- Al final de sesiones importantes: actualizar `state/`, registrar en `decisions/`, comprimir en `logs/`.
- **Preferir referenciar archivos** antes que copiar contenido largo al prompt.
- Procedimientos repetitivos → `skills/`.
- Mantener este archivo conciso y de alta densidad.

## Orden de lectura (por tarea)

| Tarea | Leer (en orden) | No leer |
|-------|-----------------|---------|
| Cualquier sesión nueva | `AGENTS.md` → `state/current.md` | `node_modules/`, `package-lock.json` |
| UI / diseño | `miplatita/Contexto/decisiones.md` → sección de `miplatita/design.md` → componente | Todos los componentes |
| Nueva feature | `state/current.md` → spec del usuario → archivo(s) tocados | Repo entero |
| Bug en pantalla X | `gotchas/` → componente X → `App.tsx` si es estado | `design.md` completo si no es UI |
| Levantar dev | `skills/dev-server.md` | — |
| Registro gasto | `skills/registrar-gasto.md` → `AddExpenseModal.tsx` | AnalisisView, PerfilView |

## Routing de skills

| Señal en el prompt | Skill |
|--------------------|-------|
| "levantar server", "npm run dev" | `skills/dev-server.md` |
| "registrar gasto", modal, ARS | `skills/registrar-gasto.md` |
| cambios visuales, colores, layout | `skills/cambios-ui-design-system.md` |
| cerrar sesión, actualizar memoria | `skills/cerrar-sesion.md` |
| commit, PR | reglas del usuario en Cursor (no skill local) |

## Arquitectura mínima (no re-leer salvo cambio estructural)

```
miplatita/src/
├── App.tsx          # Auth gate, tabs, cálculos, localStorage, toast registro
├── accountAuth.ts   # Login/registro email+password (local V1)
├── data.ts          # INITIAL_EXPENSES, AVAILABLE_CATEGORIES, iconos
├── types.ts         # Expense, ActiveTab
├── DemoDay.tsx      # Presentación /demo-day (aislada)
└── components/
    ├── AuthScreen.tsx       # Login / crear cuenta
    ├── MainMetric.tsx       # Tarjeta verde % presupuesto
    ├── StatCards.tsx        # 4 KPIs
    ├── ExpenseTable.tsx     # Tabla: preview (Dashboard) / full+filtros (Gastos)
    ├── CategoryAnalysis.tsx # Grid rubros (sin uso en Dashboard; Análisis usa AnalisisView)
    ├── AddExpenseModal.tsx  # Registro: monto ARS + categoría + estado
    ├── AnalisisView.tsx     # Pantalla Análisis (layout asimétrico)
    └── PerfilView.tsx       # Presupuesto, logout, bloqueo local
```

**Estado en App.tsx:** `accountEmail`, `expenses`, `categories`, `activeTab`, `isAddExpenseOpen`, `registrationToast`.
**localStorage keys:** `miplatita_expenses`, `miplatita_categories`, `miplatita_budget`, `miplatita_tab`, `miplatita_password`, `miplatita_lock_on_open`, `miplatita_accounts`, `miplatita_account_session` (+ session `miplatita_session_ok`).

## Pantallas (ActiveTab)

| Tab | Contenido |
|-----|-----------|
| `dashboard` | MainMetric + StatCards + ExpenseTable preview (últimos 6 + Ver más) |
| `gastos` | ExpenseTable full (filtros + buscador) |
| `analisis` | AnalisisView (ranking + insights, distinto al grid del dashboard) |
| `perfil` | PerfilView (presupuesto, reset, clear) |

## Definition of Done

- [ ] Respeta design system (`design.md`)
- [ ] No rompe navegación 4 tabs ni flujo registro desde home/<15s
- [ ] `npm run lint` pasa (tsc --noEmit)
- [ ] Cambio visible probado en dev (puerto 3000)
- [ ] Si cambia comportamiento: actualizar `state/current.md`
- [ ] Si hay decisión nueva: archivo en `decisions/`
- [ ] Si hay trampa nueva: entrada en `gotchas/`

## Comportamiento del agente con contexto

### Al iniciar sesión
1. Leer `AGENTS.md` + `state/current.md` (≤2 archivos).
2. Preguntar o inferir tarea; cargar 1–3 archivos más según tabla de lectura.
3. No explorar el repo con búsquedas amplias si la tarea es acotada.

### Durante la tarea
- Editar el mínimo número de archivos.
- Citas de código > pegar archivos enteros en respuesta.
- Si falta info: leer archivo puntual, no re-analizar todo.

### Al cerrar sesión importante
1. `state/current.md` — hecho/pendiente/blockers.
2. `decisions/YYYY-MM-DD-tema.md` — si hubo decisión de producto/arquitectura.
3. `logs/YYYY-MM-DD-resumen.md` — 10–20 líneas max.
4. `gotchas/` — si se descubrió algo no obvio.

## Punteros a memoria persistente

| Carpeta | Contenido |
|---------|-----------|
| `decisions/` | Decisiones con fecha y razonamiento |
| `state/` | Estado actual: hecho, pendiente, blockers |
| `skills/` | Procedimientos reutilizables |
| `gotchas/` | Problemas conocidos + soluciones |
| `logs/` | Resúmenes comprimidos de sesiones |
| `miplatita/Contexto/` | `decisiones.md` (índice), `Ficha_4d.md` (curso), README |
| `miplatita/design.md` | Fuente de verdad visual — leer por sección, no entero |

## Archivos raíz workspace (fuera de miplatita/)

- `miplatita-diagrama.html` — mapa visual para diseñadores (no código)
- `design (3).md` — copia antigua; **usar `miplatita/design.md`**

## Comandos rápidos

```bash
cd miplatita && npm install   # primera vez
cd miplatita && npm run dev   # http://localhost:3000
cd miplatita && npm run lint  # verificar TS
```

## Mejoras de contexto (instaladas)

- `.cursorignore` — excluye node_modules, dist, zip, package-lock
- Inicio de sesión: *"Lee AGENTS.md y state/current.md. Tarea: [X]"*
- No adjuntar `design.md` entero; indicar sección (ej. "§3 modal registro")
- Specs de feature: bullet list; el agente persiste en `decisions/`
- Al cerrar: *"Actualizá memoria"* → skill `skills/cerrar-sesion.md`
