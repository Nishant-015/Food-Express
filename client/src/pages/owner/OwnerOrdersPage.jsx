import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';
import {
  ShoppingBag,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  Play,
  Bike,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';

const STATUS_FILTERS = [
  'all',
  'placed',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled'
];

const OwnerOrdersPage = () => {
  const { success, error } = useToast();

  const [orders, setOrders] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setPageError(null);
      const res = await orderService.getOwnerOrders({
        status: selectedFilter === 'all' ? undefined : selectedFilter
      });
      if (res && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      setPageError(err.formattedMessage || 'Failed to fetch incoming orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Auto-poll incoming orders every 10 seconds
    const interval = setInterval(() => {
      orderService.getOwnerOrders({
        status: selectedFilter === 'all' ? undefined : selectedFilter
      }).then((res) => {
        if (res?.data) setOrders(res.data);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedFilter]);

  const handleUpdateStatus = async (orderId, newStatus, note = '') => {
    try {
      setActionLoading((prev) => ({ ...prev, [orderId]: true }));
      const res = await orderService.updateOwnerOrderStatus(orderId, newStatus, note);
      if (res?.data) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        success(`Order status updated to ${newStatus.replace('_', ' ')}`);
      }
    } catch (err) {
      error(err.formattedMessage || 'Failed to update order status');
    } finally {
      setActionLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Kitchen & Delivery Orders
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Accept, prepare, and advance orders in real-time
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 self-start sm:self-auto transition flex items-center gap-1.5 text-xs font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {pageError && <ErrorAlert message={pageError} onRetry={fetchOrders} />}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedFilter(status)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap capitalize transition ${
              selectedFilter === status
                ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching kitchen orders..." size="lg" />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders found"
          description={`There are currently no orders under the '${selectedFilter}' category.`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const isBusy = !!actionLoading[order._id];

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-5"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 pb-4 border-b border-gray-100">
                    <div>
                      <span className="text-xs font-black text-gray-900 tracking-wider">
                        {order.orderNumber}
                      </span>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.orderStatus} />
                  </div>

                  {/* Customer Delivery Information */}
                  <div className="py-3 text-xs text-gray-600 space-y-1">
                    <p className="font-bold text-gray-900">{order.customer?.name || 'Customer'}</p>
                    <p className="flex items-center gap-1.5 text-gray-500 truncate">
                      <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      {order.contactPhone}
                    </p>
                    <p className="flex items-start gap-1.5 text-gray-500 line-clamp-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                      {order.deliveryAddress?.fullAddress}, {order.deliveryAddress?.city}
                    </p>
                  </div>

                  {/* Ordered Dishes List */}
                  <div className="bg-gray-50 rounded-2xl p-3.5 space-y-1.5 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between font-medium">
                        <span className="text-gray-800">
                          <strong className="text-primary-600 mr-1">{item.quantity}x</strong>
                          {item.name}
                        </span>
                        <span className="text-gray-900 font-bold">${item.lineTotal?.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-extrabold text-sm text-gray-900">
                      <span>Total</span>
                      <span className="text-primary-600">${order.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Status Transition Action Buttons */}
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  {order.orderStatus === 'placed' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'confirmed', 'Order confirmed by restaurant')}
                        disabled={isBusy}
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'cancelled', 'Rejected by restaurant')}
                        disabled={isBusy}
                        className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}

                  {order.orderStatus === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'preparing', 'Chef started cooking')}
                      disabled={isBusy}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Preparing
                    </button>
                  )}

                  {order.orderStatus === 'preparing' && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'out_for_delivery', 'Handed to delivery courier')}
                      disabled={isBusy}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Bike className="w-3.5 h-3.5" /> Hand to Courier
                    </button>
                  )}

                  {order.orderStatus === 'out_for_delivery' && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'delivered', 'Order successfully delivered')}
                      disabled={isBusy}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Delivered
                    </button>
                  )}

                  {['delivered', 'cancelled'].includes(order.orderStatus) && (
                    <p className="text-center text-[11px] font-semibold text-gray-400 py-1">
                      Order finalized ({order.orderStatus})
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OwnerOrdersPage;
