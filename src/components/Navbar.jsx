import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  Menu, 
  ChevronDown, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  User, 
  LogOut, 
  RefreshCw, 
  Globe, 
  ShieldCheck, 
  Building2, 
  X,
  Baby,
  HeartPulse,
  MapPin,
  ArrowRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHealthData } from '../context/HealthDataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { notificationsList } from '../data/mockData';

export default function Navbar({ onOpenAddBeneficiary, onToggleSidebar, isSidebarCollapsed, onToggleCollapse }) {
  const navigate = useNavigate();
  const { anmProfile, childrenList, pregnantWomenList, sitesList } = useHealthData();
  const { user, logout } = useAuth();
  const toast = useToast();

  const activeWorkerName = user?.fullName || anmProfile.name;
  const activeSubCentre = user?.subCentre || anmProfile.subCentre;
  const activePortalId = user?.hmisPortalId || anmProfile.hmisPortalId;

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live search suggestions across Children, Pregnant Women, and Sites
  const suggestions = React.useMemo(() => {
    const q = navSearch.trim().toLowerCase();
    if (!q || q.length < 1) return [];

    const matchedChildren = childrenList
      .filter(c => c.name.toLowerCase().includes(q) || c.motherName.toLowerCase().includes(q) || c.rchId?.includes(q))
      .slice(0, 3)
      .map(c => ({
        id: c.id,
        type: 'child',
        category: 'Child Register',
        title: c.name,
        subtitle: `Mother: ${c.motherName} • ${c.age} • #${c.rchId}`,
        path: '/child-register',
        icon: Baby
      }));

    const matchedMothers = pregnantWomenList
      .filter(m => m.name.toLowerCase().includes(q) || m.husbandName.toLowerCase().includes(q) || m.rchId?.includes(q))
      .slice(0, 3)
      .map(m => ({
        id: m.id,
        type: 'mother',
        category: 'Pregnant Women',
        title: m.name,
        subtitle: `Husband: ${m.husbandName} • EDD: ${m.edd} • ${m.hrpStatus}`,
        path: '/pregnant-women',
        icon: HeartPulse
      }));

    const matchedSites = sitesList
      .filter(s => s.name.toLowerCase().includes(q) || s.village.toLowerCase().includes(q) || s.code.toLowerCase().includes(q))
      .slice(0, 2)
      .map(s => ({
        id: s.id,
        type: 'site',
        category: 'Site & Session',
        title: s.name,
        subtitle: `Village: ${s.village} • ASHA: ${s.asha}`,
        path: '/site-session',
        icon: MapPin
      }));

    return [...matchedChildren, ...matchedMothers, ...matchedSites];
  }, [navSearch, childrenList, pregnantWomenList, sitesList]);

  // Keyboard navigation for suggestions
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter' && navSearch.trim()) {
        navigate('/child-register');
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else {
        navigate('/child-register');
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (item) => {
    navigate(item.path);
    setShowSuggestions(false);
    setNavSearch('');
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success(
        "Sub-Centre Data Synced!",
        "Routine immunization registers, cold chain telemetry, and HMIS Form-7 aggregates updated."
      );
    }, 1200);
  };

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
    toast.info("Logged Out", "You have signed out of your Sub-Centre session.");
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white border-b border-[#E1ECE9] px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-soft-sm">
      {/* Left: Desktop Collapse Button + Mobile Toggle + Search Bar */}
      <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-2xl">
        {/* Mobile menu hamburger */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-[#075E54] hover:bg-[#F1F7F6] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Desktop Sidebar Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          title={isSidebarCollapsed ? "Expand Sidebar (W-72)" : "Collapse Sidebar (Compact W-20)"}
          className="hidden lg:flex p-2 rounded-xl text-[#075E54] hover:bg-[#E6F4F1] transition focus:outline-none"
          aria-label="Toggle Sidebar Collapse"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-[#075E54]" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-[#075E54]" />
          )}
        </button>

        {/* Global Search Input with Suggestions Dropdown */}
        <div className="relative w-full max-w-md" ref={searchRef}>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718783]">
            <Search className="w-4 h-4 text-[#718783]" />
          </div>

          <input
            type="text"
            value={navSearch}
            onChange={(e) => {
              setNavSearch(e.target.value);
              setShowSuggestions(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search children, pregnant women, sites..."
            className="w-full pl-10 pr-9 py-2.5 bg-[#F1F7F6] hover:bg-[#EAF3F1] focus:bg-white text-xs sm:text-sm text-[#173B38] placeholder-[#718783] rounded-xl border border-transparent focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 outline-none transition-all duration-200"
          />

          {navSearch && (
            <button
              onClick={() => {
                setNavSearch('');
                setShowSuggestions(false);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#718783] hover:text-[#173B38]"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Autocomplete Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#E1ECE9] py-2 z-50 overflow-hidden"
              >
                <div className="px-3.5 py-1.5 border-b border-[#E1ECE9] flex items-center justify-between text-[11px] text-[#718783]">
                  <span>Suggestions across Sub-Centre</span>
                  <span className="font-mono text-[10px]">Use ↑↓ to navigate</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#E1ECE9]/60">
                  {suggestions.map((item, idx) => {
                    const Icon = item.icon;
                    const isHighlighted = selectedIndex === idx;

                    return (
                      <div
                        key={`${item.type}-${item.id}`}
                        onClick={() => handleSelectSuggestion(item)}
                        className={`p-3 cursor-pointer flex items-center justify-between transition ${
                          isHighlighted ? 'bg-[#E6F4F1] text-[#075E54]' : 'hover:bg-[#F9FCFA]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-2 rounded-xl flex-shrink-0 ${
                            item.type === 'child' ? 'bg-emerald-100 text-[#075E54]' :
                            item.type === 'mother' ? 'bg-teal-100 text-[#0284C7]' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#173B38] truncate">{item.title}</span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-[#718783]">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#718783] truncate mt-0.5">{item.subtitle}</p>
                          </div>
                        </div>

                        <ArrowRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${
                          isHighlighted ? 'translate-x-1 text-[#075E54]' : 'text-gray-300'
                        }`} />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Sync Portal Button */}
        <button
          onClick={handleSync}
          title="Sync with National HMIS / RCH Portal"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#075E54] bg-[#E6F4F1] hover:bg-[#D4EBE7] rounded-xl transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#10B981]' : ''}`} />
          <span className="hidden md:inline">Sync Portal</span>
        </button>

        {/* Add Beneficiary Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenAddBeneficiary}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition shadow-[#075E54]/20"
        >
          <div className="w-5 h-5 rounded-lg bg-[#10B981] flex items-center justify-center text-white">
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="hidden xs:inline">Add Beneficiary</span>
        </motion.button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-[#F1F7F6] hover:bg-[#E4EFEA] text-[#173B38] transition focus:outline-none"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5 text-[#075E54]" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#EF4444] rounded-full ring-2 ring-white animate-pulse" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E1ECE9] py-3 z-50 overflow-hidden"
              >
                <div className="px-4 pb-2.5 border-b border-[#E1ECE9] flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#173B38]">Notifications & Reminders</h3>
                    <p className="text-[11px] text-[#718783]">HMIS & Cold Chain Alerts</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#075E54]">
                    2 Unread
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#E1ECE9]/60">
                  {notificationsList.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-3.5 hover:bg-[#F1F7F6] transition flex items-start gap-3 ${
                        notif.unread ? 'bg-[#F9FCFA]' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {notif.type === 'info' && <Info className="w-4 h-4 text-[#075E54]" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[#173B38] leading-snug">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-[#718783] mt-0.5 leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-[#8EA29E] mt-1 block font-medium">
                          {notif.time}
                        </span>
                      </div>
                      {notif.unread && (
                        <span className="w-2 h-2 rounded-full bg-[#10B981] mt-1" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="px-4 pt-2.5 border-t border-[#E1ECE9] text-center">
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-[#075E54] hover:text-[#10B981] transition"
                  >
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ANM Profile Avatar & Dropdown */}
        <div className="relative pl-1 sm:pl-2 border-l border-[#E1ECE9]" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#F1F7F6] transition group text-left"
          >
            <div className="relative">
              <img
                src={anmProfile.avatar}
                alt={anmProfile.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#075E54]/20 group-hover:ring-[#10B981] transition"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10B981] ring-2 ring-white" />
            </div>

            <div className="hidden md:block">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-[#173B38] group-hover:text-[#075E54] transition">
                  {activeWorkerName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#718783]" />
              </div>
              <p className="text-[11px] text-[#718783] font-medium leading-tight">
                {activeSubCentre}
              </p>
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-[#E1ECE9] p-2 z-50"
              >
                <div className="p-3 bg-[#F1F7F6] rounded-xl mb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#075E54]" />
                    <span className="text-xs font-bold text-[#173B38]">{user?.role === 'ADMIN' ? 'District Admin Credential' : 'Verified ANM Credential'}</span>
                  </div>
                  <p className="text-[11px] text-[#718783] mt-1">ID: {activePortalId}</p>
                  <p className="text-[11px] text-[#718783]">Facility: {activeSubCentre}</p>
                </div>

                <div className="space-y-0.5 text-xs text-[#173B38] font-medium">
                  <button 
                    onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F1F7F6] transition text-left"
                  >
                    <User className="w-4 h-4 text-[#718783]" />
                    My Health Worker Profile
                  </button>
                  <button 
                    onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F1F7F6] transition text-left"
                  >
                    <Building2 className="w-4 h-4 text-[#718783]" />
                    Sub Centre Settings
                  </button>
                  <button 
                    onClick={() => { setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F1F7F6] transition text-left"
                  >
                    <Globe className="w-4 h-4 text-[#718783]" />
                    Language: हिन्दी / English
                  </button>
                  <div className="my-1 border-t border-[#E1ECE9]" />
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleSync();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-emerald-50 text-[#075E54] font-semibold transition text-left"
                  >
                    <RefreshCw className="w-4 h-4 text-[#10B981]" />
                    Force Portal Data Sync
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 transition text-left font-semibold"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Sign Out / Switch Shift
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
