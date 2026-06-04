const router = require('express').Router();
const ctrl   = require('../controllers/fournisseur_catalogue.controller');
router.get('/',       ctrl.findAll);
router.post('/',      ctrl.create);
router.put('/:id',    ctrl.update);
router.delete('/:id', ctrl.delete);
module.exports = router;
