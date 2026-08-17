// Pipelines de etapas por tipo de orden. El tipo de orden (orderType) determina qué
// secuencia de etapas aplica; el estatus (status) siempre debe ser válido dentro del
// pipeline de su propio orderType.
const SERVICIO_STAGES = ['RECIBIDO', 'EN_TALLER', 'LAVADO', 'CONTROL_CALIDAD', 'TERMINADO', 'ENTREGADO'];

const HYP_STAGES = [
  'EN_VALUACION',
  'PRESUPUESTO_ENVIADO',
  'PRESUPUESTO_AUTORIZADO',
  'PEDIDO_REFACCIONES',
  'EN_COMPLEMENTO',
  'REFACCIONES_SURTIDAS_PARCIAL',
  'REFACCIONES_COMPLETAS',
  'CONFORMADO_LAMINA',
  'MECANICA_COLISION',
  'PREPARACION',
  'PINTURA',
  'ENSAMBLE',
  'PULIDO',
  'CONTROL_CALIDAD',
  'LAVADO',
  'TERMINADO',
  'ENTREGADO',
];

const STAGE_PIPELINES = { SERVICIO: SERVICIO_STAGES, HYP: HYP_STAGES };

const ORDER_TYPES = ['SERVICIO', 'HYP'];

// Unión de todas las claves de etapa válidas en cualquier pipeline (para validación de esquemas).
const ALL_STAGE_KEYS = [...new Set([...SERVICIO_STAGES, ...HYP_STAGES])];

function getStageOrder(orderType) {
  return STAGE_PIPELINES[orderType] || SERVICIO_STAGES;
}

function statusIndex(orderType, status) {
  return getStageOrder(orderType).indexOf(status);
}

function isForwardTransition(orderType, from, to) {
  return statusIndex(orderType, to) > statusIndex(orderType, from);
}

// Sub-estados: marcas opcionales *dentro* de una etapa, no etapas del pipeline. No avanzan ni
// retroceden el flujo (por eso no entran en STAGE_PIPELINES), solo matizan la situación de la
// unidad mientras sigue en la misma etapa. Se limpian al cambiar de etapa.
// El mapa se indexa por clave de etapa, así que una etapa que exista en ambos pipelines
// heredaría los mismos sub-estados; hoy solo aplican a etapas exclusivas de Servicio.
const STAGE_SUB_STATES = {
  RECIBIDO: ['POR_ASIGNAR'],
  EN_TALLER: ['ESPERANDO_REFACCIONES'],
};

const ALL_SUB_STATES = [...new Set(Object.values(STAGE_SUB_STATES).flat())];

function getSubStates(status) {
  return STAGE_SUB_STATES[status] || [];
}

function isValidSubState(status, subState) {
  return getSubStates(status).includes(subState);
}

module.exports = {
  SERVICIO_STAGES,
  HYP_STAGES,
  STAGE_PIPELINES,
  ORDER_TYPES,
  ALL_STAGE_KEYS,
  getStageOrder,
  statusIndex,
  isForwardTransition,
  STAGE_SUB_STATES,
  ALL_SUB_STATES,
  getSubStates,
  isValidSubState,
};
