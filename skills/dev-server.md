# Skill: Levantar dev server

## Cuándo usar
Usuario pide correr la app localmente.

## Pasos

```bash
cd miplatita
npm install          # solo si no existe node_modules
npm run dev
```

## Resultado esperado
- URL: http://localhost:3000
- Network: http://0.0.0.0:3000 (host expuesto)

## Notas
- No requiere GEMINI_API_KEY para UI de gastos.
- `.env.local` opcional (ver `.env.example`).

## Si falla
- Puerto ocupado → matar proceso en 3000 o cambiar puerto en `package.json` scripts (requiere pedido explícito).
