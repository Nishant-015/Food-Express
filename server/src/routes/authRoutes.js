const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  changePassword
} = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const { authLimiter } = require('../middleware/rateLimiter');
const validateRequest = require('../middleware/validateRequest');
const {
  registerValidator,
  loginValidator,
  changePasswordValidator
} = require('../validators/authValidators');

router.post('/register', authLimiter, registerValidator, validateRequest, register);
router.post('/login', authLimiter, loginValidator, validateRequest, login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.patch('/change-password', authenticate, changePasswordValidator, validateRequest, changePassword);

module.exports = router;
