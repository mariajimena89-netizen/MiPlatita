import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, AlertTriangle } from 'lucide-react';
import { verifyPassword, markSessionUnlocked } from '../authStorage';

interface AppLockScreenProps {
  onUnlocked: () => void;
}

export const AppLockScreen: React.FC<AppLockScreenProps> = ({ onUnlocked }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password.trim()) {
      setError('Ingresá tu contraseña');
      return;
    }
    if (!verifyPassword(password)) {
      setError('Contraseña incorrecta');
      return;
    }
    markSessionUnlocked();
    onUnlocked();
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white border border-surface-container-high rounded-[32px] p-6 md:p-8 flex flex-col gap-5"
      >
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-forest-ink text-white flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-section-title text-forest-ink">MiPlatita</h1>
            <p className="type-meta mt-1">Ingresá tu contraseña para continuar</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label htmlFor="lock-password" className="font-label-caps text-fog">
            Contraseña
          </label>
          <input
            id="lock-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="ui-input w-full bg-surface-container-low border border-surface-container-high rounded-full px-4 text-forest-ink focus:outline-none focus:border-lime-volt focus:ring-2 focus:ring-lime-volt/20"
            placeholder="••••••••"
            autoFocus
          />

          {error && (
            <div className="flex items-center gap-2 text-[#cf2929] text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full hover:bg-forest-ink/90 mt-1">
            Desbloquear
          </button>
        </form>

        <p className="type-meta text-center">
          Demo local · la clave se guarda en este navegador
        </p>
      </motion.div>
    </div>
  );
};
