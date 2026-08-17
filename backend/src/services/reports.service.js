const prisma = require('../config/prisma');
const { getStageOrder } = require('../utils/workOrderStatus');

const MS_PER_HOUR = 1000 * 60 * 60;

// Cuánto duró la orden en cada etapa: el fin de una etapa es el inicio de la que le sigue
// *cronológicamente* en el historial, no la siguiente del pipeline — una orden puede saltarse
// etapas al avanzar, y en ese caso la etapa saltada nunca tuvo StatusEvent propio, así que no
// aporta una muestra (no se le puede inventar una duración de cero, sería un dato falso).
function stageDurationsForOrder(workOrder) {
  const events = [...workOrder.statusEvents].sort((a, b) => new Date(a.occurredAt) - new Date(b.occurredAt));
  const durations = [];
  for (let i = 0; i < events.length - 1; i += 1) {
    const start = new Date(events[i].occurredAt);
    const end = new Date(events[i + 1].occurredAt);
    durations.push({ stage: events[i].status, hours: (end - start) / MS_PER_HOUR });
  }
  return durations;
}

// Reporte de tiempo promedio por etapa + tiempo total de estadía (ingreso a entrega), para el
// panel de Reportes. Solo considera órdenes ya entregadas: mientras una orden sigue en el
// taller su "tiempo en la etapa actual" sigue corriendo, así que promediarla junto con las ya
// cerradas sesgaría el número hacia abajo sin que signifique nada real.
async function stageDurationsReport(orderType) {
  const workOrders = await prisma.workOrder.findMany({
    where: { orderType, status: 'ENTREGADO', deliveredAt: { not: null } },
    include: { statusEvents: true },
  });

  const stageSamples = new Map();
  const totalSamples = [];

  for (const wo of workOrders) {
    for (const { stage, hours } of stageDurationsForOrder(wo)) {
      if (!stageSamples.has(stage)) stageSamples.set(stage, []);
      stageSamples.get(stage).push(hours);
    }
    totalSamples.push((new Date(wo.deliveredAt) - new Date(wo.receivedAt)) / MS_PER_HOUR);
  }

  const average = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);

  const stages = getStageOrder(orderType).map((key) => {
    const samples = stageSamples.get(key) || [];
    return { key, avgHours: average(samples), sampleSize: samples.length };
  });

  return {
    orderType,
    sampleSize: workOrders.length,
    avgTotalHours: average(totalSamples),
    stages,
  };
}

module.exports = { stageDurationsReport };
