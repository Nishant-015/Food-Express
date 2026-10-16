import api from './api';

export const cartService = {
  getCart: async () => {
    return await api.get('/cart');
  },

  addItem: async (foodId, quantity = 1, replaceCart = false) => {
    return await api.post('/cart/items', { foodId, quantity, replaceCart });
  },

  updateQuantity: async (foodId, quantity) => {
    return await api.patch(`/cart/items/${foodId}`, { quantity });
  },

  removeItem: async (foodId) => {
    return await api.delete(`/cart/items/${foodId}`);
  },

  clearCart: async () => {
    return await api.delete('/cart');
  }
};
