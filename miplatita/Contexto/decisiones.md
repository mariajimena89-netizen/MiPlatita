# Decisiones de diseño — MiPlatita

Índice denso. Detalle completo en `../design.md`. Decisiones de producto en `../../decisions/`.

## Paleta (invariante)

| Token | Hex | Uso |
|-------|-----|-----|
| lime-volt | `#87ea5c` | Hero, acentos, botón + móvil |
| forest-ink | `#083400` | Texto, header/footer móvil, CTA primario |
| fog | `#58717a` | Secundario, placeholders |
| surface-container | `#eeeeee` / `#f3f3f4` | Inputs, bordes, neutros |

Estados pago: verde `#008026` (pagado), rojo `#cf2929` (pendiente). Ver `index.css`.

## Tipografía

- **Sora** — display, % grandes, marca
- **Inter** — cuerpo, tablas, forms
- **font-label-caps** — 12px uppercase (eyebrows)
- Escala UI: `font-page-title`, `font-section-title`, `type-meta`, `btn-primary`, `btn-secondary`, `chip`, `ui-filter-control`, `ui-input` → ver `src/index.css`

## Escala de controles (2026-07-22)

| Rol | Medida |
|-----|--------|
| Primario | `btn-primary` h-48 / 44 md, texto blanco |
| Secundario | `btn-secondary` h-40 |
| Filtros | `ui-filter-control` h-40, 12px |
| Chip | `chip` px-2.5 py-1 · 11px |
| Gap tabs | gap-6 / md:gap-8 |

## Layout por pantalla

### Dashboard (`design.md` §3.1–3.3)
- Desktop: grid 50/50 — hero % | 4 KPIs 2×2 compactos
- Mobile: stack; CTA registrar solo vía FAB (no en hero)
- Hero: % + monto/presupuesto + barra + “% disponible” (sin tag “Progreso de pagos”)
- Saludo + período en una línea
- Preview últimos 6 + Ver más → Gastos
- CategoryAnalysis fuera del Dashboard

### Análisis (`design.md` §3.4)
- Ranking + promedio + añadir rubro (sin card “Rubro líder” duplicada ni chip Insights)

### Gastos
- ExpenseTable `variant="full"`: lista completa + buscador + filtros de estado/categoría

### Perfil
- Identidad (sin niveles/premium)
- Seguridad: password local + pedir al abrir (`AppLockScreen`)
- Preferencias: $ ARS, período · Presupuesto mensual
- Sin card de simulación demo

## Componentes móviles (`design.md` §4)

- Nav inferior (solo `< md`): barra blanca, iconos 16px, labels 9px, FAB 44px
- Desktop (`md+`): tabs en header compacto; sin bottom nav
- Tabs móvil: activo forest-ink · inactivo fog
- Botón **+**: fondo forest-ink, icono blanco
- Títulos de tab: `font-page-title` (26→36 md), sin eyebrow gris

## Modal registro

- Nombre + monto ARS + categoría + estado + CTA
- Badge DATOS DEMO

## Lista gastos

- Sin fecha · tag solo lectura · Confirmar pago / Marcar pendiente
- Mobile lista · Desktop tabla (icono solo md+)

## Delegación curso (Ficha 4D)

- **D2:** categorías no compiten visualmente con gastos → layouts separados
- **No delegar:** criterio visual final, validación de content
- Ver `Ficha_4d.md`

## Moneda

- Toda la plataforma: **$ ARS** vía `formatCurrency.ts` (`formatARS`)
- Lista Gastos: filas compactas mobile-first (sin tabla ancha)
