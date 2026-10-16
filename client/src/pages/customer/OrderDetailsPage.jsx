import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import OrderTracker from '../../components/order/OrderTracker';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import Modal from '../../components/common/Modal';
import {
  MapPin,
  Phone,
  Store,
  Calendar,
  Receipt,
  XCircle,
  Clock,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { success, error } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  // Cancellation modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setPageError(null);
      const res = await orderService.getOrderById(id);
      if (res && res.data) {
        setOrder(res.data);
      }
    } catch (err) {
      setPageError(err.formattedMessage || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Auto-refresh order status every 15 seconds for active orders
    const interval = setInterval(() => {
      if (order && !['delivered', 'cancelled'].includes(order.orderStatus)) {
        orderService.getOrderById(id).then((res) => {
          if (res?.data) setOrder(res.data);
        });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [id]);

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    try {
      setCancelling(true);
      const res = await orderService.cancelOrder(id, cancelReason);
      if (res && res.data) {
        setOrder(res.data);
        setCancelModalOpen(false);
        success('Order was successfully cancelled');
      }
    } catch (err) {
      error(err.formattedMessage || 'Could not cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading && !order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner text="Tracking order status..." size="lg" />
      </div>
    );
  }

  if (pageError || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ErrorAlert message={pageError || 'Order not found'} />
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-primary-500 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>
      </div>
    );
  }

  // Check if order can be cancelled: allowed only when placed or confirmed
  const canCancel = ['placed', 'confirmed'].includes(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Order {order.orderNumber}
            </h1>
            <OrderStatusBadge status={order.orderStatus} />
          </div>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrder}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition"
            title="Refresh order status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {canCancel && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" /> Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Visual Order Progress Tracker */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-2">Live Delivery Status</h2>
        <OrderTracker
          currentStatus={order.orderStatus}
          cancellationReason={order.cancellationReason}
        />
      </div>

      {/* Grid: Order Items & Delivery Location */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Items breakdown */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <Store className="w-5 h-5 text-primary-500" />
              <h3 className="font-bold text-base text-gray-900">
                {order.restaurant?.name || 'Restaurant'}
              </h3>
            </div>
            <span className="text-xs text-gray-400">
              {order.restaurant?.city}
            </span>
          </div>

          {/* Items list */}
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="space-y-0.5">
                  <p className="font-bold text-gray-900">
                    <span className="text-primary-600 font-extrabold mr-1.5">{item.quantity}x</span>
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    ${item.unitPrice?.toFixed(2)} per unit
                  </p>
                </div>
                <span className="font-extrabold text-gray-900">
                  ${item.lineTotal?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">${order.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-gray-900">${order.deliveryFee?.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-${order.discount?.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
              <span className="font-extrabold text-gray-900">Total Paid</span>
              <span className="font-black text-xl text-primary-600">
                ${order.totalAmount?.toFixed(2)}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 text-right uppercase font-semibold">
              Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'} ({order.paymentStatus})
            </p>
          </div>
        </div>

        {/* Right: Delivery Details & Status History */}
        <div className="md:col-span-5 space-y-6">
          {/* Delivery Address Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-500" />
              Delivery Address
            </h3>

            <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="font-bold text-gray-900">{order.deliveryAddress?.label || 'Destination'}</p>
              <p>{order.deliveryAddress?.fullAddress}</p>
              <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.postalCode}</p>
              <p className="pt-1 flex items-center gap-1.5 text-gray-700 font-semibold">
                <Phone className="w-3.5 h-3.5 text-gray-400" /> {order.contactPhone}
              </p>
            </div>
          </div>

          {/* Status Timeline Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-500" />
              Status Timeline
            </h3>

            <div className="space-y-3 relative pl-4 border-l-2 border-primary-200">
              {order.statusHistory?.map((hist, idx) => (
                <div key={idx} className="relative text-xs">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary-500"></span>
                  <p className="font-bold text-gray-900 capitalize">{hist.status.replace('_', ' ')}</p>
                  <p className="text-[11px] text-gray-400">
                    {new Date(hist.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {hist.note && ` — ${hist.note}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel This Order"
      >
        <form onSubmit={handleCancelOrder} className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to cancel order <strong>{order.orderNumber}</strong>? Orders can only be cancelled before preparation starts.
          </p>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Reason for Cancellation
            </label>
            <textarea
              required
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Ordered by mistake, changed mind, delivery taking too long..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              Keep Order
            </button>
            <button
              type="submit"
              disabled={cancelling}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OrderDetailsPage;
