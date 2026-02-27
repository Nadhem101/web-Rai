const express = require('express');
const router = express.Router();
const { Fabricant } = require('../models');

router.get('/', async (req, res) => {
  try {
    const fabricants = await Fabricant.findAll();
    res.json(fabricants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
