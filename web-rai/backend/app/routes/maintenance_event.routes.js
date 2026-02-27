const express = require('express');
const router = express.Router();
const controller = require('../controllers/maintenance_event.controller');

router.get('/',    controller.findAll);
router.put('/',    controller.upsert);
router.delete('/', controller.remove);

module.exports = router;
