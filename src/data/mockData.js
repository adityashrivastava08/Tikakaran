export const anmProfile = {
  name: "Sunita Sharma",
  role: "Auxiliary Nurse Midwife (ANM)",
  designation: "ANM / Multi-Purpose Health Worker (Female)",
  subCentre: "Health Sub Centre Pipariya",
  subCentreCode: "SC-49201",
  phc: "PHC Rampur",
  block: "Rampur Block",
  district: "Hoshangabad",
  state: "Madhya Pradesh",
  hmisPortalId: "HMIS-MP-77821",
  coldChainTemp: "4.2°C",
  coldChainStatus: "Optimal (2°C - 8°C)",
  avatar: "https://images.unsplash.com/photo-1594824813581-229d71c4c95d?auto=format&fit=crop&q=80&w=200",
  lastSync: "Today, 10:45 AM"
};

export const statsCardsData = [
  {
    id: "total-children",
    title: "Total Registered Children",
    value: 1250,
    formattedValue: "1,250",
    icon: "Baby",
    subtitle: "Registered beneficiaries",
    trend: "+8.4%",
    trendType: "positive",
    badge: "96.1% Target",
    accentBg: "bg-emerald-50",
    iconBg: "bg-[#E6F4F1] text-[#075E54]",
    detail: "Age 0–5 Years in Sub Centre catchment"
  },
  {
    id: "pregnant-women",
    title: "Pregnant Women",
    value: 245,
    formattedValue: "245",
    icon: "HeartPulse",
    subtitle: "Active registrations",
    trend: "+12 New",
    trendType: "positive",
    badge: "92% 1st Tri",
    accentBg: "bg-teal-50",
    iconBg: "bg-[#E0F2FE] text-[#0284C7]",
    detail: "12 High-Risk Pregnancies tracked"
  },
  {
    id: "vaccination-due",
    title: "Vaccination Due",
    value: 86,
    formattedValue: "86",
    icon: "Syringe",
    subtitle: "Upcoming vaccinations",
    trend: "38 Today",
    trendType: "warning",
    badge: "Active Roster",
    accentBg: "bg-amber-50",
    iconBg: "bg-[#FEF3C7] text-[#D97706]",
    detail: "38 due in today's village sessions"
  },
  {
    id: "overdue-vaccinations",
    title: "Overdue Vaccinations",
    value: 24,
    formattedValue: "24",
    icon: "CalendarClock",
    subtitle: "Require follow-up",
    trend: "-6 vs Last Mo",
    trendType: "negative",
    badge: "Follow-up Needed",
    accentBg: "bg-rose-50",
    iconBg: "bg-[#FEE2E2] text-[#DC2626]",
    detail: "18 visited by ASHA, 6 pending"
  }
];

export const monthlyChartData = [
  { name: "Jan", completed: 110, pending: 18, target: 120 },
  { name: "Feb", completed: 125, pending: 15, target: 130 },
  { name: "Mar", completed: 140, pending: 22, target: 145 },
  { name: "Apr", completed: 132, pending: 25, target: 140 },
  { name: "May", completed: 158, pending: 19, target: 160 },
  { name: "Jun", completed: 145, pending: 28, target: 150 },
  { name: "Jul", completed: 168, pending: 14, target: 170 },
  { name: "Aug", completed: 175, pending: 20, target: 180 },
  { name: "Sep", completed: 160, pending: 16, target: 165 },
  { name: "Oct", completed: 182, pending: 21, target: 185 },
  { name: "Nov", completed: 148, pending: 32, target: 175 },
  { name: "Dec", completed: 165, pending: 24, target: 180 }
];

export const weeklyChartData = [
  { name: "Mon", completed: 28, pending: 6, target: 30 },
  { name: "Tue", completed: 34, pending: 4, target: 35 },
  { name: "Wed", completed: 42, pending: 8, target: 45 },
  { name: "Thu", completed: 22, pending: 5, target: 25 },
  { name: "Fri", completed: 38, pending: 7, target: 40 },
  { name: "Sat", completed: 19, pending: 2, target: 20 }
];

export const yearlyChartData = [
  { name: "2023", completed: 1420, pending: 280, target: 1600 },
  { name: "2024", completed: 1680, pending: 210, target: 1800 },
  { name: "2025", completed: 1890, pending: 160, target: 1950 },
  { name: "2026 (YTD)", completed: 1708, pending: 244, target: 1850 }
];

export const initialSites = [
  { id: 'SIT-01', name: 'Anganwadi Kendra Pipariya Ward-04', code: 'AWC-04', village: 'Pipariya', type: 'Anganwadi', asha: 'Sunita Malviya', ashaPhone: '+91 98261 44521', beneficiaries: 180, sessionsDone: 2, totalSessions: 2, status: 'Active', day: '1st Wednesday' },
  { id: 'SIT-02', name: 'Health Sub-Centre Main Booth', code: 'SC-MAIN', village: 'Pipariya Central', type: 'Sub-Centre', asha: 'Rajeshwari Bai', ashaPhone: '+91 94250 88102', beneficiaries: 320, sessionsDone: 3, totalSessions: 4, status: 'Active', day: 'Every Friday' },
  { id: 'SIT-03', name: 'Anganwadi Kendra Khera Basti', code: 'AWC-07', village: 'Khera Basti', type: 'Anganwadi', asha: 'Geeta Verma', ashaPhone: '+91 91312 90034', beneficiaries: 140, sessionsDone: 2, totalSessions: 2, status: 'Active', day: '2nd Wednesday' },
  { id: 'SIT-04', name: 'Gram Panchayat Bhavan Booth', code: 'GP-HALL', village: 'Gram Panchayat', type: 'Panchayat', asha: 'Anita Rathore', ashaPhone: '+91 98270 12093', beneficiaries: 210, sessionsDone: 2, totalSessions: 2, status: 'Active', day: '3rd Thursday' },
  { id: 'SIT-05', name: 'Anganwadi Kendra Pipariya Ward-02', code: 'AWC-02', village: 'Pipariya Ward 2', type: 'Anganwadi', asha: 'Kavita Bai', ashaPhone: '+91 98260 55192', beneficiaries: 165, sessionsDone: 2, totalSessions: 2, status: 'Active', day: '3rd Wednesday' },
  { id: 'SIT-06', name: 'Primary Vidyalaya Khera School', code: 'SCH-01', village: 'Khera', type: 'School', asha: 'Meera Devi', ashaPhone: '+91 94251 33214', beneficiaries: 95, sessionsDone: 1, totalSessions: 1, status: 'Active', day: '4th Tuesday' },
  { id: 'SIT-07', name: 'Outreach Camp Mandir Chowk', code: 'OC-03', village: 'Mandir Chowk', type: 'Outreach', asha: 'Shanti Bai', ashaPhone: '+91 91310 44590', beneficiaries: 70, sessionsDone: 1, totalSessions: 1, status: 'Active', day: '4th Wednesday' },
  { id: 'SIT-08', name: 'Anganwadi Kendra Ward-01 (Harijan Basti)', code: 'AWC-01', village: 'Pipariya Ward 1', type: 'Anganwadi', asha: 'Laxmi Ahirwar', ashaPhone: '+91 97554 88201', beneficiaries: 70, sessionsDone: 1, totalSessions: 2, status: 'Active', day: '1st Thursday' }
];

