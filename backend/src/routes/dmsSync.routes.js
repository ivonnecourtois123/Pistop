const { Router } = require('express');
const controller = require('../controllers/dmsSync.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.post('/sync-rows', controller.syncExcelRows);
router.post('/preview-sync', controller.previewSync);
router.post('/clean-demos', controller.cleanDemoData);

module.exports = router;
