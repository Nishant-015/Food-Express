import api from './api';

export const adminService = {
  getAdminDashboard: async () => {
    return await api.get('/admin/dashboard');
  },

  getUsers: async (params = {}) => {
    return await api.get('/admin/users', { params });
  },

  updateUserStatus: async (userId, isActive) => {
    return await api.patch(`/admin/users/${userId}/status`, { isActive });
  },

  getAdminRestaurants: async (params = {}) => {
    return await api.get('/admin/restaurants', { params });
  },

  updateRestaurantApproval: async (restaurantId, isApproved) => {
    return await api.patch(`/admin/restaurants/${restaurantId}/approval`, { isApproved });
  },

  getAdminOrders: async (params = {}) => {
    return await api.get('/admin/orders', { params });
  }
};
