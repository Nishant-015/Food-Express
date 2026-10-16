import React from 'react';
import { Clock, CheckCircle2, ChefHat, Bike, Check, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  placed: {
    label: 'Order Placed',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Clock
  },
  confirmed: {
    label: 'Confirmed',
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Check
  },
  preparing: {
    label: 'Preparing Food',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: ChefHat
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Bike
  },
  delivered: {
    label: 'Delivered',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: XCircle
  }
};

const OrderStatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: Clock
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.bg} capitalize shadow-xs`}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
