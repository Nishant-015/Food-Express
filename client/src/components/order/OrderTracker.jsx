import React from 'react';
import { Clock, Check, ChefHat, Bike, CheckCircle2, AlertOctagon } from 'lucide-react';

const STEPS = [
  { id: 'placed', label: 'Order Placed', icon: Clock },
  { id: 'confirmed', label: 'Confirmed', icon: Check },
  { id: 'preparing', label: 'Preparing', icon: ChefHat },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: Bike },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2 }
];

const OrderTracker = ({ currentStatus, cancellationReason = '' }) => {
  if (currentStatus === 'cancelled') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center my-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-rose-900 mb-1">Order Cancelled</h3>
        <p className="text-sm text-rose-700 max-w-md mx-auto">
          {cancellationReason || 'This order was cancelled and is no longer being processed.'}
        </p>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.id === currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between">
        {/* Background Connecting Line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-gray-200 -z-0">
          <div
            className="h-full bg-primary-500 transition-all duration-500 ease-out"
            style={{
              width: `${(activeIndex / (STEPS.length - 1)) * 100}%`
            }}
          ></div>
        </div>

        {/* Step Nodes */}
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center transition duration-300 ${
                  isDone
                    ? 'bg-emerald-500 text-white shadow-md'
                    : isCurrent
                    ? 'bg-primary-500 text-white shadow-lg ring-4 ring-primary-100 scale-110'
                    : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span
                className={`mt-2.5 text-xs font-bold text-center max-w-[80px] leading-tight ${
                  isCurrent
                    ? 'text-primary-600'
                    : isDone
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;
