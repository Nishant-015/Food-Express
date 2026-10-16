import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Bike, ShieldAlert } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  const {
    _id,
    name,
    image,
    cuisines,
    rating,
    deliveryFee,
    estimatedDeliveryMinutes,
    isOpen,
    city
  } = restaurant;

  return (
    <Link
      to={`/restaurants/${_id}`}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
    >
      {/* Restaurant Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <img
          src={image || 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

        {/* Closed or Open Status Badge */}
        {!isOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg">
              Closed Now
            </span>
          </div>
        )}

        {/* Rating badge */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1 text-xs font-bold text-gray-900">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{rating ? rating.toFixed(1) : '4.5'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-primary-600 transition truncate">
              {name}
            </h3>
          </div>

          {/* Cuisines */}
          <p className="text-xs text-gray-500 mb-3 truncate">
            {Array.isArray(cuisines) ? cuisines.join(' • ') : cuisines}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{estimatedDeliveryMinutes || 30} mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bike className="w-4 h-4 text-gray-400" />
            <span>{deliveryFee === 0 ? 'Free Delivery' : `$${deliveryFee.toFixed(2)}`}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
