import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import {
  Users,
  Store,
  ShoppingBag,
  DollarSign,
  ShieldCheck,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await adminService.getAdminDashboard();
        if (res && res.data) {
          setData(res.data);
        }
      } catch (err) {
        setError(err.formattedMessage || 'Failed to load platform statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Aggregating platform intelligence..." size="lg" />
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

  const { metrics, recentOrders } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Platform Administration
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Global monitoring of users, partner restaurants, and financial transactions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/restaurants"
            className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/20 transition"
          >
            Approve Restaurants
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gross Revenue</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              ${metrics?.totalRevenue?.toFixed(2) || '0.00'}
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
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Users</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {metrics?.totalUsers || 0}
            </h3>
            <span className="text-[11px] text-gray-400 mt-1 block">
              {metrics?.customerCount} Customers • {metrics?.ownerCount} Partners
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Restaurants</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {metrics?.totalRestaurants || 0}
            </h3>
            <span className="text-[11px] text-amber-600 font-bold mt-1 block">
              {metrics?.pendingRestaurants || 0} Pending Approvals
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">All-Time Orders</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {metrics?.totalOrders || 0}
            </h3>
            <span className="text-[11px] text-gray-400 mt-1 block">
              {metrics?.deliveredOrders} Delivered • {metrics?.cancelledOrders} Cancelled
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Platform Recent Orders Audit */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Platform Orders Audit</h2>
            <p className="text-xs text-gray-400 mt-0.5">Live monitoring across all kitchens</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders && recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-xs">
            No platform orders recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Restaurant</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-r-xl">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {recentOrders?.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/60 transition">
                    <td className="py-4 px-4 font-bold text-gray-900">{order.orderNumber}</td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900">{order.customer?.name || 'Customer'}</p>
                      <p className="text-[11px] text-gray-400">{order.customer?.email}</p>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-900">
                      {order.restaurant?.name || 'Restaurant'}
                    </td>
                    <td className="py-4 px-4 font-bold text-gray-900">
                      ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <OrderStatusBadge status={order.orderStatus} />
                    </td>
                    <td className="py-4 px-4 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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

export default AdminDashboard;
