# Perfil: password local + sin badge/demo card

**Fecha:** 2026-07-22  
**Estado:** Implementado

## Decisión

Perfil incluye:
1. Identidad (sin badge premium)
2. Seguridad: crear/cambiar/quitar contraseña + toggle “Pedir al abrir”
3. Preferencias: moneda $ ARS (solo lectura), período
4. Presupuesto mensual
5. Nota privacidad local

Sin card de simulación demo. Gate `AppLockScreen` si hay password + lock on open.

## Demo / seguridad

Clave en localStorage (`authStorage.ts`, encode btoa). No es producción.

## Archivos

- `authStorage.ts`, `AppLockScreen.tsx`, `PerfilView.tsx`, `App.tsx`
