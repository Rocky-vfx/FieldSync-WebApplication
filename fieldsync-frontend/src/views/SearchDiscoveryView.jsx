import React from 'react';
import { useApp } from '../context/AppContext';
import SearchFilters from '../components/search/SearchFilters';
import HelperCard from '../components/search/HelperCard';
import HelperMapView from '../components/map/HelperMapView';
import { Sparkles, Users, ShieldCheck, CheckCircle2, SearchX } from 'lucide-react';

export default function SearchDiscoveryView() {
  const { searchResults, searchParams, setSearchParams } = useApp();

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Hero Welcome Banner */}
      <div className="rounded-3xl bg-white text-slate-900 p-7 relative overflow-hidden shadow-lg border border-slate-200">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold mb-3 border border-orange-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Daily-Wage Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading leading-tight mb-2 text-slate-900">
            Find & Compare Verified Skilled Field Workers Nearby
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4">
            Search painters, electricians, plumbers, carpenters, and technicians. Compare upfront daily wages, verified government credentials, distance, and genuine customer reviews.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Government ID Verified
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Direct Quoted Wage
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Middleman Markup
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Category Controls */}
      <SearchFilters />

      {/* Results Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-heading">
            {searchResults.length} {searchResults.length === 1 ? 'Helper' : 'Helpers'} Available Nearby
          </h2>
          <p className="text-xs text-slate-500">
            Showing verified helpers within {searchParams.radiusKm} km radius
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
          Sorted by: <strong className="text-slate-800 capitalize">{searchParams.sortBy}</strong>
        </span>
      </div>

      {/* View Switch: Grid vs Interactive Map */}
      {searchParams.viewMode === 'map' ? (
        <HelperMapView />
      ) : searchResults.length === 0 ? (
        <div className="field-card p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-4">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-heading mb-1">
            No Helpers Found Matching These Filters
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
            Try expanding your search radius beyond {searchParams.radiusKm} km or clearing the trade and wage filters.
          </p>
          <button
            onClick={() => setSearchParams(prev => ({ ...prev, skillId: '', radiusKm: 35, maxWage: 2000 }))}
            className="btn-primary text-xs font-bold px-5 py-2.5"
          >
            Expand Search Radius & Reset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {searchResults.map((helper) => (
            <HelperCard key={helper.id} helper={helper} />
          ))}
        </div>
      )}
    </div>
  );
}
