import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  CalendarCheck,
  Briefcase,
  ShieldCheck,
  Layers,
  LogOut,
  CheckCircle2,
  User,
  ArrowLeftRight
} from 'lucide-react';

export default function Sidebar() {
  const { currentUser, activeTab, setActiveTab, switchRole, initiateGoogleLogin } = useApp();

  const navigationItems = [
    {
      id: 'search',
      label: 'Find Helpers',
      icon: Compass,
      roles: ['USER', 'HELPER', 'ADMIN'],
      badge: 'Live'
    },
    {
      id: 'bookings',
      label: currentUser.role === 'HELPER' ? 'Client Bookings' : 'My Bookings',
      icon: CalendarCheck,
      roles: ['USER', 'HELPER', 'ADMIN']
    },
    {
      id: 'helper-dashboard',
      label: 'Helper Workplace',
      icon: Briefcase,
      roles: ['HELPER', 'ADMIN']
    },
    {
      id: 'admin',
      label: 'Admin & AI Console',
      icon: ShieldCheck,
      roles: ['ADMIN']
    }
  ];

  const filteredNav = navigationItems.filter(item => item.roles.includes(currentUser.role));

  const roleOptions = [
    { id: 'USER', label: 'User', icon: User, desc: 'Client' },
    { id: 'HELPER', label: 'Helper', icon: Briefcase, desc: 'Worker' },
    { id: 'ADMIN', label: 'Admin', icon: ShieldCheck, desc: 'Manager' }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">
                Field<span className="text-orange-500">Sync</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Daily-Wage Work Marketplace</p>
          </div>
        </div>

        {/* Themed Account Switch Section */}
        <div className="mt-4 pt-3.5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2 px-0.5">
            <div className="flex items-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Switch Account
              </span>
            </div>
            <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 border border-orange-200/60 px-1.5 py-0.5 rounded-md">
              {currentUser.role}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-200/70">
            {roleOptions.map(({ id, label, icon: Icon, desc }) => {
              const active = currentUser.role === id;
              return (
                <button
                  key={id}
                  onClick={() => switchRole(id)}
                  title={`Switch to ${label} view (${desc})`}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/25 scale-[1.02]'
                      : 'text-slate-600 hover:text-orange-600 hover:bg-white font-medium'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 mb-1 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span className="text-xs leading-none">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Links with Active Pill Highlight */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
          Menu
        </div>
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-orange-400' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer Profile & Google OAuth CTA */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/70 shadow-sm">
          <img
            src={currentUser.avatar}
            alt={currentUser.fullName}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-400/20"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-xs font-bold text-slate-800 truncate">
                {currentUser.fullName}
              </p>
              {currentUser.accountStatus === 'VERIFIED' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 capitalize">
              {currentUser.role.toLowerCase()}
            </p>
          </div>
          <button
            onClick={() => initiateGoogleLogin()}
            title="Switch Account / Sign In"
            className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
