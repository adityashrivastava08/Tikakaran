import React, { useState, useRef } from 'react';
import { 
  HardDriveDownload, 
  UploadCloud, 
  Download, 
  FileCheck2, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  FileText,
  Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthData } from '../context/HealthDataContext';

export default function BackupRestorePage() {
  const { backupRestore, generateNewBackup, restoreFromData, anmProfile } = useHealthData();
  const { lastBackupDate, totalBackups, autoBackupStatus, cloudSyncTarget, backupsList } = backupRestore;

  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRestoreSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        restoreFromData(json);
        setRestoreSuccess(true);
        setTimeout(() => {
          setRestoreSuccess(false);
          setIsRestoreModalOpen(false);
          setSelectedFile(null);
        }, 1500);
      } catch (err) {
        alert("Invalid JSON backup file. Please select a valid Tikakaran Register backup file.");
      }
    };
    reader.readAsText(selectedFile);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] flex items-center justify-center text-[#075E54]">
              <HardDriveDownload className="w-6 h-6 text-[#075E54]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B38] tracking-tight">
                Data Backup & Disaster Recovery
              </h1>
              <p className="text-xs sm:text-sm text-[#718783] mt-0.5">
                Sub-Centre Encrypted Archive • MoHFW Compliant Data Continuity
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRestoreModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-[#E1ECE9] text-[#173B38] rounded-xl text-xs font-bold hover:bg-[#F1F7F6] transition shadow-soft-sm"
          >
            <UploadCloud className="w-4 h-4 text-[#075E54]" />
            <span>Restore Backup JSON</span>
          </button>

          <button
            onClick={generateNewBackup}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Download className="w-4 h-4 text-[#10B981]" />
            <span>Generate & Export JSON Backup</span>
          </button>
        </div>
      </div>

      {/* 2. Status Information Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E1ECE9] shadow-soft-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#718783]">Last Archive Timestamp</span>
            <Clock className="w-4 h-4 text-[#075E54]" />
          </div>
          <p className="text-2xl font-extrabold text-[#173B38]">{lastBackupDate}</p>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
            Total {totalBackups} Backups on Disk
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E1ECE9] shadow-soft-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#718783]">Scheduled Auto-Archive</span>
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          </div>
          <p className="text-base font-extrabold text-[#075E54]">{autoBackupStatus}</p>
          <span className="text-[10px] text-[#718783]">Automatic snapshot taken every night</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E1ECE9] shadow-soft-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#718783]">Cloud Archive Target</span>
            <Server className="w-4 h-4 text-[#0284C7]" />
          </div>
          <p className="text-sm font-bold text-[#173B38] truncate">{cloudSyncTarget}</p>
          <span className="text-[10px] text-teal-700 font-semibold">256-Bit AES Encryption</span>
        </div>
      </div>

      {/* 3. Backup History Table */}
      <div className="bg-white rounded-2xl border border-[#E1ECE9] shadow-card overflow-hidden">
        <div className="p-4 bg-[#F8FBFA] border-b border-[#E1ECE9] flex items-center justify-between">
          <h3 className="font-bold text-xs text-[#173B38]">Verified Backup History & Checksums</h3>
          <span className="text-[11px] text-[#718783]">SHA-256 Cryptographic Integrity Tested</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F7F6] text-[#718783] uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Backup Archive Filename</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Records Included</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-center">Integrity Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1ECE9] text-[#173B38]">
              {backupsList.map((bkp) => (
                <tr key={bkp.id} className="hover:bg-[#F9FCFB]">
                  <td className="py-3.5 px-4">
                    <div className="font-bold font-mono text-[#075E54] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#10B981]" />
                      {bkp.filename}
                    </div>
                    <span className="text-[10px] text-[#718783] font-mono block pl-6">{bkp.checksum}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium whitespace-nowrap">{bkp.date}</td>
                  <td className="py-3.5 px-4 font-semibold">{bkp.size}</td>
                  <td className="py-3.5 px-4 text-[#718783]">{bkp.records}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#E6F4F1] text-[#075E54] text-[10px] font-bold">
                      {bkp.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                      <FileCheck2 className="w-3 h-3 text-emerald-600" />
                      {bkp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={generateNewBackup}
                      className="px-3 py-1.5 bg-white hover:bg-[#F1F7F6] border border-[#E1ECE9] text-[#075E54] rounded-lg text-xs font-bold transition inline-flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5 text-[#10B981]" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESTORE MODAL */}
      <AnimatePresence>
        {isRestoreModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-md overflow-hidden relative"
            >
              <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-emerald-300" />
                  <h3 className="text-base font-bold">Restore Register from Backup</h3>
                </div>
                <button onClick={() => setIsRestoreModalOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRestoreSubmit} className="p-5 space-y-4 text-xs">
                <p className="text-[#718783] leading-relaxed">
                  Select a valid `.json` backup file exported from Tikakaran Register. Restoring will safely synchronize beneficiary cohorts, vaccination histories, and session rosters.
                </p>

                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="border-2 border-dashed border-[#CCE8E1] hover:border-[#075E54] bg-[#F9FCFA] p-6 rounded-2xl text-center cursor-pointer transition"
                >
                  <UploadCloud className="w-8 h-8 text-[#075E54] mx-auto mb-2" />
                  <p className="font-bold text-[#173B38]">
                    {selectedFile ? selectedFile.name : "Click to select backup JSON file"}
                  </p>
                  <span className="text-[10px] text-[#718783]">
                    {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "Supports UTF-8 JSON archives"}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="pt-3 border-t border-[#E1ECE9] flex justify-end gap-2.5">
                  <button type="button" onClick={() => setIsRestoreModalOpen(false)} className="px-4 py-2 border rounded-xl font-bold">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedFile}
                    className="px-4 py-2 bg-[#075E54] disabled:opacity-40 text-white rounded-xl font-bold"
                  >
                    Confirm & Restore
                  </button>
                </div>
              </form>

              {restoreSuccess && (
                <div className="absolute inset-0 bg-[#075E54]/95 text-white flex flex-col items-center justify-center p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-[#10B981] mb-2" />
                  <h4 className="text-lg font-bold">Data Successfully Restored!</h4>
                  <p className="text-xs text-emerald-200 mt-1">Beneficiary registers and sessions loaded into workspace.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

