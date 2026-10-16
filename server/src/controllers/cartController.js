const Cart = require('../models/Cart');
const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Helper to calculate cart summary
const formatCartResponse = (cart) => {
  let subtotal = 0;
  const items = [];

  if (cart && cart.items) {
    for (const item of cart.items) {
      if (item.food) {
        const lineTotal = Number((item.food.price * item.quantity).toFixed(2));
        subtotal += lineTotal;
        items.push({
          food: item.food,
          quantity: item.quantity,
          lineTotal
        });
      }
    }
  }

  subtotal = Number(subtotal.toFixed(2));
  const deliveryFee = cart && cart.restaurant ? Number((cart.restaurant.deliveryFee || 0).toFixed(2)) : 0;
  const totalAmount = Number((subtotal + deliveryFee).toFixed(2));

  return {
    _id: cart ? cart._id : null,
    restaurant: cart ? cart.restaurant : null,
    items,
    subtotal,
    deliveryFee,
    totalAmount,
    itemCount: items.reduce((acc, curr) => acc + curr.quantity, 0)
  };
};

// @desc    Get customer cart
// @route   GET /api/cart
// @access  Private (Customer)
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id })
    .populate({
      path: 'items.food',
      populate: { path: 'category', select: 'name' }
    })
    .populate('restaurant', 'name isOpen deliveryFee estimatedDeliveryMinutes isApproved image');

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [], restaurant: null });
  }

  // Filter out any foods that might have been deleted from DB
  const validItems = cart.items.filter((item) => item.food !== null);
  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    if (cart.items.length === 0) {
      cart.restaurant = null;
    }
    await cart.save();
  }

  return ApiResponse.success(res, 200, 'Cart retrieved successfully', formatCartResponse(cart));
});

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private (Customer)
const addItemToCart = asyncHandler(async (req, res) => {
  const { foodId, quantity = 1, replaceCart = false } = req.body;

  if (!foodId) {
    throw new ApiError(400, 'foodId is required');
  }

  const food = await Food.findById(foodId).populate('restaurant');
  if (!food) {
    throw new ApiError(404, 'Food item not found');
  }

  if (!food.isAvailable) {
    throw new ApiError(400, 'This food item is currently unavailable');
  }

  if (!food.restaurant.isOpen) {
    throw new ApiError(400, 'This restaurant is currently closed');
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [], restaurant: null });
  }

  const targetRestaurantId = food.restaurant._id.toString();

  // Check if cart has items from a different restaurant
  if (cart.restaurant && cart.items.length > 0 && cart.restaurant.toString() !== targetRestaurantId) {
    if (!replaceCart) {
      // Return 409 Conflict with details so frontend can show modal to confirm replacing
      return res.status(409).json({
        success: false,
        message: 'Your cart contains items from another restaurant. Would you like to clear it and add this item?',
        data: {
          conflict: true,
          currentRestaurantId: cart.restaurant,
          newRestaurantId: targetRestaurantId
        }
      });
    }

    // User confirmed replace: clear old items
    cart.items = [];
    cart.restaurant = targetRestaurantId;
  }

  cart.restaurant = targetRestaurantId;

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.food && item.food.toString() === foodId.toString()
  );

  const addQty = Math.max(1, parseInt(quantity, 10));

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += addQty;
  } else {
    cart.items.push({ food: foodId, quantity: addQty });
  }

  await cart.save();

  const populatedCart = await Cart.findById(cart._id)
    .populate({
      path: 'items.food',
      populate: { path: 'category', select: 'name' }
    })
    .populate('restaurant', 'name isOpen deliveryFee estimatedDeliveryMinutes isApproved image');

  return ApiResponse.success(res, 200, 'Item added to cart', formatCartResponse(populatedCart));
});

// @desc    Update item quantity in cart
// @route   PATCH /api/cart/items/:foodId
// @access  Private (Customer)
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { foodId } = req.params;
  const { quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError(404, 'Cart is empty');
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.food && item.food.toString() === foodId.toString()
  );

  if (itemIndex === -1) {
    throw new ApiError(404, 'Item not found in cart');
  }

  const newQty = parseInt(quantity, 10);

  if (newQty <= 0) {
    // Remove item
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = Math.min(50, newQty);
  }

  if (cart.items.length === 0) {
    cart.restaurant = null;
  }

  await cart.save();

  const populatedCart = await Cart.findById(cart._id)
    .populate({
      path: 'items.food',
      populate: { path: 'category', select: 'name' }
    })
    .populate('restaurant', 'name isOpen deliveryFee estimatedDeliveryMinutes isApproved image');

  return ApiResponse.success(res, 200, 'Cart item updated', formatCartResponse(populatedCart));
});

// @desc    Remove an item from cart
// @route   DELETE /api/cart/items/:foodId
// @access  Private (Customer)
const removeCartItem = asyncHandler(async (req, res) => {
  const { foodId } = req.params;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError(404, 'Cart is empty');
  }

  cart.items = cart.items.filter((item) => item.food && item.food.toString() !== foodId.toString());

  if (cart.items.length === 0) {
    cart.restaurant = null;
  }

  await cart.save();

  const populatedCart = await Cart.findById(cart._id)
    .populate({
      path: 'items.food',
      populate: { path: 'category', select: 'name' }
    })
    .populate('restaurant', 'name isOpen deliveryFee estimatedDeliveryMinutes isApproved image');

  return ApiResponse.success(res, 200, 'Item removed from cart', formatCartResponse(populatedCart));
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private (Customer)
const clearCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    cart.restaurant = null;
    await cart.save();
  }

  return ApiResponse.success(res, 200, 'Cart cleared', {
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    totalAmount: 0,
    itemCount: 0
  });
});

module.exports = {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart
};
