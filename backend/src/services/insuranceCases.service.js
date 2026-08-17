const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const { isForwardInsuranceStage } = require('../utils/immobilized');

const INCLUDE_RELATIONS = {
  immobilizedUnit: {
    include: {
      vehicle: { include: { customer: true } },
      registeredBy: { select: { id: true, name: true } },
    },
  },
  documents: true,
  stageComments: {
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'asc' },
  },
};

// Los casos de seguro viven mientras la unidad tenga (o haya tenido) tratamiento ASEGURADORA.
// El módulo Seguros solo muestra los que están actualmente en ese tratamiento — "extraer" una
// unidad es cambiar su tratamiento, no borrar el caso (se conserva el historial/checklist).
async function list() {
  return prisma.insuranceCase.findMany({
    where: { immobilizedUnit: { treatmentType: 'ASEGURADORA' } },
    include: INCLUDE_RELATIONS,
    orderBy: { createdAt: 'desc' },
  });
}

async function getById(id) {
  const insuranceCase = await prisma.insuranceCase.findUnique({ where: { id }, include: INCLUDE_RELATIONS });
  if (!insuranceCase) throw ApiError.notFound('Caso de seguro no encontrado');
  return insuranceCase;
}

async function update(id, data) {
  await getById(id);
  return prisma.insuranceCase.update({
    where: { id },
    data: {
      reportNumber: data.reportNumber !== undefined ? data.reportNumber : undefined,
      insurer: data.insurer !== undefined ? data.insurer : undefined,
      policyType: data.policyType !== undefined ? data.policyType : undefined,
    },
    include: INCLUDE_RELATIONS,
  });
}

async function advanceStage(id, stage) {
  const current = await getById(id);
  if (!isForwardInsuranceStage(current.stage, stage)) {
    throw ApiError.badRequest(`No se puede mover de '${current.stage}' a '${stage}'. La etapa solo avanza.`);
  }
  return prisma.insuranceCase.update({ where: { id }, data: { stage }, include: INCLUDE_RELATIONS });
}

async function toggleDocument(id, docType, completed) {
  const current = await getById(id);
  const doc = current.documents.find((d) => d.docType === docType);
  if (!doc) throw ApiError.notFound('Documento no encontrado en el checklist');

  await prisma.insuranceDocument.update({
    where: { id: doc.id },
    data: { completed, completedAt: completed ? new Date() : null },
  });

  return getById(id);
}

async function addStageComment(id, stage, comment, userId) {
  await getById(id);
  await prisma.insuranceStageComment.create({
    data: { insuranceCaseId: id, stage, comment, userId },
  });
  return getById(id);
}

module.exports = { list, getById, update, advanceStage, toggleDocument, addStageComment };
