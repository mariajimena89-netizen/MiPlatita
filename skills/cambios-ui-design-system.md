# Skill: Cambios UI respetando design system

## Cuándo usar
Ajustes visuales, layout, componentes, copy de interfaz.

## Lectura mínima
1. `miplatita/Contexto/decisiones.md` (escala UI)
2. `miplatita/src/index.css` — tokens + utilidades
3. Componente a editar

## Escala unificada (usar estas utilidades)

| Utilidad | Uso |
|----------|-----|
| `font-page-title` | Títulos de tab (+ `md:text-4xl`) |
| `font-section-title` | Títulos de bloque/card |
| `font-label-caps` | Eyebrows / labels (12px) |
| `type-meta` | Fechas, conteos, helpers (12px fog) |
| `type-body-ui` | Cuerpo UI 14px |
| `btn-primary` | CTA principal (h-48 / 44 md) texto blanco |
| `btn-secondary` | CTA secundario (h-40) |
| `chip` / `chip-lg` | Pastillas estado / período |
| `ui-filter-control` | h-40 filtros |
| `ui-input` / `ui-input-hero` | Forms estándar / monto |

## Checklist
- [ ] ¿Color existe en design.md / index.css?
- [ ] ¿Reutilizo utilidad de escala (no `text-[9px]`)?
- [ ] ¿CTA primario = `btn-primary`?
- [ ] ¿Filtros a la misma altura (`ui-filter-control`)?
- [ ] Controles táctiles ≥40px

## No hacer
- Inventar colores/fuentes
- Mezclar layout AnalisisView con CategoryAnalysis
- Botones primarios con `text-lime-volt` (usar blanco)
