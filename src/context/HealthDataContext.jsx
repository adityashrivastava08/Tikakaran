import React, { createContext, useContext, useState } from 'react';
import { 
  initialChildren, 
  initialPregnantWomen, 
  initialSites, 
  todaySessions, 
  healthServicesData, 
  hmisReportsData, 
  dutyAttendanceData, 
  chhattipurtiLedgerData, 
  portalPendingData, 
  backupRestoreData,
  statsCardsData,
  anmProfile,
  recentActivitiesData
} from '../data/mockData';

const HealthDataContext = createContext();

export function HealthDataProvider({ children }) {
  const [childrenList, setChildrenList] = useState(initialChildren);
  const [pregnantWomenList, setPregnantWomenList] = useState(initialPregnantWomen);
  const [sitesList, setSitesList] = useState(initialSites);
  const [sessionsList, setSessionsList] = useState(todaySessions);
  const [healthServices, setHealthServices] = useState(healthServicesData);
  const [hmisReports, setHmisReports] = useState(hmisReportsData);
  const [dutyAttendance, setDutyAttendance] = useState(dutyAttendanceData);
  const [chhattipurtiLedger, setChhattipurtiLedger] = useState(chhattipurtiLedgerData);
  const [portalPendingList, setPortalPendingList] = useState(portalPendingData);
  const [backupRestore, setBackupRestore] = useState(backupRestoreData);
  const [recentActivities, setRecentActivities] = useState(recentActivitiesData);

  // Stats cards dynamically derived
  const [stats, setStats] = useState(statsCardsData);

  // --- CHILD METHODS ---
  const addChild = (newChild) => {
    const entry = {
      ...newChild,
      id: `CHD-${Date.now().toString().slice(-4)}`,
      rchId: newChild.rchId || `984210${Math.floor(1000 + Math.random() * 9000)}`,
      status: newChild.status || 'Due Today',
      vaccinationHistory: newChild.vaccinationHistory || [
        { vaccine: "BCG", dose: "Birth", date: newChild.dob || "2026-11-03", status: "Administered", batch: "BCG-99A", by: "ANM Sunita Sharma" }
      ]
    };
    setChildrenList(prev => [entry, ...prev]);

    // Update stats
    setStats(prev => prev.map(s => s.id === 'total-children' ? { ...s, value: s.value + 1 } : s));

    // Add activity
    addActivity({
      type: 'registration',
      title: 'New Child Registered',
      description: `${entry.name} (s/o ${entry.motherName}) added with RCH #${entry.rchId}`,
      village: entry.village,
      time: 'Just now',
      icon: 'Baby',
      iconBg: 'bg-emerald-100 text-[#075E54]'
    });
  };

  const updateChild = (id, updatedFields) => {
    setChildrenList(prev => prev.map(child => child.id === id ? { ...child, ...updatedFields } : child));
  };

  const deleteChild = (id) => {
    setChildrenList(prev => prev.filter(c => c.id !== id));
    setStats(prev => prev.map(s => s.id === 'total-children' ? { ...s, value: Math.max(0, s.value - 1) } : s));
  };

  const recordVaccineAdministered = (childId, vaccineName, dose, batch = "LOT-2026X") => {
    setChildrenList(prev => prev.map(child => {
      if (child.id === childId) {
        const newHistory = [
          { vaccine: vaccineName, dose: dose || "Routine Dose", date: new Date().toISOString().split('T')[0], status: "Administered", batch, by: "ANM Sunita Sharma" },
          ...(child.vaccinationHistory || [])
        ];
        return {
          ...child,
          status: 'Completed',
          vaccinationHistory: newHistory
        };
      }
      return child;
    }));

    // Update due stats
    setStats(prev => prev.map(s => s.id === 'vaccination-due' ? { ...s, value: Math.max(0, s.value - 1) } : s));

    addActivity({
      type: 'vaccination',
      title: 'Vaccine Administered',
      description: `${vaccineName} (${dose || 'Dose'}) recorded for beneficiary`,
      village: 'Health Sub-Centre',
      time: 'Just now',
      icon: 'Syringe',
      iconBg: 'bg-teal-100 text-[#075E54]'
    });
  };

  // --- PREGNANT WOMEN METHODS ---
  const addPregnantWoman = (newMother) => {
    const entry = {
      ...newMother,
      id: `PW-${Date.now().toString().slice(-4)}`,
      rchId: newMother.rchId || `984220${Math.floor(1000 + Math.random() * 9000)}`,
      trimester: newMother.trimester || '1st Trimester',
      ifaCount: 100,
      calciumCount: 60,
      anc1Date: newMother.anc1Date || `${new Date().toISOString().split('T')[0]} (Done)`
    };
    setPregnantWomenList(prev => [entry, ...prev]);

    setStats(prev => prev.map(s => s.id === 'pregnant-women' ? { ...s, value: s.value + 1 } : s));

    addActivity({
      type: 'registration',
      title: 'New Pregnant Mother Registered',
      description: `${entry.name} (w/o ${entry.husbandName}) registered for ANC care`,
      village: entry.village,
      time: 'Just now',
      icon: 'HeartPulse',
      iconBg: 'bg-teal-100 text-[#0284C7]'
    });
  };

  const updatePregnantWoman = (id, updatedFields) => {
    setPregnantWomenList(prev => prev.map(mother => mother.id === id ? { ...mother, ...updatedFields } : mother));
  };

  const deletePregnantWoman = (id) => {
    setPregnantWomenList(prev => prev.filter(m => m.id !== id));
    setStats(prev => prev.map(s => s.id === 'pregnant-women' ? { ...s, value: Math.max(0, s.value - 1) } : s));
  };

  // --- SITES & SESSIONS METHODS ---
  const addSite = (newSite) => {
    const entry = {
      ...newSite,
      id: `SIT-0${sitesList.length + 1}`,
      status: 'Active',
      sessionsDone: 0,
      totalSessions: 2
    };
    setSitesList(prev => [entry, ...prev]);
  };

  const updateSite = (id, updatedFields) => {
    setSitesList(prev => prev.map(site => site.id === id ? { ...site, ...updatedFields } : site));
  };

  const addSession = (newSession) => {
    const entry = {
      ...newSession,
      id: `SES-0${sessionsList.length + 1}`,
      beneficiariesDone: 0,
      status: 'Scheduled',
      statusColor: 'teal'
    };
    setSessionsList(prev => [entry, ...prev]);
  };

  const updateSessionStatus = (id, newStatus, reason = '') => {
    setSessionsList(prev => prev.map(ses => {
      if (ses.id === id) {
        return {
          ...ses,
          status: newStatus,
          statusColor: newStatus === 'Completed' ? 'gray' : newStatus === 'In Progress' ? 'emerald' : newStatus === 'Not Conducted' ? 'rose' : 'teal',
          reasonNotConducted: reason || ses.reasonNotConducted
        };
      }
      return ses;
    }));
  };

  // --- HEALTH SERVICES ENTRY ---
  const addServiceEntry = (category, data) => {
    if (category === 'test') {
      setHealthServices(prev => ({
        ...prev,
        testRecords: [data, ...prev.testRecords],
        stats: { ...prev.stats, diagnosticTestsConducted: prev.stats.diagnosticTestsConducted + 1 }
      }));
    } else if (category === 'ncd') {
      setHealthServices(prev => ({
        ...prev,
        ncdScreeningsList: [data, ...prev.ncdScreeningsList],
        stats: { ...prev.stats, ncdScreenings: prev.stats.ncdScreenings + 1 }
      }));
    } else if (category === 'telemedicine') {
      setHealthServices(prev => ({
        ...prev,
        telemedicineList: [data, ...prev.telemedicineList],
        stats: { ...prev.stats, telemedicineConsults: prev.stats.telemedicineConsults + 1 }
      }));
    }
  };

  // --- CHHATTIPURTI METHODS ---
  const addChhattipurtiTransaction = (tx) => {
    const newTx = {
      ...tx,
      id: `TX-0${chhattipurtiLedger.transactions.length + 1}`,
      date: new Date().toISOString().split('T')[0]
    };
    const newBal = chhattipurtiLedger.balances.closingBalance + (tx.credit || 0) - (tx.debit || 0);

    setChhattipurtiLedger(prev => ({
      balances: {
        ...prev.balances,
        earnedLeave: prev.balances.earnedLeave + (tx.credit || 0),
        usedLeave: prev.balances.usedLeave + (tx.debit || 0),
        closingBalance: newBal
      },
      transactions: [{ ...newTx, balance: newBal }, ...prev.transactions]
    }));
  };

  // --- PORTAL PENDING RETRY ---
  const retryPortalSync = (pendingId) => {
    setPortalPendingList(prev => prev.map(item => {
      if (item.id === pendingId) {
        return { ...item, entryStatus: 'Retrying Sync...', retryCount: item.retryCount + 1 };
      }
      return item;
    }));

    setTimeout(() => {
      setPortalPendingList(prev => prev.filter(item => item.id !== pendingId));
    }, 1500);
  };

  const syncAllPending = () => {
    setPortalPendingList(prev => prev.map(p => ({ ...p, entryStatus: 'Syncing...' })));
    setTimeout(() => {
      setPortalPendingList([]);
    }, 2000);
  };

  // --- BACKUP & RESTORE ---
  const generateNewBackup = () => {
    const today = new Date().toISOString().split('T')[0];
    const newBkp = {
      id: `BKP-0${backupRestore.backupsList.length + 1}`,
      filename: `Tikakaran_SC49201_Manual_${today}.json`,
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      size: "4.3 MB",
      records: `${childrenList.length} Children, ${pregnantWomenList.length} PW, ${sessionsList.length} Sessions`,
      checksum: `SHA256: ${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
      type: "Manual Export",
      status: "Verified Safe"
    };

    setBackupRestore(prev => ({
      ...prev,
      lastBackupDate: "Just now",
      totalBackups: prev.totalBackups + 1,
      backupsList: [newBkp, ...prev.backupsList]
    }));

    // Trigger JSON download
    const exportData = {
      subCentre: anmProfile,
      children: childrenList,
      pregnantWomen: pregnantWomenList,
      sites: sitesList,
      sessions: sessionsList,
      healthServices,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = newBkp.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const restoreFromData = (parsedJson) => {
    if (parsedJson.children) setChildrenList(parsedJson.children);
    if (parsedJson.pregnantWomen) setPregnantWomenList(parsedJson.pregnantWomen);
    if (parsedJson.sites) setSitesList(parsedJson.sites);
    if (parsedJson.sessions) setSessionsList(parsedJson.sessions);
  };

  // --- ACTIVITIES ---
  const addActivity = (act) => {
    setRecentActivities(prev => [{ id: `ACT-${Date.now()}`, ...act }, ...prev.slice(0, 10)]);
  };

  return (
    <HealthDataContext.Provider value={{
      childrenList,
      addChild,
      updateChild,
      deleteChild,
      recordVaccineAdministered,
      pregnantWomenList,
      addPregnantWoman,
      updatePregnantWoman,
      deletePregnantWoman,
      sitesList,
      addSite,
      updateSite,
      sessionsList,
      addSession,
      updateSessionStatus,
      healthServices,
      addServiceEntry,
      hmisReports,
      dutyAttendance,
      chhattipurtiLedger,
      addChhattipurtiTransaction,
      portalPendingList,
      retryPortalSync,
      syncAllPending,
      backupRestore,
      generateNewBackup,
      restoreFromData,
      stats,
      anmProfile,
      recentActivities
    }}>
      {children}
    </HealthDataContext.Provider>
  );
}

export function useHealthData() {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
}

