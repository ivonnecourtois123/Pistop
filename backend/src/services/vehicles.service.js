const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

async function list() {
  return prisma.vehicle.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  });
}

async function getById(id) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: { customer: true, workOrders: true },
  });
  if (!vehicle) throw ApiError.notFound('Vehículo no encontrado');
  return vehicle;
}

async function create(data) {
  return prisma.vehicle.create({ data, include: { customer: true } });
}

async function update(id, data) {
  await getById(id);
  return prisma.vehicle.update({ where: { id }, data, include: { customer: true } });
}

async function remove(id) {
  await getById(id);
  await prisma.vehicle.delete({ where: { id } });
}

module.exports = { list, getById, create, update, remove };
