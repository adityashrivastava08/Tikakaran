# Tikakaran Register – HMIS Reminder Software

> **Web-based Healthcare Management System for ANM (Auxiliary Nurse Midwife) & Health Sub-Centre Workers**

Built with **React.js**, **React Router v6**, **Tailwind CSS**, **Framer Motion**, **Lucide React Icons**, and **Recharts**.

---

## 🎨 Design System

- **Primary Color:** Deep Teal `#075E54`
- **Secondary Color:** Emerald Green `#10B981`
- **Background:** Soft Mint / Healthcare Canvas `#F1F7F6`
- **Cards & Surfaces:** Clean White `#FFFFFF` with `#E1ECE9` borders and soft shadows
- **Typography:** Deep Forest `#173B38` and Muted `#718783`
- **Theme:** Clean, modern, accessible light healthcare theme

---

## 🧭 Navigation & Page Directory (React Router)

| Route Path | Page Title | Core Capabilities |
| :--- | :--- | :--- |
| `/` | **Dashboard** | 4 Animated Stat Cards, Monthly Vaccination Line Chart (Week/Month/Year), Today's Sessions, HMIS Progress (78%), Site Statistics & Live Activity Log |
| `/child-register` | **Child Register** | Cohort management, Search (Name, DOB, Mother, Mobile), Filters (Village, AWC, Gender, Age Group), Add Child Modal, Edit Details, View Profile, Vaccination History & Card, Pagination |
| `/pregnant-women` | **Pregnant Women Register** | Antenatal Care (ANC 1–4), High Risk Pregnancy (HRP) tracking, Td dose tracking, LMP/EDD dates, Registration form modal, Profile details |
| `/vaccination-due` | **Vaccination Due List** | Tabs: Upcoming Due, Due Today, Overdue Dropouts, Completed Doses. Site & Date filters, Record Vaccine modal with lot/batch, Batch SMS Reminders trigger, Print Session Roster |
| `/site-session` | **Site & Session Management** | 8 Village AWCs directory, Add/Edit Site modal, Session Calendar, Create Vaccination Session modal, Session status toggle (In Progress, Completed, Not Conducted with official exemption reason) |
| `/health-services` | **Health Services** | Family Planning (Contraceptive users & stocks), Supplements & Drug Store stock, NCD Screenings (BP & Sugar 30+), Telemedicine (e-Sanjeevani video consults), Bhavya (ABHA EHR sync), Diagnostics Rapid Tests |
| `/hmis-reports` | **HMIS Reports** | Month & Year selectors, 8 Official Returns (HMIS SC Form-7, Arogya Diwas VHSND, Regular Immunization RI, HSC Monthly ELA, Vaccination Cohort, Services & Tests, Due List Analysis, Portal Pending). Generate, Preview Form, Download PDF, Export Excel |
| `/duty-attendance` | **Duty & Attendance** | Monthly summary (Work, Week Off, CL, SL, Holiday, Absent, Chhattipurti Leave), 30-Day Calendar View, Selected Day duty inspection, Holiday duty report with compensatory off credits, Log Duty modal |
| `/chhattipurti` | **Chhattipurti Ledger** | Opening Balance, Earned Leave (+), Used Leave (-), Closing Balance cards. Transaction audit ledger with dates, holiday details, approving officer, and Claim/Avail Leave modal |
| `/portal-pending` | **Portal Pending** | U-WIN / MoHFW RCH Portal offline queue tracking, Error logs (API timeout, Aadhaar mismatch), Individual Retry sync with feedback, Batch "Retry Sync All" button |
| `/backup-restore` | **Backup & Restore** | Export JSON backup with real in-memory snapshot download, Restore JSON backup file modal, SHA-256 integrity verified backup history, Cloud sync status |
| `/statistics` | **Statistics** | AWC Village Beneficiary Bar Chart, FIC rates, Institutional delivery targets |
| `/settings` | **Settings** | ANM credentials, Sub-Centre code, Attached PHC, Language selector |
| `/help-support` | **Help & Support** | Emergency Block/District helplines, National HMIS toll-free, Universal Immunization Schedule quick reference |

---

## 💻 How to Run Locally

```bash
# 1. Start the Vite development server
npm run dev

# 2. Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
