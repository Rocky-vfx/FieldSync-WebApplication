import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/common/StatCard';
import StarRating from '../components/common/StarRating';
import { SKILL_CATEGORIES } from '../data/skillCategories';
import { formatCurrency } from '../utils/distance';
import {
  Briefcase,
  IndianRupee,
  MapPin,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Power,
  Save,
  CheckCircle2,
  CalendarCheck,
  Star,
  Users
} from 'lucide-react';

export default function HelperDashboardView() {
  const {
    currentUser,
    helpers,
    bookings,
    updateHelperProfile,
    toggleHelperAvailability
  } = useApp();

  // Find helper object for current user
  const currentHelper = helpers.find(
    h => h.id === (currentUser.helperProfileId || currentUser.id) || h.email === currentUser.email
  ) || helpers[0];

  const [wage, setWage] = useState(currentHelper.dailyWage);
  const [workArea, setWorkArea] = useState(currentHelper.workLocationName);
  const [experience, setExperience] = useState(currentHelper.experienceYears);
  const [skillId, setSkillId] = useState(currentHelper.skillCategory.id);
  const [bio, setBio] = useState(currentHelper.bio);

  const helperBookings = bookings.filter(b => b.helperId === currentHelper.id || b.helperName === currentHelper.name);
  const completedBookings = helperBookings.filter(b => b.status === 'COMPLETED');
  const pendingBookings = helperBookings.filter(b => b.status === 'PENDING');
  const totalEarned = completedBookings.reduce((sum, b) => sum + (b.dailyWage || currentHelper.dailyWage), 0);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const selectedSkill = SKILL_CATEGORIES.find(s => s.id === Number(skillId)) || currentHelper.skillCategory;
    updateHelperProfile({
      dailyWage: Number(wage),
      workLocationName: workArea,
      experienceYears: Number(experience),
      skillCategory: { id: selectedSkill.id, name: selectedSkill.name },
      bio
    });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Top Header & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
            Helper Workplace & Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your quoted wage, preferred work areas, availability, and service credentials
          </p>
        </div>

        {/* Live Availability Toggle Switch */}
        <div className="flex items-center gap-3 bg-white p-2.5 px-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-700">
              {currentHelper.available ? 'Ready for Work' : 'Currently Busy / Off Duty'}
            </span>
            <span className="text-[10px] text-slate-400">
              {currentHelper.available ? 'Visible in customer searches' : 'Hidden from search results'}
            </span>
          </div>

          <button
            onClick={() => toggleHelperAvailability(currentHelper.id)}
            className={`w-12 h-6.5 rounded-full p-1 transition-colors relative flex items-center ${
              currentHelper.available ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform ${
                currentHelper.available ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Verification Warning or Success Banner */}
      {currentHelper.verified && currentHelper.accountStatus === 'VERIFIED' ? (
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900">
                Verified Helper Account Active
              </h4>
              <p className="text-xs text-emerald-700">
                Your government credentials ({currentHelper.documentType}) have been approved. You are actively appearing in customer search results.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-full shadow-sm">
            Status: Active
          </span>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Account Pending Admin / AI Verification
              </h4>
              <p className="text-xs text-amber-700">
                Your profile is submitted. You will be activated in customer discovery as soon as an Admin or AI Agent verifies your ID.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-white px-3 py-1.5 rounded-full shadow-sm">
            Status: In Review
          </span>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Daily Wage Rate"
          value={formatCurrency(currentHelper.dailyWage)}
          description="Your transparent quoted rate per day"
          icon={IndianRupee}
          iconBg="bg-orange-100 text-orange-600"
        />
        <StatCard
          title="Rating & Trust"
          value={`★ ${currentHelper.averageRating}`}
          description={`From ${currentHelper.ratingCount} authentic reviews`}
          icon={Star}
          iconBg="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Completed Jobs"
          value={completedBookings.length}
          change={`+${completedBookings.length} jobs`}
          description="Total successful client appointments"
          icon={CalendarCheck}
          iconBg="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          title="Estimated Earnings"
          value={formatCurrency(totalEarned)}
          description="Gross earnings from completed work"
          icon={Briefcase}
          iconBg="bg-blue-100 text-blue-600"
        />
      </div>

      {/* Profile Self-Service Form */}
      <div className="field-card p-6">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Edit Helper Work Preferences
            </h3>
            <p className="text-xs text-slate-500">
              Update your trade, quoted daily wage, and preferred work radius
            </p>
          </div>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
            Self-Service Settings
          </span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Trade / Skill
              </label>
              <select
                value={skillId}
                onChange={(e) => setSkillId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                {SKILL_CATEGORIES.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Quoted Daily Wage (₹ per day)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  required
                  min="300"
                  max="5000"
                  value={wage}
                  onChange={(e) => setWage(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Work Coverage Area (Independent of Home Address)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-orange-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={workArea}
                  onChange={(e) => setWorkArea(e.target.value)}
                  placeholder="e.g. Koramangala & Indiranagar"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Experience in Trade (Years)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-800"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Profile Summary & Craftsmanship Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-800"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="btn-accent text-xs font-bold px-6 py-2.5 shadow-md shadow-orange-500/20"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
