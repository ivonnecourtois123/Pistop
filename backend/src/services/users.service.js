const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

const PUBLIC_FIELDS = { id: true, name: true, email: true, role: true, active: true, createdAt: true };

async function list() {
  return prisma.user.findMany({ select: PUBLIC_FIELDS, orderBy: { name: 'asc' } });
}

async function create({ name, email, password, role }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { name, email, passwordHash, role: role || 'ADVISOR' },
    select: PUBLIC_FIELDS,
  });
}

async function update(id, { name, email, active, role, password }) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Usuario no encontrado');
  }

  const data = {
    ...(name !== undefined ? { name } : {}),
    ...(email !== undefined ? { email } : {}),
    ...(active !== undefined ? { active } : {}),
    ...(role !== undefined ? { role } : {}),
  };

  if (password) {
    data.passwordHash = await bcrypt.hash(password, 10);
  }

  return prisma.user.update({ where: { id }, data, select: PUBLIC_FIELDS });
}

module.exports = { list, create, update };
