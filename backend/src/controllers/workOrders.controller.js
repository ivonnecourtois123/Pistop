const { z } = require('zod');
const workOrdersService = require('../services/workOrders.service');
const reportsService = require('../services/reports.service');
const { ALL_STAGE_KEYS, ORDER_TYPES, ALL_SUB_STATES } = require('../utils/workOrderStatus');
const { SERVICE_CATEGORIES } = require('../utils/priority');

const createSchema = z.object({
  vehicleId: z.string().uuid(),
  technicianId: z.string().uuid().optional(),
  orderNumber: z.string().optional(),
  orderType: z.enum(ORDER_TYPES).optional(),
  estimatedDeliveryAt: z.coerce.date().optional(),
  notes: z.string().optional(),
});

const statusSchema = z.object({
  status: z.enum(ALL_STAGE_KEYS),
  note: z.string().optional(),
});

const orderTypeSchema = z.object({
  orderType: z.enum(ORDER_TYPES),
});

// null limpia el sub-estado. La validación de que el sub-estado corresponda a la etapa actual
// vive en el servicio, porque depende del estatus vigente de esa orden en particular.
const subStateSchema = z.object({
  subState: z.union([z.null(), z.enum(ALL_SUB_STATES)]),
});

const partsReadySchema = z.object({
  partsReady: z.boolean(),
});

const customerWaitingSchema = z.object({
  customerWaiting: z.boolean(),
});

const pendingPartSchema = z.object({
  partNumber: z.string().min(1),
  description: z.string().optional(),
  orderNumber: z.string().min(1),
  orderDate: z.coerce.date(),
});

const pendingPartReceivedSchema = z.object({
  received: z.boolean(),
});

// null deja la categoría sin definir
const serviceCategorySchema = z.object({
  serviceCategory: z.union([z.null(), z.enum(SERVICE_CATEGORIES)]),
});

const diagnosisNeededSchema = z.object({
  diagnosisNeeded: z.boolean(),
});

const washNeededSchema = z.object({
  washNeeded: z.boolean(),
});

// null limpia el campo
const insurerSchema = z.object({
  insurer: z.union([z.null(), z.string()]),
});

const reportNumberSchema = z.object({
  reportNumber: z.union([z.null(), z.string()]),
});

// null desasigna al técnico
const technicianSchema = z.object({
  technicianId: z.union([z.null(), z.string().uuid()]),
});

// null limpia la fecha promesa; una fecha/hora la actualiza
const estimatedDeliverySchema = z.object({
  estimatedDeliveryAt: z.union([z.null(), z.coerce.date()]),
});

const stageCommentSchema = z.object({
  stage: z.enum(ALL_STAGE_KEYS),
  comment: z.string().min(1),
});

async function list(req, res) {
  const { q } = req.query;
  const workOrders = await workOrdersService.search(q);
  res.json(workOrders);
}

async function getOne(req, res) {
  const workOrder = await workOrdersService.getById(req.params.id);
  res.json(workOrder);
}

// Alimenta la tarjeta principal "Vehículo en Servicio" cuando no hay búsqueda activa
async function getLatest(req, res) {
  const workOrder = await workOrdersService.getLatest();
  res.json(workOrder);
}

// Alimenta la lista "Unidades en Proceso" al pie del dashboard. `orderType` filtra por módulo
// (Servicio/HYP) — sin el parámetro devuelve todo, como antes de separar los dashboards.
async function listInProgress(req, res) {
  const { orderType } = req.query;
  const workOrders = await workOrdersService.listInProgress(
    ORDER_TYPES.includes(orderType) ? orderType : undefined
  );
  res.json(workOrders);
}

async function create(req, res) {
  const data = createSchema.parse(req.body);
  const workOrder = await workOrdersService.create(data, req.user.sub);
  res.status(201).json(workOrder);
}

async function updateStatus(req, res) {
  const { status, note } = statusSchema.parse(req.body);
  const workOrder = await workOrdersService.updateStatus(req.params.id, status, note);
  res.json(workOrder);
}

async function updateSubState(req, res) {
  const { subState } = subStateSchema.parse(req.body);
  const workOrder = await workOrdersService.updateSubState(req.params.id, subState);
  res.json(workOrder);
}

async function updateOrderType(req, res) {
  const { orderType } = orderTypeSchema.parse(req.body);
  const workOrder = await workOrdersService.updateOrderType(req.params.id, orderType);
  res.json(workOrder);
}

async function updatePartsReady(req, res) {
  const { partsReady } = partsReadySchema.parse(req.body);
  const workOrder = await workOrdersService.updatePartsReady(req.params.id, partsReady);
  res.json(workOrder);
}

async function updateCustomerWaiting(req, res) {
  const { customerWaiting } = customerWaitingSchema.parse(req.body);
  const workOrder = await workOrdersService.updateCustomerWaiting(req.params.id, customerWaiting);
  res.json(workOrder);
}

async function addPendingPart(req, res) {
  const data = pendingPartSchema.parse(req.body);
  const workOrder = await workOrdersService.addPendingPart(req.params.id, data);
  res.status(201).json(workOrder);
}

async function setPendingPartReceived(req, res) {
  const { received } = pendingPartReceivedSchema.parse(req.body);
  const workOrder = await workOrdersService.setPendingPartReceived(req.params.id, req.params.partId, received);
  res.json(workOrder);
}

