import React from 'react';
import { FileSpreadsheet, CheckCircle2, Clock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { hmisProgressData } from '../data/mockData';

export default function HMISProgressCard({ onViewHMIS }) {
  const { 
    month, 
    completionPercentage, 
    reportStatus, 
    totalCompletedFields, 
    totalFields, 
    pendingFields, 
    sections 
  } = hmisProgressData;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E1ECE9] shadow-card flex flex-col justify-between hover:shadow-card-hover transition-all duration-200">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] flex items-center justify-center text-[#075E54]">
              <FileSpreadsheet className="w-5 h-5 text-[#075E54]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#173B38] leading-tight">
                Monthly HMIS Progress
              </h3>
              <p className="text-xs text-[#718783]">{month} • Form-7 Return</p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Due in 4 Days
          </span>
        </div>

        {/* Circular / Large Percentage Meter */}
        <div className="bg-[#F9FCFB] p-4 rounded-xl border border-[#E1ECE9] mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#718783]">Completion Percentage</span>
            <span className="text-lg font-extrabold text-[#075E54]">{completionPercentage}%</span>
          </div>

          {/* Progress Bar with Gradient */}
          <div className="w-full h-3 bg-[#E1ECE9] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#075E54] to-[#10B981] rounded-full"
            />
          </div>

          {/* Completed vs Pending Numbers */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#E8F2EF] text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="text-[#718783]">Completed Fields:</span>
              <span className="font-bold text-[#173B38]">{totalCompletedFields}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[#718783]">Pending:</span>
              <span className="font-bold text-amber-700">{pendingFields} fields</span>
            </div>
          </div>
        </div>

        {/* Breakdown by Sections */}
        <div className="space-y-2 mb-4">
          {sections.map((sec, idx) => (
            <div key={idx} className="text-xs">
              <div className="flex items-center justify-between text-[#173B38] mb-1">
                <span className="font-medium truncate pr-2">{sec.name}</span>
                <span className="font-bold text-[#075E54]">{sec.pct}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#F1F7F6] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#075E54] rounded-full" 
                  style={{ width: `${sec.pct}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Report Status & CTA */}
      <div className="pt-3 border-t border-[#E1ECE9]">
        <div className="flex items-center justify-between text-xs mb-2.5">
          <span className="text-[#718783] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#075E54]" />
            Status:
          </span>
          <span className="font-semibold text-[#173B38]">{reportStatus}</span>
        </div>

        <button 
          onClick={onViewHMIS}
          className="w-full py-2 px-3 bg-[#E6F4F1] hover:bg-[#075E54] text-[#075E54] hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 group"
        >
          <span>Complete HMIS Form 7</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

