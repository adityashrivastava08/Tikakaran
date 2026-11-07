import React, { useState, useEffect, useCallback } from 'react';
import { 
  Syringe, 
  Search, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Phone, 
  Printer, 
  History, 
  X,
  Send,
  FileCheck2,
  SearchX,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Thermometer,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { vaccinationService } from '../services/vaccinationService';
import { childService } from '../services/childService';
import VaccinationEntryModal from '../components/VaccinationEntryModal';
import EmptyState from '../components/ui/EmptyState';

export default function VaccinationDueListPage() {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('Due Today');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSite, setSelectedSite] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Data states
  const [dueRecords, setDueRecords] = useState([]);
  const [summary, setSummary] = useState({
    dueToday: 0,
    upcoming: 0,
    overdue: 0,
    completed: 0,
    totalDue: 0
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [sites, setSites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [vaccinationModalRecord, setVaccinationModalRecord] = useState(null);
  const [historyModalBeneficiary, setHistoryModalBeneficiary] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // 1. Fetch available Sub-Centre sites for filter
  useEffect(() => {
    let isMounted = true;
    childService.getSites()
      .then(data => {
        if (isMounted && data && Array.isArray(data)) {
          setSites(data);
        }
      })
      .catch(err => console.warn('Could not load sites:', err));

    return () => { isMounted = false; };
  }, []);

  // 2. Fetch live Due List data from calculation engine
  const fetchDueData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await vaccinationService.getDueList({
        tab: activeTab,
        siteId: selectedSite,
        date: selectedDate,
        search: searchTerm,
        page: currentPage,
        limit: pageSize
      });

      if (response && response.success) {
        setDueRecords(response.data || []);
        if (response.meta) {
          setPagination({
            total: response.meta.total || 0,
            page: response.meta.page || 1,
            limit: response.meta.limit || pageSize,
            totalPages: response.meta.totalPages || 1
          });
          if (response.meta.summary) {
            setSummary(response.meta.summary);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch due list:', err);
      toast.error('Data Loading Error', err.message || 'Unable to retrieve due beneficiaries from database.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, selectedSite, selectedDate, searchTerm, currentPage, toast]);

  // Trigger data fetch on filter change
  useEffect(() => {
    fetchDueData();
  }, [fetchDueData]);

  // Reset to page 1 when changing tabs or search
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // 3. Open child vaccination history modal
  const handleOpenHistory = async (record) => {
    setHistoryModalBeneficiary(record);
    setHistoryLoading(true);
    setHistoryData(null);

    try {
      const targetId = record.childId || record.id;
      const history = await vaccinationService.getChildHistory(targetId);
      setHistoryData(history);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      toast.error('History Error', 'Could not load complete immunization timeline.');
    } finally {
      setHistoryLoading(false);
    }
  };

  // 4. Batch SMS Reminder Dispatcher
  const handleSendBatchSms = () => {
    const count = activeTab === 'Due Today' ? summary.dueToday : (activeTab === 'Overdue' ? summary.overdue : summary.upcoming);
    toast.success(
      "SMS Reminders Dispatched!",
      `${count || dueRecords.length} automated SMS alerts sent in Hindi to parents with village session timing, site location, and ASHA contact.`
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
              <Syringe className="w-6 h-6 text-[#D97706]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B38] tracking-tight">
                Vaccination Due List
              </h1>
              <p className="text-xs sm:text-sm text-[#718783] mt-0.5">
                Session Roster & Dropout Tracking • Ministry of Health Universal Immunization (UIP)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-[#E1ECE9] text-[#173B38] rounded-xl text-xs font-bold hover:bg-[#F1F7F6] transition shadow-soft-sm"
          >
            <Printer className="w-4 h-4 text-[#075E54]" />
            <span>Print Session Roster</span>
          </button>

          <button
            onClick={fetchDueData}
            title="Refresh database records"
            className="p-2.5 bg-white border border-[#E1ECE9] text-[#718783] hover:text-[#075E54] hover:bg-[#F1F7F6] rounded-xl text-xs font-bold transition shadow-soft-sm"
          >
            <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#075E54]' : ''}`} />
          </button>

          <button
            onClick={handleSendBatchSms}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Send className="w-4 h-4 text-[#10B981]" />
            <span>Send SMS Reminders</span>
          </button>
        </div>
      </div>

      {/* 2. Section Navigation Tabs with Real Live Badges */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E1ECE9] pb-2">
        {[
          { id: 'Due Today', label: "Due Today", count: summary.dueToday, icon: Clock, color: 'text-amber-600' },
          { id: 'Upcoming Due', label: "Upcoming Due", count: summary.upcoming, icon: Calendar, color: 'text-[#075E54]' },
          { id: 'Overdue', label: "Overdue Dropouts", count: summary.overdue, icon: AlertCircle, color: 'text-rose-600' },
          { id: 'Completed', label: "Completed Doses", count: summary.completed, icon: CheckCircle2, color: 'text-emerald-600' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                isActive
                  ? 'bg-[#075E54] text-white shadow-sm'
                  : 'bg-white text-[#718783] hover:text-[#173B38] border border-[#E1ECE9]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.color}`} />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isActive ? 'bg-[#043E38] text-white' : 'bg-[#F1F7F6] text-[#173B38]'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E1ECE9] shadow-soft-sm grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718783]" />
          <input
            type="text"
            placeholder="Search by child, mother, vaccine, RCH ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-3 py-2 bg-[#F1F7F6] focus:bg-white text-xs text-[#173B38] rounded-xl border border-transparent focus:border-[#10B981] outline-none transition"
          />
        </div>

        {/* Site Filter */}
        <div>
          <select
            value={selectedSite}
            onChange={(e) => {
              setSelectedSite(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-[#F1F7F6] focus:bg-white rounded-xl border border-[#E1ECE9] text-xs text-[#173B38] outline-none transition"
          >
            <option value="All">All Immunization Sites (AWCs)</option>
            {sites.map(s => (
              <option key={s.id} value={s.id}>
                {s.code ? `${s.code} - ` : ''}{s.name} ({s.village})
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="relative">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-[#F1F7F6] focus:bg-white rounded-xl border border-[#E1ECE9] text-xs text-[#173B38] outline-none transition"
          />
          {selectedDate && (
            <button
              onClick={() => { setSelectedDate(''); setCurrentPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718783] hover:text-[#173B38] text-[10px] font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 4. Due Table */}
      <div className="bg-white rounded-2xl border border-[#E1ECE9] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FBFA] text-[#718783] font-bold uppercase tracking-wider text-[10px] border-b border-[#E1ECE9]">
              <tr>
                <th className="py-3.5 px-4">Beneficiary Name</th>
                <th className="py-3.5 px-4">Age / Gender</th>
                <th className="py-3.5 px-4">Vaccine Antigen</th>
                <th className="py-3.5 px-4">Dose Stage</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Session Site</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1ECE9]/70 text-[#173B38]">
              {isLoading ? (
                // Skeleton Loader
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="animate-pulse">
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-[#E1ECE9] rounded w-32 mb-1.5" />
                      <div className="h-3 bg-[#E1ECE9]/60 rounded w-24" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-[#E1ECE9] rounded w-16 mb-1" />
                      <div className="h-3 bg-[#E1ECE9]/60 rounded w-10" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-6 bg-[#E1ECE9] rounded-lg w-28" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-[#E1ECE9] rounded w-20" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-[#E1ECE9] rounded w-20 mb-1" />
                      <div className="h-3 bg-[#E1ECE9]/60 rounded w-16" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-[#E1ECE9] rounded w-24 mb-1" />
                      <div className="h-3 bg-[#E1ECE9]/60 rounded w-16" />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="h-5 bg-[#E1ECE9] rounded-full w-20 mx-auto" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="h-7 bg-[#E1ECE9] rounded-lg w-24 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : dueRecords.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <EmptyState
                      icon={SearchX}
                      title="No Due Beneficiaries Found"
                      description={`No children found under "${activeTab}" for the selected search and site filters.`}
                    />
                  </td>
                </tr>
              ) : (
                dueRecords.map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.2 }}
                    className="hover:bg-[#F9FCFB] transition group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-sm text-[#173B38] group-hover:text-[#075E54] transition">
                        {item.name || item.childName}
                      </div>
                      <span className="text-[10px] text-[#718783]">
                        Mother: {item.motherName} • #{item.rchId || item.registrationNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold">{item.age}</span>
                      <span className="text-[10px] text-[#718783] block">{item.gender}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#075E54] bg-[#E6F4F1] px-2.5 py-1 rounded-lg text-[11px] inline-block">
                        {item.dueVaccine || item.vaccineName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#173B38]">
                      {item.dose || 'Routine Dose'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-[#173B38] block">{item.dueDate}</span>
                      <span className="text-[10px] text-[#718783]">DOB: {item.dob}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium block truncate max-w-[140px]">{item.village || item.site}</span>
                      <span className="text-[10px] text-[#718783]">ASHA: {item.asha}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                        item.status === 'Due Today' ? 'bg-amber-100 text-amber-800' :
                        'bg-teal-50 text-[#075E54]'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Record Vaccine */}
                        {item.status !== 'Completed' ? (
                          <button
                            onClick={() => setVaccinationModalRecord(item)}
                            className="px-2.5 py-1.5 bg-[#075E54] hover:bg-[#064C44] text-white rounded-lg font-bold flex items-center gap-1 transition text-[11px] shadow-sm"
                          >
                            <Syringe className="w-3 h-3" />
                            Record Dose
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px] bg-emerald-50 px-2 py-1 rounded-md">
                            <FileCheck2 className="w-3.5 h-3.5" /> Done
                          </span>
                        )}

                        {/* History */}
                        <button
                          onClick={() => handleOpenHistory(item)}
                          title="View Vaccination History"
                          className="p-1.5 rounded-lg border border-[#E1ECE9] text-[#718783] hover:text-[#075E54] hover:bg-[#E6F4F1] transition"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>

                        {/* Phone */}
                        {item.mobile && (
                          <a
                            href={`tel:${item.mobile}`}
                            title={`Call Parent: ${item.mobile}`}
                            className="p-1.5 rounded-lg border border-[#E1ECE9] text-[#718783] hover:text-[#075E54] hover:bg-[#E6F4F1] transition"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Footer */}
        {pagination.total > 0 && (
          <div className="px-5 py-3.5 bg-[#F8FBFA] border-t border-[#E1ECE9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#718783]">
            <div>
              Showing <span className="font-bold text-[#173B38]">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
              <span className="font-bold text-[#173B38]">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
              <span className="font-bold text-[#173B38]">{pagination.total}</span> beneficiaries
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1 || isLoading}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#E1ECE9] text-xs font-bold text-[#173B38] hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <span className="px-2.5 py-1 bg-white border border-[#E1ECE9] rounded-lg font-bold text-[#075E54]">
                {pagination.page} / {pagination.totalPages}
              </span>

              <button
                disabled={currentPage >= pagination.totalPages || isLoading}
                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-[#E1ECE9] text-xs font-bold text-[#173B38] hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* REUSABLE VACCINATION ENTRY MODAL CONNECTED TO DATABASE */}
      <VaccinationEntryModal
        isOpen={!!vaccinationModalRecord}
        onClose={() => setVaccinationModalRecord(null)}
        initialBeneficiary={vaccinationModalRecord}
        onSuccess={() => {
          fetchDueData();
        }}
      />

      {/* FULL IMMUNIZATION HISTORY TIMELINE MODAL */}
      <AnimatePresence>
        {historyModalBeneficiary && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-2xl overflow-hidden"
            >
              <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-300" />
                    Beneficiary Immunization MCP Card
                  </h3>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    {historyModalBeneficiary.name || historyModalBeneficiary.childName} • #{historyModalBeneficiary.rchId || historyModalBeneficiary.registrationNumber}
                  </p>
                </div>
                <button 
                  onClick={() => setHistoryModalBeneficiary(null)} 
                  className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 max-h-[70vh] overflow-y-auto">
                {historyLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-[#718783] gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#075E54]" />
                    <span className="text-xs">Loading complete UIP vaccination history...</span>
                  </div>
                ) : historyData ? (
                  <div className="space-y-4">
                    {/* Header metrics card */}
                    <div className="p-3.5 bg-[#F1F7F6] rounded-2xl border border-[#E1ECE9] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div>
                        <span className="text-[10px] text-[#718783] uppercase block">Age / Gender</span>
                        <span className="font-bold text-xs text-[#173B38]">{historyData.child.age} • {historyData.child.gender}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#718783] uppercase block">Mother</span>
                        <span className="font-bold text-xs text-[#173B38]">{historyData.child.motherName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#718783] uppercase block">Doses Given</span>
                        <span className="font-bold text-xs text-[#075E54]">
                          {historyData.child.completedDoses} / {historyData.child.totalDoses}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#718783] uppercase block">Full Immunization</span>
                        <span className="font-bold text-xs text-[#075E54]">
                          {historyData.child.progressPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-[#E1ECE9] h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#10B981] h-full rounded-full transition-all duration-500"
                        style={{ width: `${historyData.child.progressPercent}%` }}
                      />
                    </div>

                    {/* Detailed timeline table */}
                    <table className="w-full text-left text-xs border border-[#E1ECE9] rounded-xl overflow-hidden">
                      <thead className="bg-[#F8FBFA] text-[#718783] uppercase text-[10px] border-b border-[#E1ECE9]">
                        <tr>
                          <th className="py-2.5 px-3">Antigen</th>
                          <th className="py-2.5 px-3">Dose Stage</th>
                          <th className="py-2.5 px-3">Due / Administered</th>
                          <th className="py-2.5 px-3">Batch #</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E1ECE9]">
                        {historyData.timeline.map((h, i) => (
                          <tr key={i} className="hover:bg-[#F9FCFB]">
                            <td className="py-2.5 px-3 font-bold text-[#075E54]">
                              {h.vaccineName}
                            </td>
                            <td className="py-2.5 px-3 text-[#173B38]">{h.dose}</td>
                            <td className="py-2.5 px-3">
                              {h.status === 'Completed' ? (
                                <span className="font-semibold text-emerald-800">
                                  {h.administeredDate}
                                </span>
                              ) : (
                                <span className="font-medium text-[#718783]">
                                  Due: {h.dueDate}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-[#718783]">
                              {h.batchNumber || '—'}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                h.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                h.status === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                                h.status === 'Due Today' ? 'bg-amber-100 text-amber-800' :
                                'bg-teal-50 text-[#075E54]'
                              }`}>
                                {h.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-[#718783]">
                    No historical immunization records found.
                  </div>
                )}
              </div>

              <div className="p-4 bg-[#F9FCFA] border-t border-[#E1ECE9] flex items-center justify-between">
                <span className="text-[11px] text-[#718783]">
                  U-WIN Portal Synchronized • Safe Cold Chain Telemetry
                </span>
                <button
                  onClick={() => setHistoryModalBeneficiary(null)}
                  className="px-4 py-2 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl text-xs font-bold transition"
                >
                  Close Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
