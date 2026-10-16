const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder
} = require('../controllers/orderController');
const authenticate = require('../middleware/authenticate');
const validateRequest = require('../middleware/validateRequest');
const { createOrderValidator } = require('../validators/orderValidators');

router.use(authenticate);

router.post('/', createOrderValidator, validateRequest, createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:orderId', getOrderById);
router.patch('/:orderId/cancel', cancelOrder);

module.exports = router;
