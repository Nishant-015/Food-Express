const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  getRestaurantMenu
} = require('../controllers/restaurantController');
const {
  createFood,
  updateFood,
  deleteFood
} = require('../controllers/foodController');
const { createCategory } = require('../controllers/categoryController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validateRequest = require('../middleware/validateRequest');
const {
  createRestaurantValidator,
  updateRestaurantValidator
} = require('../validators/restaurantValidators');
const {
  createFoodValidator,
  updateFoodValidator
} = require('../validators/foodValidators');

// Public routes
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/menu', getRestaurantMenu);

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('restaurant_owner', 'admin'),
  createRestaurantValidator,
  validateRequest,
  createRestaurant
);

router.patch(
  '/:id',
  authenticate,
  authorize('restaurant_owner', 'admin'),
  updateRestaurantValidator,
  validateRequest,
  updateRestaurant
);

// Nested routes for restaurant's menu items
router.post(
  '/:restaurantId/foods',
  authenticate,
  authorize('restaurant_owner', 'admin'),
  createFoodValidator,
  validateRequest,
  createFood
);

router.patch(
  '/:restaurantId/foods/:foodId',
  authenticate,
  authorize('restaurant_owner', 'admin'),
  updateFoodValidator,
  validateRequest,
  updateFood
);

router.delete(
  '/:restaurantId/foods/:foodId',
  authenticate,
  authorize('restaurant_owner', 'admin'),
  deleteFood
);

// Restaurant specific categories
router.post(
  '/:restaurantId/categories',
  authenticate,
  authorize('restaurant_owner', 'admin'),
  createCategory
);

module.exports = router;
