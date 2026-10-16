const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Helper to check restaurant ownership
const verifyRestaurantOwnerOrAdmin = async (restaurantId, user) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }
  if (user.role !== 'admin' && restaurant.owner.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Forbidden: You do not own this restaurant');
  }
  return restaurant;
};

// @desc    Get all foods with filtering
// @route   GET /api/foods
// @access  Public
const getAllFoods = asyncHandler(async (req, res) => {
  const { restaurantId, categoryId, isVegetarian, isAvailable, search } = req.query;

  const query = {};

  if (restaurantId) query.restaurant = restaurantId;
  if (categoryId) query.category = categoryId;
  if (isVegetarian !== undefined) query.isVegetarian = isVegetarian === 'true';
  if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const foods = await Food.find(query)
    .populate('category', 'name')
    .populate('restaurant', 'name city isOpen')
    .sort({ createdAt: -1 });

  return ApiResponse.success(res, 200, 'Foods retrieved successfully', foods);
});

// @desc    Get single food by ID
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id)
    .populate('category', 'name')
    .populate('restaurant', 'name city deliveryFee isOpen');

  if (!food) {
    throw new ApiError(404, 'Food item not found');
  }

  return ApiResponse.success(res, 200, 'Food item retrieved', food);
});

// @desc    Create food item for restaurant
// @route   POST /api/restaurants/:restaurantId/foods
// @access  Private (Owner of restaurant, Admin)
const createFood = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  await verifyRestaurantOwnerOrAdmin(restaurantId, req.user);

  const { name, description, price, image, category, isVegetarian, isAvailable } = req.body;

  const food = await Food.create({
    name,
    description: description || '',
    price: Number(price),
    image: image || undefined,
    category,
    restaurant: restaurantId,
    isVegetarian: !!isVegetarian,
    isAvailable: isAvailable !== undefined ? !!isAvailable : true
  });

  return ApiResponse.success(res, 201, 'Food item created successfully', food);
});

// @desc    Update food item
// @route   PATCH /api/restaurants/:restaurantId/foods/:foodId
// @access  Private (Owner of restaurant, Admin)
const updateFood = asyncHandler(async (req, res) => {
  const { restaurantId, foodId } = req.params;
  await verifyRestaurantOwnerOrAdmin(restaurantId, req.user);

  const food = await Food.findOne({ _id: foodId, restaurant: restaurantId });
  if (!food) {
    throw new ApiError(404, 'Food item not found for this restaurant');
  }

  const allowedFields = ['name', 'description', 'price', 'image', 'category', 'isVegetarian', 'isAvailable'];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (field === 'price') {
        food[field] = Number(req.body[field]);
      } else {
        food[field] = req.body[field];
      }
    }
  });

  await food.save();
  return ApiResponse.success(res, 200, 'Food item updated successfully', food);
});

// @desc    Delete food item
// @route   DELETE /api/restaurants/:restaurantId/foods/:foodId
// @access  Private (Owner of restaurant, Admin)
const deleteFood = asyncHandler(async (req, res) => {
  const { restaurantId, foodId } = req.params;
  await verifyRestaurantOwnerOrAdmin(restaurantId, req.user);

  const food = await Food.findOneAndDelete({ _id: foodId, restaurant: restaurantId });
  if (!food) {
    throw new ApiError(404, 'Food item not found');
  }

  return ApiResponse.success(res, 200, 'Food item deleted successfully', null);
});

module.exports = {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood
};
