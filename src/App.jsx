import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AddBeneficiaryModal from './components/AddBeneficiaryModal';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HealthDataProvider, useHealthData } from './context/HealthDataContext';
import { ToastProvider } from './context/ToastContext';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ChildRegisterPage from './pages/ChildRegisterPage';
import PregnantWomenPage from './pages/PregnantWomenPage';
import VaccinationDueListPage from './pages/VaccinationDueListPage';
import SiteSessionPage from './pages/SiteSessionPage';
import HealthServicesPage from './pages/HealthServicesPage';
import HmisReportsPage from './pages/HmisReportsPage';
import DutyAttendancePage from './pages/DutyAttendancePage';
import ChhattipurtiLedgerPage from './pages/ChhattipurtiLedgerPage';
import PortalPendingPage from './pages/PortalPendingPage';
import BackupRestorePage from './pages/BackupRestorePage';
import StatisticsPage from './pages/StatisticsPage';
import SettingsPage from './pages/SettingsPage';
import HelpSupportPage from './pages/HelpSupportPage';

function AuthenticatedAppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { addChild, addPregnantWoman } = useHealthData();
  const location = useLocation();

  const handleAddBeneficiary = (newEntry) => {
    if (newEntry.type === 'Child') {
      addChild(newEntry);
    } else {
      addPregnantWoman(newEntry);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F7F6] flex">
      {/* 1. COLLAPSIBLE LEFT SIDEBAR WITH REACT ROUTER NAVIGATION */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* MAIN CONTENT AREA */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* 2. TOP NAVBAR */}
        <Navbar
          onOpenAddBeneficiary={() => setIsAddModalOpen(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        />

        {/* 3. PAGE CONTENT CONTAINER WITH SMOOTH PAGE TRANSITIONS */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Routes location={location}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<Navigate to="/" replace />} />
                <Route path="/child-register" element={<ChildRegisterPage />} />
                <Route path="/pregnant-women" element={<PregnantWomenPage />} />
                <Route path="/vaccination-due" element={<VaccinationDueListPage />} />
                <Route path="/site-session" element={<SiteSessionPage />} />
                <Route path="/health-services" element={<HealthServicesPage />} />
                <Route path="/hmis-reports" element={<HmisReportsPage />} />
                <Route path="/duty-attendance" element={<DutyAttendancePage />} />
                <Route path="/chhattipurti" element={<ChhattipurtiLedgerPage />} />
                <Route path="/portal-pending" element={<PortalPendingPage />} />
                <Route path="/backup-restore" element={<BackupRestorePage />} />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/help-support" element={<HelpSupportPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Add Beneficiary Modal */}
      <AddBeneficiaryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBeneficiary={handleAddBeneficiary}
      />
    </div>
  );
}

function RootAppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Login Route - Redirects to / if already logged in */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        }
      />

      {/* Protected Routes for Authenticated Health Workers */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AuthenticatedAppLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <HealthDataProvider>
          <ToastProvider>
            <RootAppRoutes />
          </ToastProvider>
        </HealthDataProvider>
      </AuthProvider>
    </Router>
  );
}