export const todaySessions = [
  {
    id: "SES-01",
    siteName: "Anganwadi Kendra Pipariya Ward-04",
    locationType: "Anganwadi Center",
    time: "09:00 AM – 01:00 PM",
    date: "2026-11-03",
    beneficiariesCount: 32,
    beneficiariesDone: 24,
    pregnantWomenCount: 6,
    status: "In Progress",
    statusColor: "emerald",
    ashaWorker: "Sunita Malviya",
    vaccines: ["BCG", "Pentavalent-1,2,3", "Rotavirus", "bOPV", "PCV"],
    contactNumber: "+91 98261 44521"
  },
  {
    id: "SES-02",
    siteName: "Health Sub-Centre Main Booth",
    locationType: "Sub Centre Facility",
    time: "01:30 PM – 03:30 PM",
    date: "2026-11-03",
    beneficiariesCount: 26,
    beneficiariesDone: 0,
    pregnantWomenCount: 8,
    status: "Scheduled",
    statusColor: "teal",
    ashaWorker: "Rajeshwari Bai",
    vaccines: ["MR-1 (Measles-Rubella)", "Vitamin A", "JE-1", "DPT Booster"],
    contactNumber: "+91 94250 88102"
  },
  {
    id: "SES-03",
    siteName: "Anganwadi Kendra Khera Basti",
    locationType: "Outreach Booth",
    time: "03:45 PM – 05:00 PM",
    date: "2026-11-03",
    beneficiariesCount: 18,
    beneficiariesDone: 0,
    pregnantWomenCount: 4,
    status: "Scheduled",
    statusColor: "teal",
    ashaWorker: "Geeta Verma",
    vaccines: ["Pentavalent-1", "fIPV", "Td Pregnant Women"],
    contactNumber: "+91 91312 90034"
  },
  {
    id: "SES-04",
    siteName: "Gram Panchayat Bhavan Booth",
    locationType: "Village Panchayat",
    time: "07:30 AM – 08:45 AM",
    date: "2026-11-03",
    beneficiariesCount: 10,
    beneficiariesDone: 10,
    pregnantWomenCount: 2,
    status: "Completed",
    statusColor: "gray",
    ashaWorker: "Anita Rathore",
    vaccines: ["Td Booster (10 & 16 Yrs)"],
    contactNumber: "+91 98270 12093"
  },
  {
    id: "SES-05",
    siteName: "Primary Vidyalaya Khera School",
    locationType: "School Outreach",
    time: "10:00 AM – 01:00 PM",
    date: "2026-11-05",
    beneficiariesCount: 22,
    beneficiariesDone: 0,
    pregnantWomenCount: 0,
    status: "Scheduled",
    statusColor: "teal",
    ashaWorker: "Meera Devi",
    vaccines: ["Td-10 Yr", "Td-16 Yr"],
    contactNumber: "+91 94251 33214"
  },
  {
    id: "SES-06",
    siteName: "Outreach Camp Mandir Chowk",
    locationType: "Special Outreach",
    time: "09:00 AM – 12:00 PM",
    date: "2026-10-28",
    beneficiariesCount: 15,
    beneficiariesDone: 0,
    pregnantWomenCount: 3,
    status: "Not Conducted",
    statusColor: "rose",
    ashaWorker: "Shanti Bai",
    vaccines: ["Routine Immunization All Antigens"],
    contactNumber: "+91 91310 44590",
    reasonNotConducted: "Heavy rainfall and road block in river culvert"
  }
];

export const hmisProgressData = {
  month: "October 2026",
  reportCode: "Form-7 HMIS Sub Centre Return",
  completionPercentage: 78,
  reportStatus: "Draft – Due in 4 days (7th Nov)",
  statusBadge: "Action Required",
  totalCompletedFields: 142,
  totalFields: 168,
  pendingFields: 26,
  sections: [
    { name: "Maternal Health (ANC & Delivery)", completed: 48, total: 52, pct: 92 },
    { name: "Child Immunization (0-5 Years)", completed: 62, total: 70, pct: 88 },
    { name: "Family Planning & Supplies", completed: 32, total: 46, pct: 69 }
  ],
  validationIssues: [
    "Verify 2 home deliveries reported with cord care",
    "Missing batch lot number for Pentavalent vial 23A"
  ]
};

export const siteStatisticsData = {
  totalActiveSites: 8,
  totalCatchmentPopulation: "6,420",
  childrenRegisteredTotal: 1250,
  ageBreakdown: [
    { label: "0–11 Months (Infants)", count: 420, pct: 33.6, color: "#075E54" },
    { label: "12–23 Months (Toddlers)", count: 380, pct: 30.4, color: "#10B981" },
    { label: "2–5 Years (Preschool)", count: 450, pct: 36.0, color: "#3B82F6" }
  ],
  sessionsConducted: 14,
  sessionsPlanned: 16,
  conductedPct: 87.5,
  coldChainEquipment: "ILR Model Small (22 Litres)",
  storageTemperature: "4.2°C (Safe Range: 2°C – 8°C)"
};

