import React from 'react';
import { useApp } from '../../context/AppContext';
import StarRating from '../common/StarRating';
import { formatCurrency, formatDistance } from '../../utils/distance';
import { X, ShieldCheck, Scale, Check, Calendar, ArrowRight } from 'lucide-react';

export default function HelperComparisonModal() {
  const {
    comparisonList,
    setComparisonList,
    isComparing,
    setIsComparing,
    setBookingTargetHelper
  } = useApp();

  if (!isComparing || comparisonList.length === 0) return null;

  const removeHelper = (id) => {
    const updated = comparisonList.filter(h => h.id !== id);
    setComparisonList(updated);
    if (updated.length === 0) {
      setIsComparing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in-up">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-100 my-8 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg font-heading">
                Side-by-Side Helper Comparison
              </h3>
              <p className="text-xs text-slate-500">
                Compare daily wage, star ratings, distance, and experience before hiring
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsComparing(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Table / Matrix */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-3 w-40 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Attribute
                </th>
                {comparisonList.map((helper) => (
                  <th key={helper.id} className="py-4 px-4 min-w-[220px]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={helper.avatar}
                          alt={helper.name}
                          className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-100"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{helper.name}</div>
                          <span className="text-xs text-orange-600 font-semibold">{helper.skillCategory.name}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeHelper(helper.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 rounded transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {/* Daily Wage */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Quoted Wage
                </td>
                {comparisonList.map((helper) => (
                  <td key={helper.id} className="py-3.5 px-4 font-extrabold text-slate-900 text-base">
                    {formatCurrency(helper.dailyWage)}
                    <span className="text-xs font-normal text-slate-500"> / day</span>
                  </td>
                ))}
              </tr>

              {/* Rating & Reviews */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Star Rating
                </td>
                {comparisonList.map((helper) => (
                  <td key={helper.id} className="py-3.5 px-4">
                    <StarRating rating={helper.averageRating} count={helper.ratingCount} size="sm" />
                  </td>
                ))}
              </tr>

              {/* Distance from you */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Distance
                </td>
                {comparisonList.map((helper) => (
                  <td key={helper.id} className="py-3.5 px-4 font-semibold text-slate-700 text-xs">
                    {formatDistance(helper.distanceKm)}
                  </td>
                ))}
              </tr>

              {/* Work Area */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Coverage Area
                </td>
                {comparisonList.map((helper) => (
                  <td key={helper.id} className="py-3.5 px-4 text-xs text-slate-600">
                    {helper.workLocationName}
                  </td>
                ))}
              </tr>

              {/* Experience */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Experience
                </td>
                {comparisonList.map((helper) => (
                  <td key={helper.id} className="py-3.5 px-4 font-bold text-slate-800 text-xs">
                    {helper.experienceYears} Years in Field
                  </td>
                ))}
              </tr>

              {/* Availability */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Availability
                </td>
                {comparisonList.map((helper) => (
                  <td key={helper.id} className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                      helper.available ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${helper.available ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {helper.available ? 'Available' : 'Busy Today'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Verification */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Govt ID Status
                </td>
                {comparisonList.map((helper) => (
                  <td key={helper.id} className="py-3.5 px-4">
                    {helper.verified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600 font-semibold">Pending</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Book Action */}
              <tr>
                <td className="py-5 px-3"></td>
                {comparisonList.map((helper) => (
                  <td key={helper.id} className="py-5 px-4">
                    <button
                      onClick={() => {
                        setIsComparing(false);
                        setBookingTargetHelper(helper);
                      }}
                      className="btn-accent w-full text-xs font-bold py-2.5 shadow-md shadow-orange-500/20"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Book {helper.name.split(' ')[0]}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
