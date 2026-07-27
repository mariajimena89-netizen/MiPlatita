# Carga ineficiente de contexto

## Problemas detectados
1. **node_modules/** — miles de archivos; nunca indexar ni leer.
2. **design.md completo** (~90 líneas) — cargar por sección según tarea.
3. **Re-explorar zip** — código ya está en `miplatita/`; no descomprimir de nuevo.
4. **Todos los componentes** — App.tsx + 1 componente suele bastar.
5. **design (3).md** en raíz — duplicado obsoleto; usar `miplatita/design.md`.

## Mitigación
- Leer `AGENTS.md` + `state/current.md` al inicio.
- Usar tabla de lectura en AGENTS.md.
- Agregar `.cursorignore` con `node_modules/`, `dist/`, `*.zip`.

## Archivo diagrama
`miplatita-diagrama.html` — referencia visual para diseñadores; no necesario para coding tasks.
