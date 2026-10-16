import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    return await api.post('/orders', orderData);
  },

  getMyOrders: async (params = {}) => {
    return await api.get('/orders/my-orders', { params });
  },

  getOrderById: async (orderId) => {
    return await api.get(`/orders/${orderId}`);
  },

  cancelOrder: async (orderId, reason = '') => {
    return await api.patch(`/orders/${orderId}/cancel`, { reason });
  },

  // Owner endpoints
  getOwnerDashboard: async () => {
    return await api.get('/owner/dashboard');
  },

  getOwnerOrders: async (params = {}) => {
    return await api.get('/owner/orders', { params });
  },

  updateOwnerOrderStatus: async (orderId, status, note = '') => {
    return await api.patch(`/owner/orders/${orderId}/status`, { status, note });
  }
};