export const recentActivitiesData = [
  {
    id: "ACT-01",
    type: "registration",
    title: "New Child Registered",
    description: "Aarav Sharma (s/o Priya Devi) added with RCH ID #9842100412",
    village: "Pipariya Ward 04",
    time: "14 mins ago",
    icon: "Baby",
    iconBg: "bg-emerald-100 text-[#075E54]",
    action: "View Profile"
  },
  {
    id: "ACT-02",
    type: "vaccination",
    title: "Vaccination Entry Recorded",
    description: "Pentavalent-1 & bOPV-1 administered to Kabir Verma",
    village: "Sub-Centre Booth",
    time: "48 mins ago",
    icon: "Syringe",
    iconBg: "bg-teal-100 text-[#075E54]",
    action: "Print Certificate"
  },
  {
    id: "ACT-03",
    type: "hmis",
    title: "HMIS Report Section 2.2 Generated",
    description: "Monthly Child Immunization indicators aggregated for Sub-Centre",
    village: "Health Sub Centre",
    time: "2 hours ago",
    icon: "FileSpreadsheet",
    iconBg: "bg-amber-100 text-amber-700",
    action: "Download XML"
  },
  {
    id: "ACT-04",
    type: "attendance",
    title: "Session Attendance & Vitals Synced",
    description: "Duty verified at Pipariya Ward-04 session with ASHA Sunita",
    village: "Ward 04 Booth",
    time: "3.5 hours ago",
    icon: "ClipboardCheck",
    iconBg: "bg-blue-100 text-blue-700",
    action: "Verify Log"
  },
  {
    id: "ACT-05",
    type: "alert",
    title: "Overdue Follow-up Reminder Sent",
    description: "ASHA worker alerted for 4 missed MR-1 doses in Khera Basti",
    village: "Khera Basti",
    time: "Yesterday, 05:20 PM",
    icon: "CalendarClock",
    iconBg: "bg-rose-100 text-rose-700",
    action: "Roster Due"
  }
];

export const initialChildren = [
  {
    id: "CHD-01",
    rchId: "9842100412",
    name: "Aarav Sharma",
    dob: "2026-08-18",
    age: "2.5 Months",
    ageMonths: 2.5,
    gender: "Male",
    motherName: "Priya Devi",
    fatherName: "Ramesh Sharma",
    mobile: "+91 98261 55410",
    village: "Pipariya",
    site: "Anganwadi Kendra Pipariya Ward-04",
    awc: "AWC-04",
    dueVaccine: "Pentavalent-2, bOPV-2, Rota-2",
    dose: "Dose 2",
    dueDate: "2026-11-03",
    status: "Due Today",
    weight: "5.4 kg",
    asha: "Sunita Malviya",
    vaccinationHistory: [
      { vaccine: "BCG", dose: "Birth", date: "2026-08-18", status: "Administered", batch: "BCG-22B", by: "ANM Sunita Sharma" },
      { vaccine: "bOPV-0", dose: "Birth", date: "2026-08-18", status: "Administered", batch: "OPV-99A", by: "ANM Sunita Sharma" },
      { vaccine: "Hep-B", dose: "Birth", date: "2026-08-18", status: "Administered", batch: "HEP-04K", by: "ANM Sunita Sharma" },
      { vaccine: "Pentavalent-1", dose: "Dose 1", date: "2026-09-30", status: "Administered", batch: "PV-558", by: "ANM Sunita Sharma" },
      { vaccine: "bOPV-1", dose: "Dose 1", date: "2026-09-30", status: "Administered", batch: "OPV-102", by: "ANM Sunita Sharma" },
      { vaccine: "Rota-1", dose: "Dose 1", date: "2026-09-30", status: "Administered", batch: "RT-884", by: "ANM Sunita Sharma" },
      { vaccine: "fIPV-1", dose: "Dose 1", date: "2026-09-30", status: "Administered", batch: "IPV-31C", by: "ANM Sunita Sharma" },
      { vaccine: "Pentavalent-2", dose: "Dose 2", date: "2026-11-03", status: "Due Today", batch: "--", by: "--" },
      { vaccine: "bOPV-2", dose: "Dose 2", date: "2026-11-03", status: "Due Today", batch: "--", by: "--" }
    ]
  },
  {
    id: "CHD-02",
    rchId: "9842100887",
    name: "Ananya Pal",
    dob: "2026-01-15",
    age: "9.5 Months",
    ageMonths: 9.5,
    gender: "Female",
    motherName: "Meena Pal",
    fatherName: "Dinesh Pal",
    mobile: "+91 94250 11983",
    village: "Khera Basti",
    site: "Anganwadi Kendra Khera Basti",
    awc: "AWC-07",
    dueVaccine: "MR-1, Vit-A (Dose 1), JE-1",
    dose: "Dose 1 (9 Mo)",
    dueDate: "2026-10-24",
    status: "Overdue",
    weight: "7.8 kg",
    asha: "Geeta Verma",
    vaccinationHistory: [
      { vaccine: "BCG", dose: "Birth", date: "2026-01-15", status: "Administered", batch: "BCG-11X", by: "Staff Nurse PHC" },
      { vaccine: "Pentavalent-3", dose: "Dose 3", date: "2026-04-28", status: "Administered", batch: "PV-441", by: "ANM Sunita Sharma" },
      { vaccine: "bOPV-3", dose: "Dose 3", date: "2026-04-28", status: "Administered", batch: "OPV-88", by: "ANM Sunita Sharma" },
      { vaccine: "fIPV-2", dose: "Dose 2", date: "2026-04-28", status: "Administered", batch: "IPV-20", by: "ANM Sunita Sharma" },
      { vaccine: "MR-1", dose: "Dose 1", date: "2026-10-24", status: "Overdue", batch: "--", by: "--" },
      { vaccine: "Vitamin A", dose: "Dose 1", date: "2026-10-24", status: "Overdue", batch: "--", by: "--" }
    ]
  },
  {
    id: "CHD-03",
    rchId: "9842101290",
    name: "Kabir Verma",
    dob: "2026-09-16",
    age: "1.5 Months",
    ageMonths: 1.5,
    gender: "Male",
    motherName: "Radha Verma",
    fatherName: "Sanjay Verma",
    mobile: "+91 91312 44321",
    village: "Pipariya",
    site: "Health Sub-Centre Main Booth",
    awc: "SC-MAIN",
    dueVaccine: "Pentavalent-1, bOPV-1, fIPV-1",
    dose: "Dose 1 (6 Wk)",
    dueDate: "2026-11-03",
    status: "Due Today",
    weight: "4.8 kg",
    asha: "Rajeshwari Bai",
    vaccinationHistory: [
      { vaccine: "BCG", dose: "Birth", date: "2026-09-16", status: "Administered", batch: "BCG-90", by: "Hospital Delivery" },
      { vaccine: "Pentavalent-1", dose: "Dose 1", date: "2026-11-03", status: "Due Today", batch: "--", by: "--" }
    ]
  },
  {
    id: "CHD-04",
    rchId: "9842100234",
    name: "Diya Patel",
    dob: "2025-06-25",
    age: "16 Months",
    ageMonths: 16,
    gender: "Female",
    motherName: "Pooja Patel",
    fatherName: "Vikas Patel",
    mobile: "+91 98270 33812",
    village: "Pipariya Ward 2",
    site: "Anganwadi Kendra Pipariya Ward-02",
    awc: "AWC-02",
    dueVaccine: "DPT Booster-1, OPV Booster",
    dose: "Booster 1 (16-24 Mo)",
    dueDate: "2026-11-10",
    status: "Upcoming",
    weight: "9.6 kg",
    asha: "Kavita Bai",
    vaccinationHistory: [
      { vaccine: "MR-1", dose: "Dose 1", date: "2026-03-30", status: "Administered", batch: "MR-300", by: "ANM Sunita Sharma" },
      { vaccine: "DPT Booster-1", dose: "Booster 1", date: "2026-11-10", status: "Upcoming", batch: "--", by: "--" }
    ]
  },
  {
    id: "CHD-05",
    rchId: "9842100511",
    name: "Shivam Ahirwar",
    dob: "2026-08-01",
    age: "3 Months",
    ageMonths: 3,
    gender: "Male",
    motherName: "Sunita Ahirwar",
    fatherName: "Deepak Ahirwar",
    mobile: "+91 97554 99120",
    village: "Pipariya Ward 1",
    site: "Anganwadi Kendra Ward-01 (Harijan Basti)",
    awc: "AWC-01",
    dueVaccine: "Pentavalent-3, bOPV-3",
    dose: "Dose 3 (14 Wk)",
    dueDate: "2026-11-14",
    status: "Upcoming",
    weight: "6.1 kg",
    asha: "Laxmi Ahirwar",
    vaccinationHistory: [
      { vaccine: "Pentavalent-2", dose: "Dose 2", date: "2026-10-05", status: "Administered", batch: "PV-512", by: "ANM Sunita Sharma" }
    ]
  },
  {
    id: "CHD-06",
    rchId: "9842100652",
    name: "Roshni Kushwaha",
    dob: "2025-11-10",
    age: "12 Months",
    ageMonths: 12,
    gender: "Female",
    motherName: "Kamla Kushwaha",
    fatherName: "Mohan Kushwaha",
    mobile: "+91 98261 77412",
    village: "Khera",
    site: "Primary Vidyalaya Khera School",
    awc: "SCH-01",
    dueVaccine: "MR-1, Vit-A Dose 1",
    dose: "Dose 1",
    dueDate: "2026-10-15",
    status: "Overdue",
    weight: "8.2 kg",
    asha: "Meera Devi",
    vaccinationHistory: [
      { vaccine: "Pentavalent-3", dose: "Dose 3", date: "2026-03-12", status: "Administered", batch: "PV-301", by: "ANM Sunita Sharma" }
    ]
  },
  {
    id: "CHD-07",
    rchId: "9842100799",
    name: "Manish Gond",
    dob: "2026-09-02",
    age: "2 Months",
    ageMonths: 2,
    gender: "Male",
    motherName: "Sita Gond",
    fatherName: "Kailash Gond",
    mobile: "+91 91310 66209",
    village: "Mandir Chowk",
    site: "Outreach Camp Mandir Chowk",
    awc: "OC-03",
    dueVaccine: "Pentavalent-1, Rota-1",
    dose: "Dose 1",
    dueDate: "2026-11-03",
    status: "Due Today",
    weight: "5.0 kg",
    asha: "Shanti Bai",
    vaccinationHistory: [
      { vaccine: "BCG", dose: "Birth", date: "2026-09-02", status: "Administered", batch: "BCG-99", by: "Sub-Centre" }
    ]
  },
  {
    id: "CHD-08",
    rchId: "9842100101",
    name: "Tanya Malviya",
    dob: "2024-05-12",
    age: "2.5 Years",
    ageMonths: 30,
    gender: "Female",
    motherName: "Reena Malviya",
    fatherName: "Santosh Malviya",
    mobile: "+91 98265 44102",
    village: "Pipariya",
    site: "Anganwadi Kendra Pipariya Ward-04",
    awc: "AWC-04",
    dueVaccine: "Vitamin A Dose 4",
    dose: "Dose 4 (Bi-annual)",
    dueDate: "2026-10-01",
    status: "Completed",
    weight: "12.4 kg",
    asha: "Sunita Malviya",
    vaccinationHistory: [
      { vaccine: "DPT Booster-1", dose: "Booster 1", date: "2025-12-14", status: "Administered", batch: "DPT-44", by: "ANM Sunita Sharma" },
      { vaccine: "Vitamin A", dose: "Dose 4", date: "2026-10-01", status: "Administered", batch: "VA-102", by: "ANM Sunita Sharma" }
    ]
  }
];

