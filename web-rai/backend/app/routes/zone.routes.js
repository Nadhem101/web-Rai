const express = require('express');
const router = express.Router();
const { Zone } = require('../models');

router.get('/', async (req, res) => {
  try {
    const zones = await Zone.findAll();
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
