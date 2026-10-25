import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_HELPERS, INITIAL_REVIEWS, INITIAL_BOOKINGS, DEMO_USERS } from '../data/initialData';
import { SKILL_CATEGORIES } from '../data/skillCategories';
import { calculateHaversineDistance } from '../utils/distance';
import { api } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Load from localStorage or use initial seed
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('fieldsync_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.user;
  });

  const [helpers, setHelpers] = useState(() => {
    const saved = localStorage.getItem('fieldsync_helpers');
    return saved ? JSON.parse(saved) : INITIAL_HELPERS;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('fieldsync_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('fieldsync_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam && ['search', 'bookings', 'helper-dashboard', 'admin'].includes(viewParam)) {
      return viewParam;
    }
    const saved = localStorage.getItem('fieldsync_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.role === 'ADMIN') return 'admin';
        if (u.role === 'HELPER') return 'helper-dashboard';
      } catch {}
    }
    return 'search';
  });

  // Search and Filter State
  const [searchParams, setSearchParams] = useState({
    skillId: '',
    searchLocation: 'Bellandur & Outer Ring Road, Bengaluru',
    userLat: 12.9352,
    userLng: 77.6745,
    radiusKm: 20,
    sortBy: 'distance', // 'distance' | 'wage' | 'rating'
    minRating: 0,
    maxWage: 2000,
    viewMode: 'grid' // 'grid' | 'map'
  });

  // Modal states
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [comparisonList, setComparisonList] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [bookingTargetHelper, setBookingTargetHelper] = useState(null);
  const [reviewTargetBooking, setReviewTargetBooking] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileSetupOpen, setProfileSetupOpen] = useState(false);
  const [pendingGoogleAccount, setPendingGoogleAccount] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Check backend connection on mount & authenticate dev session
  useEffect(() => {
    api.checkConnection().then(connected => {
      setIsBackendConnected(connected);
      if (connected) {
        api.devLogin(currentUser.email, currentUser.fullName, currentUser.role)
          .then(() => console.log('[FieldSync] Backend connected with JWT authentication.'))
          .catch(err => console.warn('[FieldSync] Dev login failed:', err));
      }
    });
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fieldsync_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('fieldsync_helpers', JSON.stringify(helpers));
  }, [helpers]);

  useEffect(() => {
    localStorage.setItem('fieldsync_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('fieldsync_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Toast Notification helper
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Quick switch role for effortless grading/demo
  const switchRole = (roleKey) => {
    const targetUser = DEMO_USERS[roleKey.toLowerCase()];
    if (targetUser) {
      setCurrentUser(targetUser);
      if (targetUser.role === 'ADMIN') {
        setActiveTab('admin');
      } else if (targetUser.role === 'HELPER') {
        setActiveTab('helper-dashboard');
      } else {
        setActiveTab('search');
      }

      // Synchronize backend JWT token
      if (isBackendConnected) {
        api.devLogin(targetUser.email, targetUser.fullName, targetUser.role).catch(() => {});
      }

      addToast(`Switched view to ${targetUser.fullName} (${targetUser.role})`, 'info');
    }
  };

  // Google OAuth flow simulation
  const initiateGoogleLogin = (preselectedRole = 'USER') => {
    setAuthModalOpen(true);
  };

  const completeGoogleAuth = (googleProfile, roleChoice) => {
    setAuthModalOpen(false);
    // If user needs profile setup (per spec: first-time entry has personal details step)
    const pending = {
      ...googleProfile,
      role: roleChoice,
      accountStatus: roleChoice === 'HELPER' ? 'PENDING' : 'VERIFIED',
      profileComplete: false
    };
    setPendingGoogleAccount(pending);
    setProfileSetupOpen(true);
  };

  const finalizeProfileSetup = (details) => {
    const newUser = {
      id: Date.now(),
      fullName: details.fullName,
      email: pendingGoogleAccount.email,
      phone: details.phone,
      address: details.address,
      role: pendingGoogleAccount.role,
      accountStatus: pendingGoogleAccount.role === 'HELPER' ? 'PENDING' : 'VERIFIED',
      profileComplete: true,
      avatar: pendingGoogleAccount.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      latitude: details.latitude || 12.9352,
      longitude: details.longitude || 77.6745
    };

    if (newUser.role === 'HELPER') {
      const selectedSkill = SKILL_CATEGORIES.find(s => s.id === Number(details.skillCategoryId)) || SKILL_CATEGORIES[0];
      const newHelperProfile = {
        id: Date.now(),
        name: details.fullName,
        email: newUser.email,
        phone: details.phone,
        avatar: newUser.avatar,
        skillCategory: { id: selectedSkill.id, name: selectedSkill.name },
        dailyWage: Number(details.dailyWage),
        experienceYears: Number(details.experienceYears || 3),
        workLocationName: details.workLocationName || details.address,
        latitude: details.latitude || 12.9352,
        longitude: details.longitude || 77.6745,
        available: true,
        verified: false,
        accountStatus: 'PENDING',
        averageRating: 0.0,
        ratingCount: 0,
        documentUrl: details.documentUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
        documentType: details.documentType || 'Government ID Verification Document',
        bio: details.bio || `Skilled ${selectedSkill.name} with ${details.experienceYears || 3} years of professional field experience.`,
        badges: ['Pending Verification']
      };

      setHelpers(prev => [newHelperProfile, ...prev]);
      newUser.helperProfileId = newHelperProfile.id;
    }

    setCurrentUser(newUser);
    setProfileSetupOpen(false);
    setPendingGoogleAccount(null);

    // Call backend profile completion if connected
    if (isBackendConnected) {
      api.completeProfile({
        fullName: details.fullName,
        phone: details.phone,
        address: details.address,
        role: newUser.role,
        skillCategoryId: details.skillCategoryId ? Number(details.skillCategoryId) : undefined,
        dailyWage: details.dailyWage ? Number(details.dailyWage) : undefined,
        workLocationName: details.workLocationName || details.address,
        latitude: details.latitude || 12.9352,
        longitude: details.longitude || 77.6745,
        experienceYears: details.experienceYears ? Number(details.experienceYears) : 1,
        documentUrl: details.documentUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
        bio: details.bio || ''
      }).catch(err => console.warn('[FieldSync API] Profile sync error:', err));
    }

    if (newUser.role === 'HELPER') {
      setActiveTab('helper-dashboard');
      addToast('Profile submitted! Your helper account is currently pending Admin verification.', 'warning');
    } else {
      setActiveTab('search');
      addToast('Welcome to FieldSync! Profile created successfully.', 'success');
    }
  };

  // Helper self-service profile update
  const updateHelperProfile = (updatedFields) => {
    setHelpers(prev => prev.map(h => {
      if (h.id === currentUser.helperProfileId || h.id === currentUser.id) {
        return { ...h, ...updatedFields };
      }
      return h;
    }));

    if (isBackendConnected) {
      api.updateHelperProfile({
        skillCategoryId: updatedFields.skillCategory?.id,
        dailyWage: updatedFields.dailyWage,
        workLocationName: updatedFields.workLocationName,
        latitude: updatedFields.latitude,
        longitude: updatedFields.longitude,
        experienceYears: updatedFields.experienceYears,
        bio: updatedFields.bio,
        available: updatedFields.available
      }).catch(err => console.warn('[FieldSync API] Helper update error:', err));
    }

    addToast('Helper profile updated successfully!', 'success');
  };

  const toggleHelperAvailability = (helperId) => {
    setHelpers(prev => prev.map(h => {
      if (h.id === helperId) {
        const nextState = !h.available;
        addToast(`Availability set to ${nextState ? 'Available for work' : 'Busy / Off duty'}`, 'info');
        return { ...h, available: nextState };
      }
      return h;
    }));

    if (isBackendConnected) {
      api.toggleAvailability().catch(err => console.warn('[FieldSync API] Availability toggle error:', err));
    }
  };

  // Booking Flow
  const createBooking = (bookingData) => {
    const newBooking = {
      id: 100 + bookings.length + 1,
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      customerPhone: currentUser.phone,
      customerAddress: currentUser.address,
      helperId: bookingData.helperId,
      helperName: bookingData.helperName,
      skillCategoryName: bookingData.skillCategoryName,
      dailyWage: bookingData.dailyWage,
      requestedDate: bookingData.requestedDate,
      status: 'PENDING',
      notes: bookingData.notes,
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    setBookingTargetHelper(null);
    addToast(`Booking request sent to ${bookingData.helperName}!`, 'success');

    if (isBackendConnected) {
      api.createBooking({
        workerProfileId: bookingData.helperId,
        requestedDate: bookingData.requestedDate,
        notes: bookingData.notes
      }).catch(err => console.warn('[FieldSync API] Create booking error:', err));
    }
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return b;
    }));

    const statusLabels = {
      ACCEPTED: 'Accepted booking request!',
      REJECTED: 'Declined booking request',
      COMPLETED: 'Job marked as completed!',
      CANCELLED: 'Booking cancelled'
    };
    addToast(statusLabels[newStatus] || `Booking status updated to ${newStatus}`, newStatus === 'ACCEPTED' || newStatus === 'COMPLETED' ? 'success' : 'info');

    if (isBackendConnected) {
      if (newStatus === 'ACCEPTED') api.acceptBooking(bookingId).catch(() => {});
      else if (newStatus === 'REJECTED') api.rejectBooking(bookingId).catch(() => {});
      else if (newStatus === 'COMPLETED') api.completeBooking(bookingId).catch(() => {});
      else if (newStatus === 'CANCELLED') api.cancelBooking(bookingId).catch(() => {});
    }
  };

  // Review & Rating Flow
  const submitReview = ({ bookingId, helperProfileId, rating, comment }) => {
    const newReview = {
      id: Date.now(),
      helperProfileId,
      bookingId,
      reviewer: {
        id: currentUser.id,
        fullName: currentUser.fullName,
        avatar: currentUser.avatar
      },
      rating: Number(rating),
      comment,
      flagged: false,
      createdAt: new Date().toISOString()
    };

    // Auto update helper's average rating and count
    const existingHelperReviews = reviews.filter(r => r.helperProfileId === helperProfileId);
    const allHelperReviews = [...existingHelperReviews, newReview];
    const newCount = allHelperReviews.length;
    const newAvg = Math.round((allHelperReviews.reduce((sum, r) => sum + r.rating, 0) / newCount) * 10) / 10;

    setHelpers(prev => prev.map(h => {
      if (h.id === helperProfileId) {
        return { ...h, averageRating: newAvg, ratingCount: newCount };
      }
      return h;
    }));

    setReviews(prev => [newReview, ...prev]);
    setReviewTargetBooking(null);
    addToast('Review published! Thank you for rating the helper.', 'success');

    if (isBackendConnected) {
      api.submitReview({
        bookingId,
        rating: Number(rating),
        comment
      }).catch(err => console.warn('[FieldSync API] Submit review error:', err));
    }
  };

  // Flag review
  const flagReview = (reviewId, reason) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return { ...r, flagged: true, flagReason: reason || 'Flagged by community user for moderation' };
      }
      return r;
    }));
    addToast('Review reported to Admin moderation queue.', 'info');

    if (isBackendConnected) {
      api.flagReview(reviewId).catch(err => console.warn('[FieldSync API] Flag review error:', err));
    }
  };

  // Admin Actions
  const adminApproveHelper = (helperId) => {
    setHelpers(prev => prev.map(h => {
      if (h.id === helperId) {
        return {
          ...h,
          verified: true,
          accountStatus: 'VERIFIED',
          badges: ['Verified ID', 'Admin Approved']
        };
      }
      return h;
    }));
    addToast(`Helper #${helperId} verified and activated for search!`, 'success');

    if (isBackendConnected) {
      api.verifyHelper(helperId).catch(err => console.warn('[FieldSync API] Verify helper error:', err));
    }
  };

  const adminRejectHelper = (helperId, reason) => {
    setHelpers(prev => prev.map(h => {
      if (h.id === helperId) {
        return {
          ...h,
          verified: false,
          accountStatus: 'REJECTED',
          rejectionReason: reason || 'Document image unreadable or trade verification failed.'
        };
      }
      return h;
    }));
    addToast(`Helper #${helperId} verification rejected.`, 'info');

    if (isBackendConnected) {
      api.rejectHelper(helperId).catch(err => console.warn('[FieldSync API] Reject helper error:', err));
    }
  };

  const adminModerateReview = (reviewId, action) => {
    if (action === 'delete') {
      const targetReview = reviews.find(r => r.id === reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      // Recompute average rating if deleted
      if (targetReview) {
        const remaining = reviews.filter(r => r.helperProfileId === targetReview.helperProfileId && r.id !== reviewId);
        const count = remaining.length;
        const avg = count > 0 ? Math.round((remaining.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10 : 0;
        setHelpers(prev => prev.map(h => h.id === targetReview.helperProfileId ? { ...h, averageRating: avg, ratingCount: count } : h));
      }
      addToast('Inappropriate review removed from platform.', 'success');

      if (isBackendConnected) {
        api.deleteAdminReview(reviewId).catch(err => console.warn('[FieldSync API] Delete review error:', err));
      }
    } else if (action === 'dismiss') {
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, flagged: false, flagReason: null } : r));
      addToast('Flag dismissed. Review approved to stay.', 'info');
    }
  };

  // AI Agent verification assistant simulation
  const runAiDocumentVerification = (helperId) => {
    const helper = helpers.find(h => h.id === helperId);
    if (!helper) return;

    addToast(`AI Agent scanning documents for ${helper.name}...`, 'info');

    setTimeout(() => {
      adminApproveHelper(helperId);
      addToast(`AI Agent verified document OCR & credentials for ${helper.name} with 99.4% confidence score!`, 'success');
    }, 1800);
  };

  // Comparison drawer management
  const toggleComparison = (helper) => {
    setComparisonList(prev => {
      const exists = prev.find(h => h.id === helper.id);
      if (exists) {
        return prev.filter(h => h.id !== helper.id);
      }
      if (prev.length >= 4) {
        addToast('You can compare a maximum of 4 helpers at once.', 'warning');
        return prev;
      }
      addToast(`Added ${helper.name} to comparison list`, 'info');
      return [...prev, helper];
    });
  };

  // Filtered and Sorted Search Results
  const searchResults = helpers
    .filter(helper => {
      // Must be verified to appear in public search per spec
      if (!helper.verified || helper.accountStatus !== 'VERIFIED') return false;
      // Skill filter
      if (searchParams.skillId && helper.skillCategory.id !== Number(searchParams.skillId)) {
        return false;
      }
      // Wage filter
      if (helper.dailyWage > searchParams.maxWage) {
        return false;
      }
      // Rating filter
      if (helper.averageRating < searchParams.minRating) {
        return false;
      }
      // Distance filter
      const distance = calculateHaversineDistance(
        searchParams.userLat,
        searchParams.userLng,
        helper.latitude,
        helper.longitude
      );
      helper.distanceKm = distance;
      return distance <= searchParams.radiusKm;
    })
    .sort((a, b) => {
      if (searchParams.sortBy === 'distance') {
        return a.distanceKm - b.distanceKm;
      }
      if (searchParams.sortBy === 'wage') {
        return a.dailyWage - b.dailyWage; // low to high
      }
      if (searchParams.sortBy === 'rating') {
        return b.averageRating - a.averageRating; // high to low
      }
      return 0;
    });

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        helpers,
        bookings,
        reviews,
        activeTab,
        setActiveTab,
        toasts,
        addToast,
        removeToast,
        searchParams,
        setSearchParams,
        searchResults,
        selectedHelper,
        setSelectedHelper,
        comparisonList,
        setComparisonList,
        toggleComparison,
        isComparing,
        setIsComparing,
        bookingTargetHelper,
        setBookingTargetHelper,
        reviewTargetBooking,
        setReviewTargetBooking,
        authModalOpen,
        setAuthModalOpen,
        profileSetupOpen,
        setProfileSetupOpen,
        pendingGoogleAccount,
        initiateGoogleLogin,
        completeGoogleAuth,
        finalizeProfileSetup,
        updateHelperProfile,
        toggleHelperAvailability,
        createBooking,
        updateBookingStatus,
        submitReview,
        flagReview,
        adminApproveHelper,
        adminRejectHelper,
        adminModerateReview,
        runAiDocumentVerification,
        isBackendConnected
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
