const express = require('express');
const controller = require('../controllers/applicateur_threshold.controller');

const router = express.Router();

router.get('/', controller.findAll);

module.exports = router;