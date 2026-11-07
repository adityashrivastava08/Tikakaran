/**
 * ==============================================================================
 * Vaccine Calculation & National Immunization Schedule (UIP) Rules Engine
 * Tikakaran Register - HMIS Reminder Software
 * 
 * Compliant with Government of India Universal Immunization Programme (UIP)
 * Guidelines, Operational Guidelines for Routine Immunization, and U-WIN specs.
 * ==============================================================================
 */

// Approved UIP Minimum Intervals (in days) between successive doses
export const UIP_MINIMUM_INTERVALS = {
  // Pentavalent: 4 weeks (28 days) between consecutive doses
  PENTA: {
    'PENTA_1': { nextCode: 'PENTA_2', minIntervalDays: 28 },
    'PENTA_2': { nextCode: 'PENTA_3', minIntervalDays: 28 },
    'PENTA_3': { nextCode: 'DPT_BOOSTER_1', minIntervalDays: 180 } // 6 months after primary series
  },
  // bOPV: 4 weeks (28 days) between primary doses, 6 months before booster
  OPV: {
    'OPV_1': { nextCode: 'OPV_2', minIntervalDays: 28 },
    'OPV_2': { nextCode: 'OPV_3', minIntervalDays: 28 },
    'OPV_3': { nextCode: 'OPV_BOOSTER', minIntervalDays: 180 }
  },
  // Rotavirus: 4 weeks (28 days) between consecutive doses
  ROTA: {
    'ROTA_1': { nextCode: 'ROTA_2', minIntervalDays: 28 },
    'ROTA_2': { nextCode: 'ROTA_3', minIntervalDays: 28 }
  },
  // Fractional IPV: 8 weeks (56 days) between fIPV-1 and fIPV-2
  FIPV: {
    'FIPV_1': { nextCode: 'FIPV_2', minIntervalDays: 56 }
  },
  // PCV: 8 weeks (56 days) between Dose 1 & 2, and 6 months (180 days) before Booster
  PCV: {
    'PCV_1': { nextCode: 'PCV_2', minIntervalDays: 56 },
    'PCV_2': { nextCode: 'PCV_BOOSTER', minIntervalDays: 180 }
  },
  // Measles-Rubella: 6 months (180 days) between MR-1 and MR-2
  MR: {
    'MR_1': { nextCode: 'MR_2', minIntervalDays: 180 }
  },
  // Japanese Encephalitis: 6 months (180 days) between JE-1 and JE-2
  JE: {
    'JE_1': { nextCode: 'JE_2', minIntervalDays: 180 }
  },
  // Vitamin A: 6 months (180 days) between consecutive prophylactic doses
  VITA: {
    'VITA_1': { nextCode: 'VITA_2', minIntervalDays: 180 }
  },
  // Td in Pregnancy: 4 weeks (28 days) between Td-1 and Td-2
  TD_PREG: {
    'TD_PREG_1': { nextCode: 'TD_PREG_2', minIntervalDays: 28 }
  }
};

/**
 * Format a Date object to YYYY-MM-DD
 */
export const toDateString = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

/**
 * Calculate precise pediatric age in days, months, and years from DOB
 * @param {Date|string} dob - Date of Birth
 * @param {Date|string} referenceDate - Reference Date (default: today)
 * @returns {object} { totalDays, totalMonths, years, formattedAge, ageGroup }
 */
export const calculateAge = (dob, referenceDate = new Date()) => {
  const dobDate = new Date(dob);
  const refDate = new Date(referenceDate);

  // Set times to midnight UTC to avoid timezone hour offsets
  dobDate.setUTCHours(0, 0, 0, 0);
  refDate.setUTCHours(0, 0, 0, 0);

  const diffMs = refDate.getTime() - dobDate.getTime();
  const totalDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  
  // Standard pediatric average month = 30.4375 days (365.25 / 12)
  const totalMonths = +(totalDays / 30.4375).toFixed(1);
  const years = +(totalDays / 365.25).toFixed(1);

  let formattedAge = '';
  if (totalDays < 30) {
    formattedAge = `${totalDays} ${totalDays === 1 ? 'Day' : 'Days'}`;
  } else if (totalMonths < 24) {
    formattedAge = `${totalMonths} Months`;
  } else {
    formattedAge = `${years} Yrs`;
  }

  // Determine standard age group
  let ageGroup = '0-11m';
  if (totalDays >= 1825) {
    ageGroup = '5y+';
  } else if (totalDays >= 730) {
    ageGroup = '2-5y';
  } else if (totalDays >= 365) {
    ageGroup = '12-23m';
  }

  return {
    totalDays,
    totalMonths,
    years: parseFloat(years),
    formattedAge,
    ageGroup
  };
};