export const initialPregnantWomen = [
  {
    id: "PW-01",
    rchId: "9842200115",
    name: "Riya Sen",
    age: 24,
    mobile: "+91 98260 77123",
    husbandName: "Sunil Sen",
    lmp: "2026-05-14",
    edd: "2027-02-18",
    village: "Pipariya",
    site: "Anganwadi Kendra Pipariya Ward-04",
    awc: "AWC-04",
    hrpStatus: "No (Normal)",
    trimester: "2nd Trimester (24 Wks)",
    anc1Date: "2026-07-10 (Done)",
    anc2Date: "2026-09-18 (Done)",
    anc3Date: "2026-11-03 (Due Today)",
    anc4Date: "2026-12-28 (Scheduled)",
    td1: "Administered (10 Jul 2026)",
    td2: "Administered (18 Sep 2026)",
    tdBooster: "Not Required",
    ifaCount: 180,
    calciumCount: 180,
    hb: "11.2 g/dL (Normal)",
    bp: "118/78 mmHg",
    weight: "56 kg",
    highRiskReason: "None",
    asha: "Sunita Malviya"
  },
  {
    id: "PW-02",
    rchId: "9842200388",
    name: "Sunita Sahu",
    age: 28,
    mobile: "+91 97554 99012",
    husbandName: "Ramesh Sahu",
    lmp: "2026-04-02",
    edd: "2027-01-07",
    village: "Khera Basti",
    site: "Anganwadi Kendra Khera Basti",
    awc: "AWC-07",
    hrpStatus: "Yes (High Risk - Severe Anemia)",
    trimester: "3rd Trimester (30 Wks)",
    anc1Date: "2026-06-04 (Done)",
    anc2Date: "2026-08-15 (Done)",
    anc3Date: "2026-10-12 (Done)",
    anc4Date: "2026-11-15 (Upcoming)",
    td1: "Administered (04 Jun 2026)",
    td2: "Administered (15 Aug 2026)",
    tdBooster: "Not Required",
    ifaCount: 240,
    calciumCount: 200,
    hb: "8.2 g/dL (Critical - Referred for IV Iron Sucrose at PHC)",
    bp: "124/82 mmHg",
    weight: "51 kg",
    highRiskReason: "Severe Anemia Hb < 9 g/dL. Under MO observation.",
    asha: "Geeta Verma"
  },
  {
    id: "PW-03",
    rchId: "9842200540",
    name: "Pooja Kushwaha",
    age: 22,
    mobile: "+91 94250 88912",
    husbandName: "Manoj Kushwaha",
    lmp: "2026-08-01",
    edd: "2027-05-08",
    village: "Pipariya Central",
    site: "Health Sub-Centre Main Booth",
    awc: "SC-MAIN",
    hrpStatus: "No (Normal)",
    trimester: "1st Trimester (13 Wks)",
    anc1Date: "2026-10-05 (Done)",
    anc2Date: "2026-12-10 (Upcoming)",
    anc3Date: "2027-02-15 (Scheduled)",
    anc4Date: "2027-04-10 (Scheduled)",
    td1: "Administered (05 Oct 2026)",
    td2: "Due on 10 Dec 2026",
    tdBooster: "--",
    ifaCount: 100,
    calciumCount: 60,
    hb: "11.8 g/dL (Normal)",
    bp: "110/72 mmHg",
    weight: "48 kg",
    highRiskReason: "None (Primi Gravida)",
    asha: "Rajeshwari Bai"
  },
  {
    id: "PW-04",
    rchId: "9842200672",
    name: "Kavita Ahirwar",
    age: 31,
    mobile: "+91 98270 44199",
    husbandName: "Vinod Ahirwar",
    lmp: "2026-03-10",
    edd: "2026-12-15",
    village: "Pipariya Ward 1",
    site: "Anganwadi Kendra Ward-01 (Harijan Basti)",
    awc: "AWC-01",
    hrpStatus: "Yes (High Risk - Previous C-Section & PIH)",
    trimester: "3rd Trimester (34 Wks)",
    anc1Date: "2026-05-12 (Done)",
    anc2Date: "2026-07-20 (Done)",
    anc3Date: "2026-09-25 (Done)",
    anc4Date: "2026-11-08 (Due in 5 Days)",
    td1: "Administered (12 May 2026)",
    td2: "Administered (20 Jul 2026)",
    tdBooster: "Not Required",
    ifaCount: 200,
    calciumCount: 180,
    hb: "10.4 g/dL",
    bp: "142/94 mmHg (Pregnancy-Induced Hypertension)",
    weight: "64 kg",
    highRiskReason: "Blood Pressure 142/94 mmHg. Recommended for institutional delivery at District Hospital.",
    asha: "Laxmi Ahirwar"
  },
  {
    id: "PW-05",
    rchId: "9842200810",
    name: "Anita Meena",
    age: 26,
    mobile: "+91 91312 77014",
    husbandName: "Gopal Meena",
    lmp: "2026-06-20",
    edd: "2027-03-27",
    village: "Gram Panchayat",
    site: "Gram Panchayat Bhavan Booth",
    awc: "GP-HALL",
    hrpStatus: "No (Normal)",
    trimester: "2nd Trimester (19 Wks)",
    anc1Date: "2026-08-25 (Done)",
    anc2Date: "2026-11-03 (Due Today)",
    anc3Date: "2027-01-10 (Scheduled)",
    anc4Date: "2027-03-05 (Scheduled)",
    td1: "Administered (25 Aug 2026)",
    td2: "Due Today (03 Nov 2026)",
    tdBooster: "--",
    ifaCount: 120,
    calciumCount: 100,
    hb: "11.0 g/dL",
    bp: "120/78 mmHg",
    weight: "53 kg",
    highRiskReason: "None",
    asha: "Anita Rathore"
  }
];

