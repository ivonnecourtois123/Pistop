const { z } = require('zod');
const service = require('../services/users.service');

const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADVISOR', 'ADMIN']).optional(),
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  active: z.boolean().optional(),
  role: z.enum(['ADVISOR', 'ADMIN']).optional(),
  password: z.string().min(6).optional(),
});

async function list(req, res) {
  res.json(await service.list());
}

async function create(req, res) {
  const data = createSchema.parse(req.body);
  res.status(201).json(await service.create(data));
}

async function update(req, res) {
  const data = updateSchema.parse(req.body);
  res.json(await service.update(req.params.id, data));
}

module.exports = { list, create, update };
