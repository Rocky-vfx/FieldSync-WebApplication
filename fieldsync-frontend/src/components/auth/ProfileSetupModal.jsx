import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SKILL_CATEGORIES } from '../../data/skillCategories';
import { X, ShieldAlert, Upload, CheckCircle2, Briefcase, User } from 'lucide-react';

export default function ProfileSetupModal() {
  const { profileSetupOpen, setProfileSetupOpen, pendingGoogleAccount, finalizeProfileSetup } = useApp();

  if (!profileSetupOpen || !pendingGoogleAccount) return null;

  const isHelper = pendingGoogleAccount.role === 'HELPER';
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: pendingGoogleAccount.fullName || '',
    phone: '',
    address: '',
    // Helper fields
    skillCategoryId: '4',
    dailyWage: '',
    experienceYears: '',
    workLocationName: '',
    latitude: 12.9352,
    longitude: 77.6245,
    documentType: 'Aadhaar Card + ITI Trade Certificate',
    documentUrl: '',
    bio: ''
  });

  const [uploadedDocName, setUploadedDocName] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedDocName(file.name);
      // Store file name as document reference (in real app would upload to server)
      setFormData(prev => ({ ...prev, documentUrl: file.name, documentType: file.type || 'Document' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    finalizeProfileSetup(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in-up">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 my-8 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-lg font-heading">
                Complete Your Profile
              </h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                isHelper ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {isHelper ? 'Helper Registration' : 'User Setup'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified identity ensures safety & transparent wage comparison on FieldSync.
            </p>
          </div>
          <button
            onClick={() => setProfileSetupOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Personal Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Personal Details
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name (Prefilled from Google)
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number (for booking SMS/call)
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Home Address / Base City
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Helper Specific Fields */}
          {isHelper && (
            <div className="pt-3 border-t border-slate-100 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Skill & Work Preferences
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Skill Category
                  </label>
                  <select
                    value={formData.skillCategoryId}
                    onChange={(e) => setFormData({ ...formData, skillCategoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    {SKILL_CATEGORIES.map((skill) => (
                      <option key={skill.id} value={skill.id}>
                        {skill.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quoted Daily Wage (₹ per day)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min="300"
                      max="5000"
                      value={formData.dailyWage}
                      onChange={(e) => setFormData({ ...formData, dailyWage: e.target.value })}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Preferred Work Area</span>
                    <span className="text-[10px] text-orange-600 font-bold">Independent of home</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Koramangala & Indiranagar"
                    value={formData.workLocationName}
                    onChange={(e) => setFormData({ ...formData, workLocationName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Document upload box — real file input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ID &amp; Skill Verification Document (Aadhaar / Trade Card)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="doc-upload-input"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  id="doc-upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-orange-400 hover:bg-orange-50/20 transition-colors bg-slate-50/50 focus:outline-none focus:border-orange-500"
                >
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  {uploadedDocName ? (
                    <p className="text-xs font-semibold text-slate-700">
                      ✅ <span className="text-orange-600">{uploadedDocName}</span>
                    </p>
                  ) : (
                    <p className="text-xs font-semibold text-slate-500">
                      Click to upload your Government ID, Trade Certificate, or Driving License
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-0.5">PDF, JPG, PNG accepted</p>
                </button>
              </div>

              {/* Status Note */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <span className="font-bold">Pending Verification Policy:</span> As a Helper, your profile will be submitted to the Admin / AI Moderation system. You will appear in customer search results once verified.
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setProfileSetupOpen(false)}
              className="px-4 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-accent text-xs font-bold px-6 py-2.5 shadow-md shadow-orange-500/20"
            >
              {isHelper ? 'Submit for Verification' : 'Start Finding Helpers'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
