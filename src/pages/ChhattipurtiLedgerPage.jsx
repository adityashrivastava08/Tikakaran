import React, { useState } from 'react';
import { 
  Receipt, 
  Calendar, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Award, 
  CheckCircle2, 
  X, 
  Download,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthData } from '../context/HealthDataContext';

export default function ChhattipurtiLedgerPage() {
  const { chhattipurtiLedger, addChhattipurtiTransaction, anmProfile } = useHealthData();
  const { balances, transactions } = chhattipurtiLedger;

  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimType, setClaimType] = useState('credit'); // 'credit' (earned) or 'debit' (used)
  const [claimForm, setClaimForm] = useState({
    activity: '',
    days: 1,
    remarks: '',
    approvedBy: 'Dr. A.K. Verma (MOIC Rampur PHC)'
  });

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    addChhattipurtiTransaction({
      activity: claimForm.activity,
      credit: claimType === 'credit' ? claimForm.days : 0,
      debit: claimType === 'debit' ? claimForm.days : 0,
      remarks: claimForm.remarks,
      approvedBy: claimForm.approvedBy
    });
    setIsClaimModalOpen(false);
    setClaimForm({
      activity: '',
      days: 1,
      remarks: '',
      approvedBy: 'Dr. A.K. Verma (MOIC Rampur PHC)'
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Receipt className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B38] tracking-tight">
                Chhattipurti (Compensatory Off) Ledger
              </h1>
              <p className="text-xs sm:text-sm text-[#718783] mt-0.5">
                Official Compensatory Leave Tracking for Sunday & Holiday Health Session Duties
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsClaimModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition hover:shadow-md"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Claim / Avail Chhattipurti Leave</span>
        </button>
      </div>

      {/* 2. 4 Ledger Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Opening Balance */}
        <div className="bg-white p-5 rounded-2xl border border-[#E1ECE9] shadow-soft-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#718783]">Opening Balance</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F1F7F6] text-[#173B38]">Q4 2026</span>
          </div>
          <p className="text-3xl font-extrabold text-[#173B38]">{balances.openingBalance} <span className="text-xs font-normal text-[#718783]">Days</span></p>
          <p className="text-[11px] text-[#718783] mt-1">Carried forward from Sep 2026</p>
        </div>

        {/* Earned Leave */}
        <div className="bg-white p-5 rounded-2xl border border-[#E1ECE9] shadow-soft-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#718783]">Earned Leave (+)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> Credited
            </span>
          </div>
          <p className="text-3xl font-extrabold text-[#10B981]">+{balances.earnedLeave} <span className="text-xs font-normal text-[#718783]">Days</span></p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Earned on Sunday / Holiday Duties</p>
        </div>

        {/* Used Leave */}
        <div className="bg-white p-5 rounded-2xl border border-[#E1ECE9] shadow-soft-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#718783]">Used Leave (-)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 flex items-center gap-0.5">
              <ArrowDownLeft className="w-3 h-3" /> Availed
            </span>
          </div>
          <p className="text-3xl font-extrabold text-amber-600">-{balances.usedLeave} <span className="text-xs font-normal text-[#718783]">Days</span></p>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">Availed with MOIC Sanction</p>
        </div>

        {/* Closing Balance */}
        <div className="bg-white p-5 rounded-2xl border border-[#075E54]/30 shadow-card bg-gradient-to-br from-white to-[#F4F9F8]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#075E54]">Closing Balance</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#075E54] text-white">Available Now</span>
          </div>
          <p className="text-3xl font-extrabold text-[#075E54]">{balances.closingBalance} <span className="text-xs font-bold text-[#075E54]">Days</span></p>
          <p className="text-[11px] text-[#075E54] font-medium mt-1">Valid until 31 March 2027</p>
        </div>
      </div>

      {/* 3. Transaction Ledger Table */}
      <div className="bg-white rounded-2xl border border-[#E1ECE9] shadow-card overflow-hidden">
        <div className="p-4 bg-[#F8FBFA] border-b border-[#E1ECE9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-xs text-[#173B38]">Official Leave Audit & Ledger Transactions</h3>
            <p className="text-[11px] text-[#718783]">Staff: {anmProfile.name} • Sub-Centre Pipariya (SC-49201)</p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-white border border-[#E1ECE9] rounded-xl text-xs font-bold text-[#075E54] flex items-center gap-1.5 hover:bg-[#F1F7F6]"
          >
            <Download className="w-3.5 h-3.5" /> Export Ledger Statement
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F7F6] text-[#718783] uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Tx ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Activity / Holiday Session Details</th>
                <th className="py-3 px-4 text-center">Credit (+)</th>
                <th className="py-3 px-4 text-center">Debit (-)</th>
                <th className="py-3 px-4 text-center">Net Balance</th>
                <th className="py-3 px-4">Approval Authority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1ECE9] text-[#173B38]">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#F9FCFB]">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#075E54]">{tx.id}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-medium">{tx.date}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold block text-[#173B38]">{tx.activity}</span>
                    <span className="text-[11px] text-[#718783]">{tx.remarks}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {tx.credit > 0 ? (
                      <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        +{tx.credit} Day
                      </span>
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {tx.debit > 0 ? (
                      <span className="font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        -{tx.debit} Day
                      </span>
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center font-extrabold text-[#075E54]">
                    {tx.balance} Days
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-semibold text-[#173B38] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                      {tx.approvedBy}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CLAIM OR AVAIL LEAVE */}
      <AnimatePresence>
        {isClaimModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-md overflow-hidden"
            >
              <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
                <h3 className="text-base font-bold">Chhattipurti Leave Application</h3>
                <button onClick={() => setIsClaimModalOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleClaimSubmit} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Transaction Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setClaimType('credit')}
                      className={`p-2.5 rounded-xl font-bold border transition ${
                        claimType === 'credit' ? 'bg-[#075E54] text-white' : 'border-[#E1ECE9]'
                      }`}
                    >
                      Credit (+ Earned on Holiday)
                    </button>
                    <button
                      type="button"
                      onClick={() => setClaimType('debit')}
                      className={`p-2.5 rounded-xl font-bold border transition ${
                        claimType === 'debit' ? 'bg-[#075E54] text-white' : 'border-[#E1ECE9]'
                      }`}
                    >
                      Debit (- Avail Day Off)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">
                    {claimType === 'credit' ? 'Holiday / Sunday Duty Details *' : 'Reason for Availed Off *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={claimType === 'credit' ? "e.g. Intensified Mission Indradhanush Sunday" : "e.g. Compensatory Leave for Personal Work"}
                    value={claimForm.activity}
                    onChange={(e) => setClaimForm({ ...claimForm, activity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Number of Days</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={claimForm.days}
                      onChange={(e) => setClaimForm({ ...claimForm, days: parseInt(e.target.value, 10) || 1 })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Sanctioning Officer</label>
                    <input
                      type="text"
                      value={claimForm.approvedBy}
                      onChange={(e) => setClaimForm({ ...claimForm, approvedBy: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E1ECE9] flex justify-end gap-2.5">
                  <button type="button" onClick={() => setIsClaimModalOpen(false)} className="px-4 py-2 border rounded-xl font-bold">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-[#075E54] text-white rounded-xl font-bold">
                    Submit Ledger Entry
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

