const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const { isForwardTransition, getStageOrder, isValidSubState } = require('../utils/workOrderStatus');

const INCLUDE_RELATIONS = {
  vehicle: { include: { customer: true } },
  technician: true,
  advisor: { select: { id: true, name: true } },
  statusEvents: { orderBy: { occurredAt: 'asc' } },
  stageComments: {
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'asc' },
  },
  pendingParts: { orderBy: { createdAt: 'asc' } },
};

// Busca por número de orden, placas o VIN (los 3 modos del selector en el dashboard)
async function search(query) {
  if (!query || !query.trim()) {
    return prisma.workOrder.findMany({
      include: INCLUDE_RELATIONS,
      orderBy: { receivedAt: 'desc' },
      take: 25,
    });
  }

  // Se normaliza a mayúsculas en vez de usar `mode: 'insensitive'` (no soportado por el
  // conector SQLite; orderNumber/plate/vin siempre se guardan en mayúsculas al escribir).
  const term = query.trim().toUpperCase();
  return prisma.workOrder.findMany({
    where: {
      OR: [
        { orderNumber: { contains: term } },
        { vehicle: { plate: { contains: term } } },
        { vehicle: { vin: { contains: term } } },
      ],
    },
    include: INCLUDE_RELATIONS,
    orderBy: { receivedAt: 'desc' },
    take: 25,
  });
}

async function getById(id) {
  const workOrder = await prisma.workOrder.findUnique({
    where: { id },
    include: INCLUDE_RELATIONS,
  });
  if (!workOrder) {
    throw ApiError.notFound('Orden de trabajo no encontrada');
  }
  return workOrder;
}

// Unidades que siguen físicamente en el taller (todo lo que no se ha entregado aún). ENTREGADO
// es la etapa final en ambos pipelines (Servicio y HYP), así que basta con excluirla.
async function listInProgress(orderType) {
  return prisma.workOrder.findMany({
    where: { status: { not: 'ENTREGADO' }, ...(orderType ? { orderType } : {}) },
    include: INCLUDE_RELATIONS,
    orderBy: { receivedAt: 'asc' },
  });
}

async function getLatest() {
  const workOrder = await prisma.workOrder.findFirst({
    include: INCLUDE_RELATIONS,
    orderBy: { receivedAt: 'desc' },
  });
  if (!workOrder) {
    throw ApiError.notFound('No hay órdenes de trabajo registradas');
  }
  return workOrder;
}

async function generateOrderNumber() {
  const count = await prisma.workOrder.count();
  return `WO-${9000 + count + 1}`;
}

async function create(data, advisorId) {
  const orderNumber = data.orderNumber ? data.orderNumber.toUpperCase() : await generateOrderNumber();
  const orderType = data.orderType ?? 'SERVICIO';
  const initialStatus = getStageOrder(orderType)[0];

  return prisma.workOrder.create({
    data: {
      orderNumber,
      orderType,
      status: initialStatus,
      vehicleId: data.vehicleId,
      technicianId: data.technicianId ?? null,
      advisorId: advisorId ?? null,
      estimatedDeliveryAt: data.estimatedDeliveryAt ?? null,
      notes: data.notes ?? null,
      statusEvents: {
        create: { status: initialStatus },
      },
    },
    include: INCLUDE_RELATIONS,
  });
}

async function updateStatus(id, nextStatus, note) {
  const current = await prisma.workOrder.findUnique({ where: { id } });
  if (!current) {
    throw ApiError.notFound('Orden de trabajo no encontrada');
  }

  if (!isForwardTransition(current.orderType, current.status, nextStatus)) {
    throw ApiError.badRequest(
      `No se puede mover de '${current.status}' a '${nextStatus}'. El estatus solo avanza.`
    );
  }

  return prisma.workOrder.update({
    where: { id },
    data: {
      status: nextStatus,
      // El sub-estado pertenece a la etapa que se abandona, así que no se arrastra.
      subState: null,
      deliveredAt: nextStatus === 'ENTREGADO' ? new Date() : current.deliveredAt,
      statusEvents: {
        create: { status: nextStatus, note: note ?? null },
      },
    },
    include: INCLUDE_RELATIONS,
  });
}