export const healthServicesData = {
  stats: {
    familyPlanningUsers: 342,
    supplementsDistributed: 1840,
    ncdScreenings: 512,
    telemedicineConsults: 64,
    bhavyaSyncedRecords: 480,
    diagnosticTestsConducted: 320
  },
  commoditiesStock: [
    { name: "Condoms (Nirodh)", category: "Spacing", stock: "650 pcs", minLevel: "200 pcs", status: "Adequate" },
    { name: "Mala-N (Combined OCP)", category: "Oral Pills", stock: "140 cycles", minLevel: "50 cycles", status: "Adequate" },
    { name: "Chhaya (Centchroman)", category: "Weekly Pill", stock: "95 strips", minLevel: "30 strips", status: "Adequate" },
    { name: "Antara Injections (MPA)", category: "Injectable", stock: "28 vials", minLevel: "15 vials", status: "Safe" },
    { name: "IFA Red Tablets (Pregnant)", category: "Supplements", stock: "3,200 tabs", minLevel: "1,000 tabs", status: "Optimal" },
    { name: "IFA Blue Tablets (Adolescent)", category: "Supplements", stock: "2,400 tabs", minLevel: "800 tabs", status: "Optimal" },
    { name: "Albendazole 400mg", category: "Deworming", stock: "450 tabs", minLevel: "200 tabs", status: "Adequate" },
    { name: "Vitamin A Solution", category: "Immunization", stock: "18 bottles", minLevel: "10 bottles", status: "Adequate" },
    { name: "Zinc Tablets (20mg)", category: "Child Diarrhea", stock: "600 tabs", minLevel: "200 tabs", status: "Adequate" },
    { name: "ORS Packets", category: "Rehydration", stock: "180 pkts", minLevel: "100 pkts", status: "Adequate" }
  ],
  ncdScreeningsList: [
    { id: "NCD-01", name: "Kailash Sharma", age: 54, gender: "Male", village: "Pipariya", bp: "148/92 mmHg", rbs: "186 mg/dL", screening: "Hypertension & Diabetes Suspected", referral: "Referred to MO Rampur PHC", date: "2026-11-02" },
    { id: "NCD-02", name: "Kamla Bai", age: 48, gender: "Female", village: "Khera", bp: "122/80 mmHg", rbs: "112 mg/dL", screening: "Oral/Cervical Normal", referral: "None (Routine Followup)", date: "2026-11-01" },
    { id: "NCD-03", name: "Rameshwar Gond", age: 62, gender: "Male", village: "Gram Panchayat", bp: "160/98 mmHg", rbs: "220 mg/dL", screening: "High BP Stage 2", referral: "PHC Non-Communicable Clinic", date: "2026-10-30" }
  ],
  telemedicineList: [
    { id: "TM-01", patient: "Sunita Sahu (Severe Anemia PW)", doctor: "Dr. A.K. Verma (MBBS, PHC Rampur)", date: "2026-11-02", diagnosis: "Advised 2 Doses IV Iron Sucrose at PHC daycare", status: "Completed" },
    { id: "TM-02", patient: "Baby Aarav (Mild Skin Rash)", doctor: "Dr. Neha Saxena (Pediatrician, CHC Babai)", date: "2026-10-29", diagnosis: "Prescribed Calamine & Hydrocortisone 1%", status: "Completed" }
  ],
  testRecords: [
    { id: "TST-01", testName: "Hemoglobin (Sahli/Hemocue)", beneficiary: "Riya Sen", result: "11.2 g/dL", status: "Normal", date: "2026-11-03" },
    { id: "TST-02", testName: "Urine Albumin & Sugar", beneficiary: "Kavita Ahirwar", result: "Albumin: Trace, Sugar: Nil", status: "Pre-Eclampsia Watch", date: "2026-11-02" },
    { id: "TST-03", testName: "Pregnancy Test (Nischay Kit)", beneficiary: "Meena Patel", result: "Positive (Pregnancy Confirmed)", status: "New ANC Registered", date: "2026-11-01" },
    { id: "TST-04", testName: "Malaria RDT", beneficiary: "Babloo Verma", result: "Negative for Pf / Pv", status: "Non-Malarial Fever", date: "2026-10-31" }
  ]
};

