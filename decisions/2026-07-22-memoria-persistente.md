# Memoria persistente fuera del context window

**Fecha:** 2026-07-22  
**Estado:** Activo

## Decisión

Estado del proyecto, decisiones, skills y gotchas viven en archivos en raíz del repo (`AGENTS.md`, `decisions/`, `state/`, `skills/`, `gotchas/`, `logs/`). Diseño curso en `miplatita/Contexto/`.

## Razonamiento

- Context window caro y volátil; conversaciones previas no persisten.
- Sin esto se re-explora zip, design.md entero y node_modules en cada sesión.
- AGENTS.md como router: qué leer según tarea, no qué evitar cargar.

## Estructura

```
AGENTS.md          # Router central ≤300 líneas
decisions/         # Por qué se decidió X
state/current.md   # Hecho / pendiente / blockers
skills/            # Procedimientos repetibles
gotchas/           # Trampas conocidas
logs/              # Resúmenes sesión 10–20 líneas
miplatita/Contexto/  # Diseño + Ficha 4D
```

## Regla operativa

Inicio sesión: AGENTS.md + state/current.md. Fin sesión importante: skill `cerrar-sesion.md`.
