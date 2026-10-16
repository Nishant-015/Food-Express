const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.route('/me')
  .get(getProfile)
  .patch(updateProfile);

router.route('/me/addresses')
  .get(getAddresses)
  .post(addAddress);

router.route('/me/addresses/:addressId')
  .patch(updateAddress)
  .delete(deleteAddress);

module.exports = router;
