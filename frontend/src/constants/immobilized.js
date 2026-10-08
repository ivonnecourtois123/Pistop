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

// Catálogo de Marcas del Grupo
export const GROUP_BRANDS = ['NISSAN', 'CHANGAN', 'RENAULT'];

// Catálogo completo de agencias / sucursales
export const DEFAULT_AGENCIES = [
  'Tuxtla Poniente',
  'Tuxtla Oriente',
  'Tapachula',
  'San Cristóbal',
  'Comitán',
  'Palenque',
  'Ocosingo',
  'Tenosique',
];

// Mapeo automático de códigos abreviados o letras a nombres reales de sucursal
export const AGENCY_CODE_MAP = {
  'TUX_PTE': 'Tuxtla Poniente',
  'TUX_OTE': 'Tuxtla Oriente',
  'TUXTLA_PTE': 'Tuxtla Poniente',
  'TUXTLA_OTE': 'Tuxtla Oriente',
  'TUXTLA PTE': 'Tuxtla Poniente',
  'TUXTLA OTE': 'Tuxtla Oriente',
  'TUXTLA': 'Tuxtla Poniente',
  'TAP': 'Tapachula',
  'TAPACHULA': 'Tapachula',
  'SCL': 'San Cristóbal',
  'SAN CRISTOBAL': 'San Cristóbal',
  'SAN CRISTÓBAL': 'San Cristóbal',
  'COM': 'Comitán',
  'COMITAN': 'Comitán',
  'COMITÁN': 'Comitán',
  'PAL': 'Palenque',
  'PALENQUE': 'Palenque',
  'OCO': 'Ocosingo',
  'OCOSINGO': 'Ocosingo',
  'TEN': 'Tenosique',
  'TENOSIQUE': 'Tenosique',
};

export function getFullAgencyName(rawCodeOrName) {
  if (!rawCodeOrName) return 'Sin agencia';
  const clean = String(rawCodeOrName).trim().toUpperCase();
  return AGENCY_CODE_MAP[clean] || rawCodeOrName;
}

// Checklist de documentos base y específicos por Aseguradora
export const INSURER_DOCUMENT_CHECKLISTS = {
  QUALITAS: [
    { key: 'ODA', label: 'Orden de Admisión (ODA)', required: true },
    { key: 'CONTRARRECIBO', label: 'Contrarrecibo', required: true },
    { key: 'DECLARACION_UNIVERSAL', label: 'Declaración Universal del Accidente', required: true },
    { key: 'INE', label: 'Identificación Oficial (INE)', required: true },
    { key: 'FACTURA', label: 'Factura / Carta Factura', required: true },
    { key: 'VALES_MO_REF', label: 'Vales de Mano de Obra y Refacciones', required: true },
    { key: 'FACTURA_MARCA', label: 'Factura Marca', required: true },
    { key: 'FINIQUITO', label: 'Finiquito Firmado', required: true },
    { key: 'DEDUCIBLE', label: 'Pago de Deducible o Demérito', required: false },
    { key: 'ENCUESTA', label: 'Encuesta de Satisfacción', required: false },
  ],
  ZURICH: [
    { key: 'ODA', label: 'Orden de Admisión (ODA)', required: true },
    { key: 'DECLARACION_UNIVERSAL', label: 'Declaración Universal del Accidente', required: true },
    { key: 'FINIQUITO', label: 'Finiquito Firmado', required: true },
    { key: 'FACTURA', label: 'Factura', required: true },
    { key: 'DEDUCIBLE', label: 'Pago de Deducible', required: false },
  ],
  GNP: [
    { key: 'ODA', label: 'Orden de Admisión (ODA)', required: true },
    { key: 'DECLARACION_UNIVERSAL', label: 'Declaración Universal del Accidente', required: true },
    { key: 'INE', label: 'Identificación Oficial (INE)', required: true },
    { key: 'FINIQUITO', label: 'Finiquito Firmado', required: true },
    { key: 'FACTURA_MARCA', label: 'Factura Marca', required: true },
    { key: 'DEDUCIBLE', label: 'Pago de Deducible o Demérito', required: false },
  ],
  CHUBB: [
    { key: 'ODA', label: 'Orden de Admisión (ODA)', required: true },
    { key: 'DECLARACION_UNIVERSAL', label: 'Declaración Universal del Accidente', required: true },
    { key: 'INE', label: 'Identificación Oficial (INE)', required: true },
    { key: 'FACTURA_MARCA', label: 'Factura Marca', required: true },
    { key: 'FINIQUITO', label: 'Finiquito Firmado', required: true },
    { key: 'DEDUCIBLE', label: 'Pago de Deducible', required: false },
  ],
  AXA: [
    { key: 'ODA', label: 'Orden de Admisión (ODA)', required: true },
    { key: 'DECLARACION_UNIVERSAL', label: 'Declaración Universal del Accidente', required: true },
    { key: 'FINIQUITO', label: 'Finiquito Firmado', required: true },
    { key: 'FACTURA', label: 'Factura', required: true },
    { key: 'INE', label: 'Identificación Oficial (INE)', required: true },
    { key: 'DEDUCIBLE', label: 'Pago de Deducible', required: false },
  ],
  DEFAULT: [
    { key: 'ODA', label: 'Orden de Admisión (ODA)', required: true },
    { key: 'DECLARACION_UNIVERSAL', label: 'Declaración universal del accidente', required: true },
    { key: 'FINIQUITO', label: 'Finiquito firmado', required: true },
    { key: 'ID_DECLARACION', label: 'ID con declaración del accidente', required: true },
    { key: 'FACTURA_MARCA', label: 'Factura Marca', required: true },
    { key: 'DEDUCIBLE', label: 'Pago de deducible o demérito', required: false },
  ],
};

export function getChecklistForInsurer(insurerName) {
  if (!insurerName) return INSURER_DOCUMENT_CHECKLISTS.DEFAULT;
  const upper = insurerName.toUpperCase();
  if (upper.includes('QUALITAS') || upper.includes('QUÁLITAS')) return INSURER_DOCUMENT_CHECKLISTS.QUALITAS;
  if (upper.includes('ZURICH')) return INSURER_DOCUMENT_CHECKLISTS.ZURICH;
  if (upper.includes('GNP')) return INSURER_DOCUMENT_CHECKLISTS.GNP;
  if (upper.includes('CHUBB')) return INSURER_DOCUMENT_CHECKLISTS.CHUBB;
  if (upper.includes('AXA')) return INSURER_DOCUMENT_CHECKLISTS.AXA;
  return INSURER_DOCUMENT_CHECKLISTS.DEFAULT;
}

export const DOCUMENT_TYPES = INSURER_DOCUMENT_CHECKLISTS.DEFAULT;


