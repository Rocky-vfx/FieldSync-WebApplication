import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/distance';
import { X, Calendar, Clock, MapPin, CheckCircle2, ShieldCheck, IndianRupee } from 'lucide-react';

export default function BookingModal() {
  const { bookingTargetHelper, setBookingTargetHelper, createBooking, currentUser, initiateGoogleLogin } = useApp();

  // Tomorrow's date as default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [requestedDate, setRequestedDate] = useState(defaultDateStr);
  const [notes, setNotes] = useState('');

  if (!bookingTargetHelper) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    createBooking({
      helperId: bookingTargetHelper.id,
      helperName: bookingTargetHelper.name,
      skillCategoryName: bookingTargetHelper.skillCategory.name,
      dailyWage: bookingTargetHelper.dailyWage,
      requestedDate,
      notes: notes || `Field work request for ${bookingTargetHelper.skillCategory.name} services.`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <img
              src={bookingTargetHelper.avatar}
              alt={bookingTargetHelper.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-orange-500/20 shadow-sm"
            />
            <div>
              <h3 className="font-extrabold text-slate-900 text-base font-heading">
                Book {bookingTargetHelper.name}
              </h3>
              <p className="text-xs text-orange-600 font-semibold">
                {bookingTargetHelper.skillCategory.name} · {formatCurrency(bookingTargetHelper.dailyWage)}/day
              </p>
            </div>
          </div>

          <button
            onClick={() => setBookingTargetHelper(null)}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Customer details verification */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Booking As:</span>
              <strong className="text-slate-900">{currentUser.fullName} ({currentUser.phone})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Service Location:</span>
              <span className="text-slate-700 text-right truncate max-w-[240px]">{currentUser.address}</span>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-orange-500" />
              Requested Work Date
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium text-slate-800"
            />
          </div>

          {/* Job Notes / Scope */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Description & Work Notes
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe the problem, materials available on site, access instructions, or timing..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-800"
            />
          </div>

          {/* Pricing summary */}
          <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/60">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-orange-950 block">Transparent Quoted Wage</span>
                <span className="text-[11px] text-orange-800/80">Pay directly to helper upon satisfactory completion</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold text-orange-950 font-heading">
                  {formatCurrency(bookingTargetHelper.dailyWage)}
                </span>
                <span className="text-xs text-orange-800/80 block">/ day</span>
              </div>
            </div>
          </div>

          {/* Submit action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setBookingTargetHelper(null)}
              className="px-4 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-accent text-xs font-bold px-6 py-2.5 shadow-md shadow-orange-500/25"
            >
              Confirm Booking Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
