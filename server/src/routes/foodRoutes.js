const express = require('express');
const router = express.Router();
const { getAllFoods, getFoodById } = require('../controllers/foodController');

router.get('/', getAllFoods);
router.get('/:id', getFoodById);

module.exports = router;
