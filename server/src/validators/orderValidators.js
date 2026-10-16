const { body } = require('express-validator');

const createOrderValidator = [
  body('deliveryAddress')
    .notEmpty()
    .withMessage('Delivery address is required')
    .isObject()
    .withMessage('Delivery address must be an object with fullAddress, city, postalCode'),
  body('deliveryAddress.fullAddress')
    .notEmpty()
    .withMessage('Full address line is required'),
  body('deliveryAddress.city')
    .notEmpty()
    .withMessage('City is required'),
  body('deliveryAddress.postalCode')
    .notEmpty()
    .withMessage('Postal code is required'),
  body('contactPhone')
    .trim()
    .notEmpty()
    .withMessage('Contact phone number is required'),
  body('paymentMethod')
    .optional()
    .isIn(['cod', 'simulated_card', 'upi'])
    .withMessage('Invalid payment method')
];

module.exports = {
  createOrderValidator
};
