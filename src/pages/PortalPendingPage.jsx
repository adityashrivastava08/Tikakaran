import React, { useState } from 'react';
import { 
  CloudOff, 
  RefreshCw, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  Eye, 
  Clock, 
  Check, 
  Globe,
  Wifi,
  Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthData } from '../context/HealthDataContext';

export default function PortalPendingPage() {
  const { portalPendingList, retryPortalSync, syncAllPending, anmProfile } = useHealthData();
  const [selectedPortal, setSelectedPortal] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const filteredPending = portalPendingList.filter(item => {
    const matchesPortal = selectedPortal === 'All' || item.portal === selectedPortal;
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      item.beneficiaryName.toLowerCase().includes(q) ||
      item.beneficiaryId.includes(q) ||
      item.pendingReason.toLowerCase().includes(q) ||
      item.village.toLowerCase().includes(q);

    return matchesPortal && matchesSearch;
  });

  const handleRetry = (id, name) => {
    retryPortalSync(id);
    setToastMessage(`Retrying sync for ${name}... Uploading to national server.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSyncAll = () => {
    setIsSyncingAll(true);
    syncAllPending();
    setTimeout(() => {
      setIsSyncingAll(false);
      setToastMessage("All pending records have been successfully synchronized with U-WIN and RCH portals!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700">
              <CloudOff className="w-6 h-6 text-rose-700" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B38] tracking-tight">
                Portal Pending Synchronization
              </h1>
              <p className="text-xs sm:text-sm text-[#718783] mt-0.5">
                U-WIN, MoHFW RCH Portal & Anmol Offline Queue Tracker
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={isSyncingAll || portalPendingList.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition disabled:opacity-50 hover:shadow-md"
        >
          <RefreshCw className={`w-4 h-4 text-[#10B981] ${isSyncingAll ? 'animate-spin' : ''}`} />
          <span>{isSyncingAll ? 'Syncing All Portals...' : `Retry Sync All (${portalPendingList.length})`}</span>
        </button>
      </div>

      {/* 2. Sync Efficiency Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E1ECE9] shadow-soft-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-[#718783] font-semibold">Total Pending Records</span>
            <p className="text-2xl font-extrabold text-rose-600 mt-1">{portalPendingList.length} Entries</p>
            <span className="text-[10px] text-[#718783]">Saved safely in local device storage</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <Server className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E1ECE9] shadow-soft-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-[#718783] font-semibold">National Sync Rate</span>
            <p className="text-2xl font-extrabold text-[#075E54] mt-1">98.4%</p>
            <span className="text-[10px] text-emerald-700 font-bold">1,480 / 1,495 Records Synced</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#10B981]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E1ECE9] shadow-soft-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-[#718783] font-semibold">Server API Handshake</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">Online</p>
            <span className="text-[10px] text-emerald-700 font-bold">Latency: 42ms to MoHFW</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] flex items-center justify-center text-[#075E54]">
            <Wifi className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Search and Portal Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E1ECE9] shadow-soft-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['All', 'U-WIN', 'RCH Portal', 'Anmol MP'].map((portal) => (
            <button
              key={portal}
              onClick={() => setSelectedPortal(portal)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedPortal === portal
                  ? 'bg-[#075E54] text-white shadow-sm'
                  : 'bg-[#F1F7F6] text-[#718783] hover:text-[#173B38]'
              }`}
            >
              {portal}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#718783]" />
          <input
            type="text"
            placeholder="Search pending beneficiary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F1F7F6] rounded-xl text-xs text-[#173B38] outline-none"
          />
        </div>
      </div>

      {/* 4. Table Section */}
      <div className="bg-white rounded-2xl border border-[#E1ECE9] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FBFA] text-[#718783] font-bold uppercase tracking-wider text-[10px] border-b border-[#E1ECE9]">
              <tr>
                <th className="py-3.5 px-4">Beneficiary</th>
                <th className="py-3.5 px-4">Target Portal</th>
                <th className="py-3.5 px-4 text-center">Entry Status</th>
                <th className="py-3.5 px-4">Pending Reason / Error Message</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1ECE9]/70 text-[#173B38]">
              {filteredPending.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-[#718783]">
                    <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto mb-2" />
                    <p className="font-bold text-sm text-[#173B38]">All Portal Records Synchronized!</p>
                    <p className="text-xs text-[#718783] mt-0.5">No offline entries pending for upload to national databases.</p>
                  </td>
                </tr>
              ) : (
                filteredPending.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F9FCFB]">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-sm text-[#173B38]">{item.beneficiaryName}</div>
                      <span className="font-mono text-[10px] text-[#075E54]">#{item.beneficiaryId}</span>
                      <span className="text-[10px] text-[#718783] block">Vaccine: {item.vaccine}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-[#E6F4F1] text-[#075E54] inline-block">
                        {item.portal}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        item.entryStatus.includes('Retrying') ? 'bg-amber-100 text-amber-800 animate-pulse' :
                        item.entryStatus.includes('Failed') ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.entryStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-[11px] text-rose-700 font-medium leading-snug">
                        {item.pendingReason}
                      </div>
                      <span className="text-[10px] text-[#718783] block mt-0.5">Retries: {item.retryCount} times</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#718783] whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRetry(item.id, item.beneficiaryName)}
                        className="px-3 py-1.5 bg-[#075E54] hover:bg-[#064C44] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 ml-auto"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>Retry Sync</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sync Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 bg-[#075E54] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50 text-xs font-semibold"
          >
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

