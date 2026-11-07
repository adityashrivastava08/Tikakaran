import React, { useState } from 'react';
import { Calendar, ChevronDown, Sparkles, MapPin, CheckCircle } from 'lucide-react';
import { anmProfile } from '../data/mockData';

export default function DashboardHeader({ selectedDate, setSelectedDate }) {
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const quickDates = [
    { label: "Today's Session (03 Nov 2026)", value: "2026-11-03" },
    { label: "Yesterday's Entries (02 Nov 2026)", value: "2026-11-02" },
    { label: "Tomorrow's Outreach (04 Nov 2026)", value: "2026-11-04" },
    { label: "Weekly Sub-Centre Schedule", value: "2026-W45" }
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Welcome Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B38] tracking-tight">
            Namaste, ANM 👋
          </h1>
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E6F4F1] text-[#075E54] border border-[#CDE5DF]">
            <Sparkles className="w-3 h-3 text-[#10B981]" />
            Sub-Centre Live
          </span>
        </div>
        <p className="text-sm sm:text-base text-[#718783] mt-1 font-medium">
          Here is your healthcare activity overview.
        </p>
      </div>

      {/* Right Date Selector / Quick Date Picker */}
      <div className="flex items-center gap-2 relative">
        <div className="relative">
          <button
            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white hover:bg-[#F9FCFB] text-[#173B38] rounded-xl text-xs sm:text-sm font-semibold border border-[#E1ECE9] shadow-soft-sm transition hover:border-[#10B981]"
          >
            <div className="w-7 h-7 rounded-lg bg-[#E6F4F1] flex items-center justify-center text-[#075E54]">
              <Calendar className="w-4 h-4 text-[#075E54]" />
            </div>
            <span>
              {selectedDate === '2026-11-03' ? "Today, 03 Nov 2026" : selectedDate}
            </span>
            <ChevronDown className="w-4 h-4 text-[#718783]" />
          </button>

          {dateDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E1ECE9] p-1.5 z-40">
              <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#718783]">
                Select Session Date
              </div>
              {quickDates.map((d) => (
                <button
                  key={d.value}
                  onClick={() => {
                    setSelectedDate(d.value);
                    setDateDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                    selectedDate === d.value
                      ? 'bg-[#E6F4F1] text-[#075E54] font-bold'
                      : 'hover:bg-[#F1F7F6] text-[#173B38]'
                  }`}
                >
                  <span>{d.label}</span>
                  {selectedDate === d.value && (
                    <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Catchment pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-[#E1ECE9] text-xs font-semibold text-[#173B38]">
          <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Pipariya (8 Anganwadis)</span>
        </div>
      </div>
    </div>
  );
}

