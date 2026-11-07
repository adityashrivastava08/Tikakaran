import React from 'react';
import { MapPin, Baby, CalendarCheck, Users, Shield, Thermometer } from 'lucide-react';
import { motion } from 'framer-motion';
import { siteStatisticsData } from '../data/mockData';

export default function SiteStatistics({ onNavigateSites }) {
  const { 
    totalActiveSites, 
    childrenRegisteredTotal, 
    sessionsConducted, 
    sessionsPlanned, 
    conductedPct, 
    ageBreakdown, 
    totalCatchmentPopulation 
  } = siteStatisticsData;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E1ECE9] shadow-card flex flex-col justify-between hover:shadow-card-hover transition-all duration-200">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#10B981]">
              <MapPin className="w-5 h-5 text-[#075E54]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#173B38] leading-tight">
                Site Statistics
              </h3>
              <p className="text-xs text-[#718783]">Catchment & Outreach Coverage</p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-[#075E54]">
            {totalActiveSites} Active Sites
          </span>
        </div>

        {/* 3 Metric Mini Boxes */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {/* Active Sites */}
          <div className="p-3 bg-[#F9FCFA] rounded-xl border border-[#E8F2EF]">
            <div className="flex items-center gap-1.5 text-xs text-[#718783] mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#075E54]" />
              <span>Active Sites</span>
            </div>
            <div className="text-xl font-extrabold text-[#173B38]">
              {totalActiveSites} <span className="text-xs font-normal text-[#718783]">Centers</span>
            </div>
            <p className="text-[10px] text-[#718783] mt-0.5">8 Anganwadi Villages</p>
          </div>

          {/* Sessions Conducted */}
          <div className="p-3 bg-[#F9FCFA] rounded-xl border border-[#E8F2EF]">
            <div className="flex items-center gap-1.5 text-xs text-[#718783] mb-1">
              <CalendarCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Sessions Conducted</span>
            </div>
            <div className="text-xl font-extrabold text-[#075E54]">
              {sessionsConducted} <span className="text-xs font-normal text-[#718783]">/ {sessionsPlanned}</span>
            </div>
            <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">{conductedPct}% Success Rate</p>
          </div>
        </div>

        {/* Children Registered by Age Breakdown */}
        <div className="p-3.5 bg-[#F4F9F8] rounded-xl border border-[#DCEBE7] mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-[#173B38] flex items-center gap-1.5">
              <Baby className="w-3.5 h-3.5 text-[#075E54]" />
              Children Registered
            </span>
            <span className="font-extrabold text-[#075E54]">
              {childrenRegisteredTotal.toLocaleString()} Total
            </span>
          </div>

          {/* Segmented Bar */}
          <div className="w-full h-2 bg-[#E1ECE9] rounded-full overflow-hidden flex">
            <div className="h-full bg-[#075E54]" style={{ width: '33.6%' }} title="0-11 mo" />
            <div className="h-full bg-[#10B981]" style={{ width: '30.4%' }} title="12-23 mo" />
            <div className="h-full bg-[#3B82F6]" style={{ width: '36.0%' }} title="2-5 yrs" />
          </div>

          {/* Legend items */}
          <div className="grid grid-cols-3 gap-1 mt-2.5 text-[10px] text-[#718783]">
            {ageBreakdown.map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.label.split(' ')[0]}: <strong className="text-[#173B38]">{item.count}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Catchment details */}
      <div className="pt-3 border-t border-[#E1ECE9] flex items-center justify-between text-xs">
        <span className="text-[#718783] flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-[#075E54]" />
          Population: <strong className="text-[#173B38] font-bold">{totalCatchmentPopulation}</strong>
        </span>

        <button 
          onClick={onNavigateSites}
          className="font-bold text-[#075E54] hover:text-[#10B981] transition"
        >
          View Map & Sites →
        </button>
      </div>
    </div>
  );
}

