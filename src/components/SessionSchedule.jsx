import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle, 
  PlayCircle, 
  ChevronRight, 
  Sparkles,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { todaySessions } from '../data/mockData';

export default function SessionSchedule({ onSelectSession }) {
  const [selectedSessionId, setSelectedSessionId] = useState('SES-01');

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E1ECE9] shadow-card flex flex-col h-full">
      {/* Header with Date Badge */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E1ECE9]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[#173B38] tracking-tight">
              Today's Vaccination Sessions
            </h2>
          </div>
          <p className="text-xs text-[#718783] mt-0.5">
            Routine Immunization Outreach Schedule
          </p>
        </div>

        {/* Date Display Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E6F4F1] text-[#075E54] rounded-xl text-xs font-bold border border-[#CCE8E1]">
          <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
          <span>03 Nov 2026</span>
        </div>
      </div>

      {/* Upcoming Session List */}
      <div className="mt-4 space-y-3 flex-1 overflow-y-auto pr-1">
        {todaySessions.map((session, index) => {
          const isSelected = selectedSessionId === session.id;

          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedSessionId(session.id);
                if (onSelectSession) onSelectSession(session);
              }}
              className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer relative ${
                isSelected
                  ? 'border-[#075E54] bg-[#F4F9F8] shadow-sm ring-1 ring-[#075E54]/20'
                  : 'border-[#E1ECE9] bg-white hover:border-[#10B981] hover:bg-[#FAFCFB]'
              }`}
            >
              {/* Top row: Site Name + Status Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 p-2 rounded-lg ${
                    session.status === 'In Progress' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : session.status === 'Completed'
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-[#E6F4F1] text-[#075E54]'
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#173B38] leading-tight">
                      {session.siteName}
                    </h4>
                    <span className="text-[11px] text-[#718783] font-medium">
                      ASHA: {session.ashaWorker}
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  session.status === 'In Progress'
                    ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                    : session.status === 'Completed'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-teal-50 text-[#075E54] border border-[#CDE5DF]'
                }`}>
                  {session.status === 'In Progress' && <PlayCircle className="w-3 h-3 text-emerald-600" />}
                  {session.status === 'Completed' && <CheckCircle className="w-3 h-3 text-gray-500" />}
                  {session.status}
                </span>
              </div>

              {/* Bottom row: Time + Beneficiaries Count */}
              <div className="mt-3 pt-2.5 border-t border-[#E8F2EF] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[#718783] font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#075E54]" />
                  <span>{session.time}</span>
                </div>

                <div className="flex items-center gap-1.5 font-bold text-[#173B38]">
                  <Users className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{session.beneficiariesCount} Beneficiaries</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Quick Action */}
      <div className="pt-3 mt-3 border-t border-[#E1ECE9] flex items-center justify-between">
        <span className="text-xs text-[#718783]">
          Total 4 sessions scheduled today
        </span>
        <button 
          onClick={() => onSelectSession && onSelectSession(todaySessions[0])}
          className="text-xs font-bold text-[#075E54] hover:text-[#10B981] flex items-center gap-1 transition"
        >
          View Full Roster <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

