import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, ShieldCheck } from 'lucide-react';

export default function StatusBadge({ status, size = 'sm' }) {
  const configs = {
    PENDING: {
      label: 'Pending',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Clock,
      dot: 'bg-amber-500'
    },
    ACCEPTED: {
      label: 'Accepted',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      dot: 'bg-emerald-500'
    },
    COMPLETED: {
      label: 'Completed',
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: CheckCircle2,
      dot: 'bg-blue-600'
    },
    REJECTED: {
      label: 'Rejected',
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: XCircle,
      dot: 'bg-rose-500'
    },
    CANCELLED: {
      label: 'Cancelled',
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: XCircle,
      dot: 'bg-slate-400'
    },
    VERIFIED: {
      label: 'Verified',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: ShieldCheck,
      dot: 'bg-emerald-500'
    },
    UNVERIFIED: {
      label: 'Pending Review',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: AlertCircle,
      dot: 'bg-amber-500'
    }
  };

  const config = configs[status] || {
    label: status,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
    dot: 'bg-slate-400'
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}
