const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

async function list() {
  return prisma.technician.findMany({ orderBy: { name: 'asc' } });
}

async function getById(id) {
  const technician = await prisma.technician.findUnique({ where: { id } });
  if (!technician) throw ApiError.notFound('Técnico no encontrado');
  return technician;
}

async function create(data) {
  return prisma.technician.create({ data });
}

async function update(id, data) {
  await getById(id);
  return prisma.technician.update({ where: { id }, data });
}

async function remove(id) {
  await getById(id);
  await prisma.technician.delete({ where: { id } });
}

module.exports = { list, getById, create, update, remove };
