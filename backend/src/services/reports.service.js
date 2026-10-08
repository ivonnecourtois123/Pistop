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

// Reporte de refacciones en proceso para órdenes abiertas
async function pendingPartsReport() {
  const parts = await prisma.pendingPart.findMany({
    include: {
      workOrder: {
        include: {
          vehicle: {
            include: {
              customer: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalParts = parts.length;
  const pendingCount = parts.filter((p) => !p.received).length;
  const receivedCount = parts.filter((p) => p.received).length;

  const ordersSet = new Set();
  const pendingOrdersSet = new Set();
  let totalPendingAmount = 0;
  let totalPartsAmount = 0;

  for (const p of parts) {
    const partAmount = Number(p.amount) || 0;
    totalPartsAmount += partAmount;
    ordersSet.add(p.workOrderId);
    if (!p.received) {
      pendingOrdersSet.add(p.workOrderId);
      totalPendingAmount += partAmount;
    }
  }

  return {
    totalParts,
    pendingCount,
    receivedCount,
    totalOrdersWithParts: ordersSet.size,
    ordersWaitingParts: pendingOrdersSet.size,
    totalPendingAmount,
    totalPartsAmount,
    parts: parts.map((p) => ({
      id: p.id,
      partNumber: p.partNumber,
      description: p.description || 'Sin descripción',
      orderNumber: p.orderNumber,
      orderDate: p.orderDate,
      amount: Number(p.amount) || 0,
      received: p.received,
      receivedAt: p.receivedAt,
      createdAt: p.createdAt,
      workOrderId: p.workOrderId,
      workOrderNumber: p.workOrder?.orderNumber || 'S/N',
      orderType: p.workOrder?.orderType || 'SERVICIO',
      workOrderStatus: p.workOrder?.status || 'RECIBIDO',
      agency: p.workOrder?.agency || p.workOrder?.tower || 'Tuxtla Poniente',
      vehicle: p.workOrder?.vehicle
        ? {
            plate: p.workOrder.vehicle.plate,
            brand: p.workOrder.vehicle.brand,
            model: p.workOrder.vehicle.model,
            customerName: p.workOrder.vehicle.customer?.name || 'Cliente general',
          }
        : null,
    })),
  };
}

// Reporte ejecutivo central de KPIs del taller
async function executiveKpisReport() {
  const [servicioDurations, hypDurations, inProgressOrders, totalDelivered] = await Promise.all([
    stageDurationsReport('SERVICIO'),
    stageDurationsReport('HYP'),
    prisma.workOrder.findMany({
      where: { status: { not: 'ENTREGADO' } },
      include: {
        vehicle: true,
      },
    }),
    prisma.workOrder.count({
      where: { status: 'ENTREGADO' },
    }),
  ]);

  const servicioInProgress = inProgressOrders.filter((o) => o.orderType === 'SERVICIO');
  const hypInProgress = inProgressOrders.filter((o) => o.orderType === 'HYP');

  // Conteo por categoría de servicio
  const categoriesCount = {};
  for (const o of inProgressOrders) {
    const cat = o.serviceCategory || 'SIN_CLASIFICAR';
    categoriesCount[cat] = (categoriesCount[cat] || 0) + 1;
  }

  // Conteo por estatus actual
  const statusCounts = {};
  for (const o of inProgressOrders) {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  }

  return {
    tpeServicioHours: servicioDurations.avgTotalHours,
    tpeHypHours: hypDurations.avgTotalHours,
    totalDelivered,
    totalInProgress: inProgressOrders.length,
    servicioInProgressCount: servicioInProgress.length,
    hypInProgressCount: hypInProgress.length,
    categoriesCount,
    statusCounts,
  };
}

module.exports = {
  stageDurationsReport,
  pendingPartsReport,
  executiveKpisReport,
};

