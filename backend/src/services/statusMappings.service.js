const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

async function list() {
  return prisma.statusMapping.findMany({ orderBy: { dmsStatus: 'asc' } });
}

async function create(dmsStatus, internalStatus) {
  const existing = await prisma.statusMapping.findUnique({ where: { dmsStatus } });
  if (existing) {
    throw ApiError.conflict(`Ya existe un mapeo para el estatus '${dmsStatus}'`);
  }
  return prisma.statusMapping.create({ data: { dmsStatus, internalStatus } });
}

async function update(id, internalStatus) {
  const existing = await prisma.statusMapping.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Mapeo de estatus no encontrado');
  }
  return prisma.statusMapping.update({ where: { id }, data: { internalStatus } });
}

async function remove(id) {
  const existing = await prisma.statusMapping.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Mapeo de estatus no encontrado');
  }
  await prisma.statusMapping.delete({ where: { id } });
}

// Usado por el importador del DMS: traduce un estatus crudo a uno de los 5 estatus internos.
// Si el valor no se ha visto antes, crea automáticamente el mapeo (por defecto RECIBIDO) para
// que quede disponible de inmediato en la página de Configuración.
async function resolveInternalStatus(dmsStatus) {
  const normalized = (dmsStatus || '').trim();
  if (!normalized) return 'RECIBIDO';

  const existing = await prisma.statusMapping.findUnique({ where: { dmsStatus: normalized } });
  if (existing) return existing.internalStatus;

  const created = await prisma.statusMapping.create({
    data: { dmsStatus: normalized, internalStatus: 'RECIBIDO' },
  });
  return created.internalStatus;
}

module.exports = { list, create, update, remove, resolveInternalStatus };
