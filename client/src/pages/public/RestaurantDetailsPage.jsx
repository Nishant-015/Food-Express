import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { restaurantService } from '../../services/restaurantService';
import FoodCard from '../../components/restaurant/FoodCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../context/CartContext';
import {
  Star,
  Clock,
  Bike,
  MapPin,
  Utensils,
  ShoppingBag,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const { cart } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        setLoading(true);
        setError(null);

        const [restaurantRes, menuRes] = await Promise.all([
          restaurantService.getRestaurantById(id),
          restaurantService.getRestaurantMenu(id)
        ]);

        if (restaurantRes && restaurantRes.data) {
          setRestaurant(restaurantRes.data);
        }
        if (menuRes && menuRes.data && menuRes.data.foods) {
          setFoods(menuRes.data.foods);
        }
      } catch (err) {
        setError(err.formattedMessage || 'Failed to load restaurant details');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndMenu();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner text="Preparing restaurant menu..." size="lg" />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorAlert message={error || 'Restaurant not found'} />
        <div className="text-center mt-6">
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-2xl font-bold text-sm shadow-md"
          >
            Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  // Extract unique category names
  const categoryNames = ['All', ...new Set(foods.map((f) => f.category?.name).filter(Boolean))];

  // Filter food items
  const filteredFoods = foods.filter((food) => {
    const matchesCategory = selectedCategory === 'All' || food.category?.name === selectedCategory;
    const matchesVeg = !vegOnly || food.isVegetarian;
    return matchesCategory && matchesVeg;
  });

  return (
    <div className="pb-24">
      {/* Restaurant Hero Banner */}
      <div className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src={restaurant.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80'}
            alt={restaurant.name}
            className="w-full h-full object-cover blur-sm"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/80 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/10 text-white backdrop-blur-md">
                  {Array.isArray(restaurant.cuisines) ? restaurant.cuisines.join(', ') : restaurant.cuisines}
                </span>

                {!restaurant.isOpen && (
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-rose-600 text-white shadow-md">
                    Currently Closed
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{restaurant.name}</h1>

              {restaurant.description && (
                <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
                  {restaurant.description}
                </p>
              )}

              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>
                  {restaurant.address}, {restaurant.city}
                </span>
              </div>
            </div>

            {/* Quick Metrics Card */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/15 w-fit">
              <div className="text-center px-3 border-r border-white/15">
                <div className="flex items-center justify-center gap-1 font-extrabold text-lg text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{restaurant.rating?.toFixed(1) || '4.5'}</span>
                </div>
                <span className="text-[10px] text-gray-300 uppercase font-semibold">1,000+ ratings</span>
              </div>

              <div className="text-center px-3 border-r border-white/15">
                <div className="flex items-center justify-center gap-1 font-extrabold text-lg text-white">
                  <Clock className="w-4 h-4 text-primary-400" />
                  <span>{restaurant.estimatedDeliveryMinutes || 30}m</span>
                </div>
                <span className="text-[10px] text-gray-300 uppercase font-semibold">Delivery Time</span>
              </div>

              <div className="text-center px-3">
                <div className="flex items-center justify-center gap-1 font-extrabold text-lg text-white">
                  <Bike className="w-4 h-4 text-primary-400" />
                  <span>${restaurant.deliveryFee?.toFixed(2) || '0.00'}</span>
                </div>
                <span className="text-[10px] text-gray-300 uppercase font-semibold">Delivery Fee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notice if Closed */}
      {!restaurant.isOpen && (
        <div className="bg-amber-50 border-y border-amber-200 py-3 text-amber-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 px-4">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          This restaurant is currently closed. You can explore the menu, but ordering is temporarily disabled.
        </div>
      )}

      {/* Menu Navigation & Filters Bar */}
      <div className="sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Veg Only Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition ${
              vegOnly
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className="veg-badge"></span>
            <span>Pure Veg Only</span>
          </button>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredFoods.length === 0 ? (
          <EmptyState
            icon={Utensils}
            title="No dishes found"
            description="There are no items matching your selected category or dietary filter."
            actionText="Reset Filters"
            onAction={() => {
              setSelectedCategory('All');
              setVegOnly(false);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredFoods.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                isRestaurantOpen={restaurant.isOpen}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Summary (If user has added items) */}
      {cart.itemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-lg animate-slide-up">
          <Link
            to="/cart"
            className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-2xl shadow-2xl shadow-primary-500/30 transition transform hover:scale-[1.02] active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-white/80">
                  {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in cart
                </p>
                <p className="text-base font-black">
                  Total: ${cart.totalAmount?.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 font-bold text-sm">
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailsPage;
