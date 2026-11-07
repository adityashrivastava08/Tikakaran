import React, { useState } from 'react';
import { 
  Stethoscope, 
  Heart, 
  Pill, 
  Activity, 
  Video, 
  Sparkles, 
  TestTubes, 
  Plus, 
  CheckCircle2, 
  X, 
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthData } from '../context/HealthDataContext';

export default function HealthServicesPage() {
  const { healthServices, addServiceEntry } = useHealthData();
  const [activeSection, setActiveSection] = useState('family-planning');
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [entryCategory, setEntryCategory] = useState('test'); // 'test' | 'ncd' | 'telemedicine'

  // Entry Form state
  const [testForm, setTestForm] = useState({
    testName: 'Hemoglobin (Sahli/Hemocue)',
    beneficiary: '',
    result: '11.4 g/dL',
    status: 'Normal',
    date: '2026-11-03'
  });

  const [ncdForm, setNcdForm] = useState({
    name: '',
    age: 45,
    gender: 'Male',
    village: 'Pipariya',
    bp: '128/84 mmHg',
    rbs: '130 mg/dL',
    screening: 'Normal Blood Pressure',
    referral: 'None',
    date: '2026-11-03'
  });

  const [teleForm, setTeleForm] = useState({
    patient: '',
    doctor: 'Dr. A.K. Verma (MBBS, Rampur PHC)',
    date: '2026-11-03',
    diagnosis: '',
    status: 'Completed'
  });

  const handleEntrySubmit = (e) => {
    e.preventDefault();
    if (entryCategory === 'test') {
      addServiceEntry('test', { id: `TST-${Date.now().toString().slice(-4)}`, ...testForm });
    } else if (entryCategory === 'ncd') {
      addServiceEntry('ncd', { id: `NCD-${Date.now().toString().slice(-4)}`, ...ncdForm });
    } else if (entryCategory === 'telemedicine') {
      addServiceEntry('telemedicine', { id: `TM-${Date.now().toString().slice(-4)}`, ...teleForm });
    }
    setIsEntryModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] flex items-center justify-center text-[#075E54]">
              <Stethoscope className="w-6 h-6 text-[#075E54]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B38] tracking-tight">
                Health Services & Diagnostics
              </h1>
              <p className="text-xs sm:text-sm text-[#718783] mt-0.5">
                Sub-Centre Clinical Services, Nutrition Commodities, NCD & e-Sanjeevani
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEntryModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition hover:shadow-md"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Record Health Service / Test</span>
        </button>
      </div>

      {/* 2. Top Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#E1ECE9] shadow-soft-sm">
          <span className="text-[10px] text-[#718783] font-semibold block">Family Planning Users</span>
          <p className="text-xl font-extrabold text-[#173B38] mt-0.5">{healthServices.stats.familyPlanningUsers}</p>
          <span className="text-[9px] text-emerald-700 font-bold">+18 This Mo</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#E1ECE9] shadow-soft-sm">
          <span className="text-[10px] text-[#718783] font-semibold block">Supplements Given</span>
          <p className="text-xl font-extrabold text-[#075E54] mt-0.5">{healthServices.stats.supplementsDistributed}</p>
          <span className="text-[9px] text-teal-700 font-bold">IFA & Vit-A</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#E1ECE9] shadow-soft-sm">
          <span className="text-[10px] text-[#718783] font-semibold block">NCD Screenings (30+)</span>
          <p className="text-xl font-extrabold text-[#173B38] mt-0.5">{healthServices.stats.ncdScreenings}</p>
          <span className="text-[9px] text-blue-700 font-bold">BP & Diabetes</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#E1ECE9] shadow-soft-sm">
          <span className="text-[10px] text-[#718783] font-semibold block">Telemedicine Consults</span>
          <p className="text-xl font-extrabold text-[#0284C7] mt-0.5">{healthServices.stats.telemedicineConsults}</p>
          <span className="text-[9px] text-sky-700 font-bold">e-Sanjeevani</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#E1ECE9] shadow-soft-sm">
          <span className="text-[10px] text-[#718783] font-semibold block">Bhavya Health Synced</span>
          <p className="text-xl font-extrabold text-emerald-700 mt-0.5">{healthServices.stats.bhavyaSyncedRecords}</p>
          <span className="text-[9px] text-emerald-700 font-bold">Digital ABHA</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#E1ECE9] shadow-soft-sm">
          <span className="text-[10px] text-[#718783] font-semibold block">Diagnostics Conducted</span>
          <p className="text-xl font-extrabold text-[#D97706] mt-0.5">{healthServices.stats.diagnosticTestsConducted}</p>
          <span className="text-[9px] text-amber-700 font-bold">RDT & Urine</span>
        </div>
      </div>

      {/* 3. Section Selector Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#E1ECE9] pb-2">
        {[
          { id: 'family-planning', label: 'Family Planning & Contraceptives', icon: Heart },
          { id: 'supplements', label: 'Supplements & Commodity Stock', icon: Pill },
          { id: 'ncd', label: 'NCD Screenings (BP & Sugar)', icon: Activity },
          { id: 'telemedicine', label: 'Telemedicine (e-Sanjeevani)', icon: Video },
          { id: 'bhavya', label: 'Bhavya Health Portal Records', icon: Sparkles },
          { id: 'tests', label: 'Diagnostics & Rapid Tests', icon: TestTubes }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                isActive
                  ? 'bg-[#075E54] text-white shadow-sm'
                  : 'bg-white text-[#718783] hover:text-[#173B38] border border-[#E1ECE9]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. CONTENT SECTIONS */}
      {/* A: FAMILY PLANNING & CONTRACEPTIVES */}
      {activeSection === 'family-planning' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Condoms (Nirodh)", users: 160, stock: "650 pcs", desc: "Spacing commodity distributed via ASHAs", color: "bg-blue-50 text-blue-800" },
            { name: "Chhaya (Centchroman)", users: 65, stock: "95 strips", desc: "Non-hormonal weekly oral contraceptive pill", color: "bg-purple-50 text-purple-800" },
            { name: "Antara Injections (MPA)", users: 28, stock: "28 vials", desc: "3-Month injectable contraceptive given at SC", color: "bg-teal-50 text-teal-800" },
            { name: "Mala-N (Combined OCP)", users: 89, stock: "140 cycles", desc: "Daily oral contraceptive for eligible couples", color: "bg-emerald-50 text-emerald-800" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-[#E1ECE9] shadow-soft-sm flex flex-col justify-between">
              <div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.color}`}>
                  {item.users} Active Couples
                </span>
                <h3 className="font-bold text-sm text-[#173B38] mt-2">{item.name}</h3>
                <p className="text-[11px] text-[#718783] mt-1">{item.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E1ECE9] flex justify-between items-center text-xs">
                <span className="text-[#718783]">Current Sub-Centre Stock:</span>
                <strong className="text-[#075E54]">{item.stock}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* B: SUPPLEMENTS & COMMODITY STOCK */}
      {activeSection === 'supplements' && (
        <div className="bg-white rounded-2xl border border-[#E1ECE9] shadow-card overflow-hidden">
          <div className="p-4 bg-[#F8FBFA] border-b border-[#E1ECE9] flex justify-between items-center">
            <span className="font-bold text-xs text-[#173B38]">Sub-Centre Medical Store & Drug Stock Register</span>
            <span className="text-[11px] text-[#075E54] font-semibold">Cold Chain & Drug Shelf Verified</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F7F6] text-[#718783] uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Commodity / Supplement</th>
                <th className="py-3 px-4">Therapeutic Category</th>
                <th className="py-3 px-4">Available In-Stock</th>
                <th className="py-3 px-4">Minimum Buffer</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1ECE9] text-[#173B38]">
              {healthServices.commoditiesStock.map((com, i) => (
                <tr key={i} className="hover:bg-[#F9FCFB]">
                  <td className="py-3 px-4 font-bold text-[#173B38]">{com.name}</td>
                  <td className="py-3 px-4 text-[#718783]">{com.category}</td>
                  <td className="py-3 px-4 font-extrabold text-[#075E54]">{com.stock}</td>
                  <td className="py-3 px-4 text-[#718783]">{com.minLevel}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {com.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* C: NCD SCREENINGS */}
      {activeSection === 'ncd' && (
        <div className="bg-white rounded-2xl border border-[#E1ECE9] shadow-card overflow-hidden">
          <div className="p-4 bg-[#F8FBFA] border-b border-[#E1ECE9]">
            <span className="font-bold text-xs text-[#173B38]">National NCD Portal Population Based Screening (30+ Years)</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F7F6] text-[#718783] uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Individual Name</th>
                <th className="py-3 px-4">Age / Gender</th>
                <th className="py-3 px-4">Village</th>
                <th className="py-3 px-4">Blood Pressure (BP)</th>
                <th className="py-3 px-4">Random Blood Sugar</th>
                <th className="py-3 px-4">Screening Result</th>
                <th className="py-3 px-4">Action / Referral</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1ECE9] text-[#173B38]">
              {healthServices.ncdScreeningsList.map((ncd) => (
                <tr key={ncd.id} className="hover:bg-[#F9FCFB]">
                  <td className="py-3 px-4 font-bold">{ncd.name}</td>
                  <td className="py-3 px-4">{ncd.age} Yrs • {ncd.gender}</td>
                  <td className="py-3 px-4">{ncd.village}</td>
                  <td className="py-3 px-4 font-mono font-bold text-rose-700">{ncd.bp}</td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-700">{ncd.rbs}</td>
                  <td className="py-3 px-4 font-medium">{ncd.screening}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#E6F4F1] text-[#075E54] font-bold text-[10px]">
                      {ncd.referral}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* D: TELEMEDICINE */}
      {activeSection === 'telemedicine' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[#075E54] to-[#0D7E71] p-5 rounded-2xl text-white flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">e-Sanjeevani HWC</span>
              <h3 className="text-lg font-bold mt-1">Teleconsultation Hub Connected: PHC Rampur</h3>
              <p className="text-xs text-emerald-100">Live Doctor Video Link available for high risk mothers & complex pediatric cases</p>
            </div>
            <button className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 rounded-xl text-xs font-bold shadow-md transition">
              Connect Doctor Call
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E1ECE9] p-4 shadow-card">
            <h4 className="font-bold text-xs text-[#173B38] mb-3">Recent Completed Teleconsultations</h4>
            <div className="divide-y divide-[#E1ECE9] text-xs">
              {healthServices.telemedicineList.map((tm) => (
                <div key={tm.id} className="py-3 flex items-start justify-between">
                  <div>
                    <span className="font-bold text-[#173B38] text-sm">{tm.patient}</span>
                    <p className="text-[#718783] text-[11px] mt-0.5">Doctor: {tm.doctor} • {tm.date}</p>
                    <p className="text-[#075E54] font-medium mt-1">Advice: {tm.diagnosis}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {tm.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* E: BHAVYA */}
      {activeSection === 'bhavya' && (
        <div className="bg-white rounded-2xl border border-[#E1ECE9] p-6 shadow-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F4F1] flex items-center justify-center text-[#075E54]">
              <Sparkles className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#173B38]">Bhavya Health Portal (ABHA / ABDM Sync)</h3>
              <p className="text-xs text-[#718783]">Ayushman Bharat Digital Mission automated synchronization module</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-[#F9FCFA] rounded-xl border border-[#E1ECE9]">
              <span className="text-xs text-[#718783]">ABHA IDs Created</span>
              <p className="text-2xl font-extrabold text-[#075E54] mt-1">984</p>
              <span className="text-[10px] text-emerald-700 font-bold">78.7% Catchment</span>
            </div>
            <div className="p-4 bg-[#F9FCFA] rounded-xl border border-[#E1ECE9]">
              <span className="text-xs text-[#718783]">Records Linked</span>
              <p className="text-2xl font-extrabold text-[#173B38] mt-1">480 Records</p>
              <span className="text-[10px] text-teal-700 font-bold">EHR Verified</span>
            </div>
            <div className="p-4 bg-[#F9FCFA] rounded-xl border border-[#E1ECE9]">
              <span className="text-xs text-[#718783]">Portal Sync Status</span>
              <p className="text-2xl font-extrabold text-[#10B981] mt-1">Operational</p>
              <span className="text-[10px] text-emerald-700 font-bold">API v2.4 Active</span>
            </div>
          </div>
        </div>
      )}

      {/* F: DIAGNOSTIC TESTS */}
      {activeSection === 'tests' && (
        <div className="bg-white rounded-2xl border border-[#E1ECE9] shadow-card overflow-hidden">
          <div className="p-4 bg-[#F8FBFA] border-b border-[#E1ECE9]">
            <span className="font-bold text-xs text-[#173B38]">Sub-Centre Point of Care Rapid Diagnostics Log</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F7F6] text-[#718783] uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Test ID</th>
                <th className="py-3 px-4">Diagnostic Name</th>
                <th className="py-3 px-4">Beneficiary</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Result Value</th>
                <th className="py-3 px-4 text-center">Clinical Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1ECE9] text-[#173B38]">
              {healthServices.testRecords.map((t) => (
                <tr key={t.id} className="hover:bg-[#F9FCFB]">
                  <td className="py-3 px-4 font-mono font-bold text-[#075E54]">{t.id}</td>
                  <td className="py-3 px-4 font-bold">{t.testName}</td>
                  <td className="py-3 px-4">{t.beneficiary}</td>
                  <td className="py-3 px-4 text-[#718783]">{t.date}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#173B38]">{t.result}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F4F1] text-[#075E54]">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL: RECORD SERVICE / TEST */}
      <AnimatePresence>
        {isEntryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-lg overflow-hidden"
            >
              <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
                <h3 className="text-base font-bold">Record Clinical Service or Rapid Test</h3>
                <button onClick={() => setIsEntryModalOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEntrySubmit} className="p-5 space-y-3.5 text-xs">
                {/* Category switch */}
                <div>
                  <label className="font-semibold block mb-1">Select Service Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setEntryCategory('test')}
                      className={`p-2 rounded-xl font-bold border transition ${entryCategory === 'test' ? 'bg-[#075E54] text-white' : 'border-[#E1ECE9]'}`}
                    >
                      Rapid Lab Test
                    </button>
                    <button
                      type="button"
                      onClick={() => setEntryCategory('ncd')}
                      className={`p-2 rounded-xl font-bold border transition ${entryCategory === 'ncd' ? 'bg-[#075E54] text-white' : 'border-[#E1ECE9]'}`}
                    >
                      NCD Screening
                    </button>
                    <button
                      type="button"
                      onClick={() => setEntryCategory('telemedicine')}
                      className={`p-2 rounded-xl font-bold border transition ${entryCategory === 'telemedicine' ? 'bg-[#075E54] text-white' : 'border-[#E1ECE9]'}`}
                    >
                      Telemedicine
                    </button>
                  </div>
                </div>

                {entryCategory === 'test' && (
                  <>
                    <div>
                      <label className="font-semibold block mb-1">Test Type</label>
                      <select
                        value={testForm.testName}
                        onChange={(e) => setTestForm({ ...testForm, testName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                      >
                        <option value="Hemoglobin (Sahli/Hemocue)">Hemoglobin (Sahli/Hemocue)</option>
                        <option value="Urine Albumin & Sugar">Urine Albumin & Sugar</option>
                        <option value="Pregnancy Test (Nischay Kit)">Pregnancy Test (Nischay Kit)</option>
                        <option value="Malaria RDT">Malaria RDT</option>
                        <option value="Blood Glucose (Glucometer)">Blood Glucose (Glucometer)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Beneficiary Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Riya Sen"
                        value={testForm.beneficiary}
                        onChange={(e) => setTestForm({ ...testForm, beneficiary: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold block mb-1">Result Value</label>
                        <input
                          type="text"
                          value={testForm.result}
                          onChange={(e) => setTestForm({ ...testForm, result: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Interpretation</label>
                        <input
                          type="text"
                          value={testForm.status}
                          onChange={(e) => setTestForm({ ...testForm, status: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {entryCategory === 'ncd' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold block mb-1">Individual Name *</label>
                        <input
                          type="text"
                          required
                          value={ncdForm.name}
                          onChange={(e) => setNcdForm({ ...ncdForm, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Age</label>
                        <input
                          type="number"
                          value={ncdForm.age}
                          onChange={(e) => setNcdForm({ ...ncdForm, age: parseInt(e.target.value, 10) || 40 })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold block mb-1">Blood Pressure (mmHg)</label>
                        <input
                          type="text"
                          value={ncdForm.bp}
                          onChange={(e) => setNcdForm({ ...ncdForm, bp: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Random Blood Sugar (mg/dL)</label>
                        <input
                          type="text"
                          value={ncdForm.rbs}
                          onChange={(e) => setNcdForm({ ...ncdForm, rbs: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {entryCategory === 'telemedicine' && (
                  <>
                    <div>
                      <label className="font-semibold block mb-1">Patient Name</label>
                      <input
                        type="text"
                        required
                        value={teleForm.patient}
                        onChange={(e) => setTeleForm({ ...teleForm, patient: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Doctor Advice / Prescription</label>
                      <textarea
                        rows="2"
                        value={teleForm.diagnosis}
                        onChange={(e) => setTeleForm({ ...teleForm, diagnosis: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E1ECE9] outline-none"
                      />
                    </div>
                  </>
                )}

                <div className="pt-3 border-t border-[#E1ECE9] flex justify-end gap-2.5">
                  <button type="button" onClick={() => setIsEntryModalOpen(false)} className="px-4 py-2 border rounded-xl font-bold">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-[#075E54] text-white rounded-xl font-bold">
                    Save Service Record
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

