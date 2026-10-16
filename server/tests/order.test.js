const request = require('supertest');
const app = require('../src/app');
const PricingService = require('../src/services/pricingService');
const OrderService = require('../services/orderService');

describe('Orders and Pricing Service Suite', () => {
  it('PricingService should accurately calculate subtotal, delivery fee and total amounts', () => {
    const mockItems = [
      {
        food: { _id: 'food_1', name: 'Burger', price: 12.5 },
        quantity: 2
      },
      {
        food: { _id: 'food_2', name: 'Fries', price: 4.0 },
        quantity: 1
      }
    ];

    const mockRestaurant = {
      deliveryFee: 30.0
    };

    const result = PricingService.calculateOrderPricing(mockItems, mockRestaurant, 0);

    expect(result.subtotal).toBe(29.0); // (12.5 * 2) + 4.0 = 29.0
    expect(result.deliveryFee).toBe(30.0);
    expect(result.totalAmount).toBe(59.0);
    expect(result.lineItems.length).toBe(2);
    expect(result.lineItems[0].lineTotal).toBe(25.0);
  });

  it('OrderService state machine should disallow invalid status transitions', () => {
    const allowedFromDelivered = OrderService.ALLOWED_TRANSITIONS['delivered'];
    expect(allowedFromDelivered).toEqual([]);

    const allowedFromPlaced = OrderService.ALLOWED_TRANSITIONS['placed'];
    expect(allowedFromPlaced).toContain('confirmed');
    expect(allowedFromPlaced).toContain('cancelled');
    expect(allowedFromPlaced).not.toContain('delivered');
  });

  it('POST /api/orders without authentication token should be rejected with 401', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        deliveryAddress: { fullAddress: '123 Fake St', city: 'Metropolis', postalCode: '10001' },
        contactPhone: '555-1234'
      });

    expect(res.status).toBe(401);
  });
});
