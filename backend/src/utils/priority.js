// Clasificación manual del trabajo, usada por el motor de priorización de la cola de
// asignación. Es independiente de `WorkOrder.serviceType`, que es el texto crudo que reporta
// el DMS ("SERVICIO", "DIAGNOSTICO DE FALLAS", ...) y no tiene un catálogo fijo.
//
// Catálogo provisional: se captura a mano hasta que exista el catálogo administrable desde
// Configuración (pendiente).
const SERVICE_CATEGORIES = ['MANTENIMIENTO', 'DIAGNOSTICO_FALLA_RECLAMO', 'PREVIA'];

module.exports = { SERVICE_CATEGORIES };