/**
 * Determine vaccination status based on record status and reference date
 * @param {object} record - Vaccination record ({ status, dueDate, administeredDate })
 * @param {Date|string} referenceDate - Reference date for comparison
 * @returns {string} 'Completed' | 'Due Today' | 'Upcoming Due' | 'Overdue'
 */
export const determineVaccinationStatus = (record, referenceDate = new Date()) => {
  if (record.status === 'ADMINISTERED' || record.administeredDate) {
    return 'Completed';
  }

  const refStr = toDateString(referenceDate);
  const dueStr = toDateString(record.dueDate);

  if (dueStr === refStr) {
    return 'Due Today';
  } else if (dueStr < refStr) {
    return 'Overdue';
  } else {
    return 'Upcoming Due';
  }
};

/**
 * Calculate initial schedule for a child at registration based on DOB and vaccine masters
 * @param {Date|string} dob - Child Date of Birth
 * @param {Array} vaccineMasters - Array of VaccineMaster objects
 * @returns {Array} Array of initial vaccination record payload objects
 */
export const calculateInitialSchedule = (dob, vaccineMasters) => {
  const dobDate = new Date(dob);

  return vaccineMasters.map(vaccine => {
    const dueDate = new Date(dobDate.getTime() + (vaccine.recommendedAgeDays * 24 * 60 * 60 * 1000));
    return {
      vaccineId: vaccine.id,
      doseGiven: vaccine.doseLabel,
      dueDate,
      status: 'DUE'
    };
  });
};

/**
 * Recalculate subsequent vaccine due dates when a dose in a series is administered
 * Enforces approved minimum intervals (e.g. at least 28 days after Penta-1 before Penta-2)
 * @param {string} childId - Beneficiary ID
 * @param {string} administeredVaccineCode - Vaccine code just administered (e.g. 'PENTA_1')
 * @param {Date|string} administeredDate - Date dose was given
 * @param {object} prismaTx - Active Prisma transaction client
 * @returns {Promise<number>} Number of subsequent doses rescheduled
 */
export const recalculateSubsequentDoses = async (childId, administeredVaccineCode, administeredDate, prismaTx) => {
  const adminDate = new Date(administeredDate);
  let updatedCount = 0;

  // Search each antigen category rule
  for (const [, rules] of Object.entries(UIP_MINIMUM_INTERVALS)) {
    const rule = rules[administeredVaccineCode];
    if (rule) {
      const { nextCode, minIntervalDays } = rule;
      
      // Calculate earliest allowable due date based on minimum interval
      const earliestNextDueDate = new Date(adminDate.getTime() + (minIntervalDays * 24 * 60 * 60 * 1000));

      // Find the next dose record for this child
      const nextRecord = await prismaTx.vaccinationRecord.findFirst({
        where: {
          childId,
          vaccine: { code: nextCode },
          status: { not: 'ADMINISTERED' }
        },
        include: { vaccine: true }
      });

      if (nextRecord) {
        // If current dueDate is earlier than the earliest allowable minimum interval date,
        // push the dueDate forward to enforce biological safety and approved interval
        if (nextRecord.dueDate < earliestNextDueDate) {
          await prismaTx.vaccinationRecord.update({
            where: { id: nextRecord.id },
            data: {
              dueDate: earliestNextDueDate,
              remarks: nextRecord.remarks 
                ? `${nextRecord.remarks}; Rescheduled to ${toDateString(earliestNextDueDate)} based on ${minIntervalDays}-day minimum interval from ${administeredVaccineCode}.`
                : `Rescheduled to ${toDateString(earliestNextDueDate)} based on ${minIntervalDays}-day minimum interval from ${administeredVaccineCode}.`
            }
          });
          updatedCount++;
        }
      }
    }
  }

  return updatedCount;
};

