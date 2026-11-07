import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import DashboardCard from '../components/DashboardCard';
import VaccinationChart from '../components/VaccinationChart';
import SessionSchedule from '../components/SessionSchedule';
import HMISProgressCard from '../components/HMISProgressCard';
import SiteStatistics from '../components/SiteStatistics';
import RecentActivities from '../components/RecentActivities';
import SessionDetailModal from '../components/SessionDetailModal';
import { useHealthData } from '../context/HealthDataContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { stats, sessionsList } = useHealthData();
  const [selectedDate, setSelectedDate] = useState('2026-11-03');
  const [selectedSession, setSelectedSession] = useState(null);

  const handleCardClick = (cardId) => {
    if (cardId === 'total-children') navigate('/child-register');
    else if (cardId === 'pregnant-women') navigate('/pregnant-women');
    else if (cardId === 'vaccination-due') navigate('/vaccination-due');
    else if (cardId === 'overdue-vaccinations') navigate('/vaccination-due');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* 3. MAIN DASHBOARD HEADER */}
      <DashboardHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {/* 4. DASHBOARD STATISTICS CARDS */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((card, index) => (
            <DashboardCard
              key={card.id}
              card={card}
              index={index}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      </section>

      {/* 5. MAIN DASHBOARD CONTENT (Two-Column Section) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT: Monthly Vaccination Statistics Chart (7 cols on lg) */}
        <div className="lg:col-span-7">
          <VaccinationChart />
        </div>

        {/* RIGHT: Today's Vaccination Sessions (5 cols on lg) */}
        <div className="lg:col-span-5">
          <SessionSchedule
            onSelectSession={(session) => setSelectedSession(session)}
          />
        </div>
      </section>

      {/* 6. BOTTOM DASHBOARD CARDS (Three Cards) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card A: Monthly HMIS Progress */}
        <HMISProgressCard
          onViewHMIS={() => navigate('/hmis-reports')}
        />

        {/* Card B: Site Statistics */}
        <SiteStatistics
          onNavigateSites={() => navigate('/site-session')}
        />

        {/* Card C: Recent Activities */}
        <RecentActivities
          onActivityClick={(act) => {
            if (act?.type === 'registration') navigate('/child-register');
            else if (act?.type === 'hmis') navigate('/hmis-reports');
            else if (act?.type === 'attendance') navigate('/duty-attendance');
          }}
        />
      </section>

      {/* Session Details Modal */}
      <SessionDetailModal
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </motion.div>
  );
}

