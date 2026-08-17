import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('asesor@pitstop.mx');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-margin-mobile">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <img src="/logo.png" alt="PitStop" className="h-16 w-16 object-contain" />
          <span className="font-display text-display font-bold text-primary">PitStop</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card-elevation rounded-lg border border-outline-variant bg-surface-container-lowest p-card-padding"
        >
          <h1 className="mb-6 font-headline-md text-headline-md text-primary">
            Acceso Service Advisor
          </h1>

          {error && (
            <div className="mb-4 rounded border border-error bg-error-container/40 px-4 py-2 text-sm text-on-error-container">
              {error}
            </div>
          )}

          <label className="mb-4 block">
            <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
              CORREO
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border-2 border-transparent bg-[#EDF2F7] px-4 py-3 font-body-lg text-primary transition-all focus:border-primary focus:bg-white focus:ring-0"
              placeholder="asesor@pitstop.mx"
            />
          </label>

          <label className="mb-6 block">
            <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
              CONTRASEÑA
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border-2 border-transparent bg-[#EDF2F7] px-4 py-3 font-body-lg text-primary transition-all focus:border-primary focus:bg-white focus:ring-0"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-secondary-container py-3 font-headline-md text-on-secondary-container transition-all hover:bg-secondary-container/90 disabled:opacity-60"
          >
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
