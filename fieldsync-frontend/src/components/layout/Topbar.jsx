import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Bell, SlidersHorizontal, Scale, ShieldCheck } from 'lucide-react';

export default function Topbar() {
  const {
    currentUser,
    searchParams,
    setSearchParams,
    comparisonList,
    setIsComparing,
    activeTab,
    setActiveTab,
    initiateGoogleLogin
  } = useApp();

  return (
    <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-20 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      {/* Search Input in Topbar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by skill (painter, carpenter, plumber...) or location..."
            value={searchParams.searchLocation}
            onChange={(e) => setSearchParams(prev => ({ ...prev, searchLocation: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-full text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>

        {/* Location badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200/60 rounded-full text-xs font-semibold text-orange-700 whitespace-nowrap">
          <MapPin className="w-3.5 h-3.5 text-orange-600" />
          <span>Bengaluru Central</span>
        </div>


      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 ml-4">
        {/* Helper Comparison Floating Indicator */}
        {comparisonList.length > 0 && (
          <button
            onClick={() => setIsComparing(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-500/25 hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 animate-pulse"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare ({comparisonList.length}/4)</span>
          </button>
        )}

        {/* Switch Account / Login Button */}
        <button
          onClick={() => initiateGoogleLogin()}
          title="Sign in or switch account"
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all shadow-sm"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Sign In / Switch</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setActiveTab('bookings')}
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors border border-slate-200/60"
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="w-2 h-2 rounded-full bg-orange-500 absolute top-1 right-1 ring-2 ring-white" />
        </div>

        {/* User Mini Avatar & Role */}
        <div
          onClick={() => {
            if (currentUser.role === 'ADMIN') setActiveTab('admin');
            else if (currentUser.role === 'HELPER') setActiveTab('helper-dashboard');
            else setActiveTab('bookings');
          }}
          className="flex items-center gap-2 pl-2 border-l border-slate-200/80 cursor-pointer group"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.fullName}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-orange-400 transition-all"
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
              {currentUser.fullName}
            </p>
            <p className="text-[10px] text-slate-400 capitalize">
              {currentUser.role.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
