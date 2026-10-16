const { body, param } = require('express-validator');

const createFoodValidator = [
  param('restaurantId')
    .isMongoId()
    .withMessage('Invalid restaurant ID'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Food name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Food name must be between 2 and 100 characters'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid Category ID'),
  body('isVegetarian')
    .optional()
    .isBoolean()
    .withMessage('isVegetarian must be a boolean')
];

const updateFoodValidator = [
  param('restaurantId')
    .isMongoId()
    .withMessage('Invalid restaurant ID'),
  param('foodId')
    .isMongoId()
    .withMessage('Invalid food ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Food name must be between 2 and 100 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid Category ID'),
  body('isVegetarian')
    .optional()
    .isBoolean()
    .withMessage('isVegetarian must be a boolean'),
  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean')
];

module.exports = {
  createFoodValidator,
  updateFoodValidator
};
