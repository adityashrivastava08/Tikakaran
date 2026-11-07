import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Syringe, Baby, HeartPulse, MapPin } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useHealthData } from '../context/HealthDataContext';

export default function StatisticsPage() {
  const { stats, childrenList, pregnantWomenList, sitesList } = useHealthData();

  const siteStatsData = sitesList.map(s => ({
    name: s.code,
    children: s.beneficiaries,
    coverage: Math.floor(82 + Math.random() * 16)
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] flex items-center justify-center text-[#075E54]">
          <BarChart3 className="w-6 h-6 text-[#075E54]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B38] tracking-tight">
            Sub-Centre Healthcare Analytics & Statistics
          </h1>
          <p className="text-xs sm:text-sm text-[#718783] mt-0.5">
            Cohort Trends, Antigen Dropouts & Village Health Indices
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#E1ECE9] shadow-card">
          <h3 className="font-bold text-sm text-[#173B38] mb-4">AWC Village Beneficiary Coverage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={siteStatsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EFEA" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="children" fill="#075E54" radius={[6, 6, 0, 0]} name="Registered Children" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E1ECE9] shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#173B38] mb-3">Key Performance Indicators (KPIs)</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F9FCFA] rounded-xl border border-[#E1ECE9] flex justify-between">
                <span>Fully Immunized Child (FIC) Rate (9-11 Mo):</span>
                <strong className="text-[#075E54] font-extrabold text-sm">92.4%</strong>
              </div>
              <div className="p-3 bg-[#F9FCFA] rounded-xl border border-[#E1ECE9] flex justify-between">
                <span>Institutional Delivery Rate Target:</span>
                <strong className="text-[#10B981] font-extrabold text-sm">100.0%</strong>
              </div>
              <div className="p-3 bg-[#F9FCFA] rounded-xl border border-[#E1ECE9] flex justify-between">
                <span>1st Trimester ANC Registration:</span>
                <strong className="text-[#075E54] font-extrabold text-sm">93.8%</strong>
              </div>
              <div className="p-3 bg-[#F9FCFA] rounded-xl border border-[#E1ECE9] flex justify-between">
                <span>Vaccine Wastage Factor (VWF):</span>
                <strong className="text-emerald-700 font-extrabold text-sm">4.8% (Target &lt; 10%)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

