const express = require('express');
const router = express.Router();
const {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart
} = require('../controllers/cartController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.post('/items', addItemToCart);

router.route('/items/:foodId')
  .patch(updateCartItemQuantity)
  .delete(removeCartItem);

module.exports = router;
