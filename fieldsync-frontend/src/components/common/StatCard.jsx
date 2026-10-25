import React from 'react';

export default function StatCard({ title, value, change, icon: Icon, iconBg = 'bg-orange-100 text-orange-600', description }) {
  return (
    <div className="field-card p-5 transition-all duration-200 hover:scale-[1.02] cursor-default">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </h3>
        {change && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {change}
          </span>
        )}
      </div>
      {description && (
        <p className="mt-1 text-xs text-slate-500 font-medium">
          {description}
        </p>
      )}
    </div>
  );
}
