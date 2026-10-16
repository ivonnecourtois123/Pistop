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

function resolveDateRange(period, startDate, endDate) {
  const now = new Date();
  let from;
  let to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  if (period === 'today') {
    from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  } else if (period === 'week') {
    from = new Date(now);
    const day = now.getDay() || 7; // Lunes = 1
    from.setDate(now.getDate() - day + 1);
    from.setHours(0, 0, 0, 0);
  } else if (period === 'month') {
    from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  } else if (period === 'custom' && startDate) {
    from = new Date(startDate);
    from.setHours(0, 0, 0, 0);
    if (endDate) {
      to = new Date(endDate);
      to.setHours(23, 59, 59, 999);
    }
  } else {
    // 'all'
    from = new Date(0);
  }
  return { from, to };
}

function getStageDuration(events, targetStage) {
  let totalHours = 0;
  for (let i = 0; i < events.length; i++) {
    if (events[i].status === targetStage) {
      const start = new Date(events[i].occurredAt);
      const end = events[i + 1] ? new Date(events[i + 1].occurredAt) : new Date();
      totalHours += Math.max(0, (end - start) / MS_PER_HOUR);
    }
  }
  return totalHours;
}

/**
 * Reporte de Rendimiento Operativo de Técnicos y Lavadores
 * Separado estrictamente por Servicio Mecánico vs HYP (Carrocería y Pintura)
 */
