const workshopOperationsService = require('../services/workshopOperations.service');

// Catálogo maestro
async function list(req, res) {
  const { search, category, active } = req.query;
  const data = await workshopOperationsService.listWorkshopOperations({ search, category, active });
  res.json(data);
}

async function create(req, res) {
  const op = await workshopOperationsService.createWorkshopOperation(req.body);
  res.status(201).json(op);
}

async function update(req, res) {
  const op = await workshopOperationsService.updateWorkshopOperation(req.params.id, req.body);
  res.json(op);
}

async function remove(req, res) {
  await workshopOperationsService.deleteWorkshopOperation(req.params.id);
  res.status(204).end();
}

// Operaciones en Órdenes de Trabajo
async function listOrderOperations(req, res) {
  const data = await workshopOperationsService.getWorkOrderOperations(req.params.orderId);
  res.json(data);
}

async function addOrderOperation(req, res) {
  const op = await workshopOperationsService.addWorkOrderOperation(req.params.orderId, req.body);
  res.status(201).json(op);
}

async function updateOrderOperation(req, res) {
  const op = await workshopOperationsService.updateWorkOrderOperation(req.params.operationId, req.body);
  res.json(op);
}

async function removeOrderOperation(req, res) {
  await workshopOperationsService.deleteWorkOrderOperation(req.params.operationId);
  res.status(204).end();
}

module.exports = {
  list,
  create,
  update,
  remove,
  listOrderOperations,
  addOrderOperation,
  updateOrderOperation,
  removeOrderOperation,
};
