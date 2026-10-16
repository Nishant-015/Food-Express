import React from 'react';
import { useCart } from '../../context/CartContext';
import { Plus, Minus } from 'lucide-react';

const FoodCard = ({ food, isRestaurantOpen = true }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(food._id);

  const handleAdd = () => {
    addToCart(food._id, 1);
  };

  const handleIncrement = () => {
    updateQuantity(food._id, quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(food._id, quantity - 1);
  };

  const canOrder = isRestaurantOpen && food.isAvailable;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition gap-4">
      {/* Left Info */}
      <div className="flex-1 space-y-1.5 w-full">
        <div className="flex items-center gap-2">
          {food.isVegetarian ? (
            <span className="veg-badge" title="Pure Vegetarian"></span>
          ) : (
            <span className="non-veg-badge" title="Non-Vegetarian"></span>
          )}
          <h4 className="font-bold text-base sm:text-lg text-gray-900">{food.name}</h4>
        </div>

        <p className="text-primary-600 font-extrabold text-sm sm:text-base">
          ${food.price ? food.price.toFixed(2) : '0.00'}
        </p>

        {food.description && (
          <p className="text-xs text-gray-500 line-clamp-2 max-w-lg leading-relaxed">
            {food.description}
          </p>
        )}
      </div>

      {/* Right Image + Action */}
      <div className="relative flex-shrink-0 w-full sm:w-32 flex flex-col items-center">
        <div className="w-full sm:w-32 h-28 sm:h-24 rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
          <img
            src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'}
            alt={food.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Add Button or Quantity Stepper */}
        <div className="mt-2 sm:-mt-4 w-full sm:w-28 relative z-10">
          {!canOrder ? (
            <span className="block text-center text-[11px] font-bold text-gray-400 bg-gray-100 py-1.5 rounded-xl border border-gray-200">
              Unavailable
            </span>
          ) : quantity > 0 ? (
            <div className="flex items-center justify-between bg-primary-500 text-white rounded-xl shadow-md px-2 py-1.5 text-xs font-bold">
              <button
                onClick={handleDecrement}
                className="p-1 hover:bg-primary-600 rounded-lg transition"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="p-1 hover:bg-primary-600 rounded-lg transition"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="w-full py-1.5 bg-white hover:bg-primary-50 text-primary-600 border-2 border-primary-500/80 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg transition active:scale-95 flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
