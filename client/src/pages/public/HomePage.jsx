import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { restaurantService } from '../../services/restaurantService';
import { foodService } from '../../services/foodService';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import {
  Search,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  Award,
  ChevronRight,
  Flame
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resRestaurants, resCategories] = await Promise.all([
          restaurantService.getRestaurants({ limit: 6, sortBy: 'rating' }),
          foodService.getCategories()
        ]);

        if (resRestaurants && resRestaurants.data) {
          setFeaturedRestaurants(resRestaurants.data);
        }
        if (resCategories && resCategories.data) {
          setCategories(resCategories.data);
        }
      } catch (err) {
        setError('Failed to fetch initial restaurant recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/restaurants');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 pb-16 bg-gradient-to-b from-orange-50/60 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy & Search */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/60 text-primary-700 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-primary-600" />
                The Ultimate Food Delivery Experience
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
                Savor exceptional meals, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-amber-500">
                  delivered fast
                </span>{' '}
                to your door.
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Explore hand-crafted menus from the city's finest restaurants, authentic artisanal kitchens, and beloved local gems.
              </p>

              {/* Search Form */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto lg:mx-0 p-2 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
              >
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by restaurant name, dish, or cuisine..."
                    className="w-full pl-12 pr-4 py-3.5 bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary-500/25 transition flex items-center justify-center gap-2 flex-shrink-0"
                >
                  <span>Explore Food</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Highlights row */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-bold text-gray-600">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-500" /> 25-30 Min Average
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Live Kitchen Hygiene
                </span>
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" /> Verified Top Chefs
                </span>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform lg:rotate-2 hover:rotate-0 transition duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop&q=80"
                    alt="Delicious Gourmet Dish"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Rating Pill */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce-slow">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-base">
                    ★ 4.9
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Over 50,000+ Orders</p>
                    <p className="text-[11px] text-gray-500">Consistently loved by foodies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Food Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-extrabold text-primary-600 uppercase tracking-widest">
                What's On Your Mind?
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                Explore Popular Categories
              </h2>
            </div>
            <Link
              to="/restaurants"
              className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
            >
              <span>See All</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/restaurants?cuisine=${encodeURIComponent(category.name)}`}
                className="group flex flex-col items-center p-4 bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 bg-orange-50 border-2 border-orange-100 group-hover:scale-110 transition duration-300">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-bold text-xs sm:text-sm text-gray-800 group-hover:text-primary-600 transition text-center line-clamp-1">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Restaurants Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-600 uppercase tracking-widest">
              <Flame className="w-4 h-4" /> Top Trending Today
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Featured Restaurants
            </h2>
          </div>
          <Link
            to="/restaurants"
            className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
          >
            <span>View All Restaurants</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {error && <ErrorAlert message={error} />}

        {loading ? (
          <LoadingSpinner text="Fetching top restaurants..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>

      {/* How it Works Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 sm:p-12 text-white">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-primary-400 font-extrabold text-xs uppercase tracking-widest">
              Effortless & Simple
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">How FoodieExpress Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary-500 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-lg">
                1
              </div>
              <h3 className="font-bold text-lg">Choose Your Restaurant</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Browse hundreds of verified menus, customer reviews, and chef's recommendations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary-500 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-lg">
                2
              </div>
              <h3 className="font-bold text-lg">Place Your Order</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Customize your cart, enter your address, and choose convenient cash on delivery or instant card pay.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary-500 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-lg">
                3
              </div>
              <h3 className="font-bold text-lg">Delivered Fresh & Fast</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Track status progression from the kitchen grill straight to your dining table.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