async function productivityReport(params = {}) {
  const {
    orderType = 'SERVICIO',
    period = 'month',
    startDate = null,
    endDate = null,
    agency = null,
  } = params;

  const { from, to } = resolveDateRange(period, startDate, endDate);

  // Catálogo de horas estándar para calcular horas vendidas
  const standardHoursRows = await prisma.serviceCategoryHours.findMany();
  const standardHoursMap = Object.fromEntries(standardHoursRows.map((r) => [r.category, r.hours]));

  // Personal activo del módulo correspondiente
  const [technicians, washers] = await Promise.all([
    prisma.technician.findMany({
      where: { team: orderType },
      orderBy: { name: 'asc' },
    }),
    orderType === 'SERVICIO'
      ? prisma.technician.findMany({
          where: { team: 'LAVADO' },
          orderBy: { name: 'asc' },
        })
      : Promise.resolve([]),
  ]);

  const whereClause = {
    orderType,
    ...(agency && agency !== 'ALL' ? { agency } : {}),
    OR: [
      { receivedAt: { gte: from, lte: to } },
      { deliveredAt: { gte: from, lte: to } },
      {
        statusEvents: {
          some: { occurredAt: { gte: from, lte: to } },
        },
      },
    ],
  };

  const workOrders = await prisma.workOrder.findMany({
    where: whereClause,
    include: {
      technician: true,
      washer: true,
      operations: {
        include: { technician: true },
      },
      statusEvents: {
        orderBy: { occurredAt: 'asc' },
      },
      vehicle: {
        select: { brand: true, model: true, plate: true },
      },
    },
  });

  if (orderType === 'SERVICIO') {
    // ----------------------------------------------------
    // CÁLCULO PARA SERVICIO MECÁNICO
    // ----------------------------------------------------
    const techMap = new Map();
    technicians.forEach((t) => {
      techMap.set(t.id, {
        id: t.id,
        name: t.name,
        specialty: t.specialty || 'Mecánica General',
        active: t.active,
        totalOrders: 0,
        completedOrders: 0,
        inProgressOrders: 0,
        soldHours: 0,
        realHours: 0,
        onTimeOrders: 0,
      });
    });

    const unassignedTech = {
      id: 'unassigned',
      name: 'Sin técnico asignado',
      specialty: 'Taller General',
      active: true,
      totalOrders: 0,
      completedOrders: 0,
      inProgressOrders: 0,
      soldHours: 0,
      realHours: 0,
      onTimeOrders: 0,
    };

    const washerMap = new Map();
    washers.forEach((w) => {
      washerMap.set(w.id, {
        id: w.id,
        name: w.name,
        specialty: w.specialty || 'Bahía de Lavado',
        active: w.active,
        washedOrders: 0,
        realHours: 0,
        onTimeWashes: 0,
      });
    });

    const unassignedWasher = {
      id: 'unassigned-washer',
      name: 'Sin lavador asignado',
      specialty: 'Área de Lavado',
      active: true,
      washedOrders: 0,
      realHours: 0,
      onTimeWashes: 0,
    };

    for (const wo of workOrders) {
      const isCompleted = ['TERMINADO', 'ENTREGADO'].includes(wo.status);
      const events = wo.statusEvents || [];
      const workshopHours = getStageDuration(events, 'EN_TALLER');
      const hasOperations = wo.operations && wo.operations.length > 0;
      const sold = hasOperations
        ? wo.operations.reduce((sum, op) => sum + (op.standardHours || 0), 0) + (wo.alignmentNeeded ? 0.5 : 0)
        : (standardHoursMap[wo.serviceCategory] || 1.5) + (wo.alignmentNeeded ? 0.5 : 0);

      const techEntry = wo.technicianId ? (techMap.get(wo.technicianId) || unassignedTech) : unassignedTech;
      techEntry.totalOrders += 1;

      if (isCompleted || events.some((e) => ['LAVADO', 'CONTROL_CALIDAD', 'TERMINADO', 'ENTREGADO'].includes(e.status))) {
        techEntry.completedOrders += 1;
        techEntry.realHours += workshopHours;

        if (hasOperations) {
          for (const op of wo.operations) {
            const opTechId = op.technicianId || wo.technicianId;
            const opTechEntry = opTechId ? (techMap.get(opTechId) || unassignedTech) : unassignedTech;
            opTechEntry.soldHours += (op.standardHours || 0);
          }
          if (wo.alignmentNeeded) {
            techEntry.soldHours += 0.5;
          }
        } else {
          techEntry.soldHours += sold;
        }

        if (wo.estimatedDeliveryAt && wo.deliveredAt) {
          if (new Date(wo.deliveredAt) <= new Date(wo.estimatedDeliveryAt)) {
            techEntry.onTimeOrders += 1;
          }
        } else if (workshopHours <= sold) {
          techEntry.onTimeOrders += 1;
        }
      } else {
        techEntry.inProgressOrders += 1;
        techEntry.realHours += workshopHours;
      }

      // Lavado
      if (wo.washNeeded !== false) {
        const washHours = getStageDuration(events, 'LAVADO');
        const hasPassedWash = events.some((e) => ['CONTROL_CALIDAD', 'TERMINADO', 'ENTREGADO'].includes(e.status)) || wo.status === 'LAVADO';
        if (hasPassedWash && washHours > 0) {
          const washerEntry = wo.washerId ? (washerMap.get(wo.washerId) || unassignedWasher) : unassignedWasher;
          washerEntry.washedOrders += 1;
          washerEntry.realHours += washHours;
          // Objetivo: 1.5 horas (90 min) con tolerancia hasta 100 min
          if (washHours <= 1.67) {
            washerEntry.onTimeWashes += 1;
          }
        }
      }
    }

    const techniciansList = Array.from(techMap.values())
      .concat(unassignedTech.totalOrders > 0 ? [unassignedTech] : [])
      .map((t) => {
        const efficiency = t.realHours > 0 ? Math.round((t.soldHours / t.realHours) * 100) : (t.soldHours > 0 ? 100 : null);
        const avgHoursPerOrder = t.completedOrders > 0 ? Number((t.realHours / t.completedOrders).toFixed(1)) : 0;
        const onTimeRate = t.completedOrders > 0 ? Math.round((t.onTimeOrders / t.completedOrders) * 100) : 100;
        return {
          ...t,
          soldHours: Number(t.soldHours.toFixed(1)),
          realHours: Number(t.realHours.toFixed(1)),
          efficiency,
          avgHoursPerOrder,
          onTimeRate,
        };
      });

    const washersList = Array.from(washerMap.values())
      .concat(unassignedWasher.washedOrders > 0 ? [unassignedWasher] : [])
      .map((w) => {
        const avgMinutes = w.washedOrders > 0 ? Math.round((w.realHours * 60) / w.washedOrders) : 0;
        const complianceRate = w.washedOrders > 0 ? Math.round((w.onTimeWashes / w.washedOrders) * 100) : 100;
        return {
          ...w,
          realHours: Number(w.realHours.toFixed(1)),
          avgMinutesPerWash: avgMinutes,
          complianceRate,
        };
      });

    const totalSold = techniciansList.reduce((acc, t) => acc + t.soldHours, 0);
    const totalReal = techniciansList.reduce((acc, t) => acc + t.realHours, 0);
    const totalCompleted = techniciansList.reduce((acc, t) => acc + t.completedOrders, 0);
    const globalEfficiency = totalReal > 0 ? Math.round((totalSold / totalReal) * 100) : (totalSold > 0 ? 100 : null);
    const totalWashed = washersList.reduce((acc, w) => acc + w.washedOrders, 0);
    const totalWashHours = washersList.reduce((acc, w) => acc + w.realHours, 0);
    const avgWashMinutesGlobal = totalWashed > 0 ? Math.round((totalWashHours * 60) / totalWashed) : 0;

    return {
      orderType: 'SERVICIO',
      period,
      from,
      to,
      sampleOrdersCount: workOrders.length,
      summary: {
        totalCompletedOrders: totalCompleted,
        totalSoldHours: Number(totalSold.toFixed(1)),
        totalRealHours: Number(totalReal.toFixed(1)),
        globalEfficiency,
        totalWashedOrders: totalWashed,
        avgWashMinutes: avgWashMinutesGlobal,
      },
      technicians: techniciansList,
      washers: washersList,
    };
  } else {
    // ----------------------------------------------------
    // CÁLCULO PARA HYP (HOJALATERÍA Y PINTURA)
    // ----------------------------------------------------
    const hypTechMap = new Map();
    technicians.forEach((t) => {
      hypTechMap.set(t.id, {
        id: t.id,
        name: t.name,
        specialty: t.specialty || 'Hojalatería y Pintura',
        active: t.active,
        totalOrders: 0,
        completedOrders: 0,
        inProgressOrders: 0,
        totalDays: 0,
        onTimeOrders: 0,
      });
    });

    const unassignedHypTech = {
      id: 'unassigned-hyp',
      name: 'Sin técnico asignado',
      specialty: 'Carrocería General',
      active: true,
      totalOrders: 0,
      completedOrders: 0,
      inProgressOrders: 0,
      totalDays: 0,
      onTimeOrders: 0,
    };

    let totalCompleted = 0;
    let totalStayDays = 0;
    let globalOnTimeCount = 0;

    for (const wo of workOrders) {
      const isCompleted = ['TERMINADO', 'ENTREGADO'].includes(wo.status);
      const techEntry = wo.technicianId ? (hypTechMap.get(wo.technicianId) || unassignedHypTech) : unassignedHypTech;
      techEntry.totalOrders += 1;

      const start = new Date(wo.receivedAt);
      const end = wo.deliveredAt ? new Date(wo.deliveredAt) : new Date();
      const daysInShop = Math.max(0, (end - start) / (MS_PER_HOUR * 24));

      if (isCompleted) {
        techEntry.completedOrders += 1;
        techEntry.totalDays += daysInShop;
        totalCompleted += 1;
        totalStayDays += daysInShop;
        if (wo.estimatedDeliveryAt && wo.deliveredAt) {
          if (new Date(wo.deliveredAt) <= new Date(wo.estimatedDeliveryAt)) {
            techEntry.onTimeOrders += 1;
            globalOnTimeCount += 1;
          }
        }
      } else {
        techEntry.inProgressOrders += 1;
        techEntry.totalDays += daysInShop;
      }
    }

    const hypTechniciansList = Array.from(hypTechMap.values())
      .concat(unassignedHypTech.totalOrders > 0 ? [unassignedHypTech] : [])
      .map((t) => {
        const avgDays = t.completedOrders > 0
          ? Number((t.totalDays / t.completedOrders).toFixed(1))
          : (t.totalOrders > 0 ? Number((t.totalDays / t.totalOrders).toFixed(1)) : 0);
        const onTimeRate = t.completedOrders > 0 ? Math.round((t.onTimeOrders / t.completedOrders) * 100) : 100;
        return {
          ...t,
          totalDays: Number(t.totalDays.toFixed(1)),
          avgDaysPerOrder: avgDays,
          onTimeRate,
        };
      });

    const avgStayDaysGlobal = totalCompleted > 0 ? Number((totalStayDays / totalCompleted).toFixed(1)) : 0;
    const globalOnTimeRate = totalCompleted > 0 ? Math.round((globalOnTimeCount / totalCompleted) * 100) : 100;

    return {
      orderType: 'HYP',
      period,
      from,
      to,
      sampleOrdersCount: workOrders.length,
      summary: {
        totalCompletedOrders: totalCompleted,
        avgStayDays: avgStayDaysGlobal,
        globalOnTimeRate,
        activeInProgress: workOrders.filter((w) => !['TERMINADO', 'ENTREGADO'].includes(w.status)).length,
      },
      technicians: hypTechniciansList,
      washers: [],
    };
  }
}

module.exports = {
  stageDurationsReport,
  pendingPartsReport,
  executiveKpisReport,
  productivityReport,
};

