import React from 'react';
import { 
  LayoutDashboard, 
  Baby, 
  HeartPulse, 
  Syringe, 
  MapPin, 
  Stethoscope, 
  FileSpreadsheet, 
  ClipboardCheck, 
  Receipt, 
  CloudOff, 
  BarChart3, 
  HardDriveDownload, 
  Settings, 
  HelpCircle,
  ShieldCheck,
  Thermometer,
  Wifi,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useHealthData } from '../context/HealthDataContext';

const mainMenuItems = [
  { id: 'dashboard', path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'child-register', path: '/child-register', label: 'Child Register', icon: Baby, badge: '1,250' },
  { id: 'pregnant-women', path: '/pregnant-women', label: 'Pregnant Women', icon: HeartPulse, badge: '245' },
  { id: 'vaccination-due', path: '/vaccination-due', label: 'Vaccination Due List', icon: Syringe, badge: '86', badgeColor: 'bg-amber-500' },
  { id: 'site-session', path: '/site-session', label: 'Site & Session', icon: MapPin },
  { id: 'health-services', path: '/health-services', label: 'Health Services', icon: Stethoscope },
  { id: 'hmis-reports', path: '/hmis-reports', label: 'HMIS Reports', icon: FileSpreadsheet, badge: 'Due 7 Nov', badgeColor: 'bg-emerald-500' }
];

const otherMenuItems = [
  { id: 'duty-attendance', path: '/duty-attendance', label: 'Duty & Attendance', icon: ClipboardCheck },
  { id: 'chhattipurti', path: '/chhattipurti', label: 'Chhattipurti Ledger', icon: Receipt },
  { id: 'portal-pending', path: '/portal-pending', label: 'Portal Pending', icon: CloudOff, badge: '12' },
  { id: 'statistics', path: '/statistics', label: 'Statistics', icon: BarChart3 },
  { id: 'backup-restore', path: '/backup-restore', label: 'Backup & Restore', icon: HardDriveDownload },
  { id: 'settings', path: '/settings', label: 'Settings', icon: Settings },
  { id: 'help-support', path: '/help-support', label: 'Help & Support', icon: HelpCircle }
];

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const { portalPendingList } = useHealthData();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#053E38] text-white flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-20 w-72' : 'w-72'} shadow-xl border-r border-[#084B44]`}
      >
        {/* Brand / Logo Section */}
        <div className="h-20 flex items-center justify-between px-4 sm:px-5 border-b border-[#0A4E47] bg-[#04332E]">
          <Link 
            to="/"
            onClick={() => { if (window.innerWidth < 1024) setIsOpen(false); }}
            className={`flex items-center gap-3 group min-w-0 ${isCollapsed ? 'justify-center w-full' : ''}`}
            title="Tikakaran HMIS"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#0D7E71] flex items-center justify-center shadow-lg shadow-emerald-950/30 ring-2 ring-emerald-400/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-white font-sans truncate">
                    Tikakaran
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#10B981] text-[#04332E] px-1.5 py-0.5 rounded flex-shrink-0">
                    HMIS
                  </span>
                </div>
                <p className="text-[11px] text-[#86AEA7] font-medium leading-none mt-0.5 truncate">
                  ANM Healthcare Portal
                </p>
              </div>
            )}
          </Link>

          {/* Mobile Close Button */}
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[#86AEA7] hover:text-white hover:bg-[#075E54] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {/* MAIN MENU */}
          <div>
            {!isCollapsed && (
              <div className="px-3 mb-2 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#699E95]">
                  MAIN MENU
                </span>
              </div>
            )}
            <nav className="space-y-1">
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.path === '/' 
                  ? location.pathname === '/' 
                  : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    title={isCollapsed ? item.label : undefined}
                    onClick={() => {
                      if (window.innerWidth < 1024) setIsOpen(false);
                    }}
                    className={`relative w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'gap-3.5 px-3.5 py-2.5'} rounded-xl font-medium text-sm transition-all duration-200 group text-left ${
                      isActive
                        ? 'text-white font-semibold shadow-sm'
                        : 'text-[#B4D7D0] hover:text-white hover:bg-[#084B44]/70'
                    }`}
                  >
                    {/* Active Background Pill with Framer Motion Layout */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 bg-[#10B981] rounded-xl z-0 shadow-md shadow-emerald-950/20"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}

                    <Icon className={`w-5 h-5 relative z-10 transition-transform group-hover:scale-105 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-[#82B3AA] group-hover:text-emerald-300'
                    }`} />
                    
                    {!isCollapsed && (
                      <>
                        <span className="relative z-10 flex-1 truncate">
                          {item.label}
                        </span>

                        {item.badge && (
                          <span className={`relative z-10 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-[#05413B] text-white'
                              : `${item.badgeColor || 'bg-[#084B44]'} text-emerald-200`
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* OTHER MENU */}
          <div>
            {!isCollapsed && (
              <div className="px-3 mb-2 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#699E95]">
                  OTHER MENU
                </span>
              </div>
            )}
            <nav className="space-y-1">
              {otherMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                const badgeValue = item.id === 'portal-pending' ? (portalPendingList?.length || '0') : item.badge;

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    title={isCollapsed ? item.label : undefined}
                    onClick={() => {
                      if (window.innerWidth < 1024) setIsOpen(false);
                    }}
                    className={`relative w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'gap-3.5 px-3.5 py-2.5'} rounded-xl font-medium text-sm transition-all duration-200 group text-left ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-[#B4D7D0] hover:text-white hover:bg-[#084B44]/70'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 bg-[#10B981] rounded-xl z-0 shadow-md shadow-emerald-950/20"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}

                    <Icon className={`w-5 h-5 relative z-10 transition-transform group-hover:scale-105 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-[#82B3AA] group-hover:text-emerald-300'
                    }`} />
                    
                    {!isCollapsed && (
                      <>
                        <span className="relative z-10 flex-1 truncate">
                          {item.label}
                        </span>

                        {badgeValue && (
                          <span className={`relative z-10 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-[#05413B] text-white'
                              : 'bg-[#084B44] text-amber-300'
                          }`}>
                            {badgeValue}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Cold Chain & Sub-Centre Mini Status Card at bottom */}
        <div className="p-3 border-t border-[#0A4E47] bg-[#04332E]/90">
          {isCollapsed ? (
            <div 
              className="bg-[#06423C] p-2.5 rounded-xl border border-[#0A524A] text-center"
              title="ILR Cold Chain: 4.2°C Safe • Auto-Sync Active"
            >
              <Thermometer className="w-4 h-4 text-emerald-400 mx-auto" />
              <span className="text-[9px] font-bold text-emerald-300 block mt-1">4.2°C</span>
            </div>
          ) : (
            <div className="bg-[#06423C] p-3 rounded-xl border border-[#0A524A] text-xs">
              <div className="flex items-center justify-between text-[#B4D7D0] mb-1.5">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
                  ILR Cold Chain
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  4.2°C Safe
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#86AEA7]">
                <span className="flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  Portal Sync
                </span>
                <span className="text-white font-medium">Auto-Sync On</span>
              </div>
              <div className="mt-2 pt-2 border-t border-[#095048] flex items-center justify-between text-[10px] text-[#78A29B]">
                <span>Sub-Centre: Pipariya</span>
                <span className="font-mono">SC-49201</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
