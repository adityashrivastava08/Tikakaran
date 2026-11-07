import React, { useState } from 'react';
import { 
  HeartPulse, 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Activity, 
  X, 
  User, 
  ShieldAlert, 
  Clock,
  SearchX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthData } from '../context/HealthDataContext';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';

export default function PregnantWomenPage() {
  const { pregnantWomenList, addPregnantWoman, updatePregnantWoman, deletePregnantWoman } = useHealthData();
  const toast = useToast();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [selectedHrp, setSelectedHrp] = useState('All');
  const [selectedTrimester, setSelectedTrimester] = useState('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMother, setEditingMother] = useState(null);
  const [viewingMother, setViewingMother] = useState(null);
  const [deletingMotherId, setDeletingMotherId] = useState(null);

  // New mother form
  const [newMotherForm, setNewMotherForm] = useState({
    name: '',
    age: 24,
    mobile: '',
    husbandName: '',
    lmp: '2026-06-15',
    edd: '2027-03-22',
    village: 'Pipariya',
    site: 'Anganwadi Kendra Pipariya Ward-04',
    awc: 'AWC-04',
    hrpStatus: 'No (Normal)',
    highRiskReason: 'None',
    td1: 'Administered',
    td2: 'Due',
    tdBooster: 'No',
    hb: '11.4 g/dL',
    bp: '118/76 mmHg',
    weight: '52 kg',
    asha: 'Sunita Malviya'
  });

  // Filter logic
  const filteredMothers = pregnantWomenList.filter(mother => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      mother.name.toLowerCase().includes(q) ||
      mother.husbandName.toLowerCase().includes(q) ||
      mother.mobile.includes(q) ||
      mother.rchId?.includes(q);

    const matchesVillage = selectedVillage === 'All' || mother.village === selectedVillage;
    const matchesHrp = 
      selectedHrp === 'All' ? true :
      selectedHrp === 'High Risk' ? mother.hrpStatus.startsWith('Yes') :
      !mother.hrpStatus.startsWith('Yes');

    const matchesTrimester = 
      selectedTrimester === 'All' ? true :
      mother.trimester?.toLowerCase().includes(selectedTrimester.toLowerCase());

    return matchesSearch && matchesVillage && matchesHrp && matchesTrimester;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newMotherForm.name.trim() || !newMotherForm.husbandName.trim()) {
      toast.error("Validation Error", "Woman name and husband name are required.");
      return;
    }
    addPregnantWoman(newMotherForm);
    setIsAddModalOpen(false);
    toast.success("Pregnancy Registered", `${newMotherForm.name} registered for routine ANC & Td tracking.`);
    setNewMotherForm({
      name: '',
      age: 24,
      mobile: '',
      husbandName: '',
      lmp: '2026-06-15',
      edd: '2027-03-22',
      village: 'Pipariya',
      site: 'Anganwadi Kendra Pipariya Ward-04',
      awc: 'AWC-04',
      hrpStatus: 'No (Normal)',
      highRiskReason: 'None',
      td1: 'Due',
      td2: 'Due',
      tdBooster: 'No',
      hb: '11.4 g/dL',
      bp: '118/76 mmHg',
      weight: '52 kg',
      asha: 'Sunita Malviya'
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingMother) return;
    updatePregnantWoman(editingMother.id, editingMother);
    setEditingMother(null);
    toast.success("Record Updated", `Maternal health record for ${editingMother.name} updated.`);
  };

  const handleConfirmDelete = () => {
    if (deletingMotherId) {
      const mother = pregnantWomenList.find(m => m.id === deletingMotherId);
      deletePregnantWoman(deletingMotherId);
      setDeletingMotherId(null);
      toast.info("Record Removed", `Record for ${mother?.name || 'pregnant mother'} deleted.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center text-[#0284C7]">
              <HeartPulse className="w-6 h-6 text-[#0284C7]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B38] tracking-tight">
                Pregnant Women Register
              </h1>
              <p className="text-xs sm:text-sm text-[#718783] mt-0.5">
                Maternal Health, Antenatal Care (ANC) & High Risk Pregnancy (HRP) Tracking
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition hover:shadow-md"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Pregnancy Registration</span>
        </button>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#E1ECE9] shadow-soft-sm">
          <span className="text-xs font-semibold text-[#718783]">Active Registrations</span>
          <p className="text-2xl font-extrabold text-[#173B38] mt-1">{pregnantWomenList.length}</p>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">100% Tracking</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E1ECE9] shadow-soft-sm">
          <span className="text-xs font-semibold text-[#718783]">High Risk (HRP)</span>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">
            {pregnantWomenList.filter(m => m.hrpStatus.startsWith('Yes')).length}
          </p>
          <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold">Priority Home Visits</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E1ECE9] shadow-soft-sm">
          <span className="text-xs font-semibold text-[#718783]">ANC-3 / 4 Due This Month</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">38 Visits</p>
          <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">Session Rosters Ready</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E1ECE9] shadow-soft-sm">
          <span className="text-xs font-semibold text-[#718783]">Td Immunization Given</span>
          <p className="text-2xl font-extrabold text-[#075E54] mt-1">96.4%</p>
          <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">Safe Maternal Shield</span>
        </div>
      </div>

      {/* 3. Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E1ECE9] shadow-soft-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718783]" />
          <input
            type="text"
            placeholder="Search pregnant mother by name, husband name, mobile, or RCH ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F1F7F6] focus:bg-white text-xs sm:text-sm text-[#173B38] rounded-xl border border-transparent focus:border-[#10B981] outline-none transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-[#718783] block mb-1">Village</label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full px-3 py-2 bg-[#F1F7F6] rounded-xl border border-[#E1ECE9] text-[#173B38] outline-none"
            >
              <option value="All">All Villages</option>
              <option value="Pipariya">Pipariya</option>
              <option value="Khera Basti">Khera Basti</option>
              <option value="Pipariya Central">Pipariya Central</option>
              <option value="Pipariya Ward 1">Pipariya Ward 1</option>
              <option value="Gram Panchayat">Gram Panchayat</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#718783] block mb-1">HRP Status</label>
            <select
              value={selectedHrp}
              onChange={(e) => setSelectedHrp(e.target.value)}
              className="w-full px-3 py-2 bg-[#F1F7F6] rounded-xl border border-[#E1ECE9] text-[#173B38] outline-none"
            >
              <option value="All">All Pregnancies</option>
              <option value="High Risk">High Risk (HRP Only)</option>
              <option value="Normal">Normal Pregnancy</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#718783] block mb-1">Trimester</label>
            <select
              value={selectedTrimester}
              onChange={(e) => setSelectedTrimester(e.target.value)}
              className="w-full px-3 py-2 bg-[#F1F7F6] rounded-xl border border-[#E1ECE9] text-[#173B38] outline-none"
            >
              <option value="All">All Trimesters</option>
              <option value="1st">1st Trimester (0–12 Wks)</option>
              <option value="2nd">2nd Trimester (13–27 Wks)</option>
              <option value="3rd">3rd Trimester (28–40 Wks)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Table Section */}
      <div className="bg-white rounded-2xl border border-[#E1ECE9] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FBFA] text-[#718783] font-bold uppercase tracking-wider text-[10px] border-b border-[#E1ECE9]">
              <tr>
                <th className="py-3.5 px-4">Beneficiary & RCH</th>
                <th className="py-3.5 px-4">Age / Mobile</th>
                <th className="py-3.5 px-4">Husband Name</th>
                <th className="py-3.5 px-4">LMP / EDD</th>
                <th className="py-3.5 px-4">ANC Visits & Td</th>
                <th className="py-3.5 px-4">Village / Site</th>
                <th className="py-3.5 px-4 text-center">HRP Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1ECE9]/70 text-[#173B38]">
              {filteredMothers.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <EmptyState
                      icon={SearchX}
                      title="No Pregnant Women Found"
                      description="No records matched your search or filters. Clear your filters or register a new ANC entry."
                      actionLabel="Register Pregnant Mother"
                      onAction={() => setIsAddModalOpen(true)}
                    />
                  </td>
                </tr>
              ) : (
                filteredMothers.map((mother, index) => {
                  const isHrp = mother.hrpStatus.startsWith('Yes');

                  return (
                    <motion.tr
                      key={mother.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.2 }}
                      className="hover:bg-[#F9FCFB] transition group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-sm text-[#173B38] group-hover:text-[#075E54] transition">
                          {mother.name}
                        </div>
                        <span className="font-mono text-[10px] text-[#075E54] font-semibold">#{mother.rchId}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold block">{mother.age} Yrs</span>
                        <a href={`tel:${mother.mobile}`} className="text-[11px] text-[#718783] hover:text-[#075E54] flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-[#10B981]" />
                          {mother.mobile}
                        </a>
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        {mother.husbandName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#075E54] block">EDD: {mother.edd}</span>
                        <span className="text-[10px] text-[#718783]">LMP: {mother.lmp}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                            {mother.td1.startsWith('Admin') ? 'Td-1 Done' : 'Td-1 Due'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 text-[10px] font-bold">
                            {mother.td2.startsWith('Admin') ? 'Td-2 Done' : 'Td-2 Due'}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#718783]">{mother.trimester}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold block truncate max-w-[130px]">{mother.village}</span>
                        <span className="text-[10px] text-[#718783]">ASHA: {mother.asha}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isHrp ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 inline-flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            High Risk (HRP)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewingMother(mother)}
                            title="View Profile Details"
                            className="p-1.5 rounded-lg text-[#718783] hover:text-[#075E54] hover:bg-[#E6F4F1] transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setEditingMother({ ...mother })}
                            title="Edit Pregnancy Record"
                            className="p-1.5 rounded-lg text-[#718783] hover:text-[#173B38] hover:bg-gray-100 transition"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeletingMotherId(mother.id)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg text-[#718783] hover:text-rose-600 hover:bg-rose-50 transition"
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
      </div>

      {/* MODAL: ADD PREGNANT WOMAN */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-xl overflow-hidden"
            >
              <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-emerald-300" />
                  <h3 className="text-base font-bold">New Pregnancy Registration (ANC)</h3>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-5 space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Woman Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Riya Sen"
                      value={newMotherForm.name}
                      onChange={(e) => setNewMotherForm({ ...newMotherForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Age (Years) *</label>
                    <input
                      type="number"
                      required
                      value={newMotherForm.age}
                      onChange={(e) => setNewMotherForm({ ...newMotherForm, age: parseInt(e.target.value, 10) || 20 })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Husband Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunil Sen"
                      value={newMotherForm.husbandName}
                      onChange={(e) => setNewMotherForm({ ...newMotherForm, husbandName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98261 XXXXX"
                      value={newMotherForm.mobile}
                      onChange={(e) => setNewMotherForm({ ...newMotherForm, mobile: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">LMP (Last Menstrual Period) *</label>
                    <input
                      type="date"
                      required
                      value={newMotherForm.lmp}
                      onChange={(e) => setNewMotherForm({ ...newMotherForm, lmp: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">EDD (Expected Delivery Date) *</label>
                    <input
                      type="date"
                      required
                      value={newMotherForm.edd}
                      onChange={(e) => setNewMotherForm({ ...newMotherForm, edd: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">High Risk Pregnancy (HRP)?</label>
                    <select
                      value={newMotherForm.hrpStatus}
                      onChange={(e) => setNewMotherForm({ ...newMotherForm, hrpStatus: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    >
                      <option value="No (Normal)">No (Normal)</option>
                      <option value="Yes (High Risk - Severe Anemia)">Yes (Severe Anemia Hb &lt; 9)</option>
                      <option value="Yes (High Risk - PIH / Hypertension)">Yes (PIH / High BP)</option>
                      <option value="Yes (High Risk - Previous C-Section)">Yes (Previous C-Section)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Village</label>
                    <select
                      value={newMotherForm.village}
                      onChange={(e) => setNewMotherForm({ ...newMotherForm, village: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    >
                      <option value="Pipariya">Pipariya</option>
                      <option value="Khera Basti">Khera Basti</option>
                      <option value="Pipariya Central">Pipariya Central</option>
                      <option value="Gram Panchayat">Gram Panchayat</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E1ECE9] flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border rounded-xl font-bold text-[#718783]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#075E54] text-white rounded-xl font-bold"
                  >
                    Save & Generate MCP Card
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: VIEW MOTHER PROFILE */}
      <AnimatePresence>
        {viewingMother && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-lg overflow-hidden"
            >
              <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold">Maternal Health Record: {viewingMother.name}</h3>
                  <p className="text-xs text-emerald-200">#{viewingMother.rchId} • w/o {viewingMother.husbandName}</p>
                </div>
                <button onClick={() => setViewingMother(null)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-3.5 text-xs">
                {/* ANC Progress Badges */}
                <div className="p-3 bg-[#F9FCFA] rounded-xl border border-[#E1ECE9]">
                  <span className="font-bold text-[#173B38] block mb-2">Antenatal Care (ANC) Visits Completed:</span>
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 font-bold">
                      <span className="text-[10px] block">ANC-1</span>
                      <span className="text-[9px]">Done</span>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 font-bold">
                      <span className="text-[10px] block">ANC-2</span>
                      <span className="text-[9px]">Done</span>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-800 font-bold">
                      <span className="text-[10px] block">ANC-3</span>
                      <span className="text-[9px]">Due</span>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50 text-gray-500 font-bold">
                      <span className="text-[10px] block">ANC-4</span>
                      <span className="text-[9px]">Scheduled</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-[#F4F9F8] rounded-xl text-center">
                  <div>
                    <span className="text-[#718783] text-[10px]">Hemoglobin</span>
                    <p className="font-extrabold text-sm text-[#075E54]">{viewingMother.hb || '11.2 g/dL'}</p>
                  </div>
                  <div>
                    <span className="text-[#718783] text-[10px]">Blood Pressure</span>
                    <p className="font-extrabold text-sm text-[#173B38]">{viewingMother.bp || '120/80'}</p>
                  </div>
                  <div>
                    <span className="text-[#718783] text-[10px]">Weight</span>
                    <p className="font-extrabold text-sm text-[#173B38]">{viewingMother.weight || '54 kg'}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[#E1ECE9] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#718783]">Td Immunization:</span>
                    <strong className="text-[#173B38]">{viewingMother.td1} & {viewingMother.td2}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#718783]">IFA / Calcium Provided:</span>
                    <strong className="text-[#075E54]">{viewingMother.ifaCount || 180} Red Tablets</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#718783]">Delivery Site Plan:</span>
                    <strong className="text-[#173B38]">PHC Rampur / 108 Ambulance Connected</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#F9FCFA] border-t border-[#E1ECE9] flex justify-end">
                <button
                  onClick={() => setViewingMother(null)}
                  className="px-4 py-2 bg-[#075E54] text-white rounded-xl font-bold"
                >
                  Close Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={!!deletingMotherId}
        title="Delete Pregnancy Record"
        message="Are you sure you want to remove this pregnant woman from the register? This action cannot be undone."
        confirmText="Yes, Delete Record"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingMotherId(null)}
      />
    </div>
  );
}
