import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/cart/CartItem';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ShoppingBag, ArrowRight, Trash2, Clock, Bike, ShieldCheck, Store } from 'lucide-react';

const CartPage = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Retrieving your cart..." size="lg" />
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your shopping cart is empty"
          description="Explore restaurants near you to discover delicious food and add items to your cart."
          actionText="Discover Restaurants"
          actionLink="/restaurants"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Your Cart
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review your order before proceeding to checkout
          </p>
        </div>

        <button
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Restaurant Banner Card */}
          {cart.restaurant && (
            <div className="p-4 sm:p-5 bg-white rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900">
                    {cart.restaurant.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {cart.restaurant.estimatedDeliveryMinutes || 30} mins
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Bike className="w-3.5 h-3.5 text-gray-400" />
                      ${cart.deliveryFee?.toFixed(2)} delivery
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to={`/restaurants/${cart.restaurant._id}`}
                className="text-xs font-bold text-primary-600 hover:text-primary-700 whitespace-nowrap"
              >
                + Add More
              </Link>
            </div>
          )}

          {/* Items */}
          <div className="space-y-3">
            {cart.items.map((item) => (
              <CartItem
                key={item.food._id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              All prices and item availability are verified with the kitchen in real-time.
            </span>
          </div>
        </div>

        {/* Right: Bill Details & Checkout */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-lg space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
            Bill Summary
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>Item Subtotal ({cart.itemCount} items)</span>
              <span className="font-semibold text-gray-900">
                ${cart.subtotal?.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-gray-600">
              <span className="flex items-center gap-1">
                <span>Delivery Fee</span>
              </span>
              <span className="font-semibold text-gray-900">
                ${cart.deliveryFee?.toFixed(2)}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <span className="font-extrabold text-base text-gray-900">To Pay</span>
              <span className="font-extrabold text-xl text-primary-600">
                ${cart.totalAmount?.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary-500/25 transition flex items-center justify-center gap-2 transform active:scale-95"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
