/**
 * Pricing service to enforce server-side price calculation.
 * Never trust client-supplied prices or totals.
 */
class PricingService {
  /**
   * Calculate subtotal, delivery fee, discounts, and total amount.
   * @param {Array<{food: Object, quantity: number}>} items - List of items with DB food document and quantity
   * @param {Object} restaurant - DB Restaurant document
   * @param {number} discount - Optional discount
   * @returns {Object} Calculated pricing summary and line items
   */
  static calculateOrderPricing(items, restaurant, discount = 0) {
    let subtotal = 0;

    const lineItems = items.map((item) => {
      const unitPrice = Number(item.food.price);
      const quantity = Number(item.quantity);
      const lineTotal = Number((unitPrice * quantity).toFixed(2));

      subtotal += lineTotal;

      return {
        food: item.food._id,
        name: item.food.name,
        unitPrice,
        quantity,
        lineTotal
      };
    });

    subtotal = Number(subtotal.toFixed(2));
    const deliveryFee = Number((restaurant.deliveryFee || 0).toFixed(2));
    const validDiscount = Math.min(subtotal, Math.max(0, Number(discount) || 0));
    const totalAmount = Number((subtotal + deliveryFee - validDiscount).toFixed(2));

    return {
      lineItems,
      subtotal,
      deliveryFee,
      discount: validDiscount,
      totalAmount
    };
  }
}

module.exports = PricingService;
