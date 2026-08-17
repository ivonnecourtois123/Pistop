import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface">
      <h1 className="font-display text-display font-bold text-primary">404</h1>
      <p className="font-body-lg text-on-surface-variant">Página no encontrada</p>
      <Link to="/" className="font-headline-md text-secondary hover:underline">
        Volver al dashboard
      </Link>
    </div>
  );
}
