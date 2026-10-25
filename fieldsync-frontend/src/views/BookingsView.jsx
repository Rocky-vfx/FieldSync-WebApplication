import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/common/StatusBadge';
import { formatCurrency } from '../utils/distance';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function BookingsView() {
  const {
    currentUser,
    bookings,
    updateBookingStatus,
    setReviewTargetBooking,
    reviews
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('ALL');

  const isHelper = currentUser.role === 'HELPER';

  // Filter bookings for current user or helper
  const userBookings = bookings.filter(b => {
    if (currentUser.role === 'ADMIN') return true;
    if (isHelper) {
      return b.helperId === (currentUser.helperProfileId || currentUser.id) || b.helperName === currentUser.fullName;
    }
    return b.customerId === currentUser.id || b.customerName === currentUser.fullName;
  });

  const filteredBookings = userBookings.filter(b => {
    if (statusFilter === 'ALL') return true;
    return b.status === statusFilter;
  });

  // Check if booking has already been reviewed
  const hasReview = (bookingId) => {
    return reviews.some(r => r.bookingId === bookingId);
  };

  const statusTabs = [
    { id: 'ALL', label: 'All Bookings', count: userBookings.length },
    { id: 'PENDING', label: 'Pending', count: userBookings.filter(b => b.status === 'PENDING').length },
    { id: 'ACCEPTED', label: 'Accepted', count: userBookings.filter(b => b.status === 'ACCEPTED').length },
    { id: 'COMPLETED', label: 'Completed', count: userBookings.filter(b => b.status === 'COMPLETED').length },
    { id: 'CANCELLED', label: 'Cancelled', count: userBookings.filter(b => b.status === 'CANCELLED').length }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
            {isHelper ? 'Incoming Client Bookings' : 'My Service Bookings'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track job appointments, approve incoming requests, and manage reviews
          </p>
        </div>

        {/* Status segmented pill tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl overflow-x-auto no-scrollbar">
          {statusTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                statusFilter === tab.id ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table / Card List */}
      <div className="field-card overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-sm">No Bookings Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              There are no {statusFilter.toLowerCase()} bookings under your account.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-5">ID & Service</th>
                  <th className="py-3.5 px-5">{isHelper ? 'Customer' : 'Helper'}</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Daily Wage</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900">
                        #{b.id} · {b.skillCategoryName}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs mt-0.5">
                        {b.notes}
                      </p>
                    </td>

                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-800">
                        {isHelper ? b.customerName : b.helperName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {isHelper ? b.customerPhone : 'Verified Partner'}
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-orange-500" />
                        {new Date(b.requestedDate).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-bold text-slate-900 text-sm">
                        {formatCurrency(b.dailyWage)}
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      <StatusBadge status={b.status} />
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Helper Actions */}
                        {isHelper && b.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(b.id, 'ACCEPTED')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                            </button>
                            <button
                              onClick={() => updateBookingStatus(b.id, 'REJECTED')}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg font-bold text-xs transition-colors"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {isHelper && b.status === 'ACCEPTED' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'COMPLETED')}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                          </button>
                        )}

                        {/* Customer Actions */}
                        {!isHelper && b.status === 'PENDING' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'CANCELLED')}
                            className="px-3 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg font-bold text-xs transition-colors"
                          >
                            Cancel
                          </button>
                        )}

                        {!isHelper && b.status === 'COMPLETED' && (
                          hasReview(b.id) ? (
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed
                            </span>
                          ) : (
                            <button
                              onClick={() => setReviewTargetBooking(b)}
                              className="btn-accent text-xs font-bold px-3 py-1.5 shadow-sm"
                            >
                              <Star className="w-3.5 h-3.5 fill-white" /> Rate & Review
                            </button>
                          )
                        )}
                      </div>
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
}