// Marca o quita un sub-estado sobre la etapa actual (ej. "Por asignar" en RECIBIDO). Pasar
// null lo limpia. No altera la etapa ni registra StatusEvent: no es una transición de flujo.
async function updateSubState(id, subState) {
  const current = await prisma.workOrder.findUnique({ where: { id } });
  if (!current) {
    throw ApiError.notFound('Orden de trabajo no encontrada');
  }

  if (subState !== null && !isValidSubState(current.status, subState)) {
    throw ApiError.badRequest(
      `El sub-estado '${subState}' no aplica a la etapa '${current.status}'.`
    );
  }

  return prisma.workOrder.update({
    where: { id },
    data: { subState },
    include: INCLUDE_RELATIONS,
  });
}

// Cambia el tipo de OR (Servicio <-> HYP). Como los pipelines son distintos, el avance previo
// no es transferible: se reinicia el estatus a la primera etapa del nuevo pipeline y se registra
// el cambio en el historial de estatus.
async function updateOrderType(id, orderType) {
  const current = await prisma.workOrder.findUnique({ where: { id } });
  if (!current) {
    throw ApiError.notFound('Orden de trabajo no encontrada');
  }

  if (current.orderType === orderType) {
    return prisma.workOrder.findUnique({ where: { id }, include: INCLUDE_RELATIONS });
  }

  const initialStatus = getStageOrder(orderType)[0];

  return prisma.workOrder.update({
    where: { id },
    data: {
      orderType,
      status: initialStatus,
      subState: null,
      deliveredAt: null,
      statusEvents: {
        create: { status: initialStatus, note: `Tipo de orden cambiado a ${orderType}` },
      },
    },
    include: INCLUDE_RELATIONS,
  });
}

// Marca si ya llegaron todas las refacciones. Junto con `partsNeeded` define si la orden está
// "congelada" (requiere refacciones y no las tiene completas) para el motor de priorización.
async function updatePartsReady(id, partsReady) {
  const existing = await prisma.workOrder.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Orden de trabajo no encontrada');
  }

  return prisma.workOrder.update({
    where: { id },
    data: { partsReady },
    include: INCLUDE_RELATIONS,
  });
}

// Si hay piezas registradas, `partsReady` deja de ser una casilla manual y se calcula sola:
// solo "listo" cuando TODAS están recibidas. Sin piezas registradas no se toca nada — así una
// orden marcada a mano (o importada del DMS) sin este detalle sigue funcionando como antes.
async function recomputePartsReady(workOrderId) {
  const parts = await prisma.pendingPart.findMany({ where: { workOrderId } });
  if (parts.length === 0) return;

  const allReceived = parts.every((p) => p.received);
  await prisma.workOrder.update({
    where: { id: workOrderId },
    data: { partsNeeded: true, partsReady: allReceived },
  });
}

async function addPendingPart(workOrderId, data) {
  const existing = await prisma.workOrder.findUnique({ where: { id: workOrderId } });
  if (!existing) {
    throw ApiError.notFound('Orden de trabajo no encontrada');
  }

  await prisma.pendingPart.create({
    data: {
      workOrderId,
      partNumber: data.partNumber,
      description: data.description,
      orderNumber: data.orderNumber,
      orderDate: data.orderDate,
    },
  });
  await recomputePartsReady(workOrderId);

  return prisma.workOrder.findUnique({ where: { id: workOrderId }, include: INCLUDE_RELATIONS });
}

async function setPendingPartReceived(workOrderId, partId, received) {
  const part = await prisma.pendingPart.findUnique({ where: { id: partId } });
  if (!part || part.workOrderId !== workOrderId) {
    throw ApiError.notFound('Refacción pendiente no encontrada');
  }

  await prisma.pendingPart.update({
    where: { id: partId },
    data: { received, receivedAt: received ? new Date() : null },
  });
  await recomputePartsReady(workOrderId);

  return prisma.workOrder.findUnique({ where: { id: workOrderId }, include: INCLUDE_RELATIONS });
}

async function removePendingPart(workOrderId, partId) {
  const part = await prisma.pendingPart.findUnique({ where: { id: partId } });
  if (!part || part.workOrderId !== workOrderId) {
    throw ApiError.notFound('Refacción pendiente no encontrada');
  }

  await prisma.pendingPart.delete({ where: { id: partId } });
  await recomputePartsReady(workOrderId);

  return prisma.workOrder.findUnique({ where: { id: workOrderId }, include: INCLUDE_RELATIONS });
}

