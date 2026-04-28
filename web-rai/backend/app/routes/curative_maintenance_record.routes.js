const express = require('express');
const router = express.Router();
const controller = require('../controllers/curative_maintenance_record.controller');

router.get('/summary/monthly', controller.monthlySummary);
router.get('/', controller.findAll);
router.get('/:id', controller.findOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;