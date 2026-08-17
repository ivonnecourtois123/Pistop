const { z } = require('zod');
const service = require('../services/customers.service');

const customerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

async function list(req, res) {
  res.json(await service.list());
}

async function getOne(req, res) {
  res.json(await service.getById(req.params.id));
}

async function create(req, res) {
  const data = customerSchema.parse(req.body);
  res.status(201).json(await service.create(data));
}

async function update(req, res) {
  const data = customerSchema.partial().parse(req.body);
  res.json(await service.update(req.params.id, data));
}

async function remove(req, res) {
  await service.remove(req.params.id);
  res.status(204).send();
}

module.exports = { list, getOne, create, update, remove };
