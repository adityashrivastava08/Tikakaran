import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Area, 
  ComposedChart 
} from 'recharts';
import { TrendingUp, Syringe, Calendar, Filter } from 'lucide-react';
import { monthlyChartData, weeklyChartData, yearlyChartData } from '../data/mockData';

// Custom Tooltip matching design system
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-xl border border-[#E1ECE9] text-xs space-y-1.5 min-w-[170px]">
        <div className="font-bold text-[#173B38] border-b border-[#E1ECE9] pb-1 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] font-normal text-[#718783]">Immunization Record</span>
        </div>
        <div className="flex items-center justify-between text-[#075E54]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#075E54]" />
            Completed:
          </span>
          <span className="font-extrabold">{payload[0]?.value}</span>
        </div>
        <div className="flex items-center justify-between text-amber-600">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            Pending:
          </span>
          <span className="font-extrabold">{payload[1]?.value}</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function VaccinationChart() {
  const [timeframe, setTimeframe] = useState('Month'); // 'Week' | 'Month' | 'Year'

  // Dynamic data based on selected filter
  const currentData = 
    timeframe === 'Week' ? weeklyChartData :
    timeframe === 'Year' ? yearlyChartData :
    monthlyChartData;

  // Calculate totals
  const totalCompleted = currentData.reduce((acc, cur) => acc + cur.completed, 0);
  const totalPending = currentData.reduce((acc, cur) => acc + cur.pending, 0);
  const completionRate = Math.round((totalCompleted / (totalCompleted + totalPending)) * 100) || 88;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E1ECE9] shadow-card">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] flex items-center justify-center text-[#075E54]">
              <Syringe className="w-4 h-4 text-[#075E54]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#173B38] tracking-tight">
                Monthly Vaccination Statistics
              </h2>
              <p className="text-xs text-[#718783]">
                Completed vs Pending Immunization across Sessions
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills (Week / Month / Year) */}
        <div className="flex items-center gap-1 bg-[#F1F7F6] p-1 rounded-xl self-start sm:self-auto border border-[#E1ECE9]">
          {['Week', 'Month', 'Year'].map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeframe(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                timeframe === tab
                  ? 'bg-white text-[#075E54] shadow-sm font-bold'
                  : 'text-[#718783] hover:text-[#173B38]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* KPI mini strip */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 p-3 bg-[#F9FCFA] rounded-xl border border-[#E8F2EF] text-center">
        <div>
          <span className="text-[11px] font-medium text-[#718783]">Completed Doses</span>
          <p className="text-base sm:text-xl font-bold text-[#075E54] mt-0.5">
            {totalCompleted.toLocaleString()}
          </p>
        </div>
        <div className="border-x border-[#E1ECE9]">
          <span className="text-[11px] font-medium text-[#718783]">Pending Doses</span>
          <p className="text-base sm:text-xl font-bold text-[#D97706] mt-0.5">
            {totalPending.toLocaleString()}
          </p>
        </div>
        <div>
          <span className="text-[11px] font-medium text-[#718783]">Coverage Rate</span>
          <p className="text-base sm:text-xl font-bold text-[#10B981] mt-0.5">
            {completionRate}%
          </p>
        </div>
      </div>

      {/* Line / Composed Chart */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={currentData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EFEA" />
            <XAxis 
              dataKey="name" 
              tickLine={false} 
              axisLine={{ stroke: '#E1ECE9' }}
              tick={{ fill: '#718783', fontSize: 11, fontWeight: 500 }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#718783', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              verticalAlign="top" 
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '12px', fontWeight: 600 }}
              formatter={(value) => (
                <span className="text-[#173B38] text-xs font-semibold mr-2">
                  {value === 'completed' ? 'Vaccinations Completed' : 'Pending'}
                </span>
              )}
            />

            <Area
              type="monotone"
              dataKey="completed"
              fill="url(#completedGradient)"
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="completed"
              name="completed"
              stroke="#075E54"
              strokeWidth={3}
              dot={{ r: 3.5, fill: '#075E54', strokeWidth: 2, stroke: '#FFFFFF' }}
              activeDot={{ r: 6, fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="pending"
              name="pending"
              stroke="#F59E0B"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#F59E0B', strokeWidth: 1.5, stroke: '#FFFFFF' }}
              activeDot={{ r: 5, fill: '#D97706', stroke: '#FFFFFF' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