// `customerWaiting` normalmente llega del DMS ("Cliente_Espera"), pero cambia durante el día
// (el cliente puede decidir irse y volver más tarde) y alimenta directo el motor de
// priorización, así que debe poder corregirse a mano.
async function updateCustomerWaiting(id, customerWaiting) {
  const existing = await prisma.workOrder.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Orden de trabajo no encontrada');
  }

  return prisma.workOrder.update({
    where: { id },
    data: { customerWaiting },
    include: INCLUDE_RELATIONS,
  });
}

// Clasificación manual del trabajo (catálogo provisional, ver utils/priority.js).
async function updateServiceCategory(id, serviceCategory) {
  const existing = await prisma.workOrder.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Orden de trabajo no encontrada');
  }

  return prisma.workOrder.update({
    where: { id },
    data: { serviceCategory },
    include: INCLUDE_RELATIONS,
  });
}

// Independiente de `serviceCategory`: un correctivo pesado también puede requerir diagnóstico
// previo, así que no se deriva del tipo de servicio.
async function updateDiagnosisNeeded(id, diagnosisNeeded) {
  const existing = await prisma.workOrder.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Orden de trabajo no encontrada');
  }

  return prisma.workOrder.update({
    where: { id },
    data: { diagnosisNeeded },
    include: INCLUDE_RELATIONS,
  });
}

// Datos de aseguradora, capturados directo en la lista de HYP (ver INCLUDE_RELATIONS: no hay
// relación con InsuranceCase, es un dato propio de la orden). null limpia el campo.
async function updateInsurer(id, insurer) {
  const existing = await prisma.workOrder.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Orden de trabajo no encontrada');
  }

  return prisma.workOrder.update({
    where: { id },
    data: { insurer },
    include: INCLUDE_RELATIONS,
  });
}

async function updateReportNumber(id, reportNumber) {
  const existing = await prisma.workOrder.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Orden de trabajo no encontrada');
  }

  return prisma.workOrder.update({
    where: { id },
    data: { reportNumber },
    include: INCLUDE_RELATIONS,
  });
}

// `washNeeded` normalmente llega del DMS, pero también se puede marcar/corregir a mano.
async function updateWashNeeded(id, washNeeded) {
  const existing = await prisma.workOrder.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Orden de trabajo no encontrada');
  }

  return prisma.workOrder.update({
    where: { id },
    data: { washNeeded },
    include: INCLUDE_RELATIONS,
  });
}

// technicianId null desasigna al técnico.
async function updateTechnician(id, technicianId) {
  const existing = await prisma.workOrder.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Orden de trabajo no encontrada');
  }

  if (technicianId !== null) {
    const technician = await prisma.technician.findUnique({ where: { id: technicianId } });
    if (!technician) {
      throw ApiError.notFound('Técnico no encontrado');
    }
  }

  // El reloj del semáforo de avance arranca al asignar. Se reinicia al cambiar de técnico
  // (el trabajo vuelve a empezar) y se limpia al desasignar; si se reasigna al MISMO técnico
  // no se toca, para que no se reinicie por un guardado accidental.
  const assignedAtChanged = technicianId !== existing.technicianId;
  const technicianAssignedAt = assignedAtChanged
    ? technicianId === null
      ? null
      : new Date()
    : existing.technicianAssignedAt;

  return prisma.workOrder.update({
    where: { id },
    data: { technicianId, technicianAssignedAt },
    include: INCLUDE_RELATIONS,
  });
}

async function updateEstimatedDelivery(id, estimatedDeliveryAt) {
  const existing = await prisma.workOrder.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Orden de trabajo no encontrada');
  }

  return prisma.workOrder.update({
    where: { id },
    data: { estimatedDeliveryAt },
    include: INCLUDE_RELATIONS,
  });
}

