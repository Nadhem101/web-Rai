const express = require('express');
const router = express.Router();
const pinceController = require('../controllers/pince.controller');

router.get('/', pinceController.findAll);
router.get('/:id', pinceController.findOne);
router.post('/', pinceController.create);
router.put('/:id', pinceController.update);
router.delete('/:id', pinceController.delete);

module.exports = router;
