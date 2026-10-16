import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { food, quantity, lineTotal } = item;

  if (!food) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition gap-4">
      {/* Item info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {food.isVegetarian ? (
          <span className="veg-badge flex-shrink-0"></span>
        ) : (
          <span className="non-veg-badge flex-shrink-0"></span>
        )}
        <div className="min-w-0">
          <h4 className="font-bold text-sm text-gray-900 truncate">{food.name}</h4>
          <p className="text-xs text-gray-500">
            ${food.price?.toFixed(2)} each
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl p-1 border border-gray-200">
        <button
          onClick={() => onUpdateQuantity(food._id, quantity - 1)}
          className="p-1 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="px-2 text-xs font-bold text-gray-800">{quantity}</span>
        <button
          onClick={() => onUpdateQuantity(food._id, quantity + 1)}
          className="p-1 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Line Total & Remove */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-extrabold text-gray-900 min-w-[50px] text-right">
          ${lineTotal?.toFixed(2)}
        </span>
        <button
          onClick={() => onRemove(food._id)}
          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
