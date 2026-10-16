import api from './api';

export const userService = {
  getProfile: async () => {
    return await api.get('/users/me');
  },

  updateProfile: async (data) => {
    return await api.patch('/users/me', data);
  },

  getAddresses: async () => {
    return await api.get('/users/me/addresses');
  },

  addAddress: async (addressData) => {
    return await api.post('/users/me/addresses', addressData);
  },

  updateAddress: async (addressId, addressData) => {
    return await api.patch(`/users/me/addresses/${addressId}`, addressData);
  },

  deleteAddress: async (addressId) => {
    return await api.delete(`/users/me/addresses/${addressId}`);
  }
};
