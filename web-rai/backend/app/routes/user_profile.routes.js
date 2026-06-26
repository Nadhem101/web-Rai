const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/user_profile.controller');

router.get('/me',          ctrl.getMe);
router.get('/',            ctrl.findAll);
router.put('/:userId',     ctrl.upsert);

module.exports = router;
