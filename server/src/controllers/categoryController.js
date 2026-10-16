const Category = require('../models/Category');
const Restaurant = require('../models/Restaurant');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const { restaurantId } = req.query;

  const query = { isActive: true };
  if (restaurantId) {
    // Both global and restaurant-specific
    query.$or = [{ restaurant: null }, { restaurant: restaurantId }];
  } else {
    // Global categories by default
    query.restaurant = null;
  }

  const categories = await Category.find(query).sort({ name: 1 });
  return ApiResponse.success(res, 200, 'Categories retrieved successfully', categories);
});

// @desc    Create a new category
// @route   POST /api/restaurants/:restaurantId/categories
// @access  Private (Owner or Admin)
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;
  const { restaurantId } = req.params;

  if (!name) {
    throw new ApiError(400, 'Category name is required');
  }

  // If created for a specific restaurant, verify ownership
  if (restaurantId && restaurantId !== 'global') {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) throw new ApiError(404, 'Restaurant not found');
    if (req.user.role !== 'admin' && restaurant.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Forbidden');
    }
  }

  const category = await Category.create({
    name,
    description: description || '',
    image: image || undefined,
    restaurant: restaurantId && restaurantId !== 'global' ? restaurantId : null
  });

  return ApiResponse.success(res, 201, 'Category created successfully', category);
});

// @desc    Update category
// @route   PATCH /api/categories/:categoryId
// @access  Private (Admin)
const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name, description, image, isActive } = req.body;

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  if (name !== undefined) category.name = name;
  if (description !== undefined) category.description = description;
  if (image !== undefined) category.image = image;
  if (isActive !== undefined) category.isActive = isActive;

  await category.save();
  return ApiResponse.success(res, 200, 'Category updated successfully', category);
});

// @desc    Delete category
// @route   DELETE /api/categories/:categoryId
// @access  Private (Admin)
const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  return ApiResponse.success(res, 200, 'Category deleted successfully', null);
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
