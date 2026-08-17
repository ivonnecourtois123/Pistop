const { Router } = require('express');
const controller = require('../controllers/immobilized.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.patch('/:id/treatment-type', controller.updateTreatmentType);
router.patch('/:id/resolved', controller.setResolved);
router.post('/:id/comments', controller.addComment);

module.exports = router;
