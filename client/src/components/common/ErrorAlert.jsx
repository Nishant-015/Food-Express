import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorAlert = ({ message = 'Failed to load data', onRetry = null }) => {
  return (
    <div className="rounded-2xl bg-rose-50 border border-rose-200 p-5 my-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-rose-800">
        <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
        <span className="text-sm font-semibold">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-100/60 shadow-sm transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;
