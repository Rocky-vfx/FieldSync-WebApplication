import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Toast from '../common/Toast';
import GoogleLoginModal from '../auth/GoogleLoginModal';
import ProfileSetupModal from '../auth/ProfileSetupModal';
import HelperComparisonModal from '../search/HelperComparisonModal';
import HelperDetailModal from '../search/HelperDetailModal';
import BookingModal from '../booking/BookingModal';
import ReviewModal from '../booking/ReviewModal';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area (offset by sidebar width 16rem / 64) */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <GoogleLoginModal />
      <ProfileSetupModal />
      <HelperComparisonModal />
      <HelperDetailModal />
      <BookingModal />
      <ReviewModal />
      <Toast />
    </div>
  );
}