export const hmisReportsData = [
  {
    id: "REP-01",
    code: "MOHFW-SC-07",
    name: "HMIS SC Format (Sub-Centre Form-7 Monthly Return)",
    description: "Official MoHFW national monthly return with all 168 indicators across maternal, child, and family welfare.",
    month: "October 2026",
    status: "Draft (78% Complete)",
    statusColor: "amber",
    mandatoryFields: 168,
    filledFields: 142,
    lastGenerated: "02 Nov 2026, 04:30 PM",
    fileSize: "184 KB"
  },
  {
    id: "REP-02",
    code: "VHSND-ANM-01",
    name: "Arogya Diwas ANM (VHSND Monthly Report)",
    description: "Village Health Sanitation and Nutrition Day consolidated report with weight records and nutrition counseling.",
    month: "October 2026",
    status: "Verified & Complete",
    statusColor: "emerald",
    mandatoryFields: 45,
    filledFields: 45,
    lastGenerated: "01 Nov 2026, 06:15 PM",
    fileSize: "92 KB"
  },
  {
    id: "REP-03",
    code: "RI-RCH-04",
    name: "Regular Immunization ANM (RI Monthly Return)",
    description: "Comprehensive antigen-wise coverage sheet (BCG, Penta 1-3, bOPV, fIPV, MR, Vit-A, DPT Booster, Td).",
    month: "October 2026",
    status: "Verified & Complete",
    statusColor: "emerald",
    mandatoryFields: 52,
    filledFields: 52,
    lastGenerated: "31 Oct 2026, 05:00 PM",
    fileSize: "128 KB"
  },
  {
    id: "REP-04",
    code: "ELA-HSC-03",
    name: "HSC Monthly ELA (Expected Level of Achievement)",
    description: "Target versus achievement matrix based on catchment population (6,420) and annual birth cohort.",
    month: "October 2026",
    status: "Ready for Export",
    statusColor: "teal",
    mandatoryFields: 38,
    filledFields: 36,
    lastGenerated: "02 Nov 2026, 11:20 AM",
    fileSize: "110 KB"
  },
  {
    id: "REP-05",
    code: "VAC-COV-09",
    name: "Vaccination Report (Cohort Analysis)",
    description: "Age-stratified coverage report for infants (0-11 mo), toddlers (12-23 mo), and children (2-5 yrs).",
    month: "October 2026",
    status: "Ready for Export",
    statusColor: "teal",
    mandatoryFields: 24,
    filledFields: 24,
    lastGenerated: "03 Nov 2026, 09:10 AM",
    fileSize: "96 KB"
  },
  {
    id: "REP-06",
    code: "NCD-LAB-02",
    name: "Services & Diagnostic Tests Report",
    description: "Laboratory diagnostics log covering Hb, Urine albumin, Malaria RDT, Blood Pressure, and Blood Sugar.",
    month: "October 2026",
    status: "Draft",
    statusColor: "amber",
    mandatoryFields: 30,
    filledFields: 26,
    lastGenerated: "01 Nov 2026, 02:40 PM",
    fileSize: "88 KB"
  },
  {
    id: "REP-07",
    code: "DUE-ANA-01",
    name: "Due List & Dropout Rate Analysis",
    description: "Dropouts tracking: BCG to Pentavalent-1 (2.1%), Penta-1 to Penta-3 (4.8%), Penta-3 to Measles-1 (6.2%).",
    month: "October 2026",
    status: "Verified & Complete",
    statusColor: "emerald",
    mandatoryFields: 18,
    filledFields: 18,
    lastGenerated: "02 Nov 2026, 01:15 PM",
    fileSize: "74 KB"
  },
  {
    id: "REP-08",
    code: "PORT-PEND-05",
    name: "Portal Pending Exception Report",
    description: "Listing of beneficiaries awaiting national U-WIN / RCH portal upload with error logs.",
    month: "November 2026",
    status: "Active (12 Pending)",
    statusColor: "rose",
    mandatoryFields: 12,
    filledFields: 12,
    lastGenerated: "Today, 10:45 AM",
    fileSize: "64 KB"
  }
];