async function removePendingPart(req, res) {
  const workOrder = await workOrdersService.removePendingPart(req.params.id, req.params.partId);
  res.json(workOrder);
}

async function updateServiceCategory(req, res) {
  const { serviceCategory } = serviceCategorySchema.parse(req.body);
  const workOrder = await workOrdersService.updateServiceCategory(req.params.id, serviceCategory);
  res.json(workOrder);
}

async function updateDiagnosisNeeded(req, res) {
  const { diagnosisNeeded } = diagnosisNeededSchema.parse(req.body);
  const workOrder = await workOrdersService.updateDiagnosisNeeded(req.params.id, diagnosisNeeded);
  res.json(workOrder);
}

async function updateWashNeeded(req, res) {
  const { washNeeded } = washNeededSchema.parse(req.body);
  const workOrder = await workOrdersService.updateWashNeeded(req.params.id, washNeeded);
  res.json(workOrder);
}

async function updateInsurer(req, res) {
  const { insurer } = insurerSchema.parse(req.body);
  const workOrder = await workOrdersService.updateInsurer(req.params.id, insurer);
  res.json(workOrder);
}

async function updateReportNumber(req, res) {
  const { reportNumber } = reportNumberSchema.parse(req.body);
  const workOrder = await workOrdersService.updateReportNumber(req.params.id, reportNumber);
  res.json(workOrder);
}

async function updateTechnician(req, res) {
  const { technicianId } = technicianSchema.parse(req.body);
  const workOrder = await workOrdersService.updateTechnician(req.params.id, technicianId);
  res.json(workOrder);
}

async function updateEstimatedDelivery(req, res) {
  const { estimatedDeliveryAt } = estimatedDeliverySchema.parse(req.body);
  const workOrder = await workOrdersService.updateEstimatedDelivery(req.params.id, estimatedDeliveryAt);
  res.json(workOrder);
}

async function addStageComment(req, res) {
  const { stage, comment } = stageCommentSchema.parse(req.body);
  const workOrder = await workOrdersService.addStageComment(req.params.id, stage, comment, req.user.sub);
  res.status(201).json(workOrder);
}

async function stats(req, res) {
  const { orderType } = req.query;
  const data = await workOrdersService.statsToday(ORDER_TYPES.includes(orderType) ? orderType : undefined);
  res.json(data);
}

const capacitySettingsSchema = z.object({
  hoursPerDay: z.number().nonnegative().optional(),
  efficiency: z.number().min(0).max(1).optional(),
  productivity: z.number().min(0).max(1).optional(),
  unitsPerTechnician: z.number().int().nonnegative().optional(),
});

const serviceCategoryHoursSchema = z.object({
  hours: z.number().nonnegative(),
});

async function getCapacity(req, res) {
  const team = req.params.team.toUpperCase();
  if (!ORDER_TYPES.includes(team)) {
    return res.status(400).json({ error: `Equipo inválido: ${req.params.team}` });
  }
  const data = await workOrdersService.capacityFor(team);
  res.json(data);
}

async function getCapacitySettings(req, res) {
  const team = req.params.team.toUpperCase();
  if (!ORDER_TYPES.includes(team)) {
    return res.status(400).json({ error: `Equipo inválido: ${req.params.team}` });
  }
  const data = await workOrdersService.getCapacitySettings(team);
  res.json(data);
}

async function updateCapacitySettings(req, res) {
  const team = req.params.team.toUpperCase();
  if (!ORDER_TYPES.includes(team)) {
    return res.status(400).json({ error: `Equipo inválido: ${req.params.team}` });
  }
  const data = capacitySettingsSchema.parse(req.body);
  const settings = await workOrdersService.updateCapacitySettings(team, data);
  res.json(settings);
}

async function listServiceCategoryHours(req, res) {
  const data = await workOrdersService.listServiceCategoryHours();
  res.json(data);
}

async function updateServiceCategoryHours(req, res) {
  const { category } = req.params;
  if (!SERVICE_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `Categoría inválida: ${category}` });
  }
  const { hours } = serviceCategoryHoursSchema.parse(req.body);
  const data = await workOrdersService.updateServiceCategoryHours(category, hours);
  res.json(data);
}

async function getStageDurationsReport(req, res) {
  const orderType = req.query.orderType;
  if (!ORDER_TYPES.includes(orderType)) {
    return res.status(400).json({ error: `orderType inválido o faltante: ${orderType}` });
  }
  const data = await reportsService.stageDurationsReport(orderType);
  res.json(data);
}

module.exports = {
  list,
  getOne,
  getLatest,
  listInProgress,
  create,
  updateStatus,
  updateSubState,
  updateOrderType,
  updatePartsReady,
  addPendingPart,
  setPendingPartReceived,
  removePendingPart,
  updateServiceCategory,
  updateCustomerWaiting,
  updateDiagnosisNeeded,
  updateWashNeeded,
  updateInsurer,
  updateReportNumber,
  updateTechnician,
  updateEstimatedDelivery,
  addStageComment,
  stats,
  getCapacity,
  getCapacitySettings,
  updateCapacitySettings,
  listServiceCategoryHours,
  updateServiceCategoryHours,
  getStageDurationsReport,
};
