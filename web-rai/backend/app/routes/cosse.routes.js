const express = require('express');
const router = express.Router();
const cosseController = require('../controllers/cosse.controller');

router.get('/', cosseController.findAll);
router.get('/:id', cosseController.findOne);
router.post('/', cosseController.create);
router.put('/:id', cosseController.update);
router.delete('/:id', cosseController.delete);

module.exports = router;