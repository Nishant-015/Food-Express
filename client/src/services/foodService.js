import api from './api';

export const foodService = {
  getFoods: async (params = {}) => {
    return await api.get('/foods', { params });
  },

  getFoodById: async (id) => {
    return await api.get(`/foods/${id}`);
  },

  createFood: async (restaurantId, data) => {
    return await api.post(`/restaurants/${restaurantId}/foods`, data);
  },

  updateFood: async (restaurantId, foodId, data) => {
    return await api.patch(`/restaurants/${restaurantId}/foods/${foodId}`, data);
  },

  deleteFood: async (restaurantId, foodId) => {
    return await api.delete(`/restaurants/${restaurantId}/foods/${foodId}`);
  },

  getCategories: async (params = {}) => {
    return await api.get('/categories', { params });
  }
};
