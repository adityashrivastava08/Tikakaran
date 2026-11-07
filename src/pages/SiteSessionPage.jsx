import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  PlayCircle, 
  X, 
  Edit3, 
  Check, 
  Building2, 
  Phone,
  Baby,
  HeartPulse
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthData } from '../context/HealthDataContext';

export default function SiteSessionPage() {
  const { sitesList, addSite, updateSite, sessionsList, addSession, updateSessionStatus } = useHealthData();

  // Tab: 'sites' | 'sessions'
  const [activeTab, setActiveTab] = useState('sessions');

  // Modals
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [notConductedModal, setNotConductedModal] = useState(null); // sessionId
  const [cancelReason, setCancelReason] = useState('');

  // New site form
  const [newSiteForm, setNewSiteForm] = useState({
    name: '',
    code: 'AWC-09',
    village: 'Pipariya',
    type: 'Anganwadi',
    asha: '',
    ashaPhone: '+91 98260 00000',
    beneficiaries: 120,
    day: '1st Wednesday'
  });

  // New session form
  const [newSessionForm, setNewSessionForm] = useState({
    siteName: 'Anganwadi Kendra Pipariya Ward-04',
    locationType: 'Anganwadi Center',
    time: '09:00 AM – 01:00 PM',
    date: '2026-11-10',
    beneficiariesCount: 25,
    pregnantWomenCount: 5,
    ashaWorker: 'Sunita Malviya',
    vaccines: ['BCG', 'Pentavalent', 'bOPV', 'fIPV', 'MR'],
    contactNumber: '+91 98261 44521'
  });

  const handleAddSite = (e) => {
    e.preventDefault();
    addSite(newSiteForm);
    setIsAddSiteOpen(false);
    setNewSiteForm({
      name: '',
      code: 'AWC-10',
      village: 'Pipariya',
      type: 'Anganwadi',
      asha: '',
      ashaPhone: '+91 98260 00000',
      beneficiaries: 120,
      day: '2nd Wednesday'
    });
  };

  const handleAddSession = (e) => {
    e.preventDefault();
    addSession(newSessionForm);
    setIsAddSessionOpen(false);
  };

  const handleConfirmNotConducted = (e) => {
    e.preventDefault();
    if (!notConductedModal) return;
    updateSessionStatus(notConductedModal, 'Not Conducted', cancelReason);
    setNotConductedModal(null);
    setCancelReason('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] flex items-center justify-center text-[#075E54]">
              <MapPin className="w-6 h-6 text-[#075E54]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B38] tracking-tight">
                Site & Session Management
              </h1>
              <p className="text-xs sm:text-sm text-[#718783] mt-0.5">
                8 Village AWCs & Outreach Centers • Routine Immunization Session Roster
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddSiteOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-[#E1ECE9] text-[#173B38] rounded-xl text-xs font-bold hover:bg-[#F1F7F6] transition shadow-soft-sm"
          >
            <Building2 className="w-4 h-4 text-[#075E54]" />
            <span>Add New Site</span>
          </button>

          <button
            onClick={() => setIsAddSessionOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#10B981]" />
            <span>Create Session</span>
          </button>
        </div>
      </div>

      {/* 2. Top View Switcher */}
      <div className="flex items-center gap-2 border-b border-[#E1ECE9] pb-2">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'sessions'
              ? 'bg-[#075E54] text-white shadow-sm'
              : 'bg-white text-[#718783] hover:text-[#173B38] border border-[#E1ECE9]'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Vaccination Sessions ({sessionsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sites')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'sites'
              ? 'bg-[#075E54] text-white shadow-sm'
              : 'bg-white text-[#718783] hover:text-[#173B38] border border-[#E1ECE9]'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Village & AWC Directory ({sitesList.length})</span>
        </button>
      </div>

      {/* 3. SESSIONS VIEW */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessionsList.map((session) => (
              <div 
                key={session.id}
                className="bg-white p-5 rounded-2xl border border-[#E1ECE9] shadow-soft-sm hover:shadow-card transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold text-[#075E54] bg-[#E6F4F1] px-2 py-0.5 rounded">
                      {session.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      session.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                      session.status === 'In Progress' ? 'bg-emerald-100 text-emerald-800 animate-pulse' :
                      session.status === 'Not Conducted' ? 'bg-rose-100 text-rose-800' :
                      'bg-teal-50 text-[#075E54]'
                    }`}>
                      {session.status === 'Completed' && <CheckCircle2 className="w-3 h-3 text-gray-500" />}
                      {session.status === 'In Progress' && <PlayCircle className="w-3 h-3 text-emerald-600" />}
                      {session.status === 'Not Conducted' && <AlertCircle className="w-3 h-3 text-rose-600" />}
                      {session.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#173B38] leading-snug">{session.siteName}</h3>
                  <p className="text-[11px] text-[#718783] mt-0.5">Location: {session.locationType}</p>

                  <div className="mt-3 p-3 bg-[#F9FCFA] rounded-xl border border-[#E1ECE9] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[#718783]">
                      <span className="flex items-center gap-1 font-semibold text-[#173B38]">
                        <CalendarIcon className="w-3 h-3 text-[#075E54]" />
                        {session.date}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-[#718783]" />
                        {session.time}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-[#E8F2EF]">
                      <span className="flex items-center gap-1 text-[#075E54] font-bold">
                        <Baby className="w-3.5 h-3.5" />
                        {session.beneficiariesCount} Children
                      </span>
                      <span className="flex items-center gap-1 text-[#0284C7] font-bold">
                        <HeartPulse className="w-3.5 h-3.5" />
                        {session.pregnantWomenCount || 4} PW
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-[#718783]">
                    <span>ASHA: <strong>{session.ashaWorker}</strong></span>
                  </div>

                  {session.reasonNotConducted && (
                    <div className="mt-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-[10px] text-rose-800 font-medium">
                      Cancellation Reason: {session.reasonNotConducted}
                    </div>
                  )}
                </div>

                {/* Status Toggles */}
                <div className="mt-4 pt-3 border-t border-[#E1ECE9] flex items-center justify-between gap-1.5 text-xs">
                  {session.status !== 'Completed' && (
                    <button
                      onClick={() => updateSessionStatus(session.id, 'Completed')}
                      className="px-2.5 py-1.5 bg-[#075E54] hover:bg-[#064C44] text-white rounded-lg font-bold flex items-center gap-1 text-[11px]"
                    >
                      <Check className="w-3 h-3" /> Mark Completed
                    </button>
                  )}

                  {session.status !== 'Not Conducted' && session.status !== 'Completed' && (
                    <button
                      onClick={() => setNotConductedModal(session.id)}
                      className="px-2 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg font-bold text-[11px]"
                    >
                      Not Conducted
                    </button>
                  )}

                  <a 
                    href={`tel:${session.contactNumber}`}
                    className="p-1.5 rounded-lg border border-[#E1ECE9] text-[#718783] hover:text-[#075E54]"
                    title="Call ASHA"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SITES DIRECTORY VIEW */}
      {activeTab === 'sites' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sitesList.map((site) => (
            <div key={site.id} className="bg-white p-5 rounded-2xl border border-[#E1ECE9] shadow-soft-sm hover:shadow-card transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E6F4F1] text-[#075E54]">
                    {site.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {site.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#173B38] leading-snug">{site.name}</h3>
                <p className="text-xs text-[#718783] mt-0.5">{site.village} • {site.type}</p>

                <div className="mt-3 p-3 bg-[#F9FCFA] rounded-xl border border-[#E1ECE9] space-y-1.5 text-xs text-[#718783]">
                  <div className="flex justify-between">
                    <span>Target Children:</span>
                    <strong className="text-[#173B38]">{site.beneficiaries}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Scheduled Day:</span>
                    <strong className="text-[#075E54]">{site.day}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Designated ASHA:</span>
                    <strong className="text-[#173B38]">{site.asha}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E1ECE9] flex items-center justify-between">
                <a href={`tel:${site.ashaPhone}`} className="text-xs font-bold text-[#075E54] hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#10B981]" /> Call ASHA
                </a>
                <button
                  onClick={() => setEditingSite({ ...site })}
                  className="p-1 text-[#718783] hover:text-[#173B38]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD NEW SITE */}
      <AnimatePresence>
        {isAddSiteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-md overflow-hidden"
            >
              <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
                <h3 className="text-base font-bold">Register New Session Site</h3>
                <button onClick={() => setIsAddSiteOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSite} className="p-5 space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Site / AWC Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anganwadi Kendra Ward-08"
                    value={newSiteForm.name}
                    onChange={(e) => setNewSiteForm({ ...newSiteForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">AWC Code</label>
                    <input
                      type="text"
                      value={newSiteForm.code}
                      onChange={(e) => setNewSiteForm({ ...newSiteForm, code: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Village</label>
                    <input
                      type="text"
                      value={newSiteForm.village}
                      onChange={(e) => setNewSiteForm({ ...newSiteForm, village: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">ASHA Worker Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunita Malviya"
                      value={newSiteForm.asha}
                      onChange={(e) => setNewSiteForm({ ...newSiteForm, asha: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">ASHA Mobile</label>
                    <input
                      type="tel"
                      value={newSiteForm.ashaPhone}
                      onChange={(e) => setNewSiteForm({ ...newSiteForm, ashaPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E1ECE9] flex justify-end gap-2.5">
                  <button type="button" onClick={() => setIsAddSiteOpen(false)} className="px-4 py-2 border rounded-xl font-bold">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-[#075E54] text-white rounded-xl font-bold">
                    Save Site
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CREATE SESSION */}
      <AnimatePresence>
        {isAddSessionOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-lg overflow-hidden"
            >
              <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
                <h3 className="text-base font-bold">Create New Vaccination Session</h3>
                <button onClick={() => setIsAddSessionOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSession} className="p-5 space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Session Site *</label>
                  <select
                    value={newSessionForm.siteName}
                    onChange={(e) => setNewSessionForm({ ...newSessionForm, siteName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                  >
                    {sitesList.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.village})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Session Date *</label>
                    <input
                      type="date"
                      required
                      value={newSessionForm.date}
                      onChange={(e) => setNewSessionForm({ ...newSessionForm, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Timing</label>
                    <input
                      type="text"
                      value={newSessionForm.time}
                      onChange={(e) => setNewSessionForm({ ...newSessionForm, time: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Target Children Count</label>
                    <input
                      type="number"
                      value={newSessionForm.beneficiariesCount}
                      onChange={(e) => setNewSessionForm({ ...newSessionForm, beneficiariesCount: parseInt(e.target.value, 10) || 20 })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Pregnant Women Count</label>
                    <input
                      type="number"
                      value={newSessionForm.pregnantWomenCount}
                      onChange={(e) => setNewSessionForm({ ...newSessionForm, pregnantWomenCount: parseInt(e.target.value, 10) || 5 })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E1ECE9] flex justify-end gap-2.5">
                  <button type="button" onClick={() => setIsAddSessionOpen(false)} className="px-4 py-2 border rounded-xl font-bold">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-[#075E54] text-white rounded-xl font-bold">
                    Publish Session Roster
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: NOT CONDUCTED REASON */}
      <AnimatePresence>
        {notConductedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-md overflow-hidden"
            >
              <div className="bg-rose-700 text-white p-5 flex items-center justify-between">
                <h3 className="text-base font-bold">Mark Session as Not Conducted</h3>
                <button onClick={() => setNotConductedModal(null)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmNotConducted} className="p-5 space-y-3 text-xs">
                <p className="text-[#718783]">
                  Please specify the official reason for not conducting the scheduled immunization session (required for HMIS Form-7 exemption note):
                </p>

                <textarea
                  required
                  rows="3"
                  placeholder="e.g. Inclement weather, village inundation, or emergency district epidemic duty"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E1ECE9] outline-none focus:border-rose-500"
                />

                <div className="pt-3 border-t border-[#E1ECE9] flex justify-end gap-2.5">
                  <button type="button" onClick={() => setNotConductedModal(null)} className="px-4 py-2 border rounded-xl font-bold">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold">
                    Confirm Exemption
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

