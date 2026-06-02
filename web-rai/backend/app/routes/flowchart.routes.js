const router = require('express').Router();
const ctrl   = require('../controllers/flowchart.controller');

router.get('/',     ctrl.findAll);
router.get('/:id',  ctrl.findOne);
router.post('/',    ctrl.create);
router.put('/:id',  ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;
