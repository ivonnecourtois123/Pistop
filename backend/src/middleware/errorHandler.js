const { ZodError } = require('zod');
const ApiError = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: err.flatten(),
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }

  // Prisma: violación de restricción única (email/placa/VIN/orderNumber duplicados)
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: `El valor de '${err.meta?.target}' ya está en uso`,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }

  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor' });
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFoundHandler };
