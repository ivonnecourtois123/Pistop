import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_LINKS = [
  { label: 'Servicio', path: '/' },
  { label: 'HYP', path: '/hyp' },
  { label: 'Inmovilizados', path: '/inmovilizados' },
  { label: 'Seguros', path: '/seguros' },
  { label: 'Reportes', path: '/reportes' },
];

export default function TopNavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-outline-variant bg-surface">
      <div className="mx-auto flex h-full w-full max-w-container-max items-center justify-between px-margin-desktop">
        <div className="flex shrink-0 items-center gap-4">
          <img alt="PitStop Logo" className="h-10 w-10 object-contain" src="/logo.png" />
          <span className="font-display text-display font-bold text-primary">PitStop</span>
        </div>

        {/* lg y no md: con tres enlaces la barra ya no cabe junto al logo y las acciones
            en pantallas medianas, y se encimaba. */}
        <nav className="hidden h-full shrink-0 items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = link.path === location.pathname;
            return (
              <a
                key={link.label}
                href="#"
                title={link.path ? undefined : 'Próximamente'}
                className={
                  isActive
                    ? 'cursor-pointer border-b-2 border-secondary pb-1 font-headline-md text-secondary'
                    : link.path
                    ? 'cursor-pointer font-body-md text-on-surface-variant hover:text-secondary transition-colors'
                    : 'cursor-not-allowed font-body-md text-on-surface-variant/50'
                }
                onClick={(e) => {
                  e.preventDefault();
                  if (link.path) navigate(link.path);
                }}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/config')}
            title="Configuración"
            className={`material-symbols-outlined rounded-full p-2 transition-colors hover:bg-surface-container-high ${
              location.pathname === '/config' ? 'text-secondary' : 'text-on-surface-variant'
            }`}
            data-icon="settings"
          >
            settings
          </button>
          <button
            type="button"
            className="material-symbols-outlined rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
            data-icon="notifications"
          >
            notifications
          </button>
          <button
            type="button"
            onClick={logout}
            title="Cerrar sesión"
            className="flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-low p-1 pl-3 transition-all hover:border-outline hover:bg-surface-container"
          >
            <span className="font-body-md text-primary">{user?.name || 'Service Advisor'}</span>
            <span className="material-symbols-outlined text-primary" data-icon="account_circle">
              account_circle
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
