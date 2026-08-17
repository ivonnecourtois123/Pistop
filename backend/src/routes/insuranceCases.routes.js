const { Router } = require('express');
const controller = require('../controllers/insuranceCases.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.patch('/:id', controller.update);
router.patch('/:id/stage', controller.advanceStage);
router.patch('/:id/documents/:docType', controller.toggleDocument);
router.post('/:id/comments', controller.addStageComment);

module.exports = router;
