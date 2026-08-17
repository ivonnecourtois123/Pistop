const { Router } = require('express');

const authRoutes = require('./auth.routes');
const workOrdersRoutes = require('./workOrders.routes');
const customersRoutes = require('./customers.routes');
const vehiclesRoutes = require('./vehicles.routes');
const techniciansRoutes = require('./technicians.routes');
const statusMappingsRoutes = require('./statusMappings.routes');
const usersRoutes = require('./users.routes');
const immobilizedRoutes = require('./immobilized.routes');
const insuranceCasesRoutes = require('./insuranceCases.routes');

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.use('/auth', authRoutes);
router.use('/work-orders', workOrdersRoutes);
router.use('/customers', customersRoutes);
router.use('/vehicles', vehiclesRoutes);
router.use('/technicians', techniciansRoutes);
router.use('/status-mappings', statusMappingsRoutes);
router.use('/users', usersRoutes);
router.use('/immobilized', immobilizedRoutes);
router.use('/insurance-cases', insuranceCasesRoutes);

module.exports = router;
