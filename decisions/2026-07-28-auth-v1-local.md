# Auth V1: login/registro email + password (local)

**Fecha:** 2026-07-28  
**Estado:** Implementado

## Decisión

V1 de acceso con **correo + contraseña** guardados en el navegador (`localStorage`). Sin Supabase/Firebase ni Google OAuth.

## Por qué

- Entrega rápida para demo académica.
- Respeta invariante “sin backend”.
- Gate de acceso antes de la app; gastos siguen en localStorage (no multi-usuario en nube).

## Qué hace

1. Pantalla `AuthScreen`: tabs Ingresar / Crear cuenta.
2. Cuentas en `miplatita_accounts`; sesión en `miplatita_account_session`.
3. `App.tsx` bloquea sin sesión; Perfil muestra email.
4. **Mi contraseña** = misma clave del login (cambiar / pedir al abrir / **Cerrar sesión**).
5. Bloqueo al abrir pide la contraseña de la cuenta (ya no hay PIN aparte).

## Limitaciones (explícitas)

- No es seguridad de producción (hash trivial, datos en el browser).
- Cuentas no sincronizan entre dispositivos.
- Gastos no están aislados por usuario en V1.

## Siguiente (opcional)

Supabase Auth + RLS + datos por `user_id`.

## Archivos

- `accountAuth.ts`, `components/AuthScreen.tsx`, `App.tsx`, `PerfilView.tsx`
