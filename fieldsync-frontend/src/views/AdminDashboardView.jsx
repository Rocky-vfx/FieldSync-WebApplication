import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import StarRating from '../components/common/StarRating';
import { formatCurrency } from '../utils/distance';
import {
  ShieldCheck,
  ShieldAlert,
  Bot,
  Users,
  CheckCircle2,
  XCircle,
  Flag,
  Trash2,
  Eye,
  Sparkles,
  FileText,
  AlertTriangle,
  Briefcase
} from 'lucide-react';

export default function AdminDashboardView() {
  const {
    helpers,
    bookings,
    reviews,
    adminApproveHelper,
    adminRejectHelper,
    adminModerateReview,
    runAiDocumentVerification
  } = useApp();

  const [activeTab, setActiveTab] = useState('verifications'); // 'verifications' | 'reviews' | 'helpers'
  const [selectedDocPreview, setSelectedDocPreview] = useState(null);

  // Pending helpers
  const pendingHelpers = helpers.filter(h => h.accountStatus === 'PENDING' || !h.verified);
  const verifiedHelpers = helpers.filter(h => h.verified && h.accountStatus === 'VERIFIED');
  const flaggedReviews = reviews.filter(r => r.flagged);

  // Platform metrics
  const totalHelpers = helpers.length;
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
              Admin & AI Operations Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> AI Agent Enabled
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Supervise helper document verifications, moderate flagged community reviews, and monitor metrics
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'verifications'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Verifications</span>
            {pendingHelpers.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                {pendingHelpers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Flagged Reviews</span>
            {flaggedReviews.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                {flaggedReviews.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('helpers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'helpers'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Helpers ({totalHelpers})
          </button>
        </div>
      </div>

      {/* Platform Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Verified Helpers"
          value={verifiedHelpers.length}
          change={`${verifiedHelpers.length} active`}
          description="Approved to appear in public searches"
          icon={ShieldCheck}
          iconBg="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          title="Pending Verifications"
          value={pendingHelpers.length}
          description="Helpers awaiting document checks"
          icon={ShieldAlert}
          iconBg="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Platform Bookings"
          value={totalBookings}
          change={`${completedBookings} completed`}
          description="Total work requests processed"
          icon={Briefcase}
          iconBg="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Flagged Reviews"
          value={flaggedReviews.length}
          description="Potential spam or abuse in queue"
          icon={Flag}
          iconBg="bg-rose-100 text-rose-600"
        />
      </div>

      {/* TAB 1: Pending Verifications Queue */}
      {activeTab === 'verifications' && (
        <div className="field-card overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-heading">
                Helper Verification Queue ({pendingHelpers.length})
              </h3>
              <p className="text-xs text-slate-500">
                Verify Government Aadhaar cards, trade certifications, and background before listing
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              Requires Action
            </span>
          </div>

          {pendingHelpers.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">All Verifications Cleared!</h4>
              <p className="text-xs text-slate-400 mt-1">There are no pending helper profiles awaiting review.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingHelpers.map((helper) => (
                <div key={helper.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={helper.avatar}
                      alt={helper.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{helper.name}</h4>
                        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                          {helper.skillCategory.name}
                        </span>
                        <StatusBadge status="UNVERIFIED" />
                      </div>

                      <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                        <p>📍 {helper.workLocationName} · 📞 {helper.phone}</p>
                        <p>💰 Quoted Daily Wage: <strong>{formatCurrency(helper.dailyWage)}/day</strong> · {helper.experienceYears} Years Exp</p>
                        <p className="text-slate-600 font-medium">📄 Document: {helper.documentType || 'Aadhaar ID'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* View Document */}
                    <button
                      onClick={() => setSelectedDocPreview(helper)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" /> View Document
                    </button>

                    {/* AI Agent Automated Verification */}
                    <button
                      onClick={() => runAiDocumentVerification(helper.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Run AI Verification
                    </button>

                    {/* Approve Button */}
                    <button
                      onClick={() => adminApproveHelper(helper.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>

                    {/* Reject Button */}
                    <button
                      onClick={() => adminRejectHelper(helper.id, 'Document scan illegible or trade mismatched')}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Flagged Reviews Moderation */}
      {activeTab === 'reviews' && (
        <div className="field-card overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-heading">
                Review Moderation Queue ({flaggedReviews.length})
              </h3>
              <p className="text-xs text-slate-500">
                Protect workers from abusive or spam reviews with automated AI flag analysis
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
              Community Reports
            </span>
          </div>

          {flaggedReviews.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">No Flagged Reviews</h4>
              <p className="text-xs text-slate-400 mt-1">All community reviews meet guidelines.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {flaggedReviews.map((rev) => (
                <div key={rev.id} className="p-5 space-y-3 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.reviewer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                        alt={rev.reviewer.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-bold text-slate-900 text-xs">{rev.reviewer.fullName}</span>
                        <div className="text-[10px] text-slate-400">
                          Target: Helper #{rev.helperProfileId} · Booking #{rev.bookingId}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StarRating rating={rev.rating} showCount={false} size="xs" />
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Flagged
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-xs space-y-1">
                    <p className="text-slate-800 font-medium">"{rev.comment}"</p>
                    {rev.flagReason && (
                      <p className="text-[11px] text-rose-700 font-semibold pt-1 border-t border-rose-200/50">
                        Reason: {rev.flagReason}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-1">
                    <button
                      onClick={() => adminModerateReview(rev.id, 'dismiss')}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Dismiss Flag (Keep Review)
                    </button>
                    <button
                      onClick={() => adminModerateReview(rev.id, 'delete')}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Inappropriate Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: All Registered Helpers Roster */}
      {activeTab === 'helpers' && (
        <div className="field-card overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm font-heading">
              Platform Helper Directory ({helpers.length})
            </h3>
            <span className="text-xs text-slate-400">All registered trades</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-5">Helper</th>
                  <th className="py-3 px-5">Trade</th>
                  <th className="py-3 px-5">Quoted Wage</th>
                  <th className="py-3 px-5">Coverage Area</th>
                  <th className="py-3 px-5">Rating</th>
                  <th className="py-3 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {helpers.map(h => (
                  <tr key={h.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-5 font-bold text-slate-900 flex items-center gap-2.5">
                      <img src={h.avatar} alt={h.name} className="w-8 h-8 rounded-full object-cover" />
                      <span>{h.name}</span>
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-slate-700">{h.skillCategory.name}</td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">{formatCurrency(h.dailyWage)}/day</td>
                    <td className="py-3.5 px-5 text-slate-600 truncate max-w-xs">{h.workLocationName}</td>
                    <td className="py-3.5 px-5">★ {h.averageRating} ({h.ratingCount})</td>
                    <td className="py-3.5 px-5">
                      <StatusBadge status={h.accountStatus || (h.verified ? 'VERIFIED' : 'PENDING')} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Document Preview Lightbox Modal */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h4 className="font-bold text-slate-900 text-sm">
                Document Inspection: {selectedDocPreview.name}
              </h4>
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-6 text-center space-y-3">
              <img
                src={selectedDocPreview.documentUrl}
                alt="Verification Document"
                className="w-full h-64 object-cover rounded-2xl border border-slate-200 shadow-inner"
              />
              <div className="p-3 bg-slate-50 rounded-xl text-left text-xs space-y-1">
                <p><strong>Document:</strong> {selectedDocPreview.documentType}</p>
                <p><strong>Worker:</strong> {selectedDocPreview.name}</p>
                <p><strong>Skill:</strong> {selectedDocPreview.skillCategory.name}</p>
                <p><strong>Status:</strong> {selectedDocPreview.accountStatus}</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  adminApproveHelper(selectedDocPreview.id);
                  setSelectedDocPreview(null);
                }}
                className="btn-primary text-xs font-bold px-4 py-2"
              >
                Approve ID & Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
