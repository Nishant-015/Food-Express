import api from './api';

export const restaurantService = {
  getRestaurants: async (params = {}) => {
    return await api.get('/restaurants', { params });
  },

  getRestaurantById: async (id) => {
    return await api.get(`/restaurants/${id}`);
  },

  getRestaurantMenu: async (id) => {
    return await api.get(`/restaurants/${id}/menu`);
  },

  createRestaurant: async (data) => {
    return await api.post('/restaurants', data);
  },

  updateRestaurant: async (id, data) => {
    return await api.patch(`/restaurants/${id}`, data);
  }
};
