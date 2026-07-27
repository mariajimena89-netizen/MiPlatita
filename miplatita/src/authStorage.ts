/** Auth demo local — no es seguridad de producción. */

export const AUTH_PASSWORD_KEY = 'miplatita_password';
export const AUTH_LOCK_KEY = 'miplatita_lock_on_open';
export const AUTH_SESSION_KEY = 'miplatita_session_ok';

const SALT = 'miplatita-demo-v1:';

export function encodePassword(plain: string): string {
  return btoa(unescape(encodeURIComponent(SALT + plain)));
}

export function hasStoredPassword(): boolean {
  return Boolean(localStorage.getItem(AUTH_PASSWORD_KEY));
}

export function getLockOnOpen(): boolean {
  if (!hasStoredPassword()) return false;
  return localStorage.getItem(AUTH_LOCK_KEY) !== 'false';
}

export function setLockOnOpen(enabled: boolean): void {
  localStorage.setItem(AUTH_LOCK_KEY, enabled ? 'true' : 'false');
}

export function savePassword(plain: string): void {
  localStorage.setItem(AUTH_PASSWORD_KEY, encodePassword(plain));
  if (localStorage.getItem(AUTH_LOCK_KEY) === null) {
    setLockOnOpen(true);
  }
}

export function verifyPassword(plain: string): boolean {
  const stored = localStorage.getItem(AUTH_PASSWORD_KEY);
  if (!stored) return false;
  return stored === encodePassword(plain);
}

export function clearPassword(): void {
  localStorage.removeItem(AUTH_PASSWORD_KEY);
  localStorage.removeItem(AUTH_LOCK_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}

export function markSessionUnlocked(): void {
  sessionStorage.setItem(AUTH_SESSION_KEY, '1');
}

export function isSessionUnlocked(): boolean {
  return sessionStorage.getItem(AUTH_SESSION_KEY) === '1';
}

/** ¿Mostrar pantalla de bloqueo al cargar? */
export function shouldShowLockScreen(): boolean {
  return hasStoredPassword() && getLockOnOpen() && !isSessionUnlocked();
}
