const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const { signToken } = require('../utils/jwt');

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized('Credenciales inválidas');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw ApiError.unauthorized('Credenciales inválidas');
  }

  if (!user.active) {
    throw ApiError.unauthorized('Esta cuenta está deshabilitada');
  }

  const token = signToken({ sub: user.id, role: user.role, name: user.name });
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

async function getProfile(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw ApiError.notFound('Usuario no encontrado');
  }
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

module.exports = { login, getProfile };
