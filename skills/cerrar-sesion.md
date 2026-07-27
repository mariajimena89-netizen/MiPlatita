# Skill: Cerrar sesión (actualizar memoria)

## Cuándo usar
Al terminar tarea importante o cuando el usuario lo pida.

## Pasos (5 min max)

1. **`state/current.md`** — mover items hecho/pendiente/blockers
2. **`decisions/`** — nuevo archivo si hubo decisión de producto/arquitectura:
   - Nombre: `YYYY-MM-DD-tema-corto.md`
   - Incluir: decisión, razonamiento, archivos afectados
3. **`gotchas/`** — agregar entrada si se encontró trampa no documentada
4. **`logs/`** — resumen 10–20 líneas:
   - Qué se hizo
   - Archivos tocados
   - Qué queda pendiente

## Formato log (plantilla)

```markdown
# Sesión YYYY-MM-DD — [título corto]
- **Tarea:** ...
- **Hecho:** ...
- **Archivos:** ...
- **Pendiente:** ...
- **Decisiones:** link a decisions/ si aplica
```

## No hacer
- Volcar conversación completa al log
- Duplicar design.md en logs
