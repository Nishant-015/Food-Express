const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
      minlength: [2, 'Restaurant name must be at least 2 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    cuisines: {
      type: [String],
      required: [true, 'At least one cuisine is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A restaurant must have at least one cuisine'
      }
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80'
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Restaurant owner is required']
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating cannot exceed 5.0']
    },
    deliveryFee: {
      type: Number,
      default: 40,
      min: [0, 'Delivery fee cannot be negative']
    },
    estimatedDeliveryMinutes: {
      type: Number,
      default: 30,
      min: [5, 'Estimated delivery must be at least 5 minutes']
    },
    isOpen: {
      type: Boolean,
      default: true
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

restaurantSchema.index({ name: 'text', cuisines: 'text', city: 'text' });
restaurantSchema.index({ isApproved: 1, isOpen: 1 });
restaurantSchema.index({ owner: 1 });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
