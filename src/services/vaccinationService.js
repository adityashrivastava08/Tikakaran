import { initialChildren, todaySessions } from '../data/mockData';

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
    try {
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
    } catch {
      // Fallback for hosted preview without live backend
      let allItems = initialChildren.map(c => ({
        id: c.id,
        recordId: c.id,
        childId: c.id,
        name: c.name,
        childName: c.name,
        registrationNumber: c.id,
        rchId: c.rchId,
        dob: c.dob,
        age: c.age,
        gender: c.gender,
        motherName: c.motherName,
        mobile: c.mobile,
        guardianPhone: c.mobile,
        village: c.village,
        site: c.site,
        asha: c.asha,
        dueVaccine: c.dueVaccine,
        vaccineName: c.dueVaccine,
        dose: c.dose,
        dueDate: c.dueDate,
        status: c.status
      }));

      // Compute summary across all items
      const summary = {
        dueToday: allItems.filter(i => i.status === 'Due Today').length,
        upcoming: allItems.filter(i => i.status === 'Upcoming' || i.status === 'Upcoming Due').length,
        overdue: allItems.filter(i => i.status === 'Overdue').length,
        completed: allItems.filter(i => i.status === 'Completed').length,
        totalDue: allItems.filter(i => i.status === 'Due Today' || i.status === 'Overdue').length
      };

      let filtered = allItems;
      if (tab === 'Due Today') filtered = filtered.filter(i => i.status === 'Due Today');
      else if (tab === 'Upcoming Due') filtered = filtered.filter(i => i.status === 'Upcoming' || i.status === 'Upcoming Due');
      else if (tab === 'Overdue') filtered = filtered.filter(i => i.status === 'Overdue');
      else if (tab === 'Completed') filtered = filtered.filter(i => i.status === 'Completed');

      if (search && search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(i => 
          i.name.toLowerCase().includes(q) || 
          i.motherName.toLowerCase().includes(q) || 
          i.dueVaccine.toLowerCase().includes(q)
        );
      }

      if (siteId && siteId !== 'All') {
        filtered = filtered.filter(i => i.village === siteId || i.site?.includes(siteId));
      }

      return {
        success: true,
        data: filtered.slice((page - 1) * limit, page * limit),
        meta: {
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit) || 1,
          summary
        }
      };
    }
  },

  /**
   * Get KPI summary counts (Due Today, Upcoming, Overdue, Completed)
   */
  async getDueSummary({ siteId, date } = {}) {
    try {
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
    } catch {
      return {
        dueToday: initialChildren.filter(i => i.status === 'Due Today').length,
        upcoming: initialChildren.filter(i => i.status === 'Upcoming').length,
        overdue: initialChildren.filter(i => i.status === 'Overdue').length,
        completed: initialChildren.filter(i => i.status === 'Completed').length,
        totalDue: initialChildren.filter(i => i.status === 'Due Today' || i.status === 'Overdue').length
      };
    }
  },

  /**
   * Get UIP Vaccine Master antigens
   */
  async getVaccines(targetGroup = 'CHILD') {
    try {
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
    } catch {
      return [
        { id: 'v-penta1', name: 'Pentavalent-1 (DTP-HepB-Hib)', code: 'PENTA_1', doseLabel: 'Dose 1 (6 Weeks)' },
        { id: 'v-penta2', name: 'Pentavalent-2', code: 'PENTA_2', doseLabel: 'Dose 2 (10 Weeks)' },
        { id: 'v-penta3', name: 'Pentavalent-3', code: 'PENTA_3', doseLabel: 'Dose 3 (14 Weeks)' },
        { id: 'v-opv1', name: 'bOPV-1 (Oral Polio)', code: 'OPV_1', doseLabel: 'Dose 1 (6 Weeks)' },
        { id: 'v-rota1', name: 'Rotavirus-1 (RVV)', code: 'ROTA_1', doseLabel: 'Dose 1 (6 Weeks)' },
        { id: 'v-fipv1', name: 'Fractional IPV-1', code: 'FIPV_1', doseLabel: 'Dose 1 (6 Weeks)' },
        { id: 'v-pcv1', name: 'Pneumococcal Conjugate (PCV-1)', code: 'PCV_1', doseLabel: 'Dose 1 (6 Weeks)' },
        { id: 'v-mr1', name: 'Measles-Rubella-1 (MR-1)', code: 'MR_1', doseLabel: 'Dose 1 (9 Months)' },
        { id: 'v-bcg', name: 'BCG (Bacille Calmette-Guérin)', code: 'BCG', doseLabel: 'At Birth' }
      ];
    }
  },

  /**
   * Get full vaccination timeline & history for a child
   */
  async getChildHistory(childId) {
    try {
      const res = await fetch(`${API_BASE_URL}/vaccinations/history/${childId}`, {
        headers: getAuthHeaders()
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch vaccination history');
      }

      return result.data;
    } catch {
      const child = initialChildren.find(c => c.id === childId) || initialChildren[0];
      return {
        child: {
          id: child.id,
          name: child.name,
          registrationNumber: child.id,
          rchId: child.rchId,
          dob: child.dob,
          age: child.age,
          gender: child.gender,
          motherName: child.motherName,
          guardianPhone: child.mobile,
          village: child.village,
          site: child.site,
          progressPercent: 75,
          completedDoses: child.vaccinationHistory?.length || 3,
          totalDoses: 16
        },
        timeline: (child.vaccinationHistory || []).map(h => ({
          vaccineName: h.vaccine,
          dose: h.dose,
          administeredDate: h.date,
          batchNumber: h.batch || 'LOT-2026B',
          status: h.status
        }))
      };
    }
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
    try {
      const params = new URLSearchParams();
      if (siteId && siteId !== 'All') params.append('siteId', siteId);

      const res = await fetch(`${API_BASE_URL}/vaccinations/sessions?${params.toString()}`, {
        headers: getAuthHeaders()
      });

      const result = await res.json();
      if (res.ok && result.success && Array.isArray(result.data) && result.data.length > 0) {
        return result.data;
      }

      return todaySessions.map(s => ({
        id: s.id,
        sessionDate: s.date,
        siteName: s.siteName,
        status: s.status,
        label: `${s.date} - ${s.siteName} (${s.status})`
      }));
    } catch {
      return todaySessions.map(s => ({
        id: s.id,
        sessionDate: s.date,
        siteName: s.siteName,
        status: s.status,
        label: `${s.date} - ${s.siteName} (${s.status})`
      }));
    }
  }
};
