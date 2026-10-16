import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import {
  Store,
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOwnerDashboard();
        if (res && res.data) {
          setData(res.data);
        }
      } catch (err) {
        setError(err.formattedMessage || 'Failed to load restaurant dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Compiling restaurant analytics..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <ErrorAlert message={error} />
      </div>
    );
  }

  const { hasRestaurant, restaurant, stats, recentOrders } = data || {};

  if (!hasRestaurant || !restaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-orange-50 text-primary-600 flex items-center justify-center mx-auto mb-4">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">No Restaurant Profile Registered</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
          You haven't set up your restaurant storefront yet. Create your restaurant profile to start receiving customer orders!
        </p>
        <Link
          to="/owner/restaurant"
          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary-500/25 transition"
        >
          Create Restaurant Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
            <img
              src={restaurant.image || 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=300&auto=format&fit=crop&q=80'}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">{restaurant.name}</h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  restaurant.isOpen
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {restaurant.isOpen ? 'Accepting Orders' : 'Store Closed'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {restaurant.city} • Rating: ★ {restaurant.rating?.toFixed(1) || '4.5'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/owner/menu"
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition"
          >
            Manage Menu
          </Link>
          <Link
            to="/owner/orders"
            className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/20 transition flex items-center gap-1.5"
          >
            <span>Live Kitchen Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Sales</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              ${stats?.totalRevenue?.toFixed(2) || '0.00'}
            </h3>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Delivered Orders
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Pending</p>
            <h3 className="text-2xl font-black text-amber-500 mt-1">
              {stats?.pendingOrders || 0}
            </h3>
            <span className="text-[11px] text-gray-400 font-medium mt-1 block">
              Requires fulfillment
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed Orders</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {stats?.deliveredOrders || 0}
            </h3>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
              Fulfilled successfully
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Received</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {stats?.totalOrders || 0}
            </h3>
            <span className="text-[11px] text-gray-400 font-medium mt-1 block">
              Lifetime platform orders
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Customer Orders</h2>
            <p className="text-xs text-gray-400 mt-0.5">Real-time incoming orders stream</p>
          </div>
          <Link
            to="/owner/orders"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders && recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-xs">
            No incoming orders yet today.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {recentOrders?.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/60 transition">
                    <td className="py-4 px-4 font-bold text-gray-900">{order.orderNumber}</td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900">{order.customer?.name || 'Customer'}</p>
                      <p className="text-[11px] text-gray-400">{order.contactPhone}</p>
                    </td>
                    <td className="py-4 px-4 max-w-xs truncate">
                      {order.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="py-4 px-4 font-bold text-gray-900">
                      ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <OrderStatusBadge status={order.orderStatus} />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to="/owner/orders"
                        className="text-primary-600 hover:text-primary-700 font-bold"
                      >
                        Process
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
