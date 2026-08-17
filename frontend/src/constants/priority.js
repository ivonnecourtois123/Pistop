// Clasificación manual del trabajo, independiente del texto crudo `serviceType` del DMS.
// Debe mantenerse en sincronía con SERVICE_CATEGORIES de backend/src/utils/priority.js.
//
// Catálogo provisional: se captura a mano hasta que exista el catálogo administrable desde
// Configuración (pendiente).
export const SERVICE_CATEGORIES = [
  { key: 'MANTENIMIENTO', label: 'Mantenimiento' },
  { key: 'DIAGNOSTICO_FALLA_RECLAMO', label: 'Diagnóstico / Falla / Reclamo' },
  { key: 'PREVIA', label: 'Previa' },
];

export const SERVICE_CATEGORY_LABEL = Object.fromEntries(
  SERVICE_CATEGORIES.map((c) => [c.key, c.label])
);
