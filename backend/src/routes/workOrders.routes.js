const { Router } = require('express');
const controller = require('../controllers/workOrders.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.get('/', controller.list);
router.get('/stats/today', controller.stats);
router.get('/latest', controller.getLatest);
router.get('/in-progress', controller.listInProgress);
router.get('/capacity/service-category-hours', controller.listServiceCategoryHours);
router.patch('/capacity/service-category-hours/:category', controller.updateServiceCategoryHours);
router.get('/capacity/:team/settings', controller.getCapacitySettings);
router.patch('/capacity/:team/settings', controller.updateCapacitySettings);
router.get('/capacity/:team', controller.getCapacity);
router.get('/reports/stage-durations', controller.getStageDurationsReport);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.patch('/:id/status', controller.updateStatus);
router.patch('/:id/sub-state', controller.updateSubState);
router.patch('/:id/order-type', controller.updateOrderType);
router.patch('/:id/parts-ready', controller.updatePartsReady);
router.post('/:id/pending-parts', controller.addPendingPart);
router.patch('/:id/pending-parts/:partId', controller.setPendingPartReceived);
router.delete('/:id/pending-parts/:partId', controller.removePendingPart);
router.patch('/:id/customer-waiting', controller.updateCustomerWaiting);
router.patch('/:id/service-category', controller.updateServiceCategory);
router.patch('/:id/diagnosis-needed', controller.updateDiagnosisNeeded);
router.patch('/:id/wash-needed', controller.updateWashNeeded);
router.patch('/:id/insurer', controller.updateInsurer);
router.patch('/:id/report-number', controller.updateReportNumber);
router.patch('/:id/technician', controller.updateTechnician);
router.patch('/:id/estimated-delivery', controller.updateEstimatedDelivery);
router.post('/:id/comments', controller.addStageComment);

module.exports = router;
