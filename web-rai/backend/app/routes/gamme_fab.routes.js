const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/gamme_fab.controller');

// Processus
router.get('/',               ctrl.getAll);
router.post('/',              ctrl.createProcessus);
router.put('/:id',            ctrl.updateProcessus);
router.delete('/:id',         ctrl.deleteProcessus);

// Étapes
router.post('/etapes',          ctrl.createEtape);
router.put('/etapes/:id',       ctrl.updateEtape);
router.delete('/etapes/:id',    ctrl.deleteEtape);

// Outillages in étapes
router.post('/etapes/outillages',        ctrl.addOutillageToEtape);
router.delete('/etapes/outillages/:id',  ctrl.removeOutillageFromEtape);

module.exports = router;
