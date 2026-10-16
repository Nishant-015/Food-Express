const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return ApiResponse.success(res, 200, 'Profile retrieved', { user });
});

// @desc    Update user profile (name, phone)
// @route   PATCH /api/users/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;

  await user.save();
  return ApiResponse.success(res, 200, 'Profile updated successfully', { user });
});

// @desc    Get all addresses for logged in user
// @route   GET /api/users/me/addresses
// @access  Private
const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return ApiResponse.success(res, 200, 'Addresses retrieved', { addresses: user.addresses || [] });
});

// @desc    Add an address
// @route   POST /api/users/me/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
  const { label, fullAddress, city, state, postalCode, phone, isDefault } = req.body;

  if (!fullAddress || !city || !postalCode) {
    throw new ApiError(400, 'fullAddress, city, and postalCode are required fields');
  }

  const user = await User.findById(req.user._id);

  // If this address is set as default, remove default from previous
  if (isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  } else if (user.addresses.length === 0) {
    // If it's the first address, make it default automatically
    req.body.isDefault = true;
  }

  user.addresses.push({
    label: label || 'Home',
    fullAddress,
    city,
    state: state || '',
    postalCode,
    phone: phone || user.phone || '',
    isDefault: !!req.body.isDefault
  });

  await user.save();
  const addedAddress = user.addresses[user.addresses.length - 1];

  return ApiResponse.success(res, 201, 'Address added successfully', { address: addedAddress });
});

// @desc    Update an address
// @route   PATCH /api/users/me/addresses/:addressId
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const user = await User.findById(req.user._id);

  const address = user.addresses.id(addressId);
  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  const { label, fullAddress, city, state, postalCode, phone, isDefault } = req.body;

  if (isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
    address.isDefault = true;
  }

  if (label !== undefined) address.label = label;
  if (fullAddress !== undefined) address.fullAddress = fullAddress;
  if (city !== undefined) address.city = city;
  if (state !== undefined) address.state = state;
  if (postalCode !== undefined) address.postalCode = postalCode;
  if (phone !== undefined) address.phone = phone;

  await user.save();
  return ApiResponse.success(res, 200, 'Address updated successfully', { address });
});

// @desc    Delete an address
// @route   DELETE /api/users/me/addresses/:addressId
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const user = await User.findById(req.user._id);

  const address = user.addresses.id(addressId);
  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  user.addresses.pull(addressId);

  // If deleted address was default and other addresses exist, set first as default
  if (address.isDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  return ApiResponse.success(res, 200, 'Address deleted successfully', null);
});

module.exports = {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};
