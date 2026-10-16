import React, { useState, useEffect } from 'react';
import { restaurantService } from '../../services/restaurantService';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import {
  Store,
  MapPin,
  Clock,
  Bike,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const RestaurantManagePage = () => {
  const { success, error } = useToast();

  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisines: '',
    image: '',
    address: '',
    city: '',
    deliveryFee: 40,
    estimatedDeliveryMinutes: 30,
    isOpen: true
  });

  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        setLoading(true);
        const dashRes = await orderService.getOwnerDashboard();
        if (dashRes?.data?.restaurant) {
          const r = dashRes.data.restaurant;
          setRestaurant(r);
          setIsEditingExisting(true);
          setFormData({
            name: r.name || '',
            description: r.description || '',
            cuisines: Array.isArray(r.cuisines) ? r.cuisines.join(', ') : r.cuisines || '',
            image: r.image || '',
            address: r.address || '',
            city: r.city || '',
            deliveryFee: r.deliveryFee !== undefined ? r.deliveryFee : 40,
            estimatedDeliveryMinutes: r.estimatedDeliveryMinutes || 30,
            isOpen: r.isOpen !== undefined ? r.isOpen : true
          });
        } else {
          setIsEditingExisting(false);
        }
      } catch (err) {
        setPageError('Failed to load restaurant profile');
      } finally {
        setLoading(false);
      }
    };

    loadRestaurant();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cuisinesArray = formData.cuisines
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    if (cuisinesArray.length === 0) {
      error('Please provide at least one cuisine (separated by commas)');
      return;
    }

    const payload = {
      ...formData,
      cuisines: cuisinesArray,
      deliveryFee: Number(formData.deliveryFee),
      estimatedDeliveryMinutes: Number(formData.estimatedDeliveryMinutes)
    };

    try {
      setSubmitting(true);
      if (isEditingExisting && restaurant) {
        const res = await restaurantService.updateRestaurant(restaurant._id, payload);
        if (res?.data) {
          setRestaurant(res.data);
          success('Restaurant details updated successfully');
        }
      } else {
        const res = await restaurantService.createRestaurant(payload);
        if (res?.data) {
          setRestaurant(res.data);
          setIsEditingExisting(true);
          success('Restaurant created successfully! Pending admin approval if required.');
        }
      }
    } catch (err) {
      error(err.formattedMessage || 'Failed to save restaurant details');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading restaurant settings..." size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {isEditingExisting ? 'Restaurant Settings' : 'Create Your Restaurant'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Configure storefront information, working hours, and delivery fees
        </p>
      </div>

      {pageError && <ErrorAlert message={pageError} />}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-6">
        {/* Name and Cuisines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Restaurant Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Bella Italia Trattoria"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Cuisines (Comma Separated)
            </label>
            <input
              type="text"
              required
              value={formData.cuisines}
              onChange={(e) => setFormData({ ...formData, cuisines: e.target.value })}
              placeholder="Italian, Pizza, Pasta"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            About / Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Tell customers what makes your kitchen special..."
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
          />
        </div>

        {/* Address and City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Street Address
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="142 Sullivan Street"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              City
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="New York"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
            />
          </div>
        </div>

        {/* Delivery Fee, Time & Image URL */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Delivery Fee ($)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              required
              value={formData.deliveryFee}
              onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Avg Time (Mins)
            </label>
            <input
              type="number"
              min="5"
              max="180"
              required
              value={formData.estimatedDeliveryMinutes}
              onChange={(e) => setFormData({ ...formData, estimatedDeliveryMinutes: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Cover Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
            />
          </div>
        </div>

        {/* Store Open/Closed Toggle */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-gray-900">Accepting Orders Status</h4>
            <p className="text-xs text-gray-400">
              When switched off, customers can browse your menu but cannot place new orders.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isOpen}
              onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary-500/25 transition disabled:opacity-50"
          >
            {submitting ? 'Saving Settings...' : 'Save Restaurant Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantManagePage;