// Agrega un comentario de seguimiento a una etapa específica, sin necesidad de cambiar el
// estatus actual de la orden — a diferencia de StatusEvent.note, se puede agregar a cualquier
// etapa (pasada, actual o futura) y no está limitado a uno solo por etapa.
async function addStageComment(id, stage, comment, userId) {
  const existing = await prisma.workOrder.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Orden de trabajo no encontrada');
  }

  await prisma.stageComment.create({
    data: { workOrderId: id, stage, comment, userId },
  });

  return prisma.workOrder.findUnique({ where: { id }, include: INCLUDE_RELATIONS });
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// Alimenta los 3 tiles de estadísticas del dashboard: Total hoy, Terminados, Por entregar
async function statsToday(orderType) {
  const since = startOfToday();
  const typeFilter = orderType ? { orderType } : {};

  const [totalHoy, terminados, porEntregar] = await Promise.all([
    prisma.workOrder.count({ where: { receivedAt: { gte: since }, ...typeFilter } }),
    prisma.workOrder.count({
      where: { receivedAt: { gte: since }, status: { in: ['TERMINADO', 'ENTREGADO'] }, ...typeFilter },
    }),
    prisma.workOrder.count({ where: { receivedAt: { gte: since }, status: 'TERMINADO', ...typeFilter } }),
  ]);

  return { totalHoy, terminados, porEntregar };
}

// Capacidad instalada vs demanda actual, por equipo. Servicio se mide en horas/día (técnicos ×
// horas × eficiencia × productividad, comparado contra la suma de horas estándar de las órdenes
// en proceso clasificadas por `serviceCategory` — las sin clasificar no se cuentan, se reportan
// aparte). HYP no usa horas: sus órdenes duran días, no horas, así que se mide en cupo de
// unidades simultáneas (técnicos × unitsPerTechnician) contra el conteo de órdenes HYP en proceso.
async function capacityFor(team) {
  const [settings, technicians, inProgress] = await Promise.all([
    prisma.capacitySettings.findUnique({ where: { team } }),
    prisma.technician.findMany({ where: { team, active: true } }),
    prisma.workOrder.findMany({
      where: { orderType: team, status: { not: 'ENTREGADO' } },
      select: { serviceCategory: true },
    }),
  ]);

  const technicianCount = technicians.length;

  if (team === 'HYP') {
    const unitsPerTechnician = settings?.unitsPerTechnician ?? 0;
    const capacityUnits = technicianCount * unitsPerTechnician;
    const demandUnits = inProgress.length;
    return {
      team,
      technicianCount,
      capacityUnits,
      demandUnits,
      utilization: capacityUnits > 0 ? demandUnits / capacityUnits : null,
    };
  }

  const hoursPerDay = settings?.hoursPerDay ?? 0;
  const efficiency = settings?.efficiency ?? 1;
  const productivity = settings?.productivity ?? 1;
  const capacityHours = technicianCount * hoursPerDay * efficiency * productivity;

  const categoryHoursRows = await prisma.serviceCategoryHours.findMany();
  const hoursByCategory = Object.fromEntries(categoryHoursRows.map((r) => [r.category, r.hours]));

  let demandHours = 0;
  let unclassifiedCount = 0;
  for (const wo of inProgress) {
    if (wo.serviceCategory && hoursByCategory[wo.serviceCategory] != null) {
      demandHours += hoursByCategory[wo.serviceCategory];
    } else {
      unclassifiedCount += 1;
    }
  }

  return {
    team,
    technicianCount,
    capacityHours,
    demandHours,
    unclassifiedCount,
    utilization: capacityHours > 0 ? demandHours / capacityHours : null,
  };
}

async function getCapacitySettings(team) {
  return prisma.capacitySettings.findUnique({ where: { team } });
}

async function updateCapacitySettings(team, data) {
  return prisma.capacitySettings.upsert({
    where: { team },
    update: data,
    create: { team, ...data },
  });
}

async function listServiceCategoryHours() {
  return prisma.serviceCategoryHours.findMany({ orderBy: { category: 'asc' } });
}

async function updateServiceCategoryHours(category, hours) {
  return prisma.serviceCategoryHours.upsert({
    where: { category },
    update: { hours },
    create: { category, hours },
  });
}

module.exports = {
  search,
  getById,
  getLatest,
  listInProgress,
  create,
  updateStatus,
  updateSubState,
  updateOrderType,
  updatePartsReady,
  addPendingPart,
  setPendingPartReceived,
  removePendingPart,
  updateServiceCategory,
  updateCustomerWaiting,
  updateDiagnosisNeeded,
  updateWashNeeded,
  updateInsurer,
  updateReportNumber,
  updateTechnician,
  updateEstimatedDelivery,
  addStageComment,
  statsToday,
  capacityFor,
  getCapacitySettings,
  updateCapacitySettings,
  listServiceCategoryHours,
  updateServiceCategoryHours,
};
