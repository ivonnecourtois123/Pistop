const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

// Listar operaciones del catálogo con filtros opcionales de búsqueda y categoría
async function listWorkshopOperations({ search, category, active } = {}) {
  const where = {};

  if (active !== undefined) {
    where.active = active === 'true' || active === true;
  }

  if (category && category !== 'ALL') {
    where.category = category;
  }

  if (search && search.trim()) {
    const term = search.trim();
    where.OR = [
      { code: { contains: term, mode: 'insensitive' } },
      { description: { contains: term, mode: 'insensitive' } },
    ];
  }

  return prisma.workshopOperation.findMany({
    where,
    orderBy: [{ code: 'asc' }],
  });
}

// Crear una nueva operación en el catálogo maestro
async function createWorkshopOperation({ code, description, hoursCars, hoursTrucks, category }) {
  if (!code || !description) {
    throw ApiError.badRequest('El código y la descripción son obligatorios.');
  }

  const existing = await prisma.workshopOperation.findUnique({
    where: { code: code.trim() },
  });
  if (existing) {
    throw ApiError.badRequest(`Ya existe una operación con el código "${code}".`);
  }

  return prisma.workshopOperation.create({
    data: {
      code: code.trim(),
      description: description.trim().toUpperCase(),
      hoursCars: parseFloat(hoursCars) || 0,
      hoursTrucks: parseFloat(hoursTrucks) || 0,
      category: category || 'MECANICA',
      active: true,
    },
  });
}

// Actualizar tiempos o descripción de una operación existente
async function updateWorkshopOperation(id, { description, hoursCars, hoursTrucks, category, active }) {
  const op = await prisma.workshopOperation.findUnique({ where: { id } });
  if (!op) {
    throw ApiError.notFound('Operación no encontrada en el catálogo.');
  }

  const data = {};
  if (description !== undefined) data.description = description.trim().toUpperCase();
  if (hoursCars !== undefined) data.hoursCars = parseFloat(hoursCars) || 0;
  if (hoursTrucks !== undefined) data.hoursTrucks = parseFloat(hoursTrucks) || 0;
  if (category !== undefined) data.category = category;
  if (active !== undefined) data.active = Boolean(active);

  return prisma.workshopOperation.update({
    where: { id },
    data,
  });
}

// Desactivar (soft delete) o eliminar operación
async function deleteWorkshopOperation(id) {
  const op = await prisma.workshopOperation.findUnique({
    where: { id },
    include: { _count: { select: { workOrderOperations: true } } },
  });
  if (!op) {
    throw ApiError.notFound('Operación no encontrada.');
  }

  if (op._count.workOrderOperations > 0) {
    // Si tiene órdenes vinculadas, se desactiva en vez de borrar para preservar integridad histórica
    return prisma.workshopOperation.update({
      where: { id },
      data: { active: false },
    });
  }

  return prisma.workshopOperation.delete({ where: { id } });
}

// ==========================================
// GESTIÓN DE OPERACIONES EN ÓRDENES DE TRABAJO
// ==========================================

async function getWorkOrderOperations(workOrderId) {
  return prisma.workOrderOperation.findMany({
    where: { workOrderId },
    include: {
      technician: { select: { id: true, name: true, specialty: true } },
      workshopOperation: true,
    },
    orderBy: { createdAt: 'asc' },
  });
}

async function batchAddWorkOrderOperations(workOrderId, operationsList) {
  if (!Array.isArray(operationsList) || operationsList.length === 0) {
    return [];
  }

  const wo = await prisma.workOrder.findUnique({ where: { id: workOrderId } });
  if (!wo) {
    throw ApiError.notFound('Orden de trabajo no encontrada.');
  }

  const opIds = operationsList.map((op) => op.operationId).filter(Boolean);
  const catalogOps =
    opIds.length > 0
      ? await prisma.workshopOperation.findMany({ where: { id: { in: opIds } } })
      : [];
  const catalogMap = new Map(catalogOps.map((c) => [c.id, c]));

  const createdList = [];
  for (const item of operationsList) {
    const {
      operationId,
      code,
      description,
      vehicleCategory = 'COCHE',
      standardHours,
      technicianId,
      notes,
    } = item;

    let finalHours = parseFloat(standardHours) || 0;
    let finalDesc = description;
    let finalCode = code;

    if (operationId && catalogMap.has(operationId)) {
      const catalogOp = catalogMap.get(operationId);
      finalDesc = finalDesc || catalogOp.description;
      finalCode = finalCode || catalogOp.code;
      if (standardHours === undefined || standardHours === null) {
        finalHours =
          vehicleCategory === 'CAMIONETA' ? catalogOp.hoursTrucks : catalogOp.hoursCars;
      }
    }

    const created = await prisma.workOrderOperation.create({
      data: {
        workOrderId,
        operationId: operationId || null,
        code: finalCode || null,
        description: (finalDesc || 'Operación libre').trim().toUpperCase(),
        vehicleCategory,
        standardHours: finalHours,
        technicianId: technicianId || null,
        notes: notes || null,
      },
      include: {
        technician: { select: { id: true, name: true, specialty: true } },
        workshopOperation: true,
      },
    });
    createdList.push(created);
  }

  return createdList;
}

