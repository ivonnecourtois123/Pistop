const { z } = require('zod');
const service = require('../services/insuranceCases.service');
const { POLICY_TYPES, INSURANCE_STAGES, DOCUMENT_TYPES } = require('../utils/immobilized');

const updateSchema = z.object({
  reportNumber: z.string().optional(),
  insurer: z.string().optional(),
  policyType: z.enum(POLICY_TYPES).optional(),
});

const stageSchema = z.object({
  stage: z.enum(INSURANCE_STAGES),
});

const documentSchema = z.object({
  completed: z.boolean(),
});

const stageCommentSchema = z.object({
  stage: z.enum(INSURANCE_STAGES),
  comment: z.string().min(1),
});

async function list(req, res) {
  res.json(await service.list());
}

async function getOne(req, res) {
  res.json(await service.getById(req.params.id));
}

async function update(req, res) {
  const data = updateSchema.parse(req.body);
  res.json(await service.update(req.params.id, data));
}

async function advanceStage(req, res) {
  const { stage } = stageSchema.parse(req.body);
  res.json(await service.advanceStage(req.params.id, stage));
}

async function toggleDocument(req, res) {
  const { docType } = req.params;
  if (!DOCUMENT_TYPES.includes(docType)) {
    return res.status(400).json({ error: `Tipo de documento inválido: ${docType}` });
  }
  const { completed } = documentSchema.parse(req.body);
  res.json(await service.toggleDocument(req.params.id, docType, completed));
}

async function addStageComment(req, res) {
  const { stage, comment } = stageCommentSchema.parse(req.body);
  res.status(201).json(await service.addStageComment(req.params.id, stage, comment, req.user.sub));
}

module.exports = { list, getOne, update, advanceStage, toggleDocument, addStageComment };