export const dutyAttendanceData = {
  month: "November 2026",
  summary: {
    totalDays: 30,
    workingDays: 24,
    workedPresent: 20,
    weekOff: 4,
    sickLeave: 1,
    casualLeave: 1,
    holidays: 2,
    absent: 0,
    chhattipurtiLeave: 2,
    presentPercentage: 96
  },
  calendarDays: [
    { day: 1, weekday: "Sun", status: "WO", label: "Week Off", duty: "Weekly Holiday" },
    { day: 2, weekday: "Mon", status: "P", label: "Work", duty: "Sub-Centre OPD & Record Updation" },
    { day: 3, weekday: "Tue", status: "P", label: "Work", duty: "Session: Anganwadi Kendra Pipariya Ward-04 (Today)" },
    { day: 4, weekday: "Wed", status: "P", label: "Work", duty: "Session: Sub-Centre Main Booth" },
    { day: 5, weekday: "Thu", status: "P", label: "Work", duty: "School Outreach: Primary Vidyalaya Khera" },
    { day: 6, weekday: "Fri", status: "P", label: "Work", duty: "Sector Review Meeting at PHC Rampur" },
    { day: 7, weekday: "Sat", status: "P", label: "Work", duty: "HMIS Data Entry & Verification" },
    { day: 8, weekday: "Sun", status: "WO", label: "Week Off", duty: "Weekly Holiday" },
    { day: 9, weekday: "Mon", status: "P", label: "Work", duty: "Sub-Centre Antenatal Clinic (ANC Day)" },
    { day: 10, weekday: "Tue", status: "P", label: "Work", duty: "Session: Pipariya Ward-02" },
    { day: 11, weekday: "Wed", status: "P", label: "Work", duty: "Session: Khera Basti" },
    { day: 12, weekday: "Thu", status: "P", label: "Work", duty: "Field Visit: High Risk Pregnant Women Tracking" },
    { day: 13, weekday: "Fri", status: "CL", label: "CL", duty: "Casual Leave (Approved by MOIC)" },
    { day: 14, weekday: "Sat", status: "H", label: "Holiday", duty: "Govt Holiday (Diwali / Local Festive)" },
    { day: 15, weekday: "Sun", status: "WO", label: "Week Off", duty: "Weekly Holiday" },
    { day: 16, weekday: "Mon", status: "P", label: "Work", duty: "Sub-Centre OPD" },
    { day: 17, weekday: "Tue", status: "P", label: "Work", duty: "Session: Gram Panchayat Hall" },
    { day: 18, weekday: "Wed", status: "P", label: "Work", duty: "Special Immunization Mop-Up" },
    { day: 19, weekday: "Thu", status: "CHL", label: "Chhattipurti", duty: "Chhattipurti Leave (Compensatory Off)" },
    { day: 20, weekday: "Fri", status: "P", label: "Work", duty: "Sub-Centre Routine Care" },
    { day: 21, weekday: "Sat", status: "P", label: "Work", duty: "Cold Chain Maintenance & ILR Defrost" },
    { day: 22, weekday: "Sun", status: "WO", label: "Week Off", duty: "Weekly Holiday" },
    { day: 23, weekday: "Mon", status: "P", label: "Work", duty: "Sub-Centre Clinic" },
    { day: 24, weekday: "Tue", status: "P", label: "Work", duty: "Session: Mandir Chowk Camp" },
    { day: 25, weekday: "Wed", status: "P", label: "Work", duty: "Session: Harijan Basti AWC" },
    { day: 26, weekday: "Thu", status: "P", label: "Work", duty: "NCD Screening Village Camp" },
    { day: 27, weekday: "Fri", status: "P", label: "Work", duty: "ASHA Monthly Incentive Verification" },
    { day: 28, weekday: "Sat", status: "SL", label: "SL", duty: "Sick Leave (Medical Certificate on File)" },
    { day: 29, weekday: "Sun", status: "WO", label: "Week Off", duty: "Weekly Holiday" },
    { day: 30, weekday: "Mon", status: "P", label: "Work", duty: "Monthly Stock Reconciliation & Closure" }
  ],
  holidayDutyReport: [
    { date: "02 Oct 2026", occasion: "Gandhi Jayanti (National Holiday)", dutyType: "Pulse Polio Intensive Booth", hours: "08:00 AM – 05:00 PM", compensatoryCredit: "+1 Day Chhattipurti Leave", approved: "Yes (Dr. A.K. Verma)" },
    { date: "12 Oct 2026", occasion: "Sunday Special Session", dutyType: "Intensified Mission Indradhanush (IMI 5.0)", hours: "09:00 AM – 03:00 PM", compensatoryCredit: "+1 Day Chhattipurti Leave", approved: "Yes (BPM Rampur)" },
    { date: "24 Oct 2026", occasion: "Sunday Outreach Emergency", dutyType: "Measles Cluster Outbreak Investigation", hours: "10:00 AM – 04:00 PM", compensatoryCredit: "+1 Day Chhattipurti Leave", approved: "Yes (District RCH Officer)" }
  ]
};

export const chhattipurtiLedgerData = {
  balances: {
    openingBalance: 4,
    earnedLeave: 6,
    usedLeave: 3,
    closingBalance: 7
  },
  transactions: [
    { id: "TX-01", date: "2026-10-24", activity: "Measles Outbreak Field Investigation (Sunday)", credit: 1, debit: 0, balance: 7, remarks: "Worked on Sunday for cluster containment in Khera Basti", approvedBy: "Dr. A.K. Verma (MOIC)" },
    { id: "TX-02", date: "2026-10-19", activity: "Availed Chhattipurti Leave (Compensatory Off)", credit: 0, debit: 1, balance: 6, remarks: "Availed compensatory day off for personal emergency", approvedBy: "BPM Rampur" },
    { id: "TX-03", date: "2026-10-12", activity: "Mission Indradhanush Sunday Immunization", credit: 1, debit: 0, balance: 7, remarks: "Full day special vaccination drive at Ward-04", approvedBy: "Dr. A.K. Verma (MOIC)" },
    { id: "TX-04", date: "2026-10-02", activity: "Pulse Polio Campaign on Gandhi Jayanti", credit: 1, debit: 0, balance: 6, remarks: "National holiday duty booth at Gram Panchayat", approvedBy: "CMHO Hoshangabad" },
    { id: "TX-05", date: "2026-09-22", activity: "Availed Chhattipurti Leave", credit: 0, debit: 2, balance: 5, remarks: "Two days compensatory leave availed for family ceremony", approvedBy: "MOIC PHC Rampur" },
    { id: "TX-06", date: "2026-09-07", activity: "Sunday Routine Catch-up Session", credit: 1, debit: 0, balance: 7, remarks: "Immunization for migrant laborers working on railway culvert", approvedBy: "Dr. A.K. Verma (MOIC)" },
    { id: "TX-07", date: "2026-08-15", activity: "Independence Day Sub-Centre Emergency Duty", credit: 1, debit: 0, balance: 6, remarks: "On-call emergency obstetric support", approvedBy: "Dr. A.K. Verma (MOIC)" },
    { id: "TX-08", date: "2026-08-01", activity: "Opening Balance Brought Forward", credit: 4, debit: 0, balance: 5, remarks: "Audited opening balance for Q3 2026", approvedBy: "District Auditor" }
  ]
};

