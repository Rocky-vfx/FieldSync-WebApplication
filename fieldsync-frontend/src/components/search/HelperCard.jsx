import React from 'react';
import { useApp } from '../../context/AppContext';
import StarRating from '../common/StarRating';
import { formatDistance, formatCurrency } from '../../utils/distance';
import {
  ShieldCheck,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  Scale,
  Calendar,
  ChevronRight
} from 'lucide-react';

export default function HelperCard({ helper }) {
  const {
    setSelectedHelper,
    comparisonList,
    toggleComparison,
    setBookingTargetHelper
  } = useApp();

  const isComparing = comparisonList.some(h => h.id === helper.id);

  return (
    <div className="field-card p-5 flex flex-col justify-between transition-all duration-200 hover:scale-[1.015] hover:border-orange-200/80 group">
      <div>
        {/* Top bar: Skill pill, Distance tag & Compare toggle */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 tracking-wide">
            {helper.skillCategory.name}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/60">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              {formatDistance(helper.distanceKm)}
            </span>

            {/* Compare Checkbox */}
            <button
              onClick={() => toggleComparison(helper)}
              title={isComparing ? 'Remove from comparison' : 'Add to compare'}
              className={`p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
                isComparing
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-white text-slate-400 border-slate-200 hover:text-orange-500 hover:border-orange-300'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="relative">
            <img
              src={helper.avatar}
              alt={helper.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-orange-400/40 transition-all shadow-sm"
            />
            {helper.available ? (
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-1 -right-1 shadow-sm" title="Available today" />
            ) : (
              <span className="w-3.5 h-3.5 rounded-full bg-slate-400 border-2 border-white absolute -bottom-1 -right-1" title="Currently busy" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-base font-bold text-slate-900 truncate font-heading group-hover:text-orange-600 transition-colors">
                {helper.name}
              </h4>
              {helper.verified && (
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" title="Government ID Verified" />
              )}
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
              <span>{helper.workLocationName}</span>
            </p>

            <div className="mt-1.5">
              <StarRating rating={helper.averageRating} count={helper.ratingCount} size="xs" />
            </div>
          </div>
        </div>

        {/* Short Bio snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {helper.bio}
        </p>

        {/* Key Attributes Grid */}
        <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 mb-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span><strong>{helper.experienceYears}</strong> yrs exp</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${helper.available ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            <span className={`font-semibold ${helper.available ? 'text-emerald-700' : 'text-slate-500'}`}>
              {helper.available ? 'Available' : 'Busy today'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Quoted Daily Wage & Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Quoted Daily Wage
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-slate-900 font-heading">
              {formatCurrency(helper.dailyWage)}
            </span>
            <span className="text-xs font-semibold text-slate-500">/ day</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedHelper(helper)}
            className="px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
          >
            Details
          </button>
          <button
            onClick={() => setBookingTargetHelper(helper)}
            className="btn-primary text-xs font-bold px-4 py-2 shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book
          </button>
        </div>
      </div>
    </div>
  );
}
