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
  let vehicleId = data.vehicleId;

  // Si se pasan datos de vehículo (creación directa o importación SIA NXT)
  if (!vehicleId && data.vehicle) {
    const { brand, model, year, plate, vin, customerName, customerPhone, customerEmail, color } = data.vehicle;
    const cleanPlate = plate ? plate.trim().toUpperCase() : 'SIN-PLACA';
    const cleanVin = vin ? vin.trim().toUpperCase() : `VIN-${Date.now().toString().slice(-6)}`;

    // Buscar si ya existe el vehículo por placa
    const existingVehicle = await prisma.vehicle.findFirst({
      where: { plate: cleanPlate },
      include: { customer: true },
    });

    if (existingVehicle) {
      vehicleId = existingVehicle.id;
    } else {
      // Buscar o crear cliente
      let customer = null;
      if (customerName && customerName.trim()) {
        customer = await prisma.customer.findFirst({
          where: { name: customerName.trim() },
        });
        if (!customer) {
          customer = await prisma.customer.create({
            data: {
              name: customerName.trim(),
              phone: customerPhone?.trim() || null,
              email: customerEmail?.trim() || null,
            },
          });
        }
      } else {
        customer = await prisma.customer.create({
          data: { name: 'Cliente General' },
        });
      }

      const newVehicle = await prisma.vehicle.create({
        data: {
          brand: brand?.trim().toUpperCase() || 'GENERAL',
          model: model?.trim() || 'Modelo',
          year: year ? Number(year) : new Date().getFullYear(),
          color: color?.trim() || null,
          plate: cleanPlate,
          vin: cleanVin,
          customerId: customer.id,
        },
      });
      vehicleId = newVehicle.id;
    }
  }

  if (!vehicleId) {
    throw ApiError.badRequest('Se requiere un vehículo para crear la orden de trabajo');
  }

  const orderNumber = data.orderNumber ? data.orderNumber.trim().toUpperCase() : await generateOrderNumber();

  // Validar duplicidad de orden
  const existingOrder = await prisma.workOrder.findUnique({
    where: { orderNumber },
  });
  if (existingOrder) {
    throw ApiError.badRequest(`La orden de trabajo ${orderNumber} ya existe`);
  }

  const orderType = data.orderType ?? 'SERVICIO';
  const initialStatus = getStageOrder(orderType)[0];
  const technicianId = data.technicianId || null;

  return prisma.workOrder.create({
    data: {
      orderNumber,
      orderType,
      status: initialStatus,
      vehicleId,
      technicianId,
      technicianAssignedAt: technicianId ? new Date() : null,
      advisorId: advisorId ?? null,
      serviceType: data.serviceType?.trim() || null,
      serviceCategory: data.serviceCategory ?? null,
      agency: data.agency?.trim() || null,
      customerWaiting: Boolean(data.customerWaiting),
      washNeeded: Boolean(data.washNeeded),
      diagnosisNeeded: Boolean(data.diagnosisNeeded),
      partsNeeded: Boolean(data.partsNeeded),
      insurer: data.insurer?.trim() || null,
      reportNumber: data.reportNumber?.trim() || null,
      estimatedDeliveryAt: data.estimatedDeliveryAt ?? null,
      notes: data.notes?.trim() || null,
      statusEvents: {
        create: { status: initialStatus, note: 'Orden creada en sistema (SIA NXT)' },
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
      amount: data.amount ?? 0,
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
  const today0 = startOfToday();

  const [settings, technicians, inProgress] = await Promise.all([
    prisma.capacitySettings.findUnique({ where: { team } }),
    prisma.technician.findMany({ where: { team, active: true } }),
    prisma.workOrder.findMany({
      where: { orderType: team, status: { notIn: ['ENTREGADO', 'TERMINADO'] } },
      select: {
        id: true,
        orderNumber: true,
        serviceCategory: true,
        receivedAt: true,
        technicianAssignedAt: true,
        estimatedDeliveryAt: true,
        technicianId: true,
        status: true,
      },
    }),
  ]);

  const technicianCount = technicians.length;

  if (team === 'HYP') {
    const unitsPerTechnician = settings?.unitsPerTechnician ?? 0;
    const capacityUnits = technicianCount * unitsPerTechnician;
    
    let carryoverUnits = 0;
    let todayUnits = 0;
    for (const wo of inProgress) {
      const rec = wo.receivedAt ? new Date(wo.receivedAt) : null;
      if (rec && rec < today0) {
        carryoverUnits += 1;
      } else {
        todayUnits += 1;
      }
    }
    const demandUnits = carryoverUnits + todayUnits;
    const availableUnits = Math.max(0, capacityUnits - demandUnits);

    return {
      team,
      technicianCount,
      unitsPerTechnician,
      capacityUnits,
      demandUnits,
      carryoverUnits,
      todayUnits,
      availableUnits,
      utilization: capacityUnits > 0 ? demandUnits / capacityUnits : null,
    };
  }

  const hoursPerDay = settings?.hoursPerDay ?? 8;
  const efficiency = settings?.efficiency ?? 1;
  const productivity = settings?.productivity ?? 1;
  const hoursPerTech = hoursPerDay * efficiency * productivity;
  const capacityHours = technicianCount * hoursPerTech;

  const categoryHoursRows = await prisma.serviceCategoryHours.findMany();
  const hoursByCategory = Object.fromEntries(categoryHoursRows.map((r) => [r.category, r.hours]));

  let demandHours = 0;
  let carryoverHours = 0;
  let todayDemandHours = 0;
  let carryoverCount = 0;
  let todayDemandCount = 0;
  let unclassifiedCount = 0;

  // Mapa de carga individual por técnico
  const techMap = new Map();
  for (const tech of technicians) {
    techMap.set(tech.id, {
      id: tech.id,
      name: tech.name,
      capacityHours: hoursPerTech,
      assignedHours: 0,
      carryoverHours: 0,
      todayHours: 0,
      ordersCount: 0,
    });
  }

  for (const wo of inProgress) {
    const isCarryover = wo.receivedAt && new Date(wo.receivedAt) < today0;
    const stdHours = wo.serviceCategory && hoursByCategory[wo.serviceCategory] != null
      ? hoursByCategory[wo.serviceCategory]
      : null;

    if (stdHours != null) {
      demandHours += stdHours;
      if (isCarryover) {
        carryoverHours += stdHours;
        carryoverCount += 1;
      } else {
        todayDemandHours += stdHours;
        todayDemandCount += 1;
      }

      if (wo.technicianId && techMap.has(wo.technicianId)) {
        const t = techMap.get(wo.technicianId);
        t.assignedHours += stdHours;
        t.ordersCount += 1;
        if (isCarryover) {
          t.carryoverHours += stdHours;
        } else {
          t.todayHours += stdHours;
        }
      }
    } else {
      unclassifiedCount += 1;
      if (isCarryover) {
        carryoverCount += 1;
      } else {
        todayDemandCount += 1;
      }
    }
  }

  const availableHours = Math.max(0, capacityHours - demandHours);

  const technicianBreakdown = Array.from(techMap.values()).map((t) => ({
    ...t,
    availableHours: Math.max(0, t.capacityHours - t.assignedHours),
    utilization: t.capacityHours > 0 ? t.assignedHours / t.capacityHours : 0,
    isOverloaded: t.assignedHours > t.capacityHours,
  }));

  return {
    team,
    technicianCount,
    hoursPerDay,
    efficiency,
    productivity,
    capacityHours,
    demandHours,
    carryoverHours,
    todayDemandHours,
    carryoverCount,
    todayDemandCount,
    availableHours,
    unclassifiedCount,
    utilization: capacityHours > 0 ? demandHours / capacityHours : null,
    technicianBreakdown,
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

async function getServiceCategoryImpact(category) {
  const orders = await prisma.workOrder.findMany({
    where: { serviceCategory: category },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      orderType: true,
      vehicle: {
        select: {
          brand: true,
          model: true,
          plate: true,
        },
      },
    },
    orderBy: { receivedAt: 'desc' },
  });
  return {
    category,
    count: orders.length,
    orders,
  };
}

async function updateServiceCategoryHours(category, hours, newCategory) {
  if (newCategory && newCategory !== category) {
    const updated = await prisma.serviceCategoryHours.upsert({
      where: { category: newCategory },
      update: { hours },
      create: { category: newCategory, hours },
    });
    await prisma.workOrder.updateMany({
      where: { serviceCategory: category },
      data: { serviceCategory: newCategory },
    });
    await prisma.serviceCategoryHours.deleteMany({
      where: { category },
    });
    return updated;
  }

  return prisma.serviceCategoryHours.upsert({
    where: { category },
    update: { hours },
    create: { category, hours },
  });
}

async function deleteServiceCategoryHours(category, { reassignTo, unassign } = {}) {
  if (reassignTo) {
    await prisma.workOrder.updateMany({
      where: { serviceCategory: category },
      data: { serviceCategory: reassignTo },
    });
  } else if (unassign) {
    await prisma.workOrder.updateMany({
      where: { serviceCategory: category },
      data: { serviceCategory: null },
    });
  }

  return prisma.serviceCategoryHours.deleteMany({
    where: { category },
  });
}

async function getOrphanedServiceCategories() {
  const configured = await prisma.serviceCategoryHours.findMany({ select: { category: true } });
  const configuredKeys = new Set(configured.map((c) => c.category));

  const allWithCategory = await prisma.workOrder.findMany({
    where: { serviceCategory: { not: null } },
    select: {
      id: true,
      orderNumber: true,
      serviceCategory: true,
      status: true,
      vehicle: { select: { brand: true, model: true, plate: true } },
    },
    orderBy: { receivedAt: 'desc' },
  });

  const orphaned = allWithCategory.filter((wo) => !configuredKeys.has(wo.serviceCategory));
  const groups = {};
  for (const wo of orphaned) {
    if (!groups[wo.serviceCategory]) {
      groups[wo.serviceCategory] = [];
    }
    groups[wo.serviceCategory].push(wo);
  }

  return Object.entries(groups).map(([category, orders]) => ({
    category,
    count: orders.length,
    orders,
  }));
}

async function reassignServiceCategory(fromCategory, toCategory) {
  return prisma.workOrder.updateMany({
    where: { serviceCategory: fromCategory },
    data: { serviceCategory: toCategory || null },
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
  getServiceCategoryImpact,
  getOrphanedServiceCategories,
  reassignServiceCategory,
  updateServiceCategoryHours,
  deleteServiceCategoryHours,
};
