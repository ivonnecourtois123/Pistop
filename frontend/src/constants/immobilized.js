// Constantes compartidas para los módulos Inmovilizados y Seguros. Deben mantenerse en
// sincronía con backend/src/utils/immobilized.js — las claves son las mismas cadenas que
// guarda la base de datos.

export const TREATMENT_TYPES = ['REPARACION_INTERNA', 'GARANTIA', 'ASEGURADORA'];

export const TREATMENT_TYPE_LABELS = {
  REPARACION_INTERNA: 'Reparación interna',
  GARANTIA: 'Garantía',
  ASEGURADORA: 'Aseguradora',
};

export const POLICY_TYPES = ['PLAN_PISO', 'TRASLADO'];

export const POLICY_TYPE_LABELS = {
  PLAN_PISO: 'Plan piso',
  TRASLADO: 'Traslado',
};

// Etapas del expediente de seguros, en orden — solo avanza.
export const INSURANCE_STAGES = [
  { key: 'ENVIO_PRESUPUESTO', label: 'Envío de presupuesto' },
  { key: 'AUTORIZACION', label: 'Autorización' },
  { key: 'EN_REPARACION', label: 'En reparación' },
  { key: 'ENTREGADA', label: 'Entregada' },
];

export const INSURANCE_STAGE_LABEL = Object.fromEntries(INSURANCE_STAGES.map((s) => [s.key, s.label]));

// Checklist de documentos del expediente digital.
export const DOCUMENT_TYPES = [
  { key: 'ODA', label: 'ODA' },
  { key: 'DEDUCIBLE', label: 'Pago de deducible o demérito' },
  { key: 'DECLARACION_UNIVERSAL', label: 'Declaración universal del accidente' },
  { key: 'FINIQUITO', label: 'Finiquito firmado' },
  { key: 'ID_DECLARACION', label: 'ID con declaración del accidente' },
  { key: 'FACTURA_MARCA', label: 'Factura Marca' },
];
