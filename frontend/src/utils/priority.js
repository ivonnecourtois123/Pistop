// Motor de priorización de la cola de asignación (unidades ingresadas hoy).
//
// Dos reglas, nada más: hora de promesa de entrega y si el cliente espera en agencia. Se
// expresa como puntaje en vez de jerarquía estricta para que "cliente espera" pueda rebasar
// una promesa un poco más cercana sin que una orden con promesa vencida hace horas quede
// enterrada por eso.
//
// Convención: menor score = más urgente (se ordena ascendente).

const MS_PER_HOUR = 1000 * 60 * 60;

// Peso en horas. Ajustable: es política del taller, no una constante técnica.
const WEIGHT_CUSTOMER_WAITING = 3; // el cliente espera en agencia

// Las órdenes sin fecha promesa no tienen urgencia calculable: van al final, pero "cliente
// espera" sigue pudiendo adelantarlas entre sí.
const NO_PROMISE_BASE_HOURS = 10000;

// Una orden que requiere refacciones y aún no las tiene completas no es asignable.
// `partsNeeded === null` (desconocido, típico de órdenes capturadas a mano) NO congela:
// asumir lo contrario paralizaría el tablero con órdenes que quizá ni requieren piezas.
export function isFrozen(workOrder) {
  return workOrder.partsNeeded === true && workOrder.partsReady !== true;
}

function formatHours(hours) {
  const abs = Math.abs(hours);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

// Devuelve { score, reasons } — reasons explica el ranking en la UI para que el controlista
// pueda confiar en el orden en vez de tener que adivinar por qué una unidad quedó arriba.
export function computePriority(workOrder, now = new Date()) {
  const reasons = [];
  let score;

  if (workOrder.estimatedDeliveryAt) {
    const hoursLeft = (new Date(workOrder.estimatedDeliveryAt) - now) / MS_PER_HOUR;
    score = hoursLeft;
    reasons.push(
      hoursLeft < 0
        ? { text: `Promesa vencida hace ${formatHours(hoursLeft)}`, tone: 'urgent' }
        : { text: `Promesa en ${formatHours(hoursLeft)}`, tone: 'base' }
    );
  } else {
    score = NO_PROMISE_BASE_HOURS;
    reasons.push({ text: 'Sin hora promesa', tone: 'muted' });
  }

  if (workOrder.customerWaiting === true) {
    score -= WEIGHT_CUSTOMER_WAITING;
    reasons.push({ text: 'Cliente espera', tone: 'urgent' });
  }

  return { score, reasons };
}

// Ordena la cola: primero las asignables por urgencia, al final las congeladas por refacciones
// (que no se pueden asignar aunque su promesa esté encima).
export function sortByPriority(workOrders, now = new Date()) {
  return workOrders
    .map((wo) => ({ workOrder: wo, frozen: isFrozen(wo), ...computePriority(wo, now) }))
    .sort((a, b) => a.frozen - b.frozen || a.score - b.score);
}
