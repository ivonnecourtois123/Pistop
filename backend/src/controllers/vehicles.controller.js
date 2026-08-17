const { z } = require('zod');
const service = require('../services/vehicles.service');

const vehicleSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.coerce.number().int().min(1900).optional(),
  color: z.string().min(1).optional(),
  plate: z.string().min(3),
  vin: z.string().min(11).max(17),
  logoUrl: z.string().url().optional(),
  customerId: z.string().uuid(),
});

async function list(req, res) {
  res.json(await service.list());
}

async function getOne(req, res) {
  res.json(await service.getById(req.params.id));
}

// Placas y VIN se normalizan a mayúsculas para que la búsqueda (case-sensitive en SQLite) sea consistente
function normalizePlateAndVin(data) {
  return {
    ...data,
    ...(data.plate ? { plate: data.plate.toUpperCase() } : {}),
    ...(data.vin ? { vin: data.vin.toUpperCase() } : {}),
  };
}

async function create(req, res) {
  const data = normalizePlateAndVin(vehicleSchema.parse(req.body));
  res.status(201).json(await service.create(data));
}

async function update(req, res) {
  const data = normalizePlateAndVin(vehicleSchema.partial().parse(req.body));
  res.json(await service.update(req.params.id, data));
}

async function remove(req, res) {
  await service.remove(req.params.id);
  res.status(204).send();
}

module.exports = { list, getOne, create, update, remove };
