import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Syringe, X, Check, Calendar, MapPin, User, ShieldCheck, Thermometer, AlertCircle, Loader2 } from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import { useToast } from '../context/ToastContext';
import { vaccinationService } from '../services/vaccinationService';
import { childService } from '../services/childService';

export default function VaccinationEntryModal({ 
  isOpen, 
  onClose, 
  initialBeneficiary = null, 
  initialVaccine = null,
  onSuccess = null 
}) {
  const { childrenList, sitesList, sessionsList, recordVaccineAdministered } = useHealthData();
  const toast = useToast();

  const [selectedChildId, setSelectedChildId] = useState('');
  const [selectedVaccineId, setSelectedVaccineId] = useState('');
  const [vaccineName, setVaccineName] = useState('Pentavalent-1');
  const [doseNumber, setDoseNumber] = useState('Dose 1 (6 Weeks)');
  const [vaccinationDate, setVaccinationDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [siteName, setSiteName] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [batchNumber, setBatchNumber] = useState('LOT-2026B-99');
  const [coldChainSafe, setColdChainSafe] = useState(true);
  const [coldChainTemp, setColdChainTemp] = useState(4.2);
  const [remarks, setRemarks] = useState('');
  
  const [dbVaccines, setDbVaccines] = useState([]);
  const [dbSessions, setDbSessions] = useState([]);
  const [dbSites, setDbSites] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // 1. Fetch live UIP vaccine masters, sessions, and sites
  useEffect(() => {
    let isMounted = true;

    async function loadMasterData() {
      try {
        const [vaccines, sessions, sites] = await Promise.all([
          vaccinationService.getVaccines('CHILD').catch(() => []),
          vaccinationService.getSessions().catch(() => []),
          childService.getSites().catch(() => [])
        ]);

        if (isMounted) {
          if (vaccines && vaccines.length > 0) setDbVaccines(vaccines);
          if (sessions && sessions.length > 0) {
            setDbSessions(sessions);
            if (!selectedSessionId && sessions[0]) setSelectedSessionId(sessions[0].id);
          }
          if (sites && sites.length > 0) setDbSites(sites);
        }
      } catch (err) {
        console.warn('Could not preload live vaccination metadata:', err);
      }
    }

    if (isOpen) {
      loadMasterData();
    }

    return () => { isMounted = false; };
  }, [isOpen]);

  // 2. Prefill form state when initialBeneficiary or initialVaccine changes
  useEffect(() => {
    if (initialBeneficiary) {
      const cId = initialBeneficiary.childId || initialBeneficiary.id;
      setSelectedChildId(cId);

      if (initialBeneficiary.vaccineId) {
        setSelectedVaccineId(initialBeneficiary.vaccineId);
      }
      if (initialBeneficiary.vaccineName) {
        setVaccineName(initialBeneficiary.vaccineName);
      } else if (initialBeneficiary.dueVaccine) {
        const cleanName = initialBeneficiary.dueVaccine.split('(')[0].trim();
        setVaccineName(cleanName);
      }

      if (initialBeneficiary.dose) {
        setDoseNumber(initialBeneficiary.dose);
      }

      if (initialBeneficiary.site) {
        setSiteName(initialBeneficiary.site);
      } else if (initialBeneficiary.village) {
        setSiteName(initialBeneficiary.village);
      }

      if (initialBeneficiary.sessionId) {
        setSelectedSessionId(initialBeneficiary.sessionId);
      }
    } else if (childrenList.length > 0 && !selectedChildId) {
      setSelectedChildId(childrenList[0].id);
    }

    if (initialVaccine) {
      setVaccineName(initialVaccine);
    }
  }, [initialBeneficiary, initialVaccine, childrenList]);

  // When vaccine selection changes from dropdown, sync ID and default dose
  const handleVaccineChange = (vId) => {
    setSelectedVaccineId(vId);
    const found = dbVaccines.find(v => v.id === vId);
    if (found) {
      setVaccineName(found.name);
      setDoseNumber(found.doseLabel);
    }
  };

  if (!isOpen) return null;

  const selectedChild = childrenList.find(c => c.id === selectedChildId) || initialBeneficiary;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const targetChildId = selectedChildId || initialBeneficiary?.childId || initialBeneficiary?.id;
    if (!targetChildId) newErrors.child = "Please select a child beneficiary";
    if (!vaccineName && !selectedVaccineId) newErrors.vaccine = "Vaccine name is required";
    if (!batchNumber || !batchNumber.trim()) newErrors.batch = "Vaccine vial batch/lot number is required";
    if (!vaccinationDate) newErrors.date = "Vaccination date is required";

    const tempVal = parseFloat(coldChainTemp);
    if (isNaN(tempVal) || tempVal < 2.0 || tempVal > 8.0) {
      newErrors.temp = "Cold chain temperature must be between 2.0°C and 8.0°C";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Resolve exact vaccineId if not already set
      let finalVaccineId = selectedVaccineId || initialBeneficiary?.vaccineId;
      if (!finalVaccineId && dbVaccines.length > 0) {
        const match = dbVaccines.find(v => 
          v.name.toLowerCase().includes(vaccineName.toLowerCase()) || 
          v.code.toLowerCase().includes(vaccineName.toLowerCase())
        );
        finalVaccineId = match?.id || dbVaccines[0].id;
      }

      const payload = {
        recordId: initialBeneficiary?.recordId || initialBeneficiary?.id,
        childId: targetChildId,
        vaccineId: finalVaccineId,
        sessionId: selectedSessionId || null,
        doseGiven: doseNumber,
        administeredDate: vaccinationDate,
        batchNumber: batchNumber.trim(),
        coldChainTemp: tempVal,
        remarks: remarks || `Session recorded at ${siteName || 'Sub-Centre Booth'}`
      };

      // Call backend REST API
      const result = await vaccinationService.recordVaccination(payload);

      // Also notify local context state
      recordVaccineAdministered(targetChildId, vaccineName, doseNumber, batchNumber);

      toast.success(
        "Vaccine Dose Recorded & Synced!",
        `${vaccineName} (${doseNumber}) recorded for ${selectedChild?.name || 'beneficiary'}. U-WIN portal sync queued with lot #${batchNumber}.`
      );

      if (onSuccess) {
        onSuccess(result);
      }
      onClose();
    } catch (err) {
      console.error('[VaccinationEntryModal] Record error:', err);
      // If validation error from backend
      if (err.errors && err.errors.length > 0) {
        const backendErrors = {};
        err.errors.forEach(e => {
          backendErrors[e.field] = e.message;
        });
        setErrors(backendErrors);
      } else {
        toast.error("Failed to Record Dose", err.message || "An unexpected error occurred while saving to database.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-lg overflow-hidden relative"
      >
        {/* Modal Top Header */}
        <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
              <Syringe className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">Record Vaccination Entry</h3>
              <p className="text-xs text-emerald-200">Routine Immunization & MCP Card Update</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {/* 1. Beneficiary Picker */}
          <div>
            <label className="font-bold text-[#173B38] block mb-1">
              Child Beneficiary *
            </label>
            {initialBeneficiary ? (
              <div className="p-3 bg-[#F1F7F6] rounded-xl border border-[#E1ECE9] flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#173B38] block">{initialBeneficiary.name || initialBeneficiary.childName}</span>
                  <span className="text-[10px] text-[#718783]">
                    Mother: {initialBeneficiary.motherName} • #{initialBeneficiary.rchId || initialBeneficiary.registrationNumber}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#075E54] bg-[#E6F4F1] px-2.5 py-1 rounded-lg">
                  {initialBeneficiary.age}
                </span>
              </div>
            ) : (
              <select
                value={selectedChildId}
                onChange={(e) => {
                  setSelectedChildId(e.target.value);
                  setErrors({ ...errors, child: '' });
                }}
                className="w-full px-3.5 py-2.5 bg-[#F1F7F6] focus:bg-white rounded-xl border border-[#E1ECE9] text-[#173B38] font-medium outline-none focus:border-[#10B981] transition"
              >
                {childrenList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.age}) • Mother: {c.motherName} • #{c.rchId}
                  </option>
                ))}
              </select>
            )}
            {errors.child && <p className="text-[11px] text-rose-600 mt-1">{errors.child}</p>}
          </div>

          {/* 2. Vaccine & Dose */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#173B38] block mb-1">Vaccine Antigen *</label>
              {dbVaccines.length > 0 ? (
                <select
                  value={selectedVaccineId || dbVaccines.find(v => v.name.includes(vaccineName))?.id || ''}
                  onChange={(e) => handleVaccineChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F1F7F6] focus:bg-white rounded-xl border border-[#E1ECE9] text-[#173B38] font-medium outline-none focus:border-[#10B981]"
                >
                  {dbVaccines.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F1F7F6] focus:bg-white rounded-xl border border-[#E1ECE9] text-[#173B38] font-medium outline-none"
                />
              )}
              {errors.vaccine && <p className="text-[11px] text-rose-600 mt-1">{errors.vaccine}</p>}
            </div>

            <div>
              <label className="font-bold text-[#173B38] block mb-1">Dose Stage *</label>
              <input
                type="text"
                value={doseNumber}
                onChange={(e) => setDoseNumber(e.target.value)}
                placeholder="e.g. Dose 1 (6 Weeks)"
                className="w-full px-3 py-2.5 bg-[#F1F7F6] focus:bg-white rounded-xl border border-[#E1ECE9] text-[#173B38] font-medium outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* 3. Vaccination Date & Lot / Batch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#173B38] block mb-1">Vaccination Date *</label>
              <input
                type="date"
                required
                value={vaccinationDate}
                onChange={(e) => setVaccinationDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F1F7F6] focus:bg-white rounded-xl border border-[#E1ECE9] text-[#173B38] font-medium outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="font-bold text-[#173B38] block mb-1">Vaccine Vial Batch / Lot # *</label>
              <input
                type="text"
                required
                placeholder="e.g. PV-558-X"
                value={batchNumber}
                onChange={(e) => {
                  setBatchNumber(e.target.value);
                  setErrors({ ...errors, batch: '' });
                }}
                className="w-full px-3 py-2.5 bg-[#F1F7F6] focus:bg-white rounded-xl border border-[#E1ECE9] text-[#173B38] font-mono outline-none focus:border-[#10B981]"
              />
              {errors.batch && <p className="text-[11px] text-rose-600 mt-1">{errors.batch}</p>}
            </div>
          </div>

          {/* 4. Site & Session */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#173B38] block mb-1">Session Site</label>
              <select
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F1F7F6] focus:bg-white rounded-xl border border-[#E1ECE9] text-[#173B38] outline-none"
              >
                {(dbSites.length > 0 ? dbSites : sitesList).map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.village})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-[#173B38] block mb-1">Active Vaccination Session</label>
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F1F7F6] focus:bg-white rounded-xl border border-[#E1ECE9] text-[#173B38] outline-none"
              >
                <option value="">-- No Session (Outreach/Clinic) --</option>
                {dbSessions.map(ses => (
                  <option key={ses.id} value={ses.id}>
                    {ses.sessionDate} • {ses.siteName?.slice(0, 20)} ({ses.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Cold Chain Temperature & Quality Verification */}
          <div className="p-3 bg-[#E6F4F1] rounded-2xl border border-[#CCE8E1] space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#075E54]">
                <input
                  type="checkbox"
                  checked={coldChainSafe}
                  onChange={(e) => setColdChainSafe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#075E54] focus:ring-[#10B981]"
                />
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-[#10B981]" />
                  Cold Chain Temperature Telemetry
                </span>
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Safe Range 2.0°C - 8.0°C
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-[#173B38] font-semibold">Carrier Temp:</span>
              <input
                type="number"
                step="0.1"
                min="2.0"
                max="8.0"
                value={coldChainTemp}
                onChange={(e) => setColdChainTemp(e.target.value)}
                className="w-24 px-2 py-1 bg-white rounded-lg border border-[#CCE8E1] font-mono text-center text-xs font-bold text-[#075E54] outline-none"
              />
              <span className="text-[11px] text-[#718783]">°C (VVM Stage 1)</span>
              {errors.temp && <p className="text-[11px] text-rose-600 ml-2">{errors.temp}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#E1ECE9] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-[#E1ECE9] text-xs font-bold text-[#718783] hover:bg-[#F1F7F6] transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl text-xs font-bold shadow-md shadow-[#075E54]/20 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Recording Dose...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-[#10B981] stroke-[2.5]" />
                  <span>Record & Sync to U-WIN</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
