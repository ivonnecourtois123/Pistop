export default function Spinner({ className = '' }) {
  return (
    <div
      className={`h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary ${className}`}
      role="status"
      aria-label="Cargando"
    />
  );
}
