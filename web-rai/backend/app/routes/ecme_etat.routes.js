const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/ecme_etat.controller');

router.get('/meta/affectations',                ctrl.getAffectations);
router.post('/:code/interventions',             ctrl.createIntervention);
router.put('/:code/interventions/:id',          ctrl.updateIntervention);
router.delete('/:code/interventions/:id',       ctrl.deleteIntervention);
router.get('/:code',                            ctrl.findOne);
router.get('/',                                 ctrl.findAll);
router.post('/',                                ctrl.create);
router.put('/:code',                            ctrl.update);
router.delete('/:code',                         ctrl.delete);

module.exports = router;
