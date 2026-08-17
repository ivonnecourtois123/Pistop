const { z } = require('zod');
const service = require('../services/statusMappings.service');
const { ALL_STAGE_KEYS } = require('../utils/workOrderStatus');

const createSchema = z.object({
  dmsStatus: z.string().min(1),
  internalStatus: z.enum(ALL_STAGE_KEYS),
});

const updateSchema = z.object({
  internalStatus: z.enum(ALL_STAGE_KEYS),
});

async function list(req, res) {
  res.json(await service.list());
}

async function create(req, res) {
  const { dmsStatus, internalStatus } = createSchema.parse(req.body);
  res.status(201).json(await service.create(dmsStatus, internalStatus));
}

async function update(req, res) {
  const { internalStatus } = updateSchema.parse(req.body);
  res.json(await service.update(req.params.id, internalStatus));
}

async function remove(req, res) {
  await service.remove(req.params.id);
  res.status(204).send();
}

module.exports = { list, create, update, remove };
