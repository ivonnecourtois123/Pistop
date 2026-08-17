const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Se requiere un token de autenticación');
  }

  const token = header.slice('Bearer '.length);
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    throw ApiError.unauthorized('Token inválido o expirado');
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw ApiError.forbidden('No tienes permisos para realizar esta acción');
    }
    next();
  };
}

module.exports = { authenticate, requireRole };
