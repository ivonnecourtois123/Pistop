// Módulo compartido de etapas por tipo de orden (Servicio / HYP). Debe mantenerse en sincronía
// con backend/src/utils/workOrderStatus.js — las claves de etapa son las mismas cadenas que
// guarda la base de datos en WorkOrder.status / StatusEvent.status / StageComment.stage.

export const ORDER_TYPE_LABELS = {
  SERVICIO: 'Servicio',
  HYP: 'HYP',
};

export const SERVICIO_STAGES = [
  { key: 'RECIBIDO', label: 'Recibido', icon: 'check_circle' },
  { key: 'EN_TALLER', label: 'En Taller', icon: 'build' },
  { key: 'LAVADO', label: 'Lavado', icon: 'local_car_wash' },
  { key: 'CONTROL_CALIDAD', label: 'Control de Calidad', icon: 'fact_check' },
  { key: 'TERMINADO', label: 'Terminado', icon: 'task_alt' },
  { key: 'ENTREGADO', label: 'Entregado', icon: 'done_all' },
];

export const HYP_STAGES = [
  { key: 'EN_VALUACION', label: 'En Valuación', icon: 'search' },
  { key: 'PRESUPUESTO_ENVIADO', label: 'Presupuesto Enviado', icon: 'send' },
  { key: 'PRESUPUESTO_AUTORIZADO', label: 'Presupuesto Autorizado', icon: 'verified' },
  { key: 'PEDIDO_REFACCIONES', label: 'Pedido de Refacciones', icon: 'inventory_2' },
  { key: 'EN_COMPLEMENTO', label: 'En Complemento', icon: 'add_box' },
  { key: 'REFACCIONES_SURTIDAS_PARCIAL', label: 'Refacciones Surtidas Parcial', icon: 'inventory' },
  { key: 'REFACCIONES_COMPLETAS', label: 'Refacciones Completas', icon: 'check_box' },
  { key: 'CONFORMADO_LAMINA', label: 'Conformado de Lámina', icon: 'construction' },
  { key: 'MECANICA_COLISION', label: 'Mecánica de Colisión', icon: 'car_crash' },
  { key: 'PREPARACION', label: 'Preparación', icon: 'build_circle' },
  { key: 'PINTURA', label: 'Pintura', icon: 'format_paint' },
  { key: 'ENSAMBLE', label: 'Ensamble', icon: 'handyman' },
  { key: 'PULIDO', label: 'Pulido', icon: 'auto_awesome' },
  { key: 'CONTROL_CALIDAD', label: 'Control de Calidad', icon: 'fact_check' },
  { key: 'LAVADO', label: 'Lavado', icon: 'local_car_wash' },
  { key: 'TERMINADO', label: 'Terminado', icon: 'task_alt' },
  { key: 'ENTREGADO', label: 'Entregado', icon: 'done_all' },
];

export const STAGE_PIPELINES = { SERVICIO: SERVICIO_STAGES, HYP: HYP_STAGES };

export function getStages(orderType) {
  return STAGE_PIPELINES[orderType] || SERVICIO_STAGES;
}

// Mapas planos label/icon por clave de etapa, para badges y listas que no necesitan el pipeline
// completo (ej. InProgressList, PromiseTimeBoard). Cuando una clave existe en ambos pipelines
// (Control de Calidad, Lavado, Terminado, Entregado) el label/icon es idéntico en ambos.
export const STAGE_LABEL = Object.fromEntries(
  [...SERVICIO_STAGES, ...HYP_STAGES].map((s) => [s.key, s.label])
);

export const STAGE_ICON = Object.fromEntries(
  [...SERVICIO_STAGES, ...HYP_STAGES].map((s) => [s.key, s.icon])
);

// Sub-estados: marcas opcionales *dentro* de una etapa, no etapas del pipeline. Matizan la
// situación de la unidad sin avanzar el flujo, y se limpian al cambiar de etapa.
// Debe mantenerse en sincronía con STAGE_SUB_STATES de backend/src/utils/workOrderStatus.js.
export const STAGE_SUB_STATES = {
  RECIBIDO: [{ key: 'POR_ASIGNAR', label: 'Por asignar', icon: 'person_search' }],
  EN_TALLER: [{ key: 'ESPERANDO_REFACCIONES', label: 'Esperando refacciones', icon: 'inventory_2' }],
};

export function getSubStates(status) {
  return STAGE_SUB_STATES[status] || [];
}

export const SUB_STATE_LABEL = Object.fromEntries(
  Object.values(STAGE_SUB_STATES)
    .flat()
    .map((s) => [s.key, s.label])
);
