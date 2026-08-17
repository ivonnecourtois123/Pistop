const { z } = require('zod');
const service = require('../services/immobilized.service');
const { TREATMENT_TYPES } = require('../utils/immobilized');

const createSchema = z.object({
  vehicleId: z.string().uuid(),
  damageDate: z.coerce.date(),
  treatmentType: z.enum(TREATMENT_TYPES),
  dmsReportNumber: z.string().optional(),
  description: z.string().optional(),
});

const updateSchema = z.object({
  damageDate: z.coerce.date().optional(),
  dmsReportNumber: z.string().optional(),
  description: z.string().optional(),
});

const treatmentTypeSchema = z.object({
  treatmentType: z.enum(TREATMENT_TYPES),
});

const resolvedSchema = z.object({
  resolved: z.boolean(),
});

const commentSchema = z.object({
  comment: z.string().min(1),
});

async function list(req, res) {
  const { resolved } = req.query;
  res.json(await service.list({ resolved }));
}

async function getOne(req, res) {
  res.json(await service.getById(req.params.id));
}

async function create(req, res) {
  const data = createSchema.parse(req.body);
  res.status(201).json(await service.create(data, req.user.sub));
}

async function update(req, res) {
  const data = updateSchema.parse(req.body);
  res.json(await service.update(req.params.id, data));
}

async function updateTreatmentType(req, res) {
  const { treatmentType } = treatmentTypeSchema.parse(req.body);
  res.json(await service.updateTreatmentType(req.params.id, treatmentType));
}

async function setResolved(req, res) {
  const { resolved } = resolvedSchema.parse(req.body);
  res.json(await service.setResolved(req.params.id, resolved));
}

async function addComment(req, res) {
  const { comment } = commentSchema.parse(req.body);
  res.status(201).json(await service.addComment(req.params.id, comment, req.user.sub));
}

module.exports = { list, getOne, create, update, updateTreatmentType, setResolved, addComment };
