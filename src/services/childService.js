import { initialChildren, initialSites } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('tikakaran_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const childService = {
  /**
   * Fetch paginated children with search and filters
   */
  async getChildren({ search, siteId, village, gender, ageGroup, page = 1, limit = 6 } = {}) {
    try {
      const params = new URLSearchParams();
      if (search && search.trim()) params.append('search', search.trim());
      if (siteId && siteId !== 'All') params.append('siteId', siteId);
      if (village && village !== 'All') params.append('village', village);
      if (gender && gender !== 'All') params.append('gender', gender);
      if (ageGroup && ageGroup !== 'All') params.append('ageGroup', ageGroup);
      params.append('page', page);
      params.append('limit', limit);

      const res = await fetch(`${API_BASE_URL}/children?${params.toString()}`, {
        headers: getAuthHeaders()
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch children from server');
      }

      return result;
    } catch {
      // Fallback for hosted preview without live backend
      let list = [...initialChildren];
      if (search && search.trim()) {
        const q = search.toLowerCase();
        list = list.filter(c => c.name.toLowerCase().includes(q) || c.motherName.toLowerCase().includes(q));
      }
      if (siteId && siteId !== 'All') {
        list = list.filter(c => c.village === siteId || c.site?.includes(siteId));
      }
      return {
        success: true,
        data: list.slice((page - 1) * limit, page * limit),
        meta: {
          total: list.length,
          page,
          limit,
          totalPages: Math.ceil(list.length / limit) || 1
        }
      };
    }
  },

  /**
   * Get single child by ID with complete vaccination history
   */
  async getChildById(id) {
    const res = await fetch(`${API_BASE_URL}/children/${id}`, {
      headers: getAuthHeaders()
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch child details');
    }

    return result.data;
  },

  /**
   * Register new child beneficiary
   */
  async createChild(childData) {
    const res = await fetch(`${API_BASE_URL}/children`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(childData)
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      // Preserve status code for 409 duplicate detection handling
      const error = new Error(result.message || 'Failed to register child');
      error.status = res.status;
      error.errors = result.errors;
      throw error;
    }

    return result.data;
  },

  /**
   * Update child details
   */
  async updateChild(id, childData) {
    const res = await fetch(`${API_BASE_URL}/children/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(childData)
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      const error = new Error(result.message || 'Failed to update child details');
      error.status = res.status;
      throw error;
    }

    return result.data;
  },

  /**
   * Delete child beneficiary
   */
  async deleteChild(id) {
    const res = await fetch(`${API_BASE_URL}/children/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Failed to delete child record');
    }

    return result.message;
  },

  /**
   * Record a vaccination dose in PostgreSQL
   */
  async recordVaccine({ childId, vaccineId, doseGiven, administeredDate, batchNumber, expiryDate, coldChainTemp = 4.2, remarks }) {
    const res = await fetch(`${API_BASE_URL}/vaccinations/record`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        childId,
        vaccineId,
        doseGiven,
        administeredDate,
        batchNumber,
        expiryDate,
        coldChainTemp,
        remarks
      })
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Failed to record vaccination');
    }

    return result.data;
  },

  /**
   * Fetch AWC sites for dropdowns
   */
  async getSites() {
    try {
      const res = await fetch(`${API_BASE_URL}/sites`, {
        headers: getAuthHeaders()
      });
      const result = await res.json();
      if (res.ok && result.success && Array.isArray(result.data) && result.data.length > 0) {
        return result.data;
      }
      return initialSites;
    } catch {
      return initialSites;
    }
  }
};