export const portalPendingData = [
  {
    id: "PEND-01",
    beneficiaryName: "Aarav Sharma",
    beneficiaryId: "9842100412",
    beneficiaryType: "Child",
    portal: "U-WIN",
    entryStatus: "Pending Sync",
    pendingReason: "U-WIN Portal API gateway 504 timeout during field session",
    date: "2026-11-03 10:15 AM",
    village: "Pipariya Ward-04",
    vaccine: "Pentavalent-1, Rota-1",
    retryCount: 1,
    priority: "High"
  },
  {
    id: "PEND-02",
    beneficiaryName: "Sunita Sahu",
    beneficiaryId: "9842200388",
    beneficiaryType: "Pregnant Woman",
    portal: "RCH Portal",
    entryStatus: "Validation Failed",
    pendingReason: "Husband Aadhaar biometric validation pending at bank",
    date: "2026-11-02 04:20 PM",
    village: "Khera Basti",
    vaccine: "ANC-3 & Td-2",
    retryCount: 3,
    priority: "High"
  },
  {
    id: "PEND-03",
    beneficiaryName: "Ananya Pal",
    beneficiaryId: "9842100887",
    beneficiaryType: "Child",
    portal: "U-WIN",
    entryStatus: "Network Error",
    pendingReason: "Sub-Centre 4G connectivity dropped during batch sync",
    date: "2026-11-02 02:45 PM",
    village: "Khera Basti",
    vaccine: "MR-1, Vit-A",
    retryCount: 2,
    priority: "Medium"
  },
  {
    id: "PEND-04",
    beneficiaryName: "Kabir Verma",
    beneficiaryId: "9842101290",
    beneficiaryType: "Child",
    portal: "Anmol MP",
    entryStatus: "Pending Sync",
    pendingReason: "Awaiting ASHA supervisor signature confirmation",
    date: "2026-11-01 11:30 AM",
    village: "Sub-Centre Booth",
    vaccine: "BCG, Hep-B",
    retryCount: 0,
    priority: "Normal"
  },
  {
    id: "PEND-05",
    beneficiaryName: "Riya Sen",
    beneficiaryId: "9842200115",
    beneficiaryType: "Pregnant Woman",
    portal: "RCH Portal",
    entryStatus: "Retrying",
    pendingReason: "Mobile OTP authentication expired during registration",
    date: "2026-10-31 03:10 PM",
    village: "Pipariya Ward-04",
    vaccine: "ANC-2 Vitals",
    retryCount: 4,
    priority: "Medium"
  },
  {
    id: "PEND-06",
    beneficiaryName: "Diya Patel",
    beneficiaryId: "9842100234",
    beneficiaryType: "Child",
    portal: "U-WIN",
    entryStatus: "Pending Sync",
    pendingReason: "Batch vaccine lot number format mismatch on central server",
    date: "2026-10-30 01:25 PM",
    village: "Pipariya Ward-02",
    vaccine: "DPT Booster-1",
    retryCount: 1,
    priority: "Normal"
  }
];

export const backupRestoreData = {
  lastBackupDate: "Today, 08:30 AM",
  totalBackups: 6,
  autoBackupStatus: "Enabled (Daily at 08:00 PM)",
  cloudSyncTarget: "NIC District Data Server - Hoshangabad",
  backupsList: [
    { id: "BKP-06", filename: "Tikakaran_SC49201_Full_2026-11-03.json", date: "2026-11-03 08:30 AM", size: "4.2 MB", records: "1,250 Children, 245 PW, 16 Sessions", checksum: "SHA256: e82f...a91c", type: "Automated Daily", status: "Verified Safe" },
    { id: "BKP-05", filename: "Tikakaran_SC49201_Full_2026-11-02.json", date: "2026-11-02 08:00 PM", size: "4.1 MB", records: "1,248 Children, 244 PW, 15 Sessions", checksum: "SHA256: 71b3...442d", type: "Automated Daily", status: "Verified Safe" },
    { id: "BKP-04", filename: "Tikakaran_SC49201_Manual_PreHMIS_2026-10-31.json", date: "2026-10-31 06:15 PM", size: "4.0 MB", records: "1,245 Children, 242 PW, 14 Sessions", checksum: "SHA256: f440...8e11", type: "Manual Export", status: "Verified Safe" },
    { id: "BKP-03", filename: "Tikakaran_SC49201_Full_2026-10-24.json", date: "2026-10-24 08:00 PM", size: "3.9 MB", records: "1,238 Children, 240 PW, 12 Sessions", checksum: "SHA256: a19d...3c08", type: "Automated Weekly", status: "Verified Safe" },
    { id: "BKP-02", filename: "Tikakaran_SC49201_Full_2026-10-17.json", date: "2026-10-17 08:00 PM", size: "3.8 MB", records: "1,230 Children, 238 PW, 10 Sessions", checksum: "SHA256: c382...77fa", type: "Automated Weekly", status: "Verified Safe" },
    { id: "BKP-01", filename: "Tikakaran_SC49201_Baseline_Q3_2026-10-01.json", date: "2026-10-01 09:00 AM", size: "3.6 MB", records: "1,215 Children, 230 PW, 8 Sessions", checksum: "SHA256: 9e01...bf54", type: "Quarterly Baseline", status: "Verified Safe" }
  ]
};

export const notificationsList = [
  {
    id: "NOTIF-1",
    title: "Cold Chain Temperature Logged",
    message: "ILR temperature recorded at 4.2°C at 08:00 AM. Safe range maintained.",
    time: "2 hours ago",
    unread: true,
    type: "success"
  },
  {
    id: "NOTIF-2",
    title: "HMIS Portal Monthly Cut-Off",
    message: "HMIS monthly return submission deadline is 7th November. 26 fields pending.",
    time: "5 hours ago",
    unread: true,
    type: "warning"
  },
  {
    id: "NOTIF-3",
    title: "Vaccine Roster Alert",
    message: "38 children scheduled for today's outreach session at Pipariya Ward-04.",
    time: "Yesterday",
    unread: false,
    type: "info"
  },
  {
    id: "NOTIF-4",
    title: "ASHA Chhattipurti Approval",
    message: "Incentive ledger verified for 12 routine immunization sessions.",
    time: "2 days ago",
    unread: false,
    type: "info"
  }
];
