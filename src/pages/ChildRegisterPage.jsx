import React, { useState, useEffect, useCallback } from 'react';
import { 
  Baby, 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  Syringe, 
  History, 
  Phone, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Check, 
  User, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  SearchX,
  Loader2,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { childService } from '../services/childService';
import VaccinationEntryModal from '../components/VaccinationEntryModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import { TableRowSkeleton } from '../components/ui/Skeleton';

export default function ChildRegisterPage() {
  const { user } = useAuth();
  const toast = useToast();

  // Data & Loading state
  const [children, setChildren] = useState([]);
  const [totalChildren, setTotalChildren] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('All');
  const [selectedAwc, setSelectedAwc] = useState('All');
  const [availableSites, setAvailableSites] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [viewingChild, setViewingChild] = useState(null);
  const [historyChild, setHistoryChild] = useState(null);
  const [vaccinationModalChild, setVaccinationModalChild] = useState(null);
  const [deletingChildId, setDeletingChildId] = useState(null);

  // Form submission & Duplicate error state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // New child form
  const [newChildForm, setNewChildForm] = useState({
    name: '',
    dob: '2026-08-15',
    gender: 'MALE',
    birthWeight: 3.2,
    motherName: '',
    fatherName: '',
    guardianPhone: '',
    village: 'Pipariya',
    awcCode: 'AWC-04',
    rchId: '',
    isHighRisk: false,
    highRiskReason: ''
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load available sites for dropdown
  useEffect(() => {
    async function loadSites() {
      const sites = await childService.getSites();
      if (sites && sites.length > 0) {
        setAvailableSites(sites);
      }
    }
    loadSites();
  }, []);

  // Fetch children from real backend API
  const loadChildren = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const res = await childService.getChildren({
        search: debouncedSearch,
        siteId: selectedAwc,
        village: selectedVillage,
        gender: selectedGender,
        ageGroup: selectedAgeGroup,
        page: currentPage,
        limit: itemsPerPage
      });

      setChildren(res.data || []);
      setTotalChildren(res.meta?.total || 0);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err) {
      console.error('Failed to load children:', err);
      setFetchError(err.message || 'Unable to connect to healthcare server.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedAwc, selectedVillage, selectedGender, selectedAgeGroup, currentPage]);

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  // Handle Add Child Submit with Duplicate Detection
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!newChildForm.name.trim() || !newChildForm.motherName.trim() || !newChildForm.guardianPhone.trim()) {
      setFormError("Child Name, Mother's Name, and Mobile Number are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const createdChild = await childService.createChild(newChildForm);
      setIsAddModalOpen(false);
      toast.success(
        "Child Registered Successfully!",
        `${createdChild.name} registered under Registration #${createdChild.registrationNumber} with full UIP vaccination schedule.`
      );
      // Reset form
      setNewChildForm({
        name: '',
        dob: '2026-08-15',
        gender: 'MALE',
        birthWeight: 3.2,
        motherName: '',
        fatherName: '',
        guardianPhone: '',
        village: 'Pipariya',
        awcCode: 'AWC-04',
        rchId: '',
        isHighRisk: false,
        highRiskReason: ''
      });
      loadChildren();
    } catch (err) {
      if (err.status === 409) {
        setFormError(err.message);
        toast.error("Duplicate Registration", err.message);
      } else {
        setFormError(err.message || "Failed to register child beneficiary.");
        toast.error("Registration Failed", err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Child Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingChild) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      await childService.updateChild(editingChild.id, editingChild);
      setEditingChild(null);
      toast.success("Record Updated", `Details for ${editingChild.name} updated in PostgreSQL.`);
      loadChildren();
    } catch (err) {
      setFormError(err.message);
      toast.error("Update Failed", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Child
  const handleConfirmDelete = async () => {
    if (!deletingChildId) return;

    try {
      await childService.deleteChild(deletingChildId);
      toast.info("Record Deleted", "Child beneficiary removed from the Sub-Centre register.");
      setDeletingChildId(null);
      loadChildren();
    } catch (err) {
      toast.error("Delete Failed", err.message);
    }
  };

  // Open Full Profile Modal
  const handleViewProfile = async (child) => {
    try {
      const fullChild = await childService.getChildById(child.id);
      setViewingChild(fullChild);
    } catch {
      setViewingChild(child);
    }
  };

  // Open Vaccination History Modal with Real Scheduled Doses
  const handleViewHistory = async (child) => {
    try {
      const fullChild = await childService.getChildById(child.id);
      setHistoryChild(fullChild);
    } catch {
      setHistoryChild(child);
    }
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedVillage('All');
    setSelectedGender('All');
    setSelectedAgeGroup('All');
    setSelectedAwc('All');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Heading & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] flex items-center justify-center text-[#075E54]">
              <Baby className="w-6 h-6 text-[#075E54]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B38] tracking-tight">
                  Child Register
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#075E54]">
                  PostgreSQL Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#718783] mt-0.5">
                Sub-Centre Cohort Register • Total {totalChildren} Registered Beneficiaries
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadChildren}
            title="Refresh database records"
            className="p-2.5 rounded-xl border border-[#E1ECE9] bg-white hover:bg-[#F1F7F6] text-[#075E54] transition shadow-soft-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              setFormError(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Child</span>
          </button>
        </div>
      </div>

      {/* 2. Filters & Search Box */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E1ECE9] shadow-soft-sm space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718783]" />
          <input
            type="text"
            placeholder="Search child by name, DOB, mother name, RCH ID, or mobile number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F1F7F6] focus:bg-white text-xs sm:text-sm text-[#173B38] rounded-xl border border-transparent focus:border-[#10B981] outline-none transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718783] hover:text-[#173B38]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {/* Site / AWC filter */}
          <div>
            <label className="text-[11px] font-semibold text-[#718783] block mb-1">AWC / Site</label>
            <select
              value={selectedAwc}
              onChange={(e) => { setSelectedAwc(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-[#F1F7F6] rounded-xl border border-[#E1ECE9] text-[#173B38] outline-none focus:border-[#10B981]"
            >
              <option value="All">All AWCs / Sites</option>
              {availableSites.length > 0 ? (
                availableSites.map(s => (
                  <option key={s.id} value={s.code}>
                    {s.code} ({s.village})
                  </option>
                ))
              ) : (
                <>
                  <option value="AWC-04">AWC-04 (Ward 4)</option>
                  <option value="AWC-07">AWC-07 (Khera Basti)</option>
                  <option value="AWC-02">AWC-02 (Ward 2)</option>
                  <option value="SC-MAIN">SC-MAIN (Sub-Centre)</option>
                </>
              )}
            </select>
          </div>

          {/* Age Group filter */}
          <div>
            <label className="text-[11px] font-semibold text-[#718783] block mb-1">Age Group</label>
            <select
              value={selectedAgeGroup}
              onChange={(e) => { setSelectedAgeGroup(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-[#F1F7F6] rounded-xl border border-[#E1ECE9] text-[#173B38] outline-none focus:border-[#10B981]"
            >
              <option value="All">All Ages (0-5 Yrs)</option>
              <option value="0-11m">0–11 Months (Infants)</option>
              <option value="12-23m">12–23 Months (Toddlers)</option>
              <option value="2-5y">2–5 Years (Preschool)</option>
            </select>
          </div>

          {/* Village filter */}
          <div>
            <label className="text-[11px] font-semibold text-[#718783] block mb-1">Village</label>
            <select
              value={selectedVillage}
              onChange={(e) => { setSelectedVillage(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-[#F1F7F6] rounded-xl border border-[#E1ECE9] text-[#173B38] outline-none focus:border-[#10B981]"
            >
              <option value="All">All Villages</option>
              <option value="Pipariya">Pipariya</option>
              <option value="Khera Basti">Khera Basti</option>
              <option value="Pipariya Ward 2">Pipariya Ward 2</option>
              <option value="Pipariya Central">Pipariya Central</option>
            </select>
          </div>

          {/* Gender filter */}
          <div>
            <label className="text-[11px] font-semibold text-[#718783] block mb-1">Gender</label>
            <select
              value={selectedGender}
              onChange={(e) => { setSelectedGender(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-[#F1F7F6] rounded-xl border border-[#E1ECE9] text-[#173B38] outline-none focus:border-[#10B981]"
            >
              <option value="All">All Genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error state */}
      {fetchError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{fetchError}</span>
          </div>
          <button
            onClick={loadChildren}
            className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* 3. Table Section */}
      <div className="bg-white rounded-2xl border border-[#E1ECE9] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FBFA] text-[#718783] font-bold uppercase tracking-wider text-[10px] border-b border-[#E1ECE9]">
              <tr>
                <th className="py-3.5 px-4">Registration #</th>
                <th className="py-3.5 px-4">Child Name</th>
                <th className="py-3.5 px-4">DOB</th>
                <th className="py-3.5 px-4">Age</th>
                <th className="py-3.5 px-4">Gender</th>
                <th className="py-3.5 px-4">Mother Name</th>
                <th className="py-3.5 px-4">Mobile</th>
                <th className="py-3.5 px-4">Site / AWC</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1ECE9]/70 text-[#173B38]">
              {isLoading ? (
                // Skeleton loading state
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={10} />
                ))
              ) : children.length === 0 ? (
                <tr>
                  <td colSpan="10">
                    <EmptyState
                      icon={SearchX}
                      title="No Children Found"
                      description="No registered children match your active filters in this Sub-Centre jurisdiction. You can clear filters or register a new child."
                      actionLabel="Clear Filters"
                      onAction={handleClearFilters}
                    />
                  </td>
                </tr>
              ) : (
                children.map((child, index) => {
                  const dobFormatted = child.dob ? new Date(child.dob).toISOString().split('T')[0] : 'N/A';
                  return (
                    <motion.tr
                      key={child.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.2 }}
                      className="hover:bg-[#F9FCFB] transition group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#075E54]">
                        {child.registrationNumber}
                        {child.rchId && (
                          <span className="block text-[10px] text-[#718783] font-mono">#{child.rchId}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-sm text-[#173B38] group-hover:text-[#075E54] transition flex items-center gap-1.5">
                          <span>{child.name}</span>
                          {child.isHighRisk && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                              HRP
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#718783]">Due: {child.dueVaccine}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium whitespace-nowrap">
                        {dobFormatted}
                      </td>
                      <td className="py-3.5 px-4 font-semibold">
                        {child.age}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          child.gender === 'MALE' || child.gender === 'Male' 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'bg-pink-50 text-pink-700'
                        }`}>
                          {child.gender}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        {child.motherName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <a href={`tel:${child.guardianPhone}`} className="hover:text-[#075E54] hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#10B981]" />
                          {child.guardianPhone}
                        </a>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold block truncate max-w-[140px]">{child.village}</span>
                        <span className="text-[10px] text-[#718783]">{child.awcCode}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          child.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          child.status === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {child.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Profile */}
                          <button
                            onClick={() => handleViewProfile(child)}
                            title="View Profile Details"
                            className="p-1.5 rounded-lg text-[#718783] hover:text-[#075E54] hover:bg-[#E6F4F1] transition cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Vaccination History */}
                          <button
                            onClick={() => handleViewHistory(child)}
                            title="Vaccination History & UIP Schedule"
                            className="p-1.5 rounded-lg text-[#718783] hover:text-[#075E54] hover:bg-[#E6F4F1] transition cursor-pointer"
                          >
                            <History className="w-4 h-4 text-[#10B981]" />
                          </button>

                          {/* Record Vaccine */}
                          <button
                            onClick={() => setVaccinationModalChild(child)}
                            title="Record Vaccine Dose"
                            className="p-1.5 rounded-lg text-[#075E54] hover:bg-[#075E54] hover:text-white transition cursor-pointer"
                          >
                            <Syringe className="w-4 h-4" />
                          </button>

                          {/* Edit Child */}
                          <button
                            onClick={() => {
                              setFormError(null);
                              setEditingChild({
                                ...child,
                                dob: child.dob ? new Date(child.dob).toISOString().split('T')[0] : ''
                              });
                            }}
                            title="Edit Child Details"
                            className="p-1.5 rounded-lg text-[#718783] hover:text-[#173B38] hover:bg-gray-100 transition cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Child */}
                          <button
                            onClick={() => setDeletingChildId(child.id)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg text-[#718783] hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination Footer */}
        <div className="px-5 py-3.5 bg-[#F8FBFA] border-t border-[#E1ECE9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#718783]">
          <div>
            Showing <strong className="text-[#173B38]">{totalChildren === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong className="text-[#173B38]">{Math.min(totalChildren, currentPage * itemsPerPage)}</strong> of{' '}
            <strong className="text-[#173B38]">{totalChildren}</strong> registered children
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
              className="p-1.5 rounded-lg border border-[#E1ECE9] bg-white hover:bg-[#F1F7F6] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                disabled={isLoading}
                className={`w-8 h-8 rounded-lg font-bold text-xs transition ${
                  currentPage === page
                    ? 'bg-[#075E54] text-white'
                    : 'bg-white border border-[#E1ECE9] hover:bg-[#F1F7F6] text-[#173B38]'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="p-1.5 rounded-lg border border-[#E1ECE9] bg-white hover:bg-[#F1F7F6] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD NEW CHILD (WITH DUPLICATE DETECTION) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Baby className="w-6 h-6 text-emerald-300" />
                  <div>
                    <h3 className="text-base font-bold">New Child Registration</h3>
                    <p className="text-xs text-emerald-200">PostgreSQL Verified Sub-Centre Register</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="p-1 text-white/80 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Duplicate Error Banner */}
              {formError && (
                <div className="mx-5 mt-4 p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-bold block">Validation Alert:</span>
                    <span>{formError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="p-5 space-y-3.5 text-xs overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-[#173B38]">Child Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Patel"
                      value={newChildForm.name}
                      onChange={(e) => setNewChildForm({ ...newChildForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] focus:border-[#10B981] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-[#173B38]">Date of Birth (DOB) *</label>
                    <input
                      type="date"
                      required
                      value={newChildForm.dob}
                      onChange={(e) => setNewChildForm({ ...newChildForm, dob: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] focus:border-[#10B981] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-[#173B38]">Gender</label>
                    <select
                      value={newChildForm.gender}
                      onChange={(e) => setNewChildForm({ ...newChildForm, gender: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-[#173B38]">Birth Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 3.2"
                      value={newChildForm.birthWeight}
                      onChange={(e) => setNewChildForm({ ...newChildForm, birthWeight: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-[#173B38]">Mother Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pooja Patel"
                      value={newChildForm.motherName}
                      onChange={(e) => setNewChildForm({ ...newChildForm, motherName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-[#173B38]">Father / Guardian Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Patel"
                      value={newChildForm.fatherName}
                      onChange={(e) => setNewChildForm({ ...newChildForm, fatherName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-[#173B38]">Guardian Mobile *</label>
                    <input
                      type="tel"
                      required
                      placeholder="98261XXXXX"
                      value={newChildForm.guardianPhone}
                      onChange={(e) => setNewChildForm({ ...newChildForm, guardianPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-[#173B38]">National RCH ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 9842104401"
                      value={newChildForm.rchId}
                      onChange={(e) => setNewChildForm({ ...newChildForm, rchId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-[#173B38]">Village</label>
                    <select
                      value={newChildForm.village}
                      onChange={(e) => setNewChildForm({ ...newChildForm, village: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    >
                      <option value="Pipariya">Pipariya</option>
                      <option value="Khera Basti">Khera Basti</option>
                      <option value="Pipariya Ward 2">Pipariya Ward 2</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-[#173B38]">AWC Immunization Site</label>
                    <select
                      value={newChildForm.awcCode}
                      onChange={(e) => setNewChildForm({ ...newChildForm, awcCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    >
                      {availableSites.map(s => (
                        <option key={s.id} value={s.code}>
                          {s.code} - {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E1ECE9] flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border rounded-xl font-bold text-[#718783] hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-[#075E54] text-white rounded-xl font-bold hover:bg-[#064C44] transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <span>Save & Schedule UIP Vaccines</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: EDIT CHILD */}
      <AnimatePresence>
        {editingChild && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-xl overflow-hidden"
            >
              <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
                <h3 className="text-base font-bold">Edit Child: {editingChild.name}</h3>
                <button onClick={() => setEditingChild(null)} className="p-1 text-white/80 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="mx-5 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                  {formError}
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="p-5 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Child Name</label>
                    <input
                      type="text"
                      value={editingChild.name}
                      onChange={(e) => setEditingChild({ ...editingChild, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Guardian Mobile</label>
                    <input
                      type="text"
                      value={editingChild.guardianPhone}
                      onChange={(e) => setEditingChild({ ...editingChild, guardianPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Mother Name</label>
                    <input
                      type="text"
                      value={editingChild.motherName}
                      onChange={(e) => setEditingChild({ ...editingChild, motherName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Village</label>
                    <input
                      type="text"
                      value={editingChild.village}
                      onChange={(e) => setEditingChild({ ...editingChild, village: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E1ECE9] flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingChild(null)}
                    className="px-4 py-2 border rounded-xl font-bold text-[#718783] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[#075E54] text-white rounded-xl font-bold hover:bg-[#064C44] cursor-pointer"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Record'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: VIEW CHILD PROFILE */}
      <AnimatePresence>
        {viewingChild && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-lg overflow-hidden"
            >
              <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-300" />
                  <h3 className="text-base font-bold">Child Profile: {viewingChild.name}</h3>
                </div>
                <button onClick={() => setViewingChild(null)} className="text-white/80 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-3.5 text-xs">
                <div className="p-3 bg-[#F9FCFA] rounded-xl border border-[#E1ECE9] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#718783]">Official Registration Number</span>
                    <p className="font-mono font-bold text-sm text-[#075E54]">{viewingChild.registrationNumber}</p>
                    {viewingChild.rchId && (
                      <p className="text-[11px] text-[#718783] font-mono mt-0.5">RCH ID: #{viewingChild.rchId}</p>
                    )}
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                    Verified ANM Roster
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[#718783] block">Date of Birth</span>
                    <strong className="text-[#173B38]">
                      {new Date(viewingChild.dob).toISOString().split('T')[0]} ({viewingChild.age})
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#718783] block">Gender & Weight</span>
                    <strong className="text-[#173B38]">
                      {viewingChild.gender} • {viewingChild.birthWeight ? `${viewingChild.birthWeight} kg` : 'N/A'}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[#718783] block">Mother / Father</span>
                    <strong className="text-[#173B38]">{viewingChild.motherName} / {viewingChild.fatherName || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-[#718783] block">Mobile Contact</span>
                    <strong className="text-[#173B38]">{viewingChild.guardianPhone}</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#E6F4F1] border border-[#CCE8E1]">
                  <span className="text-[11px] font-semibold text-[#075E54] block">Catchment Site & ANM Jurisdiction</span>
                  <p className="text-[#173B38] font-bold mt-0.5">
                    {viewingChild.site?.name || viewingChild.village} ({viewingChild.awcCode})
                  </p>
                  <p className="text-[#718783] text-[11px] mt-0.5">
                    Assigned ASHA: {viewingChild.site?.ashaName || 'Sunita Malviya'} ({viewingChild.site?.ashaPhone || '+91 98261 44521'})
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#F9FCFA] border-t border-[#E1ECE9] flex justify-end">
                <button
                  onClick={() => setViewingChild(null)}
                  className="px-4 py-2 bg-[#075E54] text-white rounded-xl font-bold cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: VACCINATION HISTORY & ROUTINE UIP SCHEDULE */}
      <AnimatePresence>
        {historyChild && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold">Vaccination History & MCP Schedule</h3>
                  <p className="text-xs text-emerald-200">
                    {historyChild.name} • {historyChild.registrationNumber} (DOB: {new Date(historyChild.dob).toISOString().split('T')[0]})
                  </p>
                </div>
                <button onClick={() => setHistoryChild(null)} className="text-white/80 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FBFA] text-[#718783] uppercase text-[10px] sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">Vaccine</th>
                      <th className="py-2.5 px-3">Dose</th>
                      <th className="py-2.5 px-3">Due Date</th>
                      <th className="py-2.5 px-3">Administered</th>
                      <th className="py-2.5 px-3">Batch Lot</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1ECE9] text-[#173B38]">
                    {historyChild.vaccinationRecords?.length > 0 ? (
                      historyChild.vaccinationRecords.map((vr) => (
                        <tr key={vr.id} className="hover:bg-[#F9FCFB]">
                          <td className="py-2.5 px-3 font-bold text-[#075E54]">
                            {vr.vaccine?.name || vr.doseGiven}
                          </td>
                          <td className="py-2.5 px-3 font-medium">{vr.doseGiven}</td>
                          <td className="py-2.5 px-3 font-mono">
                            {new Date(vr.dueDate).toISOString().split('T')[0]}
                          </td>
                          <td className="py-2.5 px-3 font-mono">
                            {vr.administeredDate ? new Date(vr.administeredDate).toISOString().split('T')[0] : '—'}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px]">
                            {vr.batchNumber || '—'}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              vr.status === 'ADMINISTERED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : vr.status === 'OVERDUE'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {vr.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-6 text-center text-[#718783]">
                          No vaccination records scheduled.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-[#F9FCFA] border-t border-[#E1ECE9] flex justify-between items-center">
                <button onClick={() => window.print()} className="text-xs font-bold text-[#075E54] hover:underline cursor-pointer">
                  Print MCP Immunization Card
                </button>
                <button
                  onClick={() => setHistoryChild(null)}
                  className="px-4 py-2 bg-[#075E54] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REUSABLE VACCINATION ENTRY MODAL */}
      <VaccinationEntryModal
        isOpen={!!vaccinationModalChild}
        onClose={() => {
          setVaccinationModalChild(null);
          loadChildren();
        }}
        initialBeneficiary={vaccinationModalChild}
      />

      {/* REUSABLE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={!!deletingChildId}
        title="Delete Child Beneficiary Record"
        message="Are you sure you want to permanently delete this child from PostgreSQL? All linked routine immunization records will also be removed."
        confirmText="Yes, Delete Record"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingChildId(null)}
      />
    </div>
  );
}
