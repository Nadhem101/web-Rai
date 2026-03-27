const express = require('express');
const router = express.Router();
const applicateurController = require('../controllers/applicateur.controller');

router.get('/', applicateurController.findAll);
router.get('/:id', applicateurController.findOne);
router.post('/', applicateurController.create);
router.put('/:id', applicateurController.update);
router.delete('/:id', applicateurController.delete);

module.exports = router;
