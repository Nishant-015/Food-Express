import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import {
  Store,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const RestaurantAdminPage = () => {
  const { success, error } = useToast();

  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [approvalFilter, setApprovalFilter] = useState('all'); // 'all', 'true', 'false'
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setPageError(null);
      const res = await adminService.getAdminRestaurants({
        page,
        limit: 10,
        search: searchTerm.trim() || undefined,
        isApproved: approvalFilter === 'all' ? undefined : approvalFilter
      });
      if (res && res.data) {
        setRestaurants(res.data);
        if (res.meta) setMeta(res.meta);
      }
    } catch (err) {
      setPageError(err.formattedMessage || 'Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRestaurants();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, approvalFilter, page]);

  const handleToggleApproval = async (restaurant) => {
    try {
      setActionLoading((prev) => ({ ...prev, [restaurant._id]: true }));
      const newApproval = !restaurant.isApproved;
      await adminService.updateRestaurantApproval(restaurant._id, newApproval);
      setRestaurants((prev) =>
        prev.map((r) => (r._id === restaurant._id ? { ...r, isApproved: newApproval } : r))
      );
      success(
        `Restaurant '${restaurant.name}' ${newApproval ? 'approved for listing' : 'unapproved'}`
      );
    } catch (err) {
      error(err.formattedMessage || 'Failed to update approval');
    } finally {
      setActionLoading((prev) => ({ ...prev, [restaurant._id]: false }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Restaurant Administration
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Review restaurant partner applications, verify details, and manage public listings
        </p>
      </div>

      {pageError && <ErrorAlert message={pageError} onRetry={fetchRestaurants} />}

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
            placeholder="Search by restaurant name or city..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setApprovalFilter('all');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              approvalFilter === 'all'
                ? 'bg-primary-500 text-white shadow-xs'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Spots
          </button>
          <button
            onClick={() => {
              setApprovalFilter('false');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              approvalFilter === 'false'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Pending Approval
          </button>
          <button
            onClick={() => {
              setApprovalFilter('true');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              approvalFilter === 'true'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Approved
          </button>
        </div>
      </div>

      {/* Restaurants List Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12">
            <LoadingSpinner text="Fetching restaurants..." size="md" />
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            No restaurants found for the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Restaurant</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Owner</th>
                  <th className="py-4 px-6">Cuisines</th>
                  <th className="py-4 px-6">Approval Status</th>
                  <th className="py-4 px-6 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {restaurants.map((r) => {
                  const isBusy = !!actionLoading[r._id];

                  return (
                    <tr key={r._id} className="hover:bg-gray-50/60 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={r.image || 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=100&auto=format&fit=crop&q=80'}
                            alt={r.name}
                            className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                          />
                          <div>
                            <p className="font-bold text-gray-900">{r.name}</p>
                            <span className="text-[10px] text-gray-400">★ {r.rating || 4.5}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-gray-600">
                        <p>{r.city}</p>
                        <p className="text-[11px] text-gray-400 truncate max-w-xs">{r.address}</p>
                      </td>

                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900">{r.owner?.name || 'Owner'}</p>
                        <p className="text-[11px] text-gray-400">{r.owner?.email}</p>
                      </td>

                      <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                        {Array.isArray(r.cuisines) ? r.cuisines.join(', ') : r.cuisines}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                            r.isApproved
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {r.isApproved ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Approved
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" /> Pending Review
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleToggleApproval(r)}
                          disabled={isBusy}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition disabled:opacity-50 ${
                            r.isApproved
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          }`}
                        >
                          {r.isApproved ? 'Revoke Approval' : 'Approve Partner'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Showing page {page} of {meta.pages} ({meta.total} restaurants)
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

export default RestaurantAdminPage;
