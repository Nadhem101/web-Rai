const express = require('express');
const router = express.Router();
const controller = require('../controllers/applicateur_preventive_record.controller');

// Specific routes before /:id
router.post('/maintenance',                  controller.startMaintenance);
router.get('/historique',                    controller.findHistorique);
router.get('/historique/:numero_outil',      controller.findHistoriqueByOutil);

router.get('/',       controller.findAll);
router.get('/:id',    controller.findOne);
router.post('/',      controller.create);
router.put('/:id',    controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
