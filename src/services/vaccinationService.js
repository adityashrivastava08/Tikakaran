const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('tikakaran_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const vaccinationService = {
  /**
   * Fetch paginated vaccination due list with live calculation engine
   */
  async getDueList({ tab = 'Due Today', siteId, date, search, page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams();
    if (tab) params.append('tab', tab);
    if (siteId && siteId !== 'All') params.append('siteId', siteId);
    if (date) params.append('date', date);
    if (search && search.trim()) params.append('search', search.trim());
    params.append('page', page);
    params.append('limit', limit);

    const res = await fetch(`${API_BASE_URL}/vaccinations/due?${params.toString()}`, {
      headers: getAuthHeaders()
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch vaccination due list');
    }

    return result;
  },

  /**
   * Get KPI summary counts (Due Today, Upcoming, Overdue, Completed)
   */
  async getDueSummary({ siteId, date } = {}) {
    const params = new URLSearchParams();
    if (siteId && siteId !== 'All') params.append('siteId', siteId);
    if (date) params.append('date', date);

    const res = await fetch(`${API_BASE_URL}/vaccinations/due-summary?${params.toString()}`, {
      headers: getAuthHeaders()
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch due summary');
    }

    return result.data;
  },

  /**
   * Get UIP Vaccine Master antigens
   */
  async getVaccines(targetGroup = 'CHILD') {
    const params = new URLSearchParams();
    if (targetGroup) params.append('targetGroup', targetGroup);

    const res = await fetch(`${API_BASE_URL}/vaccinations/vaccines?${params.toString()}`, {
      headers: getAuthHeaders()
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch vaccines list');
    }

    return result.data;
  },

  /**
   * Get full vaccination timeline & history for a child
   */
  async getChildHistory(childId) {
    const res = await fetch(`${API_BASE_URL}/vaccinations/history/${childId}`, {
      headers: getAuthHeaders()
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch vaccination history');
    }

    return result.data;
  },

  /**
   * Record administered vaccination dose
   */
  async recordVaccination(recordData) {
    const res = await fetch(`${API_BASE_URL}/vaccinations/record`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(recordData)
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      const err = new Error(result.message || 'Failed to record vaccination');
      err.errors = result.errors;
      throw err;
    }

    return result.data;
  },

  /**
   * Get upcoming/scheduled sessions for dropdown
   */
  async getSessions(siteId) {
    const params = new URLSearchParams();
    if (siteId && siteId !== 'All') params.append('siteId', siteId);

    const res = await fetch(`${API_BASE_URL}/vaccinations/sessions?${params.toString()}`, {
      headers: getAuthHeaders()
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch sessions');
    }

    return result.data;
  }
};

