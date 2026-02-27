const express = require('express');
const router = express.Router();
const equipementController = require('../controllers/equipement.controller');

router.get('/', equipementController.findAll);
router.get('/:id', equipementController.findOne);
router.post('/', equipementController.create);
router.put('/:id', equipementController.update);
router.delete('/:id', equipementController.delete);

module.exports = router;
