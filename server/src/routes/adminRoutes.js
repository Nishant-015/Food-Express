const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getUsers,
  updateUserStatus,
  getAdminRestaurants,
  updateRestaurantApproval,
  getAdminOrders
} = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.use(authenticate);
router.use(authorize('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/users', getUsers);
router.patch('/users/:userId/status', updateUserStatus);
router.get('/restaurants', getAdminRestaurants);
router.patch('/restaurants/:restaurantId/approval', updateRestaurantApproval);
router.get('/orders', getAdminOrders);

module.exports = router;
