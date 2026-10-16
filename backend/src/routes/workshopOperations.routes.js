const { Router } = require('express');
const controller = require('../controllers/workshopOperations.controller');
const { authenticate, requireRole } = require('../middleware/auth');

const router = Router();

// Catálogo maestro (lectura autenticada, edición para admin)
router.get('/', authenticate, controller.list);
router.post('/', authenticate, requireRole('ADMIN'), controller.create);
router.patch('/:id', authenticate, requireRole('ADMIN'), controller.update);
router.delete('/:id', authenticate, requireRole('ADMIN'), controller.remove);

// Operaciones por orden de trabajo
router.get('/order/:orderId', authenticate, controller.listOrderOperations);
router.post('/order/:orderId', authenticate, controller.addOrderOperation);
router.patch('/order-op/:operationId', authenticate, controller.updateOrderOperation);
router.delete('/order-op/:operationId', authenticate, controller.removeOrderOperation);

module.exports = router;
