const TREATMENT_TYPES = ['REPARACION_INTERNA', 'GARANTIA', 'ASEGURADORA'];

const POLICY_TYPES = ['PLAN_PISO', 'TRASLADO'];

// Etapas del expediente de seguros, solo avanza en este orden.
const INSURANCE_STAGES = ['ENVIO_PRESUPUESTO', 'AUTORIZACION', 'EN_REPARACION', 'ENTREGADA'];

// Documentos del expediente digital que se deben recopilar por cada caso de seguro.
const DOCUMENT_TYPES = [
  'ODA',
  'DEDUCIBLE',
  'DECLARACION_UNIVERSAL',
  'FINIQUITO',
  'ID_DECLARACION',
  'FACTURA_MARCA',
];

function insuranceStageIndex(stage) {
  return INSURANCE_STAGES.indexOf(stage);
}

function isForwardInsuranceStage(from, to) {
  return insuranceStageIndex(to) > insuranceStageIndex(from);
}

module.exports = {
  TREATMENT_TYPES,
  POLICY_TYPES,
  INSURANCE_STAGES,
  DOCUMENT_TYPES,
  insuranceStageIndex,
  isForwardInsuranceStage,
};
