import React from 'react';
import { useApp } from '../../context/AppContext';
import StarRating from '../common/StarRating';
import { formatCurrency, formatDistance } from '../../utils/distance';
import {
  X,
  ShieldCheck,
  MapPin,
  Clock,
  Briefcase,
  Phone,
  Mail,
  Calendar,
  Flag,
  FileCheck,
  CheckCircle2
} from 'lucide-react';

export default function HelperDetailModal() {
  const {
    selectedHelper,
    setSelectedHelper,
    reviews,
    setBookingTargetHelper,
    flagReview
  } = useApp();

  if (!selectedHelper) return null;

  const helperReviews = reviews.filter(r => r.helperProfileId === selectedHelper.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in-up">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 my-8 overflow-hidden">
        {/* Cover / Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-orange-50/50 via-slate-50 to-white">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={selectedHelper.avatar}
                alt={selectedHelper.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md"
              />
              {selectedHelper.available && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-1 -right-1" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-xl font-heading">
                  {selectedHelper.name}
                </h3>
                {selectedHelper.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" /> ID Verified
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-md">
                  {selectedHelper.skillCategory.name}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {selectedHelper.workLocationName}
                </span>
              </div>

              <div className="mt-2">
                <StarRating rating={selectedHelper.averageRating} count={selectedHelper.ratingCount} size="sm" />
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedHelper(null)}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Quick stats strip */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Daily Wage
              </span>
              <span className="text-base font-extrabold text-slate-900">
                {formatCurrency(selectedHelper.dailyWage)}
              </span>
            </div>
            <div className="border-x border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Experience
              </span>
              <span className="text-base font-extrabold text-slate-900">
                {selectedHelper.experienceYears} Years
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Work Status
              </span>
              <span className={`text-xs font-bold inline-block mt-0.5 ${selectedHelper.available ? 'text-emerald-600' : 'text-slate-500'}`}>
                {selectedHelper.available ? '● Available Today' : '○ Busy'}
              </span>
            </div>
          </div>

          {/* About & Bio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              About & Expertise
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {selectedHelper.bio}
            </p>
          </div>

          {/* Badges / Certifications */}
          {selectedHelper.badges && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Verification & Credentials
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedHelper.badges.map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {b}
                  </span>
                ))}
                {selectedHelper.documentType && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                    {selectedHelper.documentType}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Customer Reviews Section */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Authentic Customer Reviews ({helperReviews.length})
              </h4>
              <span className="text-xs text-slate-400">Tied to completed bookings</span>
            </div>

            {helperReviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No reviews yet. Be the first to book and rate {selectedHelper.name}!
              </p>
            ) : (
              <div className="space-y-3">
                {helperReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      rev.flagged ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50/60 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.reviewer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                          alt={rev.reviewer.fullName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">
                            {rev.reviewer.fullName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <StarRating rating={rev.rating} showCount={false} size="xs" />
                        {!rev.flagged ? (
                          <button
                            onClick={() => flagReview(rev.id, 'User flagged as suspicious or abusive')}
                            title="Flag review to admin"
                            className="text-slate-300 hover:text-rose-500 p-1 rounded transition-colors"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                            Flagged for Admin
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Quoted Wage
            </span>
            <span className="text-lg font-extrabold text-slate-900 font-heading">
              {formatCurrency(selectedHelper.dailyWage)}
              <span className="text-xs font-medium text-slate-500"> / day</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedHelper(null)}
              className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Close
            </button>
            <button
              onClick={() => {
                const target = selectedHelper;
                setSelectedHelper(null);
                setBookingTargetHelper(target);
              }}
              className="btn-accent text-xs font-bold px-6 py-2.5 shadow-md shadow-orange-500/25"
            >
              <Calendar className="w-3.5 h-3.5" />
              Book {selectedHelper.name.split(' ')[0]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
