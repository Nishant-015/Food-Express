import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';
import {
  ShoppingBag,
  Search,
  Calendar,
  Store,
  ChevronLeft,
  ChevronRight,
  Receipt
} from 'lucide-react';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setPageError(null);
      const res = await adminService.getAdminOrders({
        page,
        limit: 10,
        search: searchTerm.trim() || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter
      });
      if (res && res.data) {
        setOrders(res.data);
        if (res.meta) setMeta(res.meta);
      }
    } catch (err) {
      setPageError(err.formattedMessage || 'Failed to retrieve platform orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Platform Order Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Inspect, filter, and audit customer transactions across all operating kitchens
        </p>
      </div>

      {pageError && <ErrorAlert message={pageError} onRetry={fetchOrders} />}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by order number (e.g. ORD-2026...)"
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
          {['all', 'placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(
            (status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition ${
                  statusFilter === status
                    ? 'bg-primary-500 text-white shadow-xs'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Audit Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12">
            <LoadingSpinner text="Retrieving orders..." size="md" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Restaurant</th>
                  <th className="py-4 px-6">Dishes Snapshot</th>
                  <th className="py-4 px-6">Total Amount</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6">Order Status</th>
                  <th className="py-4 px-6 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50/60 transition">
                    <td className="py-4 px-6 font-bold text-gray-900">{o.orderNumber}</td>

                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900">{o.customer?.name || 'Customer'}</p>
                      <p className="text-[11px] text-gray-400">{o.contactPhone}</p>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900">{o.restaurant?.name || 'Restaurant'}</p>
                      <p className="text-[11px] text-gray-400">{o.restaurant?.city}</p>
                    </td>

                    <td className="py-4 px-6 max-w-xs truncate text-gray-600">
                      {o.items?.map((item) => `${item.quantity}x ${item.name}`).join(', ')}
                    </td>

                    <td className="py-4 px-6 font-bold text-gray-900">
                      ${o.totalAmount?.toFixed(2)}
                    </td>

                    <td className="py-4 px-6">
                      <span className="capitalize font-semibold text-gray-800">
                        {o.paymentMethod === 'cod' ? 'Cash' : 'Card'}
                      </span>
                      <span className="block text-[10px] text-gray-400 uppercase">
                        ({o.paymentStatus})
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <OrderStatusBadge status={o.orderStatus} />
                    </td>

                    <td className="py-4 px-6 text-right text-gray-400 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString([], {
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

        {/* Pagination */}
        {meta.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Showing page {page} of {meta.pages} ({meta.total} orders)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= meta.pages}
                onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
