/** Bloqueo al abrir — usa la misma contraseña de la cuenta (accountAuth). Demo. */

export const AUTH_LOCK_KEY = 'miplatita_lock_on_open';
export const AUTH_SESSION_KEY = 'miplatita_session_ok';

export function getLockOnOpen(): boolean {
  return localStorage.getItem(AUTH_LOCK_KEY) === 'true';
}

export function setLockOnOpen(enabled: boolean): void {
  localStorage.setItem(AUTH_LOCK_KEY, enabled ? 'true' : 'false');
}

export function markSessionUnlocked(): void {
  sessionStorage.setItem(AUTH_SESSION_KEY, '1');
}

export function clearSessionUnlock(): void {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}

export function isSessionUnlocked(): boolean {
  return sessionStorage.getItem(AUTH_SESSION_KEY) === '1';
}

/** ¿Mostrar bloqueo al cargar? Requiere sesión de cuenta activa. */
export function shouldShowLockScreen(hasAccountSession: boolean): boolean {
  return hasAccountSession && getLockOnOpen() && !isSessionUnlocked();
}
