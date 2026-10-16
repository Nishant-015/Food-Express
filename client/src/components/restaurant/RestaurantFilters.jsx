import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const CUISINES_LIST = ['All', 'Pizza', 'Burgers', 'Indian', 'Italian', 'Sushi', 'Healthy Bowls'];

const RestaurantFilters = ({
  search,
  setSearch,
  selectedCuisine,
  setSelectedCuisine,
  sortBy,
  setSortBy,
  isOpenOnly,
  setIsOpenOnly
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-8 space-y-5">
      {/* Search & Sort Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants, cuisines, or cities..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
          />
        </div>

        {/* Sort and Toggles */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Sort By Dropdown */}
          <div className="relative inline-flex items-center">
            <ArrowUpDown className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-9 pr-8 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none cursor-pointer transition"
            >
              <option value="rating">Top Rated</option>
              <option value="deliveryFee">Lowest Delivery Fee</option>
              <option value="deliveryTime">Fastest Delivery</option>
              <option value="newest">Newly Added</option>
            </select>
          </div>

          {/* Open now filter button */}
          <button
            onClick={() => setIsOpenOnly(!isOpenOnly)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition ${
              isOpenOnly
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            Open Now
          </button>
        </div>
      </div>

      {/* Cuisine Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
        {CUISINES_LIST.map((cuisine) => {
          const isSelected =
            (cuisine === 'All' && !selectedCuisine) || selectedCuisine === cuisine;
          return (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine === 'All' ? '' : cuisine)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {cuisine}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RestaurantFilters;
