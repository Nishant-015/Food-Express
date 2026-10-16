const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const OrderService = require('../services/orderService');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = asyncHandler(async (req, res) => {
  const { deliveryAddress, contactPhone, paymentMethod, items } = req.body;

  const order = await OrderService.createOrder({
    customerId: req.user._id,
    deliveryAddress,
    contactPhone,
    paymentMethod: paymentMethod || 'cod',
    items
  });

  return ApiResponse.success(res, 201, 'Order placed successfully', order);
});

// @desc    Get customer's orders
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ customer: req.user._id })
      .populate('restaurant', 'name image city address')
      .populate('items.food', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments({ customer: req.user._id })
  ]);

  return ApiResponse.success(res, 200, 'Orders retrieved successfully', orders, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  });
});

// @desc    Get order details by ID
// @route   GET /api/orders/:orderId
// @access  Private (Customer who placed it, Owner of restaurant, Admin)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .populate('customer', 'name email phone')
    .populate('restaurant', 'name image city address deliveryFee estimatedDeliveryMinutes')
    .populate('statusHistory.changedBy', 'name role');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Check authorization
  const isCustomer = order.customer && order.customer._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  let isOwner = false;

  if (req.user.role === 'restaurant_owner') {
    const restaurant = await Restaurant.findById(order.restaurant);
    if (restaurant && restaurant.owner.toString() === req.user._id.toString()) {
      isOwner = true;
    }
  }

  if (!isCustomer && !isAdmin && !isOwner) {
    throw new ApiError(403, 'Forbidden: You do not have permission to view this order');
  }

  return ApiResponse.success(res, 200, 'Order details retrieved', order);
});

// @desc    Cancel order by customer
// @route   PATCH /api/orders/:orderId/cancel
// @access  Private (Customer, Admin)
const cancelOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const order = await OrderService.updateOrderStatus({
    orderId: req.params.orderId,
    newStatus: 'cancelled',
    user: req.user,
    cancellationReason: reason || 'Customer requested cancellation'
  });

  return ApiResponse.success(res, 200, 'Order cancelled successfully', order);
});

// ==========================================
// RESTAURANT OWNER ORDER ENDPOINTS
// ==========================================

// @desc    Get Restaurant Owner Dashboard metrics and recent orders
// @route   GET /api/owner/dashboard
// @access  Private (Restaurant Owner)
const getOwnerDashboard = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ owner: req.user._id });
  if (!restaurant) {
    return ApiResponse.success(res, 200, 'Owner dashboard retrieved', {
      hasRestaurant: false,
      restaurant: null,
      stats: { totalOrders: 0, pendingOrders: 0, totalRevenue: 0, deliveredOrders: 0 },
      recentOrders: []
    });
  }

  const [totalOrders, pendingOrders, deliveredOrders, deliveredOrderDocs, recentOrders] =
    await Promise.all([
      Order.countDocuments({ restaurant: restaurant._id }),
      Order.countDocuments({
        restaurant: restaurant._id,
        orderStatus: { $in: ['placed', 'confirmed', 'preparing', 'out_for_delivery'] }
      }),
      Order.countDocuments({ restaurant: restaurant._id, orderStatus: 'delivered' }),
      Order.find({ restaurant: restaurant._id, orderStatus: 'delivered' }).select('totalAmount'),
      Order.find({ restaurant: restaurant._id })
        .populate('customer', 'name email phone')
        .sort({ createdAt: -1 })
        .limit(8)
    ]);

  const totalRevenue = deliveredOrderDocs.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);

  return ApiResponse.success(res, 200, 'Owner dashboard retrieved', {
    hasRestaurant: true,
    restaurant,
    stats: {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue: Number(totalRevenue.toFixed(2))
    },
    recentOrders
  });
});

// @desc    Get incoming orders for owner's restaurant
// @route   GET /api/owner/orders
// @access  Private (Restaurant Owner)
const getOwnerOrders = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ owner: req.user._id });
  if (!restaurant) {
    throw new ApiError(404, 'No restaurant found associated with your account');
  }

  const { status } = req.query;
  const query = { restaurant: restaurant._id };

  if (status && status !== 'all') {
    query.orderStatus = status;
  }

  const orders = await Order.find(query)
    .populate('customer', 'name email phone')
    .sort({ createdAt: -1 });

  return ApiResponse.success(res, 200, 'Owner orders retrieved successfully', orders);
});

// @desc    Update order status by restaurant owner
// @route   PATCH /api/owner/orders/:orderId/status
// @access  Private (Restaurant Owner)
const updateOwnerOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  if (!status) {
    throw new ApiError(400, 'New status is required');
  }

  const order = await OrderService.updateOrderStatus({
    orderId: req.params.orderId,
    newStatus: status,
    user: req.user,
    note
  });

  return ApiResponse.success(res, 200, 'Order status updated successfully', order);
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getOwnerDashboard,
  getOwnerOrders,
  updateOwnerOrderStatus
};
