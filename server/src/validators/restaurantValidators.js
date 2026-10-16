const { body, param } = require('express-validator');

const createRestaurantValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Restaurant name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Restaurant name must be between 2 and 100 characters'),
  body('cuisines')
    .isArray({ min: 1 })
    .withMessage('At least one cuisine is required'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('deliveryFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Delivery fee cannot be negative'),
  body('estimatedDeliveryMinutes')
    .optional()
    .isInt({ min: 5, max: 180 })
    .withMessage('Estimated delivery time must be between 5 and 180 minutes')
];

const updateRestaurantValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid restaurant ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Restaurant name must be between 2 and 100 characters'),
  body('cuisines')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Cuisines must be a non-empty list'),
  body('deliveryFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Delivery fee cannot be negative'),
  body('estimatedDeliveryMinutes')
    .optional()
    .isInt({ min: 5, max: 180 })
    .withMessage('Estimated delivery time must be between 5 and 180 minutes')
];

module.exports = {
  createRestaurantValidator,
  updateRestaurantValidator
};
