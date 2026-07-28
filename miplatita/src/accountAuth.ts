/** Auth de cuenta V1 — email + password en localStorage. Demo, no producción. */

export const ACCOUNTS_KEY = 'miplatita_accounts';
export const ACCOUNT_SESSION_KEY = 'miplatita_account_session';

const SALT = 'miplatita-account-v1:';

export type AccountRecord = {
  email: string;
  passwordHash: string;
  createdAt: string;
};

type AccountsMap = Record<string, AccountRecord>;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashPassword(plain: string): string {
  return btoa(unescape(encodeURIComponent(SALT + plain)));
}

function loadAccounts(): AccountsMap {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as AccountsMap;
  } catch {
    return {};
  }
}

function saveAccounts(map: AccountsMap): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(map));
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

export function getSessionEmail(): string | null {
  return localStorage.getItem(ACCOUNT_SESSION_KEY);
}

export function isAccountLoggedIn(): boolean {
  return Boolean(getSessionEmail());
}

export function setAccountSession(email: string): void {
  localStorage.setItem(ACCOUNT_SESSION_KEY, normalizeEmail(email));
}

export function clearAccountSession(): void {
  localStorage.removeItem(ACCOUNT_SESSION_KEY);
}

export type AuthResult = { ok: true } | { ok: false; error: string };

export function registerAccount(email: string, password: string): AuthResult {
  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized)) {
    return { ok: false, error: 'Ingresá un correo válido' };
  }
  if (password.length < 6) {
    return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }

  const accounts = loadAccounts();
  if (accounts[normalized]) {
    return { ok: false, error: 'Ya existe una cuenta con ese correo' };
  }

  accounts[normalized] = {
    email: normalized,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  saveAccounts(accounts);
  setAccountSession(normalized);
  return { ok: true };
}

export function loginAccount(email: string, password: string): AuthResult {
  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized)) {
    return { ok: false, error: 'Ingresá un correo válido' };
  }
  if (!password) {
    return { ok: false, error: 'Ingresá tu contraseña' };
  }

  const accounts = loadAccounts();
  const account = accounts[normalized];
  if (!account || account.passwordHash !== hashPassword(password)) {
    return { ok: false, error: 'Correo o contraseña incorrectos' };
  }

  setAccountSession(normalized);
  return { ok: true };
}

export function logoutAccount(): void {
  clearAccountSession();
}

export function verifyAccountPassword(email: string, password: string): boolean {
  const normalized = normalizeEmail(email);
  const account = loadAccounts()[normalized];
  if (!account || !password) return false;
  return account.passwordHash === hashPassword(password);
}

export function changeAccountPassword(
  email: string,
  currentPassword: string,
  nextPassword: string,
): AuthResult {
  const normalized = normalizeEmail(email);
  if (!verifyAccountPassword(normalized, currentPassword)) {
    return { ok: false, error: 'Contraseña actual incorrecta' };
  }
  if (nextPassword.length < 6) {
    return { ok: false, error: 'La nueva contraseña debe tener al menos 6 caracteres' };
  }
  if (nextPassword === currentPassword) {
    return { ok: false, error: 'La nueva contraseña debe ser distinta' };
  }

  const accounts = loadAccounts();
  const account = accounts[normalized];
  if (!account) {
    return { ok: false, error: 'No se encontró la cuenta' };
  }

  accounts[normalized] = {
    ...account,
    passwordHash: hashPassword(nextPassword),
  };
  saveAccounts(accounts);
  return { ok: true };
}
