const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

async function list() {
  return prisma.customer.findMany({ orderBy: { name: 'asc' } });
}

async function getById(id) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: { vehicles: true },
  });
  if (!customer) throw ApiError.notFound('Cliente no encontrado');
  return customer;
}

async function create(data) {
  return prisma.customer.create({ data });
}

async function update(id, data) {
  await getById(id);
  return prisma.customer.update({ where: { id }, data });
}

async function remove(id) {
  await getById(id);
  await prisma.customer.delete({ where: { id } });
}

module.exports = { list, getById, create, update, remove };
