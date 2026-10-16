const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all restaurants with search, filters, pagination and sorting
// @route   GET /api/restaurants
// @access  Public
const getAllRestaurants = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const skip = (page - 1) * limit;

  const { search, cuisine, city, sortBy, isOpen } = req.query;

  // Build query
  const query = { isApproved: true };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { cuisines: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } }
    ];
  }

  if (cuisine) {
    query.cuisines = { $in: [new RegExp(`^${cuisine}$`, 'i')] };
  }

  if (city) {
    query.city = { $regex: city, $options: 'i' };
  }

  if (isOpen !== undefined) {
    query.isOpen = isOpen === 'true';
  }

  // Sorting
  let sortOption = { rating: -1 }; // default: highest rating
  if (sortBy === 'rating') {
    sortOption = { rating: -1 };
  } else if (sortBy === 'deliveryFee') {
    sortOption = { deliveryFee: 1 };
  } else if (sortBy === 'deliveryTime') {
    sortOption = { estimatedDeliveryMinutes: 1 };
  } else if (sortBy === 'newest') {
    sortOption = { createdAt: -1 };
  }

  const [restaurants, total] = await Promise.all([
    Restaurant.find(query)
      .select('-__v')
      .populate('owner', 'name email phone')
      .sort(sortOption)
      .skip(skip)
      .limit(limit),
    Restaurant.countDocuments(query)
  ]);

  return ApiResponse.success(
    res,
    200,
    'Restaurants fetched successfully',
    restaurants,
    {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  );
});

// @desc    Get single restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id)
    .populate('owner', 'name email phone')
    .select('-__v');

  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }

  return ApiResponse.success(res, 200, 'Restaurant details retrieved', restaurant);
});

// @desc    Create new restaurant
// @route   POST /api/restaurants
// @access  Private (restaurant_owner, admin)
const createRestaurant = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    cuisines,
    image,
    address,
    city,
    deliveryFee,
    estimatedDeliveryMinutes,
    isOpen
  } = req.body;

  // Check if owner already has a restaurant (or allow multiple if admin)
  if (req.user.role === 'restaurant_owner') {
    const existingRestaurant = await Restaurant.findOne({ owner: req.user._id });
    if (existingRestaurant) {
      throw new ApiError(400, 'You already have a registered restaurant profile');
    }
  }

  const restaurant = await Restaurant.create({
    name,
    description: description || '',
    cuisines: Array.isArray(cuisines) ? cuisines : [cuisines],
    image: image || undefined,
    address,
    city,
    owner: req.user._id,
    deliveryFee: deliveryFee !== undefined ? deliveryFee : 40,
    estimatedDeliveryMinutes: estimatedDeliveryMinutes || 30,
    isOpen: isOpen !== undefined ? isOpen : true,
    isApproved: req.user.role === 'admin' // Auto-approve if created by admin
  });

  return ApiResponse.success(res, 201, 'Restaurant created successfully', restaurant);
});

// @desc    Update restaurant details
// @route   PATCH /api/restaurants/:id
// @access  Private (Owner of restaurant or admin)
const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }

  // Authorization check: only owner of this restaurant or admin can update
  if (req.user.role !== 'admin' && restaurant.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Forbidden: You can only update your own restaurant');
  }

  const allowedFields = [
    'name',
    'description',
    'cuisines',
    'image',
    'address',
    'city',
    'deliveryFee',
    'estimatedDeliveryMinutes',
    'isOpen'
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      restaurant[field] = req.body[field];
    }
  });

  await restaurant.save();

  return ApiResponse.success(res, 200, 'Restaurant updated successfully', restaurant);
});

// @desc    Get restaurant menu grouped by categories
// @route   GET /api/restaurants/:id/menu
// @access  Public
const getRestaurantMenu = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }

  const foods = await Food.find({ restaurant: req.params.id })
    .populate('category', 'name description')
    .sort({ category: 1, name: 1 });

  return ApiResponse.success(res, 200, 'Menu items retrieved successfully', {
    restaurant: {
      _id: restaurant._id,
      name: restaurant.name,
      isOpen: restaurant.isOpen,
      deliveryFee: restaurant.deliveryFee,
      estimatedDeliveryMinutes: restaurant.estimatedDeliveryMinutes
    },
    foods
  });
});

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  getRestaurantMenu
};
