import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Eye, EyeOff, Wallet } from 'lucide-react';
import { loginAccount, registerAccount } from '../accountAuth';

interface AuthScreenProps {
  onAuthenticated: (email: string) => void;
}

type Mode = 'login' | 'register';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const isRegister = mode === 'register';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (password !== confirm) {
        setError('Las contraseñas no coinciden');
        return;
      }
      const result = registerAccount(email, password);
      if (result.ok === false) {
        setError(result.error);
        return;
      }
      onAuthenticated(email.trim().toLowerCase());
      return;
    }

    const result = loginAccount(email, password);
    if (result.ok === false) {
      setError(result.error);
      return;
    }
    onAuthenticated(email.trim().toLowerCase());
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
    setPassword('');
    setConfirm('');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white border border-surface-container-high rounded-[32px] p-6 md:p-8 flex flex-col gap-5"
      >
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-lime-volt text-forest-ink border-[3px] border-forest-ink flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-section-title text-forest-ink">MiPlatita</h1>
            <p className="type-meta mt-1">
              {isRegister ? 'Creá tu cuenta para empezar' : 'Ingresá a tu cuenta'}
            </p>
          </div>
        </div>

        <div
          className="flex bg-surface-container-low border border-surface-container rounded-full p-0.5"
          role="tablist"
          aria-label="Modo de acceso"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!isRegister}
            onClick={() => switchMode('login')}
            className={`flex-1 py-2 rounded-full font-label-caps text-[11px] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-volt ${
              !isRegister ? 'bg-forest-ink text-white' : 'text-fog hover:text-forest-ink'
            }`}
          >
            Ingresar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isRegister}
            onClick={() => switchMode('register')}
            className={`flex-1 py-2 rounded-full font-label-caps text-[11px] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-volt ${
              isRegister ? 'bg-forest-ink text-white' : 'text-fog hover:text-forest-ink'
            }`}
          >
            Crear cuenta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-email" className="font-label-caps text-fog">
              Correo
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ui-input w-full bg-surface-container-low border border-surface-container-high rounded-full px-4 text-forest-ink focus:outline-none focus:border-lime-volt focus:ring-2 focus:ring-lime-volt/20"
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-password" className="font-label-caps text-fog">
              Contraseña
            </label>
            <div className="relative flex items-center">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ui-input w-full bg-surface-container-low border border-surface-container-high rounded-full px-4 pr-12 text-forest-ink focus:outline-none focus:border-lime-volt focus:ring-2 focus:ring-lime-volt/20"
                placeholder={isRegister ? 'Mínimo 6 caracteres' : '••••••••'}
                required
                minLength={isRegister ? 6 : 1}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 text-fog hover:text-forest-ink cursor-pointer p-1 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-volt"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-confirm" className="font-label-caps text-fog">
                Confirmar contraseña
              </label>
              <input
                id="auth-confirm"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="ui-input w-full bg-surface-container-low border border-surface-container-high rounded-full px-4 text-forest-ink focus:outline-none focus:border-lime-volt focus:ring-2 focus:ring-lime-volt/20"
                placeholder="Repetí la contraseña"
                required
                minLength={6}
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-[#cf2929] text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full hover:bg-forest-ink/90 mt-1">
            {isRegister ? 'Crear cuenta' : 'Ingresar'}
          </button>
        </form>

        <p className="type-meta text-center leading-relaxed">
          V1 demo · cuentas en este navegador (sin servidor)
        </p>
      </motion.div>
    </div>
  );
};
