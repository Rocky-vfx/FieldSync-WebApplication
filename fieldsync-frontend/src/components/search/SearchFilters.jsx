import React from 'react';
import { useApp } from '../../context/AppContext';
import { SKILL_CATEGORIES } from '../../data/skillCategories';
import {
  SlidersHorizontal,
  MapPin,
  ArrowUpDown,
  LayoutGrid,
  Map as MapIcon,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function SearchFilters() {
  const { searchParams, setSearchParams } = useApp();

  const sortOptions = [
    { value: 'distance', label: 'Distance (Nearest First)' },
    { value: 'wage', label: 'Daily Wage (Lowest First)' },
    { value: 'rating', label: 'Rating (Highest First)' }
  ];

  const handleSkillSelect = (skillId) => {
    setSearchParams(prev => ({
      ...prev,
      skillId: prev.skillId === String(skillId) ? '' : String(skillId)
    }));
  };

  const resetFilters = () => {
    setSearchParams(prev => ({
      ...prev,
      skillId: '',
      radiusKm: 20,
      sortBy: 'distance',
      minRating: 0,
      maxWage: 2000
    }));
  };

  return (
    <div className="space-y-4">
      {/* Category Horizontal Pill Carousel / Segmented Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Browse by Trade & Skill
            </span>
            <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              18 Seed Trades
            </span>
          </div>
          {searchParams.skillId && (
            <button
              onClick={() => setSearchParams(prev => ({ ...prev, skillId: '' }))}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              Clear trade filter ×
            </button>
          )}
        </div>

        {/* Scrollable pill bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          <button
            onClick={() => setSearchParams(prev => ({ ...prev, skillId: '' }))}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 ${
              !searchParams.skillId
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            All Skills
          </button>
          {SKILL_CATEGORIES.map((skill) => {
            const isSelected = searchParams.skillId === String(skill.id);
            return (
              <button
                key={skill.id}
                onClick={() => handleSkillSelect(skill.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-orange-300 hover:bg-orange-50/20'
                }`}
              >
                <span>{skill.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="field-card p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Radius Slider */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Search Radius</span>
              <span className="text-orange-600 font-extrabold">{searchParams.radiusKm} km</span>
            </div>
            <input
              type="range"
              min="2"
              max="40"
              step="2"
              value={searchParams.radiusKm}
              onChange={(e) => setSearchParams(prev => ({ ...prev, radiusKm: Number(e.target.value) }))}
              className="w-full accent-orange-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Max Wage Filter */}
        <div className="flex items-center gap-3 min-w-[190px]">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Max Daily Wage</span>
              <span className="text-slate-900 font-extrabold">₹{searchParams.maxWage}/day</span>
            </div>
            <input
              type="range"
              min="400"
              max="2000"
              step="50"
              value={searchParams.maxWage}
              onChange={(e) => setSearchParams(prev => ({ ...prev, maxWage: Number(e.target.value) }))}
              className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600 hidden sm:inline">Sort:</span>
          <select
            value={searchParams.sortBy}
            onChange={(e) => setSearchParams(prev => ({ ...prev, sortBy: e.target.value }))}
            className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode (Grid vs Map) */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-full flex items-center border border-slate-200/60">
            <button
              onClick={() => setSearchParams(prev => ({ ...prev, viewMode: 'grid' }))}
              className={`p-1.5 rounded-full text-xs transition-all ${
                searchParams.viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSearchParams(prev => ({ ...prev, viewMode: 'map' }))}
              className={`p-1.5 rounded-full text-xs transition-all ${
                searchParams.viewMode === 'map'
                  ? 'bg-white text-orange-600 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Interactive Map View"
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={resetFilters}
            title="Reset Filters"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
