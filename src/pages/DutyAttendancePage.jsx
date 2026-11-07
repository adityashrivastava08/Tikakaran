import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  Award, 
  Plus, 
  X, 
  Check, 
  FileText,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthData } from '../context/HealthDataContext';
import { useToast } from '../context/ToastContext';

export default function DutyAttendancePage() {
  const { dutyAttendance, anmProfile } = useHealthData();
  const toast = useToast();

  const [days, setDays] = useState(dutyAttendance.calendarDays);
  const [selectedDay, setSelectedDay] = useState(dutyAttendance.calendarDays[2]); // Default day 3 (Today)
  const [isMarkDutyOpen, setIsMarkDutyOpen] = useState(false);
  const [targetDay, setTargetDay] = useState(selectedDay);

  const [markForm, setMarkForm] = useState({
    status: 'P',
    duty: 'Sub-Centre Routine Immunization Session & Clinic'
  });

  // Calculate live summary dynamically from `days` array
  const totalDays = days.length;
  const workedPresent = days.filter(d => d.status === 'P').length;
  const weekOff = days.filter(d => d.status === 'WO').length;
  const casualLeave = days.filter(d => d.status === 'CL').length;
  const sickLeave = days.filter(d => d.status === 'SL').length;
  const chhattipurtiLeave = days.filter(d => d.status === 'CHL').length;
  const holidays = days.filter(d => d.status === 'H').length;
  const absent = days.filter(d => d.status === 'A').length;
  const workingDays = totalDays - weekOff - holidays;
  const presentPercentage = Math.round((workedPresent / (workingDays || 1)) * 100);

  const getStatusColor = (status) => {
    switch(status) {
      case 'P': return 'bg-emerald-500 text-white';
      case 'WO': return 'bg-gray-100 text-gray-600 border border-gray-200';
      case 'SL': return 'bg-amber-500 text-white';
      case 'CL': return 'bg-blue-500 text-white';
      case 'H': return 'bg-purple-500 text-white';
      case 'CHL': return 'bg-teal-600 text-white';
      case 'A': return 'bg-rose-500 text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'P': return 'Work (Present)';
      case 'WO': return 'Week Off';
      case 'SL': return 'Sick Leave (SL)';
      case 'CL': return 'Casual Leave (CL)';
      case 'H': return 'Gazetted Holiday';
      case 'CHL': return 'Chhattipurti Leave';
      case 'A': return 'Absent';
      default: return status;
    }
  };

  const handleDayClick = (dayItem) => {
    setSelectedDay(dayItem);
    setTargetDay(dayItem);
    setMarkForm({
      status: dayItem.status,
      duty: dayItem.duty
    });
  };

  const handleUpdateDutySubmit = (e) => {
    e.preventDefault();
    if (!targetDay) return;

    const updatedDays = days.map(d => {
      if (d.day === targetDay.day) {
        return {
          ...d,
          status: markForm.status,
          label: getStatusLabel(markForm.status),
          duty: markForm.duty
        };
      }
      return d;
    });

    setDays(updatedDays);
    const updatedSelected = updatedDays.find(d => d.day === targetDay.day);
    setSelectedDay(updatedSelected);
    setIsMarkDutyOpen(false);

    toast.success(
      "Attendance Updated!",
      `Day ${targetDay.day} marked as "${getStatusLabel(markForm.status)}" for ${anmProfile.name}. Summary recalculated.`
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] flex items-center justify-center text-[#075E54]">
              <ClipboardCheck className="w-6 h-6 text-[#075E54]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B38] tracking-tight">
                Duty & Attendance Register
              </h1>
              <p className="text-xs sm:text-sm text-[#718783] mt-0.5">
                Staff: {anmProfile.name} ({anmProfile.designation}) • {dutyAttendance.month}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setTargetDay(selectedDay);
            setMarkForm({ status: selectedDay.status, duty: selectedDay.duty });
            setIsMarkDutyOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition hover:shadow-md"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Mark Duty for Day {selectedDay.day}</span>
        </button>
      </div>

      {/* 2. Dynamic Monthly Attendance Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center">
        <div className="bg-white p-3 rounded-xl border border-[#E1ECE9] shadow-soft-sm">
          <span className="text-[10px] text-[#718783] block font-semibold">Total Days</span>
          <p className="text-xl font-extrabold text-[#173B38] mt-0.5">{totalDays}</p>
          <span className="text-[9px] text-[#718783]">In Month</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-[#E1ECE9] shadow-soft-sm">
          <span className="text-[10px] text-[#718783] block font-semibold">Work (Present)</span>
          <p className="text-xl font-extrabold text-emerald-600 mt-0.5">{workedPresent}</p>
          <span className="text-[9px] text-emerald-700 font-bold">{presentPercentage}% Attendance</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-[#E1ECE9] shadow-soft-sm">
          <span className="text-[10px] text-[#718783] block font-semibold">Week Off (WO)</span>
          <p className="text-xl font-extrabold text-[#173B38] mt-0.5">{weekOff}</p>
          <span className="text-[9px] text-[#718783]">Sundays</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-[#E1ECE9] shadow-soft-sm">
          <span className="text-[10px] text-[#718783] block font-semibold">Casual Leave (CL)</span>
          <p className="text-xl font-extrabold text-blue-600 mt-0.5">{casualLeave}</p>
          <span className="text-[9px] text-blue-700 font-bold">Approved</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-[#E1ECE9] shadow-soft-sm">
          <span className="text-[10px] text-[#718783] block font-semibold">Sick Leave (SL)</span>
          <p className="text-xl font-extrabold text-amber-600 mt-0.5">{sickLeave}</p>
          <span className="text-[9px] text-amber-700 font-bold">Medical Leave</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-[#E1ECE9] shadow-soft-sm">
          <span className="text-[10px] text-[#718783] block font-semibold">Chhattipurti (CHL)</span>
          <p className="text-xl font-extrabold text-teal-700 mt-0.5">{chhattipurtiLeave}</p>
          <span className="text-[9px] text-teal-800 font-bold">Compensatory</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-[#E1ECE9] shadow-soft-sm">
          <span className="text-[10px] text-[#718783] block font-semibold">Holidays (H)</span>
          <p className="text-xl font-extrabold text-purple-700 mt-0.5">{holidays}</p>
          <span className="text-[9px] text-purple-800 font-bold">Gazetted</span>
        </div>
      </div>

      {/* 3. Interactive Monthly Calendar Grid & Details View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar View (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-[#E1ECE9] shadow-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-[#E1ECE9] mb-4 gap-2">
            <div>
              <h3 className="text-base font-bold text-[#173B38] flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#075E54]" />
                Attendance Calendar: {dutyAttendance.month}
              </h3>
              <p className="text-[11px] text-[#718783]">Click any date to view details or change status</p>
            </div>

            {/* Status Legend Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
              <span className="px-2 py-0.5 rounded bg-emerald-500 text-white">Work</span>
              <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700">WO</span>
              <span className="px-2 py-0.5 rounded bg-blue-500 text-white">CL</span>
              <span className="px-2 py-0.5 rounded bg-amber-500 text-white">SL</span>
              <span className="px-2 py-0.5 rounded bg-purple-500 text-white">Holiday</span>
              <span className="px-2 py-0.5 rounded bg-teal-600 text-white">Chhattipurti</span>
            </div>
          </div>

          {/* 30-Day Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(w => (
              <div key={w} className="text-center font-bold text-[10px] text-[#718783] uppercase pb-1">
                {w}
              </div>
            ))}

            {days.map((cd) => {
              const isSelected = selectedDay.day === cd.day;
              return (
                <button
                  key={cd.day}
                  type="button"
                  onClick={() => handleDayClick(cd)}
                  className={`p-2 rounded-xl text-center border transition relative flex flex-col items-center justify-between min-h-[64px] ${
                    isSelected
                      ? 'border-[#075E54] bg-[#E6F4F1] ring-2 ring-[#075E54]/20 shadow-sm scale-105'
                      : 'border-[#E1ECE9] hover:bg-[#F9FCFB]'
                  }`}
                >
                  <span className="text-xs font-bold text-[#173B38]">{cd.day}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold ${getStatusColor(cd.status)}`}>
                    {cd.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Work Details (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#E1ECE9] shadow-card flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#718783]">Selected Day Details</span>
            <div className="flex items-center justify-between mt-1 pb-3 border-b border-[#E1ECE9]">
              <h3 className="text-lg font-bold text-[#173B38]">
                {selectedDay.day} November 2026 ({selectedDay.weekday})
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(selectedDay.status)}`}>
                {selectedDay.label || getStatusLabel(selectedDay.status)}
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-[#F9FCFA] rounded-xl border border-[#E1ECE9]">
                <span className="text-[#718783] block font-semibold mb-0.5">Assigned Duty & Session Location:</span>
                <p className="font-bold text-sm text-[#075E54]">{selectedDay.duty}</p>
              </div>

              <div className="p-3 rounded-xl border border-[#E1ECE9] space-y-2 text-[#718783]">
                <div className="flex justify-between">
                  <span>Duty Category:</span>
                  <strong className="text-[#173B38]">{getStatusLabel(selectedDay.status)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Sign-in Time:</span>
                  <strong className="text-[#173B38]">08:45 AM</strong>
                </div>
                <div className="flex justify-between">
                  <span>Sign-out Time:</span>
                  <strong className="text-[#173B38]">05:15 PM</strong>
                </div>
                <div className="flex justify-between">
                  <span>Supervising Medical Officer:</span>
                  <strong className="text-[#173B38]">Dr. A.K. Verma (MOIC Rampur)</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E1ECE9]">
            <button
              onClick={() => {
                setTargetDay(selectedDay);
                setMarkForm({ status: selectedDay.status, duty: selectedDay.duty });
                setIsMarkDutyOpen(true);
              }}
              className="w-full py-2.5 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4 text-[#10B981]" />
              <span>Change Status for Day {selectedDay.day}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Holiday Duty Report */}
      <div className="bg-white rounded-2xl border border-[#E1ECE9] shadow-card overflow-hidden">
        <div className="p-4 bg-[#F8FBFA] border-b border-[#E1ECE9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#075E54]" />
            <span className="font-bold text-xs text-[#173B38]">
              Holiday Duty Report & Compensatory Leave Credits
            </span>
          </div>
          <span className="text-[11px] text-[#075E54] font-semibold">Official Record for Chhattipurti Entitlement</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-[#F1F7F6] text-[#718783] uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Occasion / Holiday</th>
              <th className="py-3 px-4">Emergency Duty Executed</th>
              <th className="py-3 px-4">Hours Worked</th>
              <th className="py-3 px-4">Leave Entitlement</th>
              <th className="py-3 px-4 text-center">Approval Authority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E1ECE9] text-[#173B38]">
            {dutyAttendance.holidayDutyReport.map((hdr, idx) => (
              <tr key={idx} className="hover:bg-[#F9FCFB]">
                <td className="py-3 px-4 font-bold">{hdr.date}</td>
                <td className="py-3 px-4">{hdr.occasion}</td>
                <td className="py-3 px-4 font-semibold text-[#075E54]">{hdr.dutyType}</td>
                <td className="py-3 px-4 text-[#718783]">{hdr.hours}</td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#075E54]">
                    {hdr.compensatoryCredit}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {hdr.approved}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: MARK / UPDATE ATTENDANCE */}
      <AnimatePresence>
        {isMarkDutyOpen && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-md overflow-hidden"
            >
              <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold">Update Attendance: Day {targetDay?.day} Nov</h3>
                  <p className="text-xs text-emerald-200">Staff: {anmProfile.name}</p>
                </div>
                <button onClick={() => setIsMarkDutyOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateDutySubmit} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-[#173B38] block mb-1">Choose Attendance Status *</label>
                  <select
                    value={markForm.status}
                    onChange={(e) => setMarkForm({ ...markForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1ECE9] font-medium outline-none focus:border-[#10B981] bg-[#F9FCFA]"
                  >
                    <option value="P">Work (Present - Sub-Centre OPD / Session)</option>
                    <option value="WO">Week Off (Sunday)</option>
                    <option value="CL">Casual Leave (CL)</option>
                    <option value="SL">Sick Leave (SL)</option>
                    <option value="CHL">Chhattipurti Leave (Compensatory Off)</option>
                    <option value="H">Govt Gazetted Holiday</option>
                    <option value="A">Absent</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#173B38] block mb-1">Work Description / Session Notes</label>
                  <textarea
                    rows="2"
                    required
                    value={markForm.duty}
                    onChange={(e) => setMarkForm({ ...markForm, duty: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1ECE9] font-medium outline-none focus:border-[#10B981] bg-[#F9FCFA]"
                  />
                </div>

                <div className="pt-3 border-t border-[#E1ECE9] flex justify-end gap-2.5">
                  <button type="button" onClick={() => setIsMarkDutyOpen(false)} className="px-4 py-2 border rounded-xl font-bold text-[#718783]">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl font-bold shadow-sm">
                    Save Attendance
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
