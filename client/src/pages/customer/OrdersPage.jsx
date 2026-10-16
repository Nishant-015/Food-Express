import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';
import { ClipboardList, ArrowRight, Store, Calendar, ChevronRight } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getMyOrders();
        if (res && res.data) {
          setOrders(res.data);
        }
      } catch (err) {
        setError(err.formattedMessage || 'Failed to load order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Fetching your orders..." size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          My Orders
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Track active deliveries and review your past orders
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      {orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders placed yet"
          description="You haven't placed any food orders yet. Browse our top rated restaurants to make your first order!"
          actionText="Browse Restaurants"
          actionLink="/restaurants"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="group block bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-gray-900 group-hover:text-primary-600 transition">
                      {order.restaurant?.name || 'Restaurant'}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <OrderStatusBadge status={order.orderStatus} />
                  <span className="font-black text-lg text-gray-900">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items Summary & Action */}
              <div className="pt-4 flex items-center justify-between text-xs">
                <p className="text-gray-600 font-medium truncate max-w-lg">
                  {order.items?.map((item) => `${item.quantity}x ${item.name}`).join(', ')}
                </p>

                <span className="font-bold text-primary-600 flex items-center gap-1 group-hover:translate-x-1 transition flex-shrink-0 ml-4">
                  <span>Track & Details</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
