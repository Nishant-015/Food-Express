const Order = require('../models/Order');
const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant');
const Cart = require('../models/Cart');
const PricingService = require('./pricingService');
const ApiError = require('../utils/ApiError');

class OrderService {
  /**
   * Generates a readable and unique order number.
   */
  static generateOrderNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${timestamp}-${random}`;
  }

  /**
   * Allowed state transitions map
   */
  static ALLOWED_TRANSITIONS = {
    placed: ['confirmed', 'cancelled'],
    confirmed: ['preparing', 'cancelled'],
    preparing: ['out_for_delivery'],
    out_for_delivery: ['delivered'],
    delivered: [],
    cancelled: []
  };

  /**
   * Create an order after server-side validation and pricing
   */
  static async createOrder({ customerId, deliveryAddress, contactPhone, paymentMethod = 'cod', items = null }) {
    let orderItemsToProcess = [];

    // If explicit items not provided, load from customer's persistent cart
    if (!items || items.length === 0) {
      const cart = await Cart.findOne({ user: customerId }).populate('items.food');
      if (!cart || !cart.items || cart.items.length === 0) {
        throw new ApiError(400, 'Your cart is empty. Please add items to checkout.');
      }
      orderItemsToProcess = cart.items.map((i) => ({
        foodId: i.food._id.toString(),
        quantity: i.quantity
      }));
    } else {
      orderItemsToProcess = items;
    }

    if (orderItemsToProcess.length === 0) {
      throw new ApiError(400, 'Order must contain at least one food item');
    }

    // 1. Fetch all food items from DB
    const foodIds = orderItemsToProcess.map((item) => item.foodId || item.food);
    const foods = await Food.find({ _id: { $in: foodIds } });

    if (foods.length !== orderItemsToProcess.length) {
      throw new ApiError(400, 'One or more selected food items could not be found');
    }

    // 2. Validate all food items belong to a single restaurant
    const restaurantId = foods[0].restaurant.toString();
    const hasMixedRestaurants = foods.some((f) => f.restaurant.toString() !== restaurantId);
    if (hasMixedRestaurants) {
      throw new ApiError(400, 'All items in an order must be from the same restaurant');
    }

    // 3. Validate food item availability
    const unavailableFoods = foods.filter((f) => !f.isAvailable);
    if (unavailableFoods.length > 0) {
      const names = unavailableFoods.map((f) => f.name).join(', ');
      throw new ApiError(400, `The following items are currently unavailable: ${names}`);
    }

    // 4. Validate restaurant approval and operational status
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw new ApiError(404, 'The restaurant does not exist');
    }
    if (!restaurant.isApproved) {
      throw new ApiError(400, 'This restaurant is not currently approved for ordering');
    }
    if (!restaurant.isOpen) {
      throw new ApiError(400, 'This restaurant is currently closed and not accepting orders');
    }

    // 5. Structure items for pricing calculation
    const pricedItemsInput = orderItemsToProcess.map((item) => {
      const foodDoc = foods.find((f) => f._id.toString() === (item.foodId || item.food).toString());
      return {
        food: foodDoc,
        quantity: Math.max(1, parseInt(item.quantity, 10))
      };
    });

    const pricing = PricingService.calculateOrderPricing(pricedItemsInput, restaurant, 0);

    // 6. Generate order document with snapshots
    const orderNumber = this.generateOrderNumber();
    const order = new Order({
      orderNumber,
      customer: customerId,
      restaurant: restaurantId,
      items: pricing.lineItems,
      deliveryAddress,
      contactPhone,
      subtotal: pricing.subtotal,
      deliveryFee: pricing.deliveryFee,
      discount: pricing.discount,
      totalAmount: pricing.totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'simulated_card' ? 'paid' : 'pending',
      orderStatus: 'placed',
      statusHistory: [
        {
          status: 'placed',
          changedAt: new Date(),
          changedBy: customerId,
          note: 'Order successfully placed'
        }
      ]
    });

    await order.save();

    // 7. Clear customer cart upon order creation
    await Cart.findOneAndUpdate({ user: customerId }, { items: [], restaurant: null });

    return order;
  }

  /**
   * Process a state transition with role checks and validation
   */
  static async updateOrderStatus({ orderId, newStatus, user, note = '', cancellationReason = '' }) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    const currentStatus = order.orderStatus;

    if (currentStatus === newStatus) {
      return order; // No-op
    }

    // Check allowed transition
    const allowed = this.ALLOWED_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new ApiError(
        400,
        `Invalid status transition: Cannot change order status from '${currentStatus}' to '${newStatus}'`
      );
    }

    // Role-specific constraints:
    if (user.role === 'customer') {
      // Customer can ONLY cancel, and only when placed or confirmed
      if (newStatus !== 'cancelled') {
        throw new ApiError(403, 'Customers can only cancel eligible orders, not update statuses');
      }
      if (order.customer.toString() !== user._id.toString()) {
        throw new ApiError(403, 'You are not authorized to cancel this order');
      }
    } else if (user.role === 'restaurant_owner') {
      // Restaurant owner must own the restaurant
      const restaurant = await Restaurant.findById(order.restaurant);
      if (!restaurant || restaurant.owner.toString() !== user._id.toString()) {
        throw new ApiError(403, 'You are not authorized to modify orders for this restaurant');
      }
    } else if (user.role !== 'admin') {
      throw new ApiError(403, 'Unauthorized to update order status');
    }

    // Apply updates
    order.orderStatus = newStatus;
    if (newStatus === 'cancelled') {
      order.cancellationReason = cancellationReason || note || 'Cancelled by ' + user.role;
      if (order.paymentStatus === 'paid') {
        order.paymentStatus = 'refunded';
      }
    }

    order.statusHistory.push({
      status: newStatus,
      changedAt: new Date(),
      changedBy: user._id,
      note: note || `Status updated to ${newStatus}`
    });

    await order.save();
    return order;
  }
}

module.exports = OrderService;
