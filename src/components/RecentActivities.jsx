import React from 'react';
import { 
  Baby, 
  Syringe, 
  FileSpreadsheet, 
  ClipboardCheck, 
  CalendarClock, 
  Clock, 
  ChevronRight,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { recentActivitiesData } from '../data/mockData';

const iconMap = {
  Baby: Baby,
  Syringe: Syringe,
  FileSpreadsheet: FileSpreadsheet,
  ClipboardCheck: ClipboardCheck,
  CalendarClock: CalendarClock
};

export default function RecentActivities({ onActivityClick }) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E1ECE9] shadow-card flex flex-col justify-between hover:shadow-card-hover transition-all duration-200">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#075E54]">
              <Activity className="w-5 h-5 text-[#075E54]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#173B38] leading-tight">
                Recent Activities
              </h3>
              <p className="text-xs text-[#718783]">Real-time Health Field Log</p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E6F4F1] text-[#075E54]">
            Live Feed
          </span>
        </div>

        {/* Activity Feed Items */}
        <div className="space-y-3">
          {recentActivitiesData.slice(0, 4).map((activity, idx) => {
            const Icon = iconMap[activity.icon] || Baby;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                onClick={() => onActivityClick && onActivityClick(activity)}
                className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#F9FCFB] transition group cursor-pointer"
              >
                {/* Icon Badge */}
                <div className={`p-2 rounded-xl flex-shrink-0 transition-transform group-hover:scale-105 ${activity.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-xs font-bold text-[#173B38] truncate group-hover:text-[#075E54] transition">
                      {activity.title}
                    </h4>
                    <span className="text-[10px] text-[#718783] whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#718783] leading-snug line-clamp-1 mt-0.5">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-medium text-[#075E54] bg-[#E6F4F1] px-1.5 py-0.2 rounded">
                      {activity.village}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer link */}
      <div className="pt-3 mt-2 border-t border-[#E1ECE9] flex items-center justify-between text-xs">
        <span className="text-[#718783]">
          Showing 4 of 28 today's logs
        </span>
        <button 
          onClick={() => onActivityClick && onActivityClick(null)}
          className="font-bold text-[#075E54] hover:text-[#10B981] flex items-center gap-1 transition"
        >
          View Full Audit Log <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

