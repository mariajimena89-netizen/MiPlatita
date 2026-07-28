# Estado actual — MiPlatita

**Última actualización:** 2026-07-28

## Hecho ✅

| Área | Detalle |
|------|---------|
| App base | 4 tabs, estado central App.tsx, persistencia localStorage |
| Auth V1 | Login/registro email+password local (`AuthScreen`); gate antes de la app; logout en Perfil |
| Demo Day | Ruta aislada `/demo-day` (6 slides) |
| Ledgers ARS/USD | Gastos con `currency`; ingresos duales |
| Dashboard / Gastos / Análisis / Perfil | Flujos S4 operativos |
| Design system | Tokens + escala UI unificada |
| Deploy | Vercel + `vercel.json` (root `miplatita/`) |

## Pendiente 🔲

| Item | Notas |
|------|-------|
| Auth nube | Supabase/Firebase + datos por usuario (post-V1) |
| Aislar gastos por cuenta | V1 comparte localStorage de gastos en el browser |
| Pulir copy demo | Textos Ficha 4D |
| Tests | No hay suite |

## Blockers 🚫

Ninguno activo.

## Archivos calientes

- `miplatita/src/App.tsx`
- `miplatita/src/accountAuth.ts`
- `miplatita/src/components/AuthScreen.tsx`
- `miplatita/src/DemoDay.tsx`
