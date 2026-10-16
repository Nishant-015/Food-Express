import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { restaurantService } from '../../services/restaurantService';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import RestaurantFilters from '../../components/restaurant/RestaurantFilters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';
import { Store, ChevronLeft, ChevronRight } from 'lucide-react';

const RestaurantListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get('cuisine') || '');
  const [sortBy, setSortBy] = useState('rating');
  const [isOpenOnly, setIsOpenOnly] = useState(false);
  const [page, setPage] = useState(1);

  const [restaurants, setRestaurants] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1, limit: 12 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: 12,
        sortBy,
        search: search.trim() || undefined,
        cuisine: selectedCuisine || undefined,
        isOpen: isOpenOnly ? true : undefined
      };

      const res = await restaurantService.getRestaurants(params);
      if (res && res.data) {
        setRestaurants(res.data);
        if (res.meta) {
          setMeta(res.meta);
        }
      }
    } catch (err) {
      setError(err.formattedMessage || 'Failed to retrieve restaurant listings');
    } finally {
      setLoading(false);
    }
  };

  // Sync URL search params when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRestaurants();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, selectedCuisine, sortBy, isOpenOnly, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Explore Restaurants
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {meta.total} delivery spots ready to serve in your area
        </p>
      </div>

      {/* Filters Bar */}
      <RestaurantFilters
        search={search}
        setSearch={setSearch}
        selectedCuisine={selectedCuisine}
        setSelectedCuisine={setSelectedCuisine}
        sortBy={sortBy}
        setSortBy={setSortBy}
        isOpenOnly={isOpenOnly}
        setIsOpenOnly={setIsOpenOnly}
      />

      {/* Error state */}
      {error && <ErrorAlert message={error} onRetry={fetchRestaurants} />}

      {/* Loading state */}
      {loading ? (
        <LoadingSpinner text="Discovering restaurants..." size="lg" />
      ) : restaurants.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No restaurants found"
          description="We couldn't find any restaurants matching your current search or filter criteria. Try clearing some filters."
          actionText="Clear All Filters"
          onAction={() => {
            setSearch('');
            setSelectedCuisine('');
            setIsOpenOnly(false);
            setSortBy('rating');
          }}
        />
      ) : (
        <>
          {/* Restaurant Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>

          {/* Pagination Controls */}
          {meta.pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12 pt-6 border-t border-gray-100">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="text-xs font-bold text-gray-600 px-3">
                Page {page} of {meta.pages}
              </span>

              <button
                disabled={page >= meta.pages}
                onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RestaurantListingPage;
