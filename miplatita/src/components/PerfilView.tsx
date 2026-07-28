import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  Check, 
  Lock, 
  Eye,
  EyeOff,
  Shield,
  Wallet,
  LogOut,
} from 'lucide-react';
import {
  getLockOnOpen,
  setLockOnOpen,
  clearSessionUnlock,
} from '../authStorage';
import { changeAccountPassword } from '../accountAuth';

interface PerfilViewProps {
  userEmail: string;
  onLogout: () => void;
  incomeARS: number;
  incomeUSD: number;
  onUpdateIncomeARS: (value: number) => void;
  onUpdateIncomeUSD: (value: number) => void;
  expensesCount: number;
  activePeriod: string;
  periodOptions: { value: string; label: string }[];
  onChangePeriod: (periodKey: string) => void;
}

export const PerfilView: React.FC<PerfilViewProps> = ({
  userEmail,
  onLogout,
  incomeARS,
  incomeUSD,
  onUpdateIncomeARS,
  onUpdateIncomeUSD,
  expensesCount,
  activePeriod,
  periodOptions,
  onChangePeriod,
}) => {
  const [tempIncomeARS, setTempIncomeARS] = useState(incomeARS.toString());
  const [tempIncomeUSD, setTempIncomeUSD] = useState(incomeUSD.toString());
  const [showBudgetSaved, setShowBudgetSaved] = useState(false);

  // Sync inputs when period (and thus incomes) change
  React.useEffect(() => {
    setTempIncomeARS(incomeARS.toString());
    setTempIncomeUSD(incomeUSD.toString());
  }, [incomeARS, incomeUSD, activePeriod]);

  const [lockOnOpen, setLockOnOpenState] = useState(() => getLockOnOpen());
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [securityMsg, setSecurityMsg] = useState('');
  const [securityError, setSecurityError] = useState('');

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ars = parseFloat(tempIncomeARS);
    const usd = parseFloat(tempIncomeUSD);
    let saved = false;
    if (!isNaN(ars) && ars > 0) {
      onUpdateIncomeARS(ars);
      saved = true;
    }
    if (!isNaN(usd) && usd > 0) {
      onUpdateIncomeUSD(usd);
      saved = true;
    }
    if (saved) {
      setShowBudgetSaved(true);
      setTimeout(() => setShowBudgetSaved(false), 2500);
    }
  };

  const flashSecurity = (msg: string) => {
    setSecurityMsg(msg);
    setSecurityError('');
    setTimeout(() => setSecurityMsg(''), 2500);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError('');

    if (newPassword !== confirmPassword) {
      setSecurityError('Las contraseñas no coinciden');
      return;
    }

    const result = changeAccountPassword(userEmail, currentPassword, newPassword);
    if (result.ok === false) {
      setSecurityError(result.error);
      return;
    }

    setNewPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
    flashSecurity('Contraseña de cuenta actualizada');
  };

  const handleToggleLock = () => {
    const next = !lockOnOpen;
    setLockOnOpen(next);
    setLockOnOpenState(next);
    if (next) {
      clearSessionUnlock();
    }
    flashSecurity(
      next
        ? 'Se pedirá la contraseña de tu cuenta al abrir'
        : 'No se pedirá contraseña al abrir',
    );
  };

  return (
    <div className="flex flex-col gap-5 md:gap-6 w-full py-1 max-w-3xl">
      <h2 className="font-page-title text-forest-ink md:text-4xl">
        Mi Perfil
      </h2>

      {/* 1 — Identidad (compacta, horizontal) */}
      <div className="bg-white border border-surface-container-high rounded-[24px] md:rounded-[28px] px-4 py-3.5 md:px-5 md:py-4 flex items-center gap-3.5 md:gap-4 min-w-0">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-lime-volt text-forest-ink rounded-full flex items-center justify-center font-display text-xl md:text-2xl font-black border-[3px] border-forest-ink shrink-0">
          {userEmail.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-bold text-forest-ink leading-tight truncate">
            Cuenta
          </h3>
          <p className="type-meta truncate mt-0.5">{userEmail}</p>
        </div>
        <div className="shrink-0 text-right pl-2 border-l border-surface-container-high">
          <span className="type-meta block">Gastos</span>
          <span className="text-base md:text-lg font-bold text-forest-ink tabular-nums leading-none">
            {expensesCount}
          </span>
          <span className="type-meta block mt-0.5">en el mes</span>
        </div>
      </div>

      {/* 2 — Período */}
      <div className="bg-white border border-surface-container-high p-5 md:p-6 flex flex-col gap-3 rounded-[24px] md:rounded-[28px]">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-forest-ink" />
          <h4 className="font-section-title text-forest-ink">Período</h4>
        </div>
        <p className="type-meta leading-relaxed">
          Elegí el mes para ver y cargar gastos e ingresos de ese período.
        </p>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="period-select" className="font-label-caps text-fog">
            Mes
          </label>
          <select
            id="period-select"
            value={activePeriod}
            onChange={(e) => onChangePeriod(e.target.value)}
            className="ui-input w-full bg-surface-container-low border border-surface-container-high rounded-full px-4 text-forest-ink focus:outline-none focus:border-lime-volt focus:ring-2 focus:ring-lime-volt/20 transition-all cursor-pointer appearance-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23083400' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              backgroundSize: '14px',
            }}
          >
            {periodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 — Ingresos mensuales */}
      <div className="bg-white border border-surface-container-high p-5 md:p-6 flex flex-col gap-3 md:gap-4 rounded-[24px] md:rounded-[28px]">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-forest-ink" />
          <h4 className="font-section-title text-forest-ink">Ingresos mensuales</h4>
        </div>

        <form onSubmit={handleBudgetSubmit} className="flex flex-col gap-3 md:gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="income-ars" className="font-label-caps text-fog">Ingresos ARS</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 font-bold text-forest-ink text-sm">$</span>
                <input
                  id="income-ars"
                  type="number"
                  value={tempIncomeARS}
                  onChange={(e) => setTempIncomeARS(e.target.value)}
                  placeholder="2000"
                  className="ui-input w-full bg-surface-container-low border border-surface-container-high rounded-full pl-8 pr-4 text-forest-ink focus:outline-none focus:border-lime-volt focus:ring-2 focus:ring-lime-volt/20"
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="income-usd" className="font-label-caps text-fog">Ingresos USD</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 font-bold text-forest-ink text-sm">US$</span>
                <input
                  id="income-usd"
                  type="number"
                  value={tempIncomeUSD}
                  onChange={(e) => setTempIncomeUSD(e.target.value)}
                  placeholder="100"
                  className="ui-input w-full bg-surface-container-low border border-surface-container-high rounded-full pl-12 pr-4 text-forest-ink focus:outline-none focus:border-lime-volt focus:ring-2 focus:ring-lime-volt/20"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-secondary hover:bg-forest-ink/90 w-full">
            Guardar
          </button>

          {showBudgetSaved && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="type-meta text-[#008026] flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Ingresos actualizados
            </motion.p>
          )}
        </form>
      </div>

      {/* 4 — Mi contraseña (misma del login) */}
      <div className="bg-white border border-surface-container-high p-5 md:p-6 flex flex-col gap-4 rounded-[24px] md:rounded-[28px]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-forest-ink" />
          <h4 className="font-section-title text-forest-ink">Mi contraseña</h4>
        </div>

        <p className="type-meta leading-relaxed">
          Es la misma contraseña con la que iniciás sesión ({userEmail}). Mínimo 6 caracteres.
        </p>

        <form onSubmit={handleSavePassword} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="current-pw" className="font-label-caps text-fog">
              Contraseña actual
            </label>
            <input
              id="current-pw"
              type={showPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="ui-input w-full bg-surface-container-low border border-surface-container-high rounded-full px-4 text-forest-ink focus:outline-none focus:border-lime-volt focus:ring-2 focus:ring-lime-volt/20"
              placeholder="Actual"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-pw" className="font-label-caps text-fog">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                id="new-pw"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="ui-input w-full bg-surface-container-low border border-surface-container-high rounded-full px-4 pr-11 text-forest-ink focus:outline-none focus:border-lime-volt focus:ring-2 focus:ring-lime-volt/20"
                placeholder="Mín. 6 caracteres"
                autoComplete="new-password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fog hover:text-forest-ink cursor-pointer p-1"
                aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm-pw" className="font-label-caps text-fog">
              Confirmar
            </label>
            <input
              id="confirm-pw"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="ui-input w-full bg-surface-container-low border border-surface-container-high rounded-full px-4 text-forest-ink focus:outline-none focus:border-lime-volt focus:ring-2 focus:ring-lime-volt/20"
              placeholder="Repetí la contraseña"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>

          {securityError && (
            <p className="text-xs font-semibold text-[#cf2929]">{securityError}</p>
          )}
          {securityMsg && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="type-meta text-[#008026] flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> {securityMsg}
            </motion.p>
          )}

          <button type="submit" className="btn-secondary hover:bg-forest-ink/90 w-full">
            Actualizar contraseña
          </button>
        </form>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-surface-container-high">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-forest-ink">Pedir al abrir</p>
            <p className="type-meta">Vuelve a pedir la contraseña de tu cuenta al recargar</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={lockOnOpen}
            onClick={handleToggleLock}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-volt ${
              lockOnOpen ? 'bg-forest-ink' : 'bg-surface-container-high'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                lockOnOpen ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="pt-3 border-t border-surface-container-high">
          <button
            type="button"
            onClick={onLogout}
            className="btn-secondary w-full inline-flex items-center justify-center gap-2 bg-surface-container text-forest-ink hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-volt"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden />
            Cerrar sesión
          </button>
          <p className="type-meta text-center mt-2">
            Volvés a la pantalla de ingreso con tu correo
          </p>
        </div>
      </div>

      <div className="bg-surface-container-low border border-surface-container-high p-4 rounded-2xl flex items-start gap-3">
        <Lock className="w-4 h-4 text-fog shrink-0 mt-0.5" />
        <div>
          <span className="text-sm font-semibold text-forest-ink block">Privacidad local</span>
          <p className="type-meta mt-0.5 leading-relaxed">
            Cuenta, datos y bloqueo viven en tu navegador (localStorage). Demo académica V1, no producción.
          </p>
        </div>
      </div>
    </div>
  );
};
