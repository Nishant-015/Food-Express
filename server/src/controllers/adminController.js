const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get Admin Dashboard Overview
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getAdminDashboard = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    customerCount,
    ownerCount,
    totalRestaurants,
    approvedRestaurants,
    pendingRestaurants,
    totalOrders,
    deliveredOrders,
    cancelledOrders,
    recentOrders,
    revenueAgg
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ role: 'restaurant_owner' }),
    Restaurant.countDocuments(),
    Restaurant.countDocuments({ isApproved: true }),
    Restaurant.countDocuments({ isApproved: false }),
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: 'delivered' }),
    Order.countDocuments({ orderStatus: 'cancelled' }),
    Order.find()
      .populate('customer', 'name email')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
      .limit(6),
    Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ])
  ]);

  const totalRevenue = revenueAgg.length > 0 ? Number(revenueAgg[0].totalRevenue.toFixed(2)) : 0;

  return ApiResponse.success(res, 200, 'Admin metrics retrieved', {
    metrics: {
      totalUsers,
      customerCount,
      ownerCount,
      totalRestaurants,
      approvedRestaurants,
      pendingRestaurants,
      totalOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue
    },
    recentOrders
  });
});

// @desc    Get all users with search and pagination
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const { search, role, isActive } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  if (role && role !== 'all') {
    query.role = role;
  }

  if (isActive !== undefined && isActive !== 'all') {
    query.isActive = isActive === 'true';
  }

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query)
  ]);

  return ApiResponse.success(res, 200, 'Users retrieved successfully', users, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  });
});

// @desc    Toggle user active status
// @route   PATCH /api/admin/users/:userId/status
// @access  Private (Admin)
const updateUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { isActive } = req.body;

  if (userId === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot deactivate your own administrative account');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.isActive = typeof isActive === 'boolean' ? isActive : !user.isActive;
  await user.save();

  return ApiResponse.success(
    res,
    200,
    `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    user
  );
});

// @desc    Get all restaurants for administration
// @route   GET /api/admin/restaurants
// @access  Private (Admin)
const getAdminRestaurants = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const { search, isApproved } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } }
    ];
  }

  if (isApproved !== undefined && isApproved !== 'all') {
    query.isApproved = isApproved === 'true';
  }

  const [restaurants, total] = await Promise.all([
    Restaurant.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Restaurant.countDocuments(query)
  ]);

  return ApiResponse.success(res, 200, 'Restaurants retrieved successfully', restaurants, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  });
});

// @desc    Update restaurant approval status
// @route   PATCH /api/admin/restaurants/:restaurantId/approval
// @access  Private (Admin)
const updateRestaurantApproval = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { isApproved } = req.body;

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }

  restaurant.isApproved = !!isApproved;
  await restaurant.save();

  return ApiResponse.success(
    res,
    200,
    `Restaurant ${restaurant.isApproved ? 'approved' : 'unapproved'} successfully`,
    restaurant
  );
});

// @desc    Get all orders across platform
// @route   GET /api/admin/orders
// @access  Private (Admin)
const getAdminOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const { status, search } = req.query;
  const query = {};

  if (status && status !== 'all') {
    query.orderStatus = status;
  }

  if (search) {
    query.orderNumber = { $regex: search, $options: 'i' };
  }

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('customer', 'name email')
      .populate('restaurant', 'name city')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(query)
  ]);

  return ApiResponse.success(res, 200, 'Platform orders retrieved', orders, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  });
});

module.exports = {
  getAdminDashboard,
  getUsers,
  updateUserStatus,
  getAdminRestaurants,
  updateRestaurantApproval,
  getAdminOrders
};
