const express = require('express');
const router = express.Router();
const controller = require('../controllers/maintenance_sheet.controller');

router.get('/', controller.findAll);
router.get('/latest/:machineKey', controller.findLatestByMachine);
router.get('/:id', controller.findOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.post('/:id/finish', controller.finish);

module.exports = router;