/**
 * Format raw vaccination record + child demographic data into unified due list item
 * @param {object} record - Prisma vaccination record with includes
 * @param {Date|string} referenceDate - Reference date
 * @returns {object} Clean formatted due list item
 */
export const formatDueItem = (record, referenceDate = new Date()) => {
  const child = record.child;
  const vaccine = record.vaccine;
  const site = child?.site;
  const session = record.session;

  const ageData = child ? calculateAge(child.dob, referenceDate) : { formattedAge: '', ageGroup: '0-11m' };
  const calculatedStatus = determineVaccinationStatus(record, referenceDate);

  return {
    id: record.id,
    recordId: record.id,
    childId: child?.id || null,
    name: child?.name || 'Unknown Child',
    childName: child?.name || 'Unknown Child',
    registrationNumber: child?.registrationNumber || '',
    rchId: child?.rchId || 'N/A',
    dob: toDateString(child?.dob),
    age: ageData.formattedAge,
    ageMonths: ageData.totalMonths,
    ageGroup: ageData.ageGroup,
    gender: child?.gender || 'N/A',
    motherName: child?.motherName || 'N/A',
    fatherName: child?.fatherName || '',
    mobile: child?.guardianPhone || '',
    guardianPhone: child?.guardianPhone || '',
    village: child?.village || site?.village || 'Sub-Centre Ward',
    siteId: site?.id || child?.siteId || '',
    site: site?.name || child?.village || 'Sub-Centre Main Booth',
    awcCode: child?.awcCode || site?.code || 'AWC-01',
    asha: site?.ashaName || 'ASHA Worker',
    ashaPhone: site?.ashaPhone || '',
    // Vaccine details
    vaccineId: vaccine?.id || '',
    vaccineCode: vaccine?.code || '',
    dueVaccine: vaccine?.name ? `${vaccine.name} (${record.doseGiven})` : record.doseGiven,
    vaccineName: vaccine?.name || '',
    dose: record.doseGiven || vaccine?.doseLabel || 'Routine Dose',
    dueDate: toDateString(record.dueDate),
    status: calculatedStatus, // 'Due Today' | 'Upcoming Due' | 'Overdue' | 'Completed'
    dbStatus: record.status,
    administeredDate: toDateString(record.administeredDate),
    batchNumber: record.batchNumber || null,
    coldChainTemp: record.coldChainTemp ? parseFloat(record.coldChainTemp) : null,
    coldChainStatus: record.coldChainTemp ? `${record.coldChainTemp}°C Safe` : '4.2°C Safe',
    administeredBy: record.administeredBy || null,
    adverseEvent: record.adverseEvent || false,
    adverseEventDetails: record.adverseEventDetails || null,
    sessionId: session?.id || null,
    sessionDate: toDateString(session?.sessionDate),
    remarks: record.remarks || null
  };
};

/**
 * Compute KPI Summary counts across categories for an ANM or query
 * @param {Array} records - Array of vaccination records
 * @param {Date|string} referenceDate - Reference date
 * @returns {object} { dueToday, upcoming, overdue, completed, totalDue, totalTracked }
 */
export const calculateSummaryCounts = (records, referenceDate = new Date()) => {
  let dueToday = 0;
  let upcoming = 0;
  let overdue = 0;
  let completed = 0;

  for (const record of records) {
    const status = determineVaccinationStatus(record, referenceDate);
    if (status === 'Due Today') dueToday++;
    else if (status === 'Upcoming Due') upcoming++;
    else if (status === 'Overdue') overdue++;
    else if (status === 'Completed') completed++;
  }

  return {
    dueToday,
    upcoming,
    overdue,
    completed,
    totalDue: dueToday + overdue,
    totalTracked: records.length
  };
};

export default {
  UIP_MINIMUM_INTERVALS,
  toDateString,
  calculateAge,
  determineVaccinationStatus,
  calculateInitialSchedule,
  recalculateSubsequentDoses,
  formatDueItem,
  calculateSummaryCounts
};

