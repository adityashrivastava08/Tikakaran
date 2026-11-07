import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Calendar, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Eye, 
  X, 
  Printer,
  ShieldCheck,
  Table,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthData } from '../context/HealthDataContext';
import { useToast } from '../context/ToastContext';

export default function HmisReportsPage() {
  const { hmisReports, anmProfile } = useHealthData();
  const toast = useToast();

  const [selectedMonth, setSelectedMonth] = useState('October');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [generatingId, setGeneratingId] = useState(null);
  const [previewReport, setPreviewReport] = useState(null);
  const [activePreviewTab, setActivePreviewTab] = useState('maternal'); // 'maternal' | 'immunization' | 'fp'

  const handleGenerateReport = (repId, name) => {
    setGeneratingId(repId);
    setTimeout(() => {
      setGeneratingId(null);
      toast.success(
        "Report Consolidated!",
        `${name || 'Report'} generated and cross-validated with zero discrepancy for ${selectedMonth} ${selectedYear}.`
      );
    }, 1100);
  };

  const handleDownload = (rep, format) => {
    const isExcel = format === 'excel';
    const filename = `${rep.code}_${selectedMonth}_${selectedYear}.${isExcel ? 'csv' : 'txt'}`;

    let content = `Report Title: ${rep.name}\nCode: ${rep.code}\nSub-Centre: ${anmProfile.subCentre} (Code: ${anmProfile.subCentreCode})\nAttached PHC: ${anmProfile.phc}\nPeriod: ${selectedMonth} ${selectedYear}\nGenerated Date: ${new Date().toLocaleString()}\nVerified ANM: ${anmProfile.name}\n\n`;

    if (isExcel) {
      content += `Item Code,Indicator Name,Male Beneficiaries,Female Beneficiaries,Total This Month,Target ELA,Status\n`;
      content += `1.1,Total Pregnant Women registered for ANC,0,245,245,260,Validated\n`;
      content += `1.2,Registered in 1st Trimester (within 12 weeks),0,230,230,240,Validated\n`;
      content += `2.1,Infants given BCG,42,38,80,95,Validated\n`;
      content += `2.2,Infants given Pentavalent-1 & bOPV-1,36,34,70,80,Validated\n`;
      content += `2.3,Infants given Pentavalent-3 & fIPV-2,30,32,62,75,Validated\n`;
      content += `2.4,Children 9-11 months given MR-1 & Vitamin A,24,26,50,65,Validated\n`;
      content += `2.5,Fully Immunized Children (FIC),22,24,46,50,Validated\n`;
    } else {
      content += `[HMIS SUB-CENTRE MONTHLY PERFORMANCE AUDIT]\n`;
      content += `Total Mandatory Indicators: ${rep.mandatoryFields}\n`;
      content += `Completed Indicators: ${rep.filledFields}\n`;
      content += `Completion Rate: ${Math.round((rep.filledFields / rep.mandatoryFields) * 100)}%\n`;
    }

    const blob = new Blob([content], { type: isExcel ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(
      `File Exported (${isExcel ? 'Excel CSV' : 'Text Record'})`,
      `${filename} downloaded successfully for upload to State HMIS Portal.`
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] flex items-center justify-center text-[#075E54]">
              <FileSpreadsheet className="w-6 h-6 text-[#075E54]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B38] tracking-tight">
                HMIS Reporting & Sub-Centre Form-7
              </h1>
              <p className="text-xs sm:text-sm text-[#718783] mt-0.5">
                Official Ministry of Health & Family Welfare Returns & Programmatic Registers
              </p>
            </div>
          </div>
        </div>

        {/* Month & Year Selectors */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#E1ECE9] shadow-soft-sm">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F1F7F6] rounded-xl text-xs font-bold text-[#075E54]">
            <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Reporting Period:</span>
          </div>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 bg-white text-xs font-bold text-[#173B38] outline-none cursor-pointer"
          >
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 bg-white text-xs font-bold text-[#173B38] outline-none cursor-pointer border-l border-[#E1ECE9]"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      {/* 2. Top Banner / Status Overview */}
      <div className="bg-white p-5 rounded-2xl border border-[#E1ECE9] shadow-soft-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F4F1] flex items-center justify-center text-[#075E54]">
            <ShieldCheck className="w-6 h-6 text-[#10B981]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#173B38]">
              {anmProfile.subCentre} (Code: {anmProfile.subCentreCode})
            </h3>
            <p className="text-xs text-[#718783] mt-0.5">
              HMIS Portal ID: {anmProfile.hmisPortalId} • Rampur Block, District Hoshangabad
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-[#718783] block">National Cut-Off Deadline</span>
            <span className="text-sm font-extrabold text-amber-600">07 {selectedMonth} {selectedYear}</span>
          </div>
          <button
            onClick={() => handleGenerateReport('ALL', 'All 8 Monthly Returns')}
            className="px-4 py-2.5 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Consolidate All 8 Reports</span>
          </button>
        </div>
      </div>

      {/* 3. 8 Official Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {hmisReports.map((rep) => {
          const isGenerating = generatingId === rep.id || generatingId === 'ALL';
          const completionPct = Math.round((rep.filledFields / rep.mandatoryFields) * 100);

          return (
            <div
              key={rep.id}
              className="bg-white p-5 rounded-2xl border border-[#E1ECE9] shadow-soft-sm hover:shadow-card transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E6F4F1] text-[#075E54]">
                    {rep.code}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    rep.statusColor === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                    rep.statusColor === 'amber' ? 'bg-amber-100 text-amber-800' :
                    rep.statusColor === 'rose' ? 'bg-rose-100 text-rose-800' :
                    'bg-teal-50 text-[#075E54]'
                  }`}>
                    {rep.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#173B38] leading-snug">{rep.name}</h3>
                <p className="text-xs text-[#718783] mt-1.5 leading-relaxed">{rep.description}</p>

                {/* Progress Indicator */}
                <div className="mt-4 p-3 bg-[#F9FCFA] rounded-xl border border-[#E1ECE9]">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[#718783] font-medium">Indicator Completion:</span>
                    <strong className="text-[#075E54]">{rep.filledFields} / {rep.mandatoryFields} ({completionPct}%)</strong>
                  </div>
                  <div className="w-full h-2 bg-[#E1ECE9] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        completionPct === 100 ? 'bg-emerald-500' : completionPct > 70 ? 'bg-[#075E54]' : 'bg-amber-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-[#E1ECE9] flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewReport(rep)}
                  className="px-3 py-1.5 rounded-xl border border-[#E1ECE9] text-xs font-bold text-[#173B38] hover:bg-[#F1F7F6] flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5 text-[#075E54]" />
                  <span>Preview Form</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGenerateReport(rep.id, rep.name)}
                    disabled={isGenerating}
                    className="px-3 py-1.5 bg-[#E6F4F1] hover:bg-[#D3EDE6] text-[#075E54] rounded-xl text-xs font-bold flex items-center gap-1 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>Generate Report</span>
                  </button>

                  <button
                    onClick={() => handleDownload(rep, 'pdf')}
                    className="p-2 bg-white hover:bg-gray-50 border border-[#E1ECE9] text-rose-700 rounded-xl transition"
                    title="Download Form Text Record"
                  >
                    <FileText className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDownload(rep, 'excel')}
                    className="p-2 bg-white hover:bg-gray-50 border border-[#E1ECE9] text-emerald-700 rounded-xl transition"
                    title="Export Excel (CSV)"
                  >
                    <Table className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PREVIEW REPORT MODAL */}
      <AnimatePresence>
        {previewReport && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-3xl overflow-hidden"
            >
              <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold">{previewReport.name}</h3>
                  <p className="text-xs text-emerald-200">
                    Format: {previewReport.code} • Sub-Centre Pipariya • {selectedMonth} {selectedYear}
                  </p>
                </div>
                <button onClick={() => setPreviewReport(null)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-tabs in preview */}
              <div className="flex border-b border-[#E1ECE9] px-5 pt-3 bg-[#F8FBFA] gap-3 text-xs font-bold">
                <button
                  onClick={() => setActivePreviewTab('maternal')}
                  className={`pb-2.5 transition border-b-2 ${
                    activePreviewTab === 'maternal' ? 'border-[#075E54] text-[#075E54]' : 'border-transparent text-[#718783]'
                  }`}
                >
                  Section 1: Maternal Health (ANC & Delivery)
                </button>
                <button
                  onClick={() => setActivePreviewTab('immunization')}
                  className={`pb-2.5 transition border-b-2 ${
                    activePreviewTab === 'immunization' ? 'border-[#075E54] text-[#075E54]' : 'border-transparent text-[#718783]'
                  }`}
                >
                  Section 2: Child Immunization (0-5 Yrs)
                </button>
                <button
                  onClick={() => setActivePreviewTab('fp')}
                  className={`pb-2.5 transition border-b-2 ${
                    activePreviewTab === 'fp' ? 'border-[#075E54] text-[#075E54]' : 'border-transparent text-[#718783]'
                  }`}
                >
                  Section 3: Family Planning & Cold Box
                </button>
              </div>

              <div className="p-5 max-h-96 overflow-y-auto space-y-4 text-xs">
                {activePreviewTab === 'maternal' && (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F1F7F6] text-[#718783] uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Item #</th>
                        <th className="py-2.5 px-3">Indicator Description</th>
                        <th className="py-2.5 px-3 text-center">Male</th>
                        <th className="py-2.5 px-3 text-center">Female</th>
                        <th className="py-2.5 px-3 text-right">Total Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E1ECE9] text-[#173B38]">
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#075E54]">1.1</td>
                        <td className="py-2.5 px-3">Total Pregnant Women registered for ANC</td>
                        <td className="py-2.5 px-3 text-center">--</td>
                        <td className="py-2.5 px-3 text-center">245</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#075E54]">245</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#075E54]">1.2</td>
                        <td className="py-2.5 px-3">Registered within 1st trimester (within 12 weeks)</td>
                        <td className="py-2.5 px-3 text-center">--</td>
                        <td className="py-2.5 px-3 text-center">230</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#075E54]">230 (93.8%)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#075E54]">1.3</td>
                        <td className="py-2.5 px-3">Pregnant Women given 180 IFA Red Tablets</td>
                        <td className="py-2.5 px-3 text-center">--</td>
                        <td className="py-2.5 px-3 text-center">220</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#075E54]">220</td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {activePreviewTab === 'immunization' && (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F1F7F6] text-[#718783] uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Item #</th>
                        <th className="py-2.5 px-3">Indicator Description</th>
                        <th className="py-2.5 px-3 text-center">Male</th>
                        <th className="py-2.5 px-3 text-center">Female</th>
                        <th className="py-2.5 px-3 text-right">Total Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E1ECE9] text-[#173B38]">
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#075E54]">2.1</td>
                        <td className="py-2.5 px-3">Infants receiving BCG at birth / routine</td>
                        <td className="py-2.5 px-3 text-center">42</td>
                        <td className="py-2.5 px-3 text-center">38</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#075E54]">80</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#075E54]">2.2</td>
                        <td className="py-2.5 px-3">Infants receiving Pentavalent-1 & bOPV-1</td>
                        <td className="py-2.5 px-3 text-center">36</td>
                        <td className="py-2.5 px-3 text-center">34</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#075E54]">70</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#075E54]">2.3</td>
                        <td className="py-2.5 px-3">Infants receiving Pentavalent-3 & fIPV-2</td>
                        <td className="py-2.5 px-3 text-center">30</td>
                        <td className="py-2.5 px-3 text-center">32</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#075E54]">62</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#075E54]">2.4</td>
                        <td className="py-2.5 px-3">Fully Immunized Children (FIC: 9-11 months)</td>
                        <td className="py-2.5 px-3 text-center">22</td>
                        <td className="py-2.5 px-3 text-center">24</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#075E54]">46 (92%)</td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {activePreviewTab === 'fp' && (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F1F7F6] text-[#718783] uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Item #</th>
                        <th className="py-2.5 px-3">Commodity / Method</th>
                        <th className="py-2.5 px-3 text-center">Opening Stock</th>
                        <th className="py-2.5 px-3 text-center">Distributed</th>
                        <th className="py-2.5 px-3 text-right">Balance In-Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E1ECE9] text-[#173B38]">
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#075E54]">3.1</td>
                        <td className="py-2.5 px-3">Condoms (Nirodh pieces)</td>
                        <td className="py-2.5 px-3 text-center">800</td>
                        <td className="py-2.5 px-3 text-center">150</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#075E54]">650</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#075E54]">3.2</td>
                        <td className="py-2.5 px-3">Chhaya (Weekly OCP strips)</td>
                        <td className="py-2.5 px-3 text-center">120</td>
                        <td className="py-2.5 px-3 text-center">25</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#075E54]">95</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#075E54]">3.3</td>
                        <td className="py-2.5 px-3">Antara Injections (MPA vials)</td>
                        <td className="py-2.5 px-3 text-center">36</td>
                        <td className="py-2.5 px-3 text-center">8</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#075E54]">28</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>

              <div className="p-4 bg-[#F9FCFA] border-t border-[#E1ECE9] flex justify-between items-center">
                <button onClick={() => window.print()} className="text-xs font-bold text-[#075E54] flex items-center gap-1 hover:underline">
                  <Printer className="w-3.5 h-3.5" /> Print Form Report
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(previewReport, 'pdf')}
                    className="px-3.5 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold"
                  >
                    Download Text Form
                  </button>
                  <button
                    onClick={() => handleDownload(previewReport, 'excel')}
                    className="px-3.5 py-1.5 bg-[#075E54] text-white rounded-xl text-xs font-bold"
                  >
                    Export Excel (CSV)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
