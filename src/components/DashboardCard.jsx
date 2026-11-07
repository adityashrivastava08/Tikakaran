import React, { useEffect, useState } from 'react';
import { Baby, HeartPulse, Syringe, CalendarClock, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Icon Map
const iconMap = {
  Baby: Baby,
  HeartPulse: HeartPulse,
  Syringe: Syringe,
  CalendarClock: CalendarClock
};

// Smooth count-up hook
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const finalValue = parseInt(target, 10);
    if (isNaN(finalValue)) {
      setCount(target);
      return;
    }

    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function (easeOutExpo)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(ease * finalValue);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setCount(finalValue);
      }
    }

    requestAnimationFrame(update);
  }, [target, duration]);

  return count;
}

export default function DashboardCard({ card, index, onCardClick }) {
  const Icon = iconMap[card.icon] || Baby;
  const count = useCountUp(card.value);

  // Formatted count for display (with commas if > 999)
  const displayValue = count.toLocaleString('en-IN');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onCardClick && onCardClick(card.id)}
      className="bg-white rounded-2xl p-5 border border-[#E1ECE9] shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer relative overflow-hidden group"
    >
      {/* Decorative top-right corner glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#E6F4F1]/60 to-transparent rounded-bl-full pointer-events-none group-hover:from-emerald-100/50 transition-all" />

      {/* Top Row: Icon + Badge / Trend */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
          card.id === 'total-children' ? 'bg-[#E6F4F1] text-[#075E54]' :
          card.id === 'pregnant-women' ? 'bg-[#E0F2FE] text-[#0284C7]' :
          card.id === 'vaccination-due' ? 'bg-[#FEF3C7] text-[#D97706]' :
          'bg-[#FEE2E2] text-[#DC2626]'
        }`}>
          <Icon className="w-6 h-6 stroke-[2.2]" />
        </div>

        <div className="flex items-center gap-1.5">
          {card.trend && (
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
              card.trendType === 'positive' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
              card.trendType === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-200/60' :
              'bg-rose-50 text-rose-700 border border-rose-200/60'
            }`}>
              <TrendingUp className="w-3 h-3" />
              {card.trend}
            </span>
          )}
        </div>
      </div>

      {/* Middle: Title & Animated Value */}
      <div className="relative z-10">
        <h3 className="text-xs sm:text-sm font-semibold text-[#718783] tracking-wide">
          {card.title}
        </h3>
        
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#173B38] tracking-tight">
            {displayValue}
          </span>
          {card.badge && (
            <span className="text-[10px] font-semibold text-[#075E54] bg-[#E6F4F1] px-2 py-0.5 rounded-md">
              {card.badge}
            </span>
          )}
        </div>

        {/* Subtitle / Context Note */}
        <div className="mt-2.5 pt-2.5 border-t border-[#F1F7F6] flex items-center justify-between text-xs text-[#718783]">
          <span className="font-medium truncate">{card.subtitle}</span>
          <span className="text-[11px] text-[#075E54] font-semibold flex items-center gap-0.5 group-hover:text-[#10B981] transition">
            View <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

