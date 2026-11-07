import React from 'react';
import { X, MapPin, Clock, Users, Syringe, CheckCircle, Phone, Calendar, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SessionDetailModal({ session, onClose }) {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-lg overflow-hidden"
      >
        <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">{session.siteName}</h3>
              <p className="text-xs text-emerald-200">Session ID: {session.id} • {session.locationType}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Status & Time */}
          <div className="grid grid-cols-2 gap-3 bg-[#F9FCFA] p-3 rounded-xl border border-[#E1ECE9]">
            <div>
              <span className="text-[#718783] block mb-0.5">Session Timing</span>
              <div className="flex items-center gap-1 font-bold text-[#173B38]">
                <Clock className="w-3.5 h-3.5 text-[#075E54]" />
                {session.time}
              </div>
            </div>
            <div>
              <span className="text-[#718783] block mb-0.5">Session Status</span>
              <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                {session.status}
              </span>
            </div>
          </div>

          {/* ASHA & Contact */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-[#E1ECE9] bg-white">
            <div>
              <span className="text-[#718783] text-[11px]">Designated ASHA Worker</span>
              <p className="font-bold text-[#173B38] text-sm flex items-center gap-1.5 mt-0.5">
                <UserCheck className="w-4 h-4 text-[#075E54]" />
                {session.ashaWorker}
              </p>
            </div>
            <a 
              href={`tel:${session.contactNumber}`}
              className="px-3 py-1.5 bg-[#E6F4F1] text-[#075E54] hover:bg-[#075E54] hover:text-white rounded-lg font-bold transition flex items-center gap-1"
            >
              <Phone className="w-3 h-3" /> Call ASHA
            </a>
          </div>

          {/* Vaccines Available */}
          <div>
            <span className="font-bold text-[#173B38] block mb-1.5 flex items-center gap-1">
              <Syringe className="w-3.5 h-3.5 text-[#075E54]" />
              Vaccines Stocked in Cold Box
            </span>
            <div className="flex flex-wrap gap-1.5">
              {session.vaccines?.map((vac, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-[#F1F7F6] text-[#075E54] rounded-lg font-semibold border border-[#E1ECE9]">
                  {vac}
                </span>
              ))}
            </div>
          </div>

          {/* Beneficiary Stats */}
          <div className="bg-[#E6F4F1] p-3.5 rounded-xl border border-[#CCE8E1] flex items-center justify-between">
            <div>
              <span className="text-[#075E54] font-medium">Session Beneficiaries</span>
              <div className="text-xl font-extrabold text-[#173B38]">
                {session.beneficiariesDone || 0} / {session.beneficiariesCount} Done
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-sm">
                Roster Synced
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#E1ECE9] bg-[#F9FCFA] flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-[#075E54] text-white rounded-xl text-xs font-bold hover:bg-[#064C44] transition"
          >
            Close Window
          </button>
        </div>
      </motion.div>
    </div>
  );
}

