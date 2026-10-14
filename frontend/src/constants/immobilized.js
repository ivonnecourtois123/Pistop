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

// Catálogo estructurado de agencias por marca (proporcionado oficialmente por el Grupo)
export const AGENCIES_BY_BRAND = {
  NISSAN: [
    { id: 'San Cristóbal', name: 'San Cristóbal' },
    { id: 'Comitán', name: 'Comitán' },
    { id: 'Ocosingo', name: 'Ocosingo' },
    { id: 'Palenque', name: 'Palenque' },
    { id: 'Tenosique', name: 'Tenosique' },
    { id: 'Tuxtla Ote', name: 'Tuxtla Ote' },
    { id: 'Tuxtla Poniente', name: 'Tuxtla Poniente' },
    { id: 'Tapachula (Nissan)', name: 'Tapachula' },
  ],
  RENAULT: [
    { id: 'Renault Tuxtla', name: 'Tuxtla' },
    { id: 'Renault Tapachula', name: 'Tapachula' },
    { id: 'Renault Itsmo', name: 'Itsmo' },
  ],
  CHANGAN: [
    { id: 'Changan Tuxtla', name: 'Tuxtla' },
    { id: 'Changan Tapachula', name: 'Tapachula' },
  ],
};

// Lista plana para selectores estándar
export const DEFAULT_AGENCIES = [
  // Nissan
  'San Cristóbal',
  'Comitán',
  'Ocosingo',
  'Palenque',
  'Tenosique',
  'Tuxtla Ote',
  'Tuxtla Poniente',
  'Tapachula (Nissan)',
  // Renault
  'Renault Tuxtla',
  'Renault Tapachula',
  'Renault Itsmo',
  // Changan
  'Changan Tuxtla',
  'Changan Tapachula',
];

// Mapeo automático de códigos abreviados o variantes de nombres a nombres estándar
export const AGENCY_CODE_MAP = {
  // Nissan
  'TUX_PTE': 'Tuxtla Poniente',
  'TUX_OTE': 'Tuxtla Ote',
  'TUXTLA_PTE': 'Tuxtla Poniente',
  'TUXTLA_OTE': 'Tuxtla Ote',
  'TUXTLA PTE': 'Tuxtla Poniente',
  'TUXTLA OTE': 'Tuxtla Ote',
  'TUXTLA ORIENTE': 'Tuxtla Ote',
  'TUXTLA PONIENTE': 'Tuxtla Poniente',
  'TAP': 'Tapachula (Nissan)',
  'TAPACHULA': 'Tapachula (Nissan)',
  'TAPACHULA (NISSAN)': 'Tapachula (Nissan)',
  'NISSAN TAPACHULA': 'Tapachula (Nissan)',
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

  // Renault
  'REN_TUX': 'Renault Tuxtla',
  'RENAULT TUXTLA': 'Renault Tuxtla',
  'TUXTLA (RENAULT)': 'Renault Tuxtla',
  'REN_TAP': 'Renault Tapachula',
  'RENAULT TAPACHULA': 'Renault Tapachula',
  'TAPACHULA (RENAULT)': 'Renault Tapachula',
  'REN_ITSMO': 'Renault Itsmo',
  'RENAULT ITSMO': 'Renault Itsmo',
  'ITSMO (RENAULT)': 'Renault Itsmo',
  'ITSMO': 'Renault Itsmo',
  'ISTMO': 'Renault Itsmo',
  'RENAULT ISTMO': 'Renault Itsmo',

  // Changan
  'CHN_TUX': 'Changan Tuxtla',
  'CHANGAN TUXTLA': 'Changan Tuxtla',
  'TUXTLA (CHANGAN)': 'Changan Tuxtla',
  'CHN_TAP': 'Changan Tapachula',
  'CHANGAN TAPACHULA': 'Changan Tapachula',
  'TAPACHULA (CHANGAN)': 'Changan Tapachula',
};

// Mapeo exhaustivo de Agencias a Marcas del Grupo
export const AGENCY_BRAND_MAP = {
  // Nissan
  'San Cristóbal': 'NISSAN',
  'Comitán': 'NISSAN',
  'Ocosingo': 'NISSAN',
  'Palenque': 'NISSAN',
  'Tenosique': 'NISSAN',
  'Tuxtla Ote': 'NISSAN',
  'Tuxtla Oriente': 'NISSAN',
  'Tuxtla Poniente': 'NISSAN',
  'Tapachula': 'NISSAN',
  'Tapachula (Nissan)': 'NISSAN',
  'Nissan Tapachula': 'NISSAN',

  // Renault
  'Renault Tuxtla': 'RENAULT',
  'Tuxtla (Renault)': 'RENAULT',
  'Renault Tapachula': 'RENAULT',
  'Tapachula (Renault)': 'RENAULT',
  'Renault Itsmo': 'RENAULT',
  'Itsmo (Renault)': 'RENAULT',
  'Itsmo': 'RENAULT',
  'Istmo': 'RENAULT',
  'Renault Istmo': 'RENAULT',

  // Changan
  'Changan Tuxtla': 'CHANGAN',
  'Tuxtla (Changan)': 'CHANGAN',
  'Changan Tapachula': 'CHANGAN',
  'Tapachula (Changan)': 'CHANGAN',
};

export function getFullAgencyName(rawCodeOrName) {
  if (!rawCodeOrName) return 'Sin agencia';
  const clean = String(rawCodeOrName).trim().toUpperCase();
  return AGENCY_CODE_MAP[clean] || rawCodeOrName;
}

export function getAgencyBrand(rawCodeOrName) {
  if (!rawCodeOrName) return null;
  const str = String(rawCodeOrName).trim();
  const upper = str.toUpperCase();

  // 1. Mapeo directo o por alias normalizado
  const fullName = getFullAgencyName(str);
  if (AGENCY_BRAND_MAP[fullName]) return AGENCY_BRAND_MAP[fullName];
  if (AGENCY_BRAND_MAP[str]) return AGENCY_BRAND_MAP[str];
  if (AGENCY_BRAND_MAP[upper]) return AGENCY_BRAND_MAP[upper];

  // 2. Detección por palabras clave en el texto
  if (upper.includes('RENAULT') || upper.includes('ITSMO') || upper.includes('ISTMO')) return 'RENAULT';
  if (upper.includes('CHANGAN')) return 'CHANGAN';
  if (upper.includes('NISSAN')) return 'NISSAN';

  // 3. Plazas exclusivas de Nissan
  if (
    upper.includes('CRISTOBAL') ||
    upper.includes('CRISTÓBAL') ||
    upper.includes('COMITAN') ||
    upper.includes('COMITÁN') ||
    upper.includes('OCOSINGO') ||
    upper.includes('PALENQUE') ||
    upper.includes('TENOSIQUE') ||
    upper.includes('PONIENTE') ||
    upper.includes('PTE') ||
    upper.includes('ORIENTE') ||
    upper.includes('OTE')
  ) {
    return 'NISSAN';
  }

  return null;
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


