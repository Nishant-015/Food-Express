const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Public route to get categories
router.get('/', getCategories);

// Global category creation and administration (Admin only)
router.post('/', authenticate, authorize('admin'), createCategory);
router.patch('/:categoryId', authenticate, authorize('admin'), updateCategory);
router.delete('/:categoryId', authenticate, authorize('admin'), deleteCategory);

module.exports = router;
