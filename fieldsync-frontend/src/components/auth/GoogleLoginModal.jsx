import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserCheck, Briefcase, CheckCircle2, LogIn } from 'lucide-react';

const QUICK_ACCOUNTS = [
  {
    name: 'Aditya Verma',
    email: 'aditya.verma@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Pooja Hegde',
    email: 'pooja.hegde@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Sunil Rao',
    email: 'sunil.technician@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
  }
];

export default function GoogleLoginModal() {
  const { authModalOpen, setAuthModalOpen, completeGoogleAuth } = useApp();
  const [selectedRole, setSelectedRole] = useState('USER');
  const [isSimulating, setIsSimulating] = useState(false);
  const [tab, setTab] = useState('quick'); // 'quick' | 'custom'

  // Custom form state
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [formError, setFormError] = useState('');

  if (!authModalOpen) return null;

  const simulate = (account) => {
    setIsSimulating(true);
    setFormError('');
    setTimeout(() => {
      setIsSimulating(false);
      completeGoogleAuth(
        { fullName: account.name, email: account.email, avatar: account.avatar },
        selectedRole
      );
    }, 700);
  };

  const handleQuickSelect = (acc) => simulate(acc);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const name = customName.trim();
    const email = customEmail.trim();
    if (!name) { setFormError('Please enter your full name.'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    setFormError('');
    simulate({
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f97316&color=fff&size=150`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-heading">Sign in to FieldSync</h3>
              <p className="text-xs text-slate-400">Continue with your Google account</p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Role Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              I want to join as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="role-user-btn"
                onClick={() => setSelectedRole('USER')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                  selectedRole === 'USER'
                    ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <UserCheck className={`w-5 h-5 ${selectedRole === 'USER' ? 'text-orange-600' : 'text-slate-400'}`} />
                  {selectedRole === 'USER' && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                </div>
                <div className="font-bold text-sm text-slate-900">I Need Work Done</div>
                <div className="text-[11px] text-slate-500">Hire skilled field workers</div>
              </button>

              <button
                type="button"
                id="role-helper-btn"
                onClick={() => setSelectedRole('HELPER')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                  selectedRole === 'HELPER'
                    ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Briefcase className={`w-5 h-5 ${selectedRole === 'HELPER' ? 'text-orange-600' : 'text-slate-400'}`} />
                  {selectedRole === 'HELPER' && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                </div>
                <div className="font-bold text-sm text-slate-900">I am a Helper</div>
                <div className="text-[11px] text-slate-500">Get daily wage jobs</div>
              </button>
            </div>
          </div>

          {/* Tab Switch */}
          <div className="flex rounded-xl border border-slate-200 overflow-hidden text-xs font-bold">
            <button
              type="button"
              onClick={() => setTab('quick')}
              className={`flex-1 py-2 transition-colors ${tab === 'quick' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
            >
              Quick Demo Accounts
            </button>
            <button
              type="button"
              id="custom-signin-tab"
              onClick={() => setTab('custom')}
              className={`flex-1 py-2 transition-colors ${tab === 'custom' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
            >
              Enter My Details
            </button>
          </div>

          {isSimulating ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-[3px] border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-700">Verifying Google OAuth Token...</p>
            </div>
          ) : tab === 'quick' ? (
            /* Quick account list */
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Choose a demo Google account
              </label>
              {QUICK_ACCOUNTS.map((acc, i) => (
                <button
                  key={i}
                  id={`quick-account-${i}`}
                  onClick={() => handleQuickSelect(acc)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-200/80 hover:border-orange-300 hover:bg-orange-50/20 text-left transition-all group"
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-orange-400 transition-all"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate">{acc.name}</p>
                    <p className="text-xs text-slate-400 truncate">{acc.email}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-orange-600 transition-colors">Select →</span>
                </button>
              ))}
            </div>
          ) : (
            /* Custom sign-in form */
            <form onSubmit={handleCustomSubmit} className="space-y-3" id="custom-signin-form">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  id="signin-name"
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={customName}
                  onChange={(e) => { setCustomName(e.target.value); setFormError(''); }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  id="signin-email"
                  type="email"
                  required
                  placeholder="e.g. rahul@gmail.com"
                  value={customEmail}
                  onChange={(e) => { setCustomEmail(e.target.value); setFormError(''); }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-800"
                />
              </div>
              {formError && (
                <p className="text-xs text-red-500 font-semibold">{formError}</p>
              )}
              <button
                type="submit"
                id="signin-submit-btn"
                className="w-full btn-accent text-sm font-bold py-2.5 flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
              >
                <LogIn className="w-4 h-4" />
                Continue as {selectedRole === 'HELPER' ? 'Helper' : 'User'}
              </button>
            </form>
          )}

          <p className="text-[11px] text-center text-slate-400">
            By signing in, you agree to FieldSync's Terms of Service and Worker Verification Code.
          </p>
        </div>
      </div>
    </div>
  );
}
