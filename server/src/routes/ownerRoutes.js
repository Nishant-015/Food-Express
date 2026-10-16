const express = require('express');
const router = express.Router();
const {
  getOwnerDashboard,
  getOwnerOrders,
  updateOwnerOrderStatus
} = require('../controllers/orderController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.use(authenticate);
router.use(authorize('restaurant_owner', 'admin'));

router.get('/dashboard', getOwnerDashboard);
router.get('/orders', getOwnerOrders);
router.patch('/orders/:orderId/status', updateOwnerOrderStatus);

module.exports = router;