async function addWorkOrderOperation(workOrderId, data) {
  if (Array.isArray(data)) {
    return batchAddWorkOrderOperations(workOrderId, data);
  }
  if (Array.isArray(data.operations)) {
    return batchAddWorkOrderOperations(workOrderId, data.operations);
  }

  const {
    operationId,
    code,
    description,
    vehicleCategory = 'COCHE',
    standardHours,
    technicianId,
    notes,
  } = data;

  const wo = await prisma.workOrder.findUnique({ where: { id: workOrderId } });
  if (!wo) {
    throw ApiError.notFound('Orden de trabajo no encontrada.');
  }

  let finalHours = parseFloat(standardHours) || 0;
  let finalDesc = description;
  let finalCode = code;

  // Si proviene del catálogo maestro y no se especificaron horas personalizadas
  if (operationId) {
    const catalogOp = await prisma.workshopOperation.findUnique({ where: { id: operationId } });
    if (catalogOp) {
      finalDesc = finalDesc || catalogOp.description;
      finalCode = finalCode || catalogOp.code;
      if (standardHours === undefined || standardHours === null) {
        finalHours = vehicleCategory === 'CAMIONETA' ? catalogOp.hoursTrucks : catalogOp.hoursCars;
      }
    }
  }

  const created = await prisma.workOrderOperation.create({
    data: {
      workOrderId,
      operationId: operationId || null,
      code: finalCode || null,
      description: (finalDesc || 'Operación libre').trim().toUpperCase(),
      vehicleCategory,
      standardHours: finalHours,
      technicianId: technicianId || null,
      notes: notes || null,
    },
    include: {
      technician: { select: { id: true, name: true, specialty: true } },
      workshopOperation: true,
    },
  });

  return created;
}

async function updateWorkOrderOperation(operationId, data) {
  const existing = await prisma.workOrderOperation.findUnique({
    where: { id: operationId },
  });
  if (!existing) {
    throw ApiError.notFound('Operación de la orden no encontrada.');
  }

  const updateData = {};
  if (data.technicianId !== undefined) updateData.technicianId = data.technicianId || null;
  if (data.standardHours !== undefined) updateData.standardHours = parseFloat(data.standardHours) || 0;
  if (data.vehicleCategory !== undefined) updateData.vehicleCategory = data.vehicleCategory;
  if (data.description !== undefined) updateData.description = data.description.trim().toUpperCase();
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.completed !== undefined) {
    updateData.completed = Boolean(data.completed);
    updateData.completedAt = data.completed ? new Date() : null;
  }

  return prisma.workOrderOperation.update({
    where: { id: operationId },
    data: updateData,
    include: {
      technician: { select: { id: true, name: true, specialty: true } },
      workshopOperation: true,
    },
  });
}

async function deleteWorkOrderOperation(operationId) {
  const existing = await prisma.workOrderOperation.findUnique({
    where: { id: operationId },
  });
  if (!existing) {
    throw ApiError.notFound('Operación no encontrada.');
  }

  return prisma.workOrderOperation.delete({
    where: { id: operationId },
  });
}

module.exports = {
  listWorkshopOperations,
  createWorkshopOperation,
  updateWorkshopOperation,
  deleteWorkshopOperation,
  getWorkOrderOperations,
  addWorkOrderOperation,
  batchAddWorkOrderOperations,
  updateWorkOrderOperation,
  deleteWorkOrderOperation,
};
