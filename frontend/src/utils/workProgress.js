// Semáforo de avance: compara cuánto lleva la orden en manos del técnico contra las horas
// estándar de su tipo de servicio (las que se configuran en Configuración → Capacidad
// instalada). Es una regla determinística sobre datos ya capturados, no una predicción: el
// taller puede auditar exactamente por qué una orden se pintó de rojo.
//
// El reloj arranca en `technicianAssignedAt`, no en `receivedAt`: el tiempo estándar mide
// trabajo de taller, y contar la espera previa a que alguien tome la unidad pintaría de rojo
// órdenes que ni siquiera han empezado — sería ruido, no una alerta.

const MS_PER_HOUR = 1000 * 60 * 60;

// Umbrales como fracción del tiempo estándar. Son política del taller, no constantes técnicas:
// se ajustan aquí.
const WARN_THRESHOLD = 0.7;

export const PROGRESS_LEVELS = {
  UNKNOWN: 'UNKNOWN',
  OK: 'OK',
  WARN: 'WARN',
  LATE: 'LATE',
};

export const PROGRESS_LABEL = {
  UNKNOWN: 'Sin dato',
  OK: 'A tiempo',
  WARN: 'Por vencer',
  LATE: 'Excedido',
};

// Orden de atención: lo que urge primero. Se usa para ordenar el resumen del semáforo, donde
// mostrar las órdenes en verde arriba dejaría lo importante fuera de la vista.
export const PROGRESS_SEVERITY = {
  LATE: 0,
  WARN: 1,
  UNKNOWN: 2,
  OK: 3,
};

export const PROGRESS_DOT_CLASS = {
  UNKNOWN: 'bg-outline-variant',
  OK: 'bg-progress-ok',
  WARN: 'bg-progress-warn',
  LATE: 'bg-error',
};

export const PROGRESS_BORDER_CLASS = {
  UNKNOWN: 'border-outline-variant',
  OK: 'border-progress-ok',
  WARN: 'border-progress-warn',
  LATE: 'border-error',
};

// Franja lateral para tarjetas que se leen a distancia (magnetoplano): el punto de 10px se
// pierde al escanear el tablero completo, la franja no.
export const PROGRESS_STRIPE_CLASS = {
  UNKNOWN: 'border-l-outline-variant',
  OK: 'border-l-progress-ok',
  WARN: 'border-l-progress-warn',
  LATE: 'border-l-error',
};

function formatHours(hours) {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  return `${hours.toFixed(1)} h`;
}

// `standardHoursByCategory`: mapa { CATEGORIA: horas } que viene de la configuración del taller.
// Devuelve siempre un objeto con `level` y `label`, para que quien lo pinte no tenga que
// manejar casos nulos por su cuenta.
export function computeWorkProgress(workOrder, standardHoursByCategory, now = new Date()) {
  if (!workOrder.technicianAssignedAt) {
    return { level: PROGRESS_LEVELS.UNKNOWN, label: 'Sin técnico asignado — el reloj no ha iniciado' };
  }

  const standardHours = workOrder.serviceCategory
    ? standardHoursByCategory?.[workOrder.serviceCategory]
    : null;

  if (standardHours == null) {
    return {
      level: PROGRESS_LEVELS.UNKNOWN,
      label: 'Sin tiempo estándar: falta clasificar el tipo de servicio',
    };
  }

  const elapsedHours = (now - new Date(workOrder.technicianAssignedAt)) / MS_PER_HOUR;
  const ratio = elapsedHours / standardHours;

  const detail = `${formatHours(elapsedHours)} de ${formatHours(standardHours)} estándar (${Math.round(ratio * 100)}%)`;

  if (ratio >= 1) {
    return { level: PROGRESS_LEVELS.LATE, ratio, label: `Excedió el tiempo estándar — ${detail}` };
  }
  if (ratio >= WARN_THRESHOLD) {
    return { level: PROGRESS_LEVELS.WARN, ratio, label: `Cerca del tiempo estándar — ${detail}` };
  }
  return { level: PROGRESS_LEVELS.OK, ratio, label: `Dentro del tiempo estándar — ${detail}` };
}
