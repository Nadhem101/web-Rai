const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/fer_bain_record.controller');

router.get('/', ctrl.getAll);
router.get('/equipement/:equipementId', ctrl.getByEquipement);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;
