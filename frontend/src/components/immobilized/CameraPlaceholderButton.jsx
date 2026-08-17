// Botón de cámara sin funcionalidad todavía — marca el lugar donde más adelante se podrán
// adjuntar fotos del daño / de la unidad resuelta. Deshabilitado a propósito hasta que se
// habilite el almacenamiento de archivos.
export default function CameraPlaceholderButton({ label }) {
  return (
    <button
      type="button"
      disabled
      title="Función de fotos próximamente disponible"
      className="flex items-center gap-2 rounded-lg border border-dashed border-outline-variant px-3 py-2 font-label-caps text-[11px] text-on-surface-variant/70"
    >
      <span className="material-symbols-outlined text-base" data-icon="photo_camera">
        photo_camera
      </span>
      {label}
    </button>
  );
}
