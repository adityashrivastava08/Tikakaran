import React, { useState } from 'react';
import { Settings, ShieldCheck, User, Building, Save, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHealthData } from '../context/HealthDataContext';
import { useToast } from '../context/ToastContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const { anmProfile } = useHealthData();
  const toast = useToast();

  const [fullName, setFullName] = useState(user?.fullName || anmProfile.name);
  const [designation, setDesignation] = useState(user?.designation || anmProfile.role);
  const [mobile, setMobile] = useState(user?.mobile || '+91 98261 44521');
  const [subCentre, setSubCentre] = useState(user?.subCentre || anmProfile.subCentre);
  const [subCentreCode, setSubCentreCode] = useState(user?.subCentreCode || anmProfile.subCentreCode);
  const [phc, setPhc] = useState(user?.phc || anmProfile.phc);
  const [hmisPortalId, setHmisPortalId] = useState(user?.hmisPortalId || anmProfile.hmisPortalId);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success(
      "Configuration Saved!",
      "Health worker profile details and Sub-Centre configuration updated successfully."
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] flex items-center justify-center text-[#075E54]">
          <Settings className="w-6 h-6 text-[#075E54]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B38] tracking-tight">
            Settings & Sub-Centre Configuration
          </h1>
          <p className="text-xs sm:text-sm text-[#718783] mt-0.5">
            ANM Credentials, Portal Connections & Application Preferences
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-[#E1ECE9] shadow-card space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#173B38] flex items-center gap-2">
              <User className="w-4 h-4 text-[#075E54]" /> Health Worker Profile
            </h3>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#075E54] border border-emerald-200">
              Role: {user?.role || 'ANM'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[#718783] block mb-1 font-semibold">Full Name</label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E1ECE9] bg-[#F1F7F6] focus:bg-white outline-none focus:border-[#10B981]" 
              />
            </div>
            <div>
              <label className="text-[#718783] block mb-1 font-semibold">Role / Designation</label>
              <input 
                type="text" 
                value={designation} 
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E1ECE9] bg-[#F1F7F6] focus:bg-white outline-none focus:border-[#10B981]" 
              />
            </div>
            <div>
              <label className="text-[#718783] block mb-1 font-semibold">Registered Email</label>
              <input 
                type="text" 
                value={user?.email || 'anm.pipariya@mphealth.gov.in'} 
                disabled 
                className="w-full p-2.5 rounded-xl border border-[#E1ECE9] bg-gray-100 text-gray-500 cursor-not-allowed outline-none" 
              />
            </div>
            <div>
              <label className="text-[#718783] block mb-1 font-semibold">Official Contact Number</label>
              <input 
                type="text" 
                value={mobile} 
                onChange={(e) => setMobile(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E1ECE9] bg-[#F1F7F6] focus:bg-white outline-none focus:border-[#10B981]" 
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E1ECE9]">
          <h3 className="text-sm font-bold text-[#173B38] mb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-[#075E54]" /> Sub-Centre Jurisdiction & Health Facility
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[#718783] block mb-1 font-semibold">Sub-Centre Name</label>
              <input 
                type="text" 
                value={subCentre} 
                onChange={(e) => setSubCentre(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E1ECE9] bg-[#F1F7F6] focus:bg-white outline-none focus:border-[#10B981]" 
              />
            </div>
            <div>
              <label className="text-[#718783] block mb-1 font-semibold">Sub-Centre Facility Code</label>
              <input 
                type="text" 
                value={subCentreCode} 
                onChange={(e) => setSubCentreCode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E1ECE9] bg-[#F1F7F6] focus:bg-white outline-none focus:border-[#10B981]" 
              />
            </div>
            <div>
              <label className="text-[#718783] block mb-1 font-semibold">Attached PHC</label>
              <input 
                type="text" 
                value={phc} 
                onChange={(e) => setPhc(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E1ECE9] bg-[#F1F7F6] focus:bg-white outline-none focus:border-[#10B981]" 
              />
            </div>
            <div>
              <label className="text-[#718783] block mb-1 font-semibold">National HMIS Facility ID</label>
              <input 
                type="text" 
                value={hmisPortalId} 
                onChange={(e) => setHmisPortalId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E1ECE9] bg-[#F1F7F6] focus:bg-white outline-none focus:border-[#10B981]" 
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E1ECE9] flex justify-end">
          <button 
            type="submit"
            className="px-5 py-2.5 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-[#075E54]/20 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
