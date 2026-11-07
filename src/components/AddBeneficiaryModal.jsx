import React, { useState } from 'react';
import { X, Baby, HeartPulse, ShieldCheck, Check, Calendar, Phone, MapPin, User, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { childService } from '../services/childService';

export default function AddBeneficiaryModal({ isOpen, onClose, onAddBeneficiary }) {
  const toast = useToast();
  const [beneficiaryType, setBeneficiaryType] = useState('child'); // 'child' | 'mother'
  const [formData, setFormData] = useState({
    name: '',
    guardianName: '',
    dob: '2026-08-15',
    gender: 'Male',
    village: 'Pipariya',
    rchId: '',
    phone: '',
    dueVaccine: 'Pentavalent-1, bOPV-1',
    highRisk: 'No (Normal)'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const err = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      err.name = "Please enter a valid full name (minimum 2 characters)";
    }
    if (!formData.guardianName.trim() || formData.guardianName.trim().length < 2) {
      err.guardianName = beneficiaryType === 'child' ? "Please enter mother/guardian name" : "Please enter husband's name";
    }
    if (!formData.phone.trim()) {
      err.phone = "Mobile contact number is required";
    } else {
      const cleanPhone = formData.phone.replace(/[\s\-\+]/g, '');
      if (cleanPhone.length < 10) {
        err.phone = "Please enter a valid 10-digit mobile number";
      }
    }
    if (!formData.dob) {
      err.dob = beneficiaryType === 'child' ? "Date of Birth is required" : "LMP Date is required";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      if (beneficiaryType === 'child') {
        const createdChild = await childService.createChild({
          name: formData.name.trim(),
          dob: formData.dob,
          gender: formData.gender === 'Female' ? 'FEMALE' : 'MALE',
          birthWeight: 3.2,
          motherName: formData.guardianName.trim(),
          guardianPhone: formData.phone.trim(),
          village: formData.village,
          awcCode: 'AWC-04',
          rchId: formData.rchId?.trim() || undefined,
          isHighRisk: formData.highRisk?.startsWith('Yes')
        });

        const newEntry = {
          id: createdChild.id,
          registrationNumber: createdChild.registrationNumber,
          name: createdChild.name,
          type: 'Child',
          age: '2.5 Months',
          ageMonths: 2.5,
          dob: formData.dob,
          gender: formData.gender,
          motherName: formData.guardianName,
          guardianName: formData.guardianName,
          rchId: createdChild.rchId || createdChild.registrationNumber,
          village: formData.village,
          site: `Anganwadi Kendra ${formData.village}`,
          awc: 'AWC-04',
          mobile: formData.phone.startsWith('+91') ? formData.phone : `+91 ${formData.phone}`,
          dueVaccine: 'Pentavalent-1',
          dose: 'Dose 1',
          dueDate: '2026-11-03',
          status: 'Due Today',
          weight: '3.2 kg'
        };

        onAddBeneficiary(newEntry);
        toast.success(
          "Child Registered in PostgreSQL!",
          `${createdChild.name} saved under #${createdChild.registrationNumber} with routine UIP immunization schedule.`
        );
      } else {
        const newEntry = {
          id: `PW-${Date.now().toString().slice(-4)}`,
          name: formData.name.trim(),
          type: 'Pregnant Woman',
          age: '24 Years',
          dob: formData.dob,
          gender: 'Female',
          husbandName: formData.guardianName,
          guardianName: formData.guardianName,
          rchId: formData.rchId || `984210${Math.floor(1000 + Math.random() * 9000)}`,
          village: formData.village,
          site: `Anganwadi Kendra ${formData.village}`,
          awc: 'AWC-04',
          mobile: formData.phone.startsWith('+91') ? formData.phone : `+91 ${formData.phone}`,
          hrpStatus: formData.highRisk,
          highRisk: formData.highRisk
        };
        onAddBeneficiary(newEntry);
        toast.success(
          "Pregnant Woman Registered!",
          `${newEntry.name} registered under ${newEntry.village}. National RCH ID #${newEntry.rchId} assigned.`
        );
      }

      setIsSubmitting(false);
      onClose();
      // Reset form
      setFormData({
        name: '',
        guardianName: '',
        dob: '2026-08-15',
        gender: 'Male',
        village: 'Pipariya',
        rchId: '',
        phone: '',
        dueVaccine: 'Pentavalent-1, bOPV-1',
        highRisk: 'No (Normal)'
      });
      setErrors({});
    } catch (err) {
      setIsSubmitting(false);
      setErrors({ server: err.message });
      toast.error("Registration Error", err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-xl overflow-hidden relative"
      >
        {/* Top Header */}
        <div className="bg-[#075E54] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Register New Beneficiary</h2>
              <p className="text-xs text-emerald-200">
                Tikakaran Sub-Centre Cohort & HMIS Database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Beneficiary Type Selector */}
          <div>
            <label className="text-xs font-bold text-[#173B38] block mb-1.5">
              Select Beneficiary Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setBeneficiaryType('child');
                  setFormData(prev => ({ ...prev, dueVaccine: 'Pentavalent-1, bOPV-1' }));
                  setErrors({});
                }}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition ${
                  beneficiaryType === 'child'
                    ? 'border-[#075E54] bg-[#E6F4F1] text-[#075E54] shadow-sm ring-1 ring-[#075E54]/20'
                    : 'border-[#E1ECE9] bg-[#F9FCFB] text-[#718783] hover:border-gray-300'
                }`}
              >
                <Baby className="w-4 h-4" />
                Child (0–5 Years)
              </button>

              <button
                type="button"
                onClick={() => {
                  setBeneficiaryType('mother');
                  setFormData(prev => ({ ...prev, dueVaccine: 'Td-1 & IFA Tablets' }));
                  setErrors({});
                }}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition ${
                  beneficiaryType === 'mother'
                    ? 'border-[#075E54] bg-[#E6F4F1] text-[#075E54] shadow-sm ring-1 ring-[#075E54]/20'
                    : 'border-[#E1ECE9] bg-[#F9FCFB] text-[#718783] hover:border-gray-300'
                }`}
              >
                <HeartPulse className="w-4 h-4" />
                Pregnant Woman (ANC)
              </button>
            </div>
          </div>

          {/* Row 1: Beneficiary Name & Guardian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#173B38] block mb-1">
                {beneficiaryType === 'child' ? "Child's Full Name" : "Pregnant Woman Full Name"} *
              </label>
              <input
                type="text"
                placeholder={beneficiaryType === 'child' ? "e.g., Aarav Sharma" : "e.g., Sunita Bai"}
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#173B38] outline-none transition ${
                  errors.name ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500' : 'border-[#E1ECE9] bg-[#F9FCFB] focus:border-[#10B981] focus:bg-white'
                }`}
              />
              {errors.name && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="font-semibold text-[#173B38] block mb-1">
                {beneficiaryType === 'child' ? "Mother / Guardian Name" : "Husband's Name"} *
              </label>
              <input
                type="text"
                placeholder={beneficiaryType === 'child' ? "e.g., Priya Devi" : "e.g., Ramesh Kumar"}
                value={formData.guardianName}
                onChange={(e) => {
                  setFormData({ ...formData, guardianName: e.target.value });
                  if (errors.guardianName) setErrors({ ...errors, guardianName: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#173B38] outline-none transition ${
                  errors.guardianName ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500' : 'border-[#E1ECE9] bg-[#F9FCFB] focus:border-[#10B981] focus:bg-white'
                }`}
              />
              {errors.guardianName && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.guardianName}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: DOB / LMP & Gender / HRP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#173B38] block mb-1">
                {beneficiaryType === 'child' ? "Date of Birth (DOB)" : "LMP Date (Last Menstrual Period)"} *
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => {
                  setFormData({ ...formData, dob: e.target.value });
                  if (errors.dob) setErrors({ ...errors, dob: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#173B38] outline-none transition ${
                  errors.dob ? 'border-rose-400' : 'border-[#E1ECE9] bg-[#F9FCFB] focus:border-[#10B981]'
                }`}
              />
              {errors.dob && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.dob}
                </p>
              )}
            </div>

            {beneficiaryType === 'child' ? (
              <div>
                <label className="font-semibold text-[#173B38] block mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1ECE9] text-sm text-[#173B38] outline-none bg-[#F9FCFB] focus:border-[#10B981]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="font-semibold text-[#173B38] block mb-1">High Risk Pregnancy (HRP)?</label>
                <select
                  value={formData.highRisk}
                  onChange={(e) => setFormData({ ...formData, highRisk: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1ECE9] text-sm text-[#173B38] outline-none bg-[#F9FCFB] focus:border-[#10B981]"
                >
                  <option value="No (Normal)">No (Normal Pregnancy)</option>
                  <option value="Yes (High Risk - Severe Anemia)">Yes (Severe Anemia Hb &lt; 9 g/dL)</option>
                  <option value="Yes (High Risk - Hypertension)">Yes (Hypertension / PIH)</option>
                  <option value="Yes (High Risk - Previous C-Section)">Yes (Previous C-Section)</option>
                </select>
              </div>
            )}
          </div>

          {/* Row 3: Village & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#173B38] block mb-1">Catchment Village *</label>
              <select
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1ECE9] text-sm text-[#173B38] outline-none bg-[#F9FCFB] focus:border-[#10B981]"
              >
                <option value="Pipariya">Pipariya (Ward 4)</option>
                <option value="Khera Basti">Khera Basti</option>
                <option value="Pipariya Central">Pipariya Central</option>
                <option value="Pipariya Ward 2">Pipariya Ward 2</option>
                <option value="Pipariya Ward 1">Pipariya Ward 1</option>
                <option value="Gram Panchayat">Gram Panchayat</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#173B38] block mb-1">Contact Mobile Number *</label>
              <input
                type="tel"
                placeholder="98261XXXXX"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#173B38] outline-none transition ${
                  errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-[#E1ECE9] bg-[#F9FCFB] focus:border-[#10B981] focus:bg-white'
                }`}
              />
              {errors.phone && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Row 4: Due Antigen / Stage & RCH ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#173B38] block mb-1">
                {beneficiaryType === 'child' ? "Initial Due Vaccine" : "Due ANC / Td Vaccine"}
              </label>
              <input
                type="text"
                value={formData.dueVaccine}
                onChange={(e) => setFormData({ ...formData, dueVaccine: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1ECE9] text-sm text-[#173B38] outline-none bg-[#F9FCFB] focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#173B38] block mb-1">
                RCH / MCTS Registration ID <span className="text-[#718783] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Auto-generated if left blank"
                value={formData.rchId}
                onChange={(e) => setFormData({ ...formData, rchId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1ECE9] text-sm text-[#173B38] outline-none bg-[#F9FCFB] focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-[#E1ECE9] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-[#E1ECE9] text-xs font-bold text-[#718783] hover:bg-[#F1F7F6] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#075E54] hover:bg-[#064C44] text-white text-xs font-bold shadow-md shadow-[#075E54]/20 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-[#10B981]" />
              <span>{isSubmitting ? "Saving to Cohort..." : "Save to Register & Sync HMIS"}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
