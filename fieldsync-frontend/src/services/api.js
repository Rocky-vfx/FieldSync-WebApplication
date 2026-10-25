const BASE_URL = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('fieldsync_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMsg = errorData.message || `Request failed with status ${res.status}`;
      const err = new Error(errorMsg);
      err.status = res.status;
      err.data = errorData;
      throw err;
    }

    // For 204 No Content
    if (res.status === 204) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.warn(`[FieldSync API] Error at ${url}:`, error.message);
    throw error;
  }
}

export const api = {
  // Health / check
  async checkConnection() {
    try {
      const res = await fetch(`${BASE_URL}/skill-categories`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Skill categories
  async getSkillCategories() {
    return request('/skill-categories');
  },

  // Search
  async searchHelpers({ skillId, lat = 12.9352, lng = 77.6745, radius = 25, sort = 'distance', minRating, maxWage }) {
    const params = new URLSearchParams();
    if (skillId) params.append('skillId', skillId);
    if (lat) params.append('lat', lat);
    if (lng) params.append('lng', lng);
    if (radius) params.append('radius', radius);
    if (sort) params.append('sort', sort);
    if (minRating) params.append('minRating', minRating);
    if (maxWage) params.append('maxWage', maxWage);

    return request(`/search/helpers?${params.toString()}`);
  },

  // Helper details & reviews
  async getHelper(id) {
    return request(`/helpers/${id}`);
  },

  async getHelperReviews(helperProfileId) {
    return request(`/reviews/helper/${helperProfileId}`);
  },

  // Auth
  async devLogin(email, name, role) {
    const params = new URLSearchParams({ email, name, role });
    const data = await request(`/auth/dev-login?${params.toString()}`, {
      method: 'POST'
    });
    if (data?.token) {
      localStorage.setItem('fieldsync_token', data.token);
    }
    return data;
  },

  async getCurrentUser() {
    return request('/auth/me');
  },

  async completeProfile(profileData) {
    const data = await request('/auth/complete-profile', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });
    if (data?.token) {
      localStorage.setItem('fieldsync_token', data.token);
    }
    return data;
  },

  // Helper self-service
  async getMyHelperProfile() {
    return request('/helpers/me');
  },

  async updateHelperProfile(data) {
    return request('/helpers/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async toggleAvailability() {
    return request('/helpers/availability', {
      method: 'PATCH'
    });
  },

  // Bookings
  async getBookings() {
    return request('/bookings');
  },

  async createBooking(bookingData) {
    return request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },

  async acceptBooking(id) {
    return request(`/bookings/${id}/accept`, { method: 'PATCH' });
  },

  async rejectBooking(id) {
    return request(`/bookings/${id}/reject`, { method: 'PATCH' });
  },

  async completeBooking(id) {
    return request(`/bookings/${id}/complete`, { method: 'PATCH' });
  },

  async cancelBooking(id) {
    return request(`/bookings/${id}/cancel`, { method: 'PATCH' });
  },

  // Reviews
  async submitReview(reviewData) {
    return request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  },

  async flagReview(id) {
    return request(`/reviews/${id}/flag`, { method: 'POST' });
  },

  // Admin
  async getAdminStats() {
    return request('/admin/stats');
  },

  async getAdminPendingHelpers() {
    return request('/admin/helpers/pending');
  },

  async verifyHelper(id) {
    return request(`/admin/helpers/${id}/verify`, { method: 'PATCH' });
  },

  async rejectHelper(id) {
    return request(`/admin/helpers/${id}/reject`, { method: 'PATCH' });
  },

  async getAdminFlaggedReviews() {
    return request('/admin/reviews/flagged');
  },

  async deleteAdminReview(id) {
    return request(`/admin/reviews/${id}`, { method: 'DELETE' });
  }
};
