const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const { DOCUMENT_TYPES } = require('../utils/immobilized');

const INCLUDE_RELATIONS = {
  vehicle: { include: { customer: true } },
  registeredBy: { select: { id: true, name: true } },
  insuranceCase: {
    include: {
      documents: true,
      stageComments: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  },
  comments: {
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'asc' },
  },
};

async function list({ resolved } = {}) {
  return prisma.immobilizedUnit.findMany({
    where: resolved === undefined ? {} : { resolved: resolved === 'true' || resolved === true },
    include: INCLUDE_RELATIONS,
    orderBy: { damageDate: 'desc' },
  });
}

async function getById(id) {
  const unit = await prisma.immobilizedUnit.findUnique({ where: { id }, include: INCLUDE_RELATIONS });
  if (!unit) throw ApiError.notFound('Unidad inmovilizada no encontrada');
  return unit;
}

// Si el tratamiento es ASEGURADORA, crea el InsuranceCase junto con las 6 filas del checklist
// de documentos (todas pendientes). Se usa tanto al crear el registro como al cambiar el tipo
// de tratamiento hacia ASEGURADORA más adelante.
function buildInsuranceCaseCreate() {
  return {
    create: {
      documents: { create: DOCUMENT_TYPES.map((docType) => ({ docType })) },
    },
  };
}

async function create(data, userId) {
  return prisma.immobilizedUnit.create({
    data: {
      vehicleId: data.vehicleId,
      damageDate: data.damageDate,
      treatmentType: data.treatmentType,
      dmsReportNumber: data.treatmentType === 'GARANTIA' ? data.dmsReportNumber ?? null : null,
      description: data.description ?? null,
      registeredById: userId,
      ...(data.treatmentType === 'ASEGURADORA' ? { insuranceCase: buildInsuranceCaseCreate() } : {}),
    },
    include: INCLUDE_RELATIONS,
  });
}

async function update(id, data) {
  const existing = await getById(id);
  return prisma.immobilizedUnit.update({
    where: { id },
    data: {
      damageDate: data.damageDate ?? existing.damageDate,
      description: data.description !== undefined ? data.description : existing.description,
      dmsReportNumber:
        existing.treatmentType === 'GARANTIA'
          ? data.dmsReportNumber !== undefined
            ? data.dmsReportNumber
            : existing.dmsReportNumber
          : existing.dmsReportNumber,
    },
    include: INCLUDE_RELATIONS,
  });
}

// Cambia el tipo de tratamiento. Si pasa a ASEGURADORA y todavía no tiene InsuranceCase, lo crea
// (con su checklist). Si sale de GARANTIA, limpia el número de reporte del DMS (ya no aplica).
async function updateTreatmentType(id, treatmentType) {
  const existing = await getById(id);
  if (existing.treatmentType === treatmentType) return existing;

  const needsInsuranceCase = treatmentType === 'ASEGURADORA' && !existing.insuranceCase;

  return prisma.immobilizedUnit.update({
    where: { id },
    data: {
      treatmentType,
      dmsReportNumber: treatmentType === 'GARANTIA' ? existing.dmsReportNumber : null,
      ...(needsInsuranceCase ? { insuranceCase: buildInsuranceCaseCreate() } : {}),
    },
    include: INCLUDE_RELATIONS,
  });
}

async function setResolved(id, resolved) {
  await getById(id);
  return prisma.immobilizedUnit.update({
    where: { id },
    data: { resolved, resolvedAt: resolved ? new Date() : null },
    include: INCLUDE_RELATIONS,
  });
}

async function addComment(id, comment, userId) {
  await getById(id);
  await prisma.immobilizedComment.create({
    data: { immobilizedUnitId: id, comment, userId },
  });
  return getById(id);
}

module.exports = { list, getById, create, update, updateTreatmentType, setResolved, addComment };
