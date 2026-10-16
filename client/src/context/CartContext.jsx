import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const { success, error } = useToast();

  const [cart, setCart] = useState({
    items: [],
    restaurant: null,
    subtotal: 0,
    deliveryFee: 0,
    totalAmount: 0,
    itemCount: 0
  });
  const [loading, setLoading] = useState(false);
  const [conflictModal, setConflictModal] = useState({
    isOpen: false,
    pendingFoodId: null,
    pendingQuantity: 1
  });

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !isCustomer) {
      setCart({
        items: [],
        restaurant: null,
        subtotal: 0,
        deliveryFee: 0,
        totalAmount: 0,
        itemCount: 0
      });
      return;
    }

    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isCustomer]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (foodId, quantity = 1) => {
    if (!isAuthenticated) {
      error('Please sign in to add items to your cart');
      return { requiresAuth: true };
    }

    try {
      const res = await cartService.addItem(foodId, quantity, false);
      if (res && res.data) {
        setCart(res.data);
        success('Item added to cart!');
      }
      return { success: true };
    } catch (err) {
      // Check for 409 conflict (different restaurant)
      if (err.statusCode === 409) {
        setConflictModal({
          isOpen: true,
          pendingFoodId: foodId,
          pendingQuantity: quantity
        });
        return { conflict: true };
      } else {
        error(err.formattedMessage || 'Could not add item to cart');
        return { error: true };
      }
    }
  };

  const confirmReplaceAndAdd = async () => {
    try {
      const { pendingFoodId, pendingQuantity } = conflictModal;
      const res = await cartService.addItem(pendingFoodId, pendingQuantity, true);
      if (res && res.data) {
        setCart(res.data);
        success('Cart reset with new restaurant items!');
      }
      setConflictModal({ isOpen: false, pendingFoodId: null, pendingQuantity: 1 });
    } catch (err) {
      error(err.formattedMessage || 'Failed to update cart');
    }
  };

  const closeConflictModal = () => {
    setConflictModal({ isOpen: false, pendingFoodId: null, pendingQuantity: 1 });
  };

  const updateQuantity = async (foodId, newQty) => {
    try {
      const res = await cartService.updateQuantity(foodId, newQty);
      if (res && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      error(err.formattedMessage || 'Failed to update quantity');
    }
  };

  const removeFromCart = async (foodId) => {
    try {
      const res = await cartService.removeItem(foodId);
      if (res && res.data) {
        setCart(res.data);
        success('Item removed from cart');
      }
    } catch (err) {
      error(err.formattedMessage || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart({
        items: [],
        restaurant: null,
        subtotal: 0,
        deliveryFee: 0,
        totalAmount: 0,
        itemCount: 0
      });
      success('Cart cleared');
    } catch (err) {
      error(err.formattedMessage || 'Failed to clear cart');
    }
  };

  // Helper to get quantity of specific food item currently in cart
  const getItemQuantity = (foodId) => {
    const item = cart.items.find(
      (i) => (i.food?._id || i.food) === foodId || i.food === foodId
    );
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        conflictModal,
        addToCart,
        confirmReplaceAndAdd,
        closeConflictModal,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        fetchCart
      }}
    >
      {children}

      {/* Restaurant Conflict Modal */}
      {conflictModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Replace cart items?</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Your cart contains dishes from another restaurant. You can only order from one restaurant at a time.
              Would you like to discard the previous items and start a new order?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeConflictModal}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
              >
                Keep Current Cart
              </button>
              <button
                onClick={confirmReplaceAndAdd}
                className="px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm shadow-md transition"
              >
                Yes, Discard & Add
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
