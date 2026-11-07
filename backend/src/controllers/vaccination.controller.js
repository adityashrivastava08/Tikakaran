import prisma from '../services/prisma.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { 
  toDateString, 
  calculateAge, 
  determineVaccinationStatus, 
  recalculateSubsequentDoses,
  formatDueItem,
  calculateSummaryCounts 
} from '../services/vaccineCalculation.service.js';

/**
 * Get UIP Vaccine Master List
 * GET /api/vaccinations/vaccines
 */
export const getVaccineMasters = async (req, res, next) => {
  try {
    const { targetGroup = 'CHILD' } = req.query;

    const where = {
      isActive: true,
      ...(targetGroup && targetGroup !== 'ALL' && { targetGroup })
    };

    const vaccines = await prisma.vaccineMaster.findMany({
      where,
      orderBy: [
        { recommendedAgeDays: 'asc' },
        { doseNumber: 'asc' }
      ]
    });

    return sendSuccess(res, 200, 'Vaccine master list retrieved successfully', vaccines);
  } catch (err) {
    next(err);
  }
};

/**
 * Get Dynamic Vaccination Due List with Status Filtering & Live Calculation Engine
 * GET /api/vaccinations/due
 */
export const getDueList = async (req, res, next) => {
  try {
    const { 
      tab = 'Due Today', 
      siteId, 
      date, 
      search, 
      page = 1, 
      limit = 20 
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * take;

    // Reference Date for calculation (defaults to current date at midnight UTC)
    const referenceDate = date ? new Date(date) : new Date();
    referenceDate.setUTCHours(0, 0, 0, 0);

    const refDateStr = toDateString(referenceDate);

    // Build base where clause with ANM data isolation and site filtering
    const baseWhere = {
      ...(req.user.role === 'ANM' && {
        child: { anmId: req.user.anmId }
      }),
      ...(siteId && siteId !== 'All' && {
        child: {
          OR: [
            { siteId: siteId },
            { awcCode: siteId },
            { village: siteId },
            { site: { name: { contains: siteId, mode: 'insensitive' } } }
          ]
        }
      }),
      // Beneficiary search filter
      ...(search && search.trim() && {
        OR: [
          { child: { name: { contains: search.trim(), mode: 'insensitive' } } },
          { child: { motherName: { contains: search.trim(), mode: 'insensitive' } } },
          { child: { rchId: { contains: search.trim() } } },
          { child: { registrationNumber: { contains: search.trim(), mode: 'insensitive' } } },
          { vaccine: { name: { contains: search.trim(), mode: 'insensitive' } } },
          { vaccine: { code: { contains: search.trim(), mode: 'insensitive' } } }
        ]
      })
    };

    // Calculate Summary Counts across all 4 categories for the tab pills
    // We retrieve all records matching the base filter (excluding pagination) to compute live badges
    const allRecordsForSummary = await prisma.vaccinationRecord.findMany({
      where: baseWhere,
      select: {
        id: true,
        dueDate: true,
        status: true,
        administeredDate: true
      }
    });

    const summary = calculateSummaryCounts(allRecordsForSummary, referenceDate);

    // Build category-specific filter for current tab
    let tabWhere = { ...baseWhere };

    if (tab === 'Due Today') {
      tabWhere = {
        ...baseWhere,
        status: { not: 'ADMINISTERED' },
        dueDate: {
          gte: new Date(`${refDateStr}T00:00:00.000Z`),
          lte: new Date(`${refDateStr}T23:59:59.999Z`)
        }
      };
    } else if (tab === 'Upcoming Due') {
      tabWhere = {
        ...baseWhere,
        status: { not: 'ADMINISTERED' },
        dueDate: {
          gt: new Date(`${refDateStr}T23:59:59.999Z`)
        }
      };
    } else if (tab === 'Overdue') {
      tabWhere = {
        ...baseWhere,
        status: { not: 'ADMINISTERED' },
        dueDate: {
          lt: new Date(`${refDateStr}T00:00:00.000Z`)
        }
      };
    } else if (tab === 'Completed') {
      tabWhere = {
        ...baseWhere,
        status: 'ADMINISTERED'
      };
    }

    // Query total count and paginated records in parallel
    const [total, records] = await Promise.all([
      prisma.vaccinationRecord.count({ where: tabWhere }),
      prisma.vaccinationRecord.findMany({
        where: tabWhere,
        skip,
        take,
        include: {
          child: {
            include: { site: true }
          },
          vaccine: true,
          session: true
        },
        orderBy: tab === 'Completed' ? { administeredDate: 'desc' } : { dueDate: 'asc' }
      })
    ]);

    // Format records for frontend consumption
    const formattedRecords = records.map(record => formatDueItem(record, referenceDate));

    return sendSuccess(res, 200, 'Vaccination due list retrieved successfully', formattedRecords, {
      total,
      page: pageNum,
      limit: take,
      totalPages: Math.ceil(total / take) || 1,
      summary,
      tab,
      referenceDate: refDateStr
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Due List KPI Summary Counts for Dashboard Badges
 * GET /api/vaccinations/due-summary
 */
export const getDueSummary = async (req, res, next) => {
  try {
    const { siteId, date } = req.query;
    const referenceDate = date ? new Date(date) : new Date();
    referenceDate.setUTCHours(0, 0, 0, 0);

    const where = {
      ...(req.user.role === 'ANM' && {
        child: { anmId: req.user.anmId }
      }),
      ...(siteId && siteId !== 'All' && {
        child: { siteId }
      })
    };

    const records = await prisma.vaccinationRecord.findMany({
      where,
      select: {
        id: true,
        dueDate: true,
        status: true,
        administeredDate: true
      }
    });

    const summary = calculateSummaryCounts(records, referenceDate);
    return sendSuccess(res, 200, 'Vaccination due summary calculated', summary);
  } catch (err) {
    next(err);
  }
};

/**
 * Get Child Full Vaccination Timeline & History
 * GET /api/vaccinations/history/:childId
 */
export const getChildVaccinationHistory = async (req, res, next) => {
  try {
    const { childId } = req.params;

    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        site: true,
        anm: {
          select: {
            fullName: true,
            mobile: true,
            healthCentre: { select: { code: true, name: true } }
          }
        },
        vaccinationRecords: {
          include: {
            vaccine: true,
            session: true
          },
          orderBy: { dueDate: 'asc' }
        }
      }
    });

    if (!child) {
      return sendError(res, 404, 'Child beneficiary not found');
    }

    // Role-based data isolation check
    if (req.user.role === 'ANM' && child.anmId !== req.user.anmId) {
      return sendError(res, 403, 'Access denied. You can only access beneficiaries in your Sub-Centre.');
    }

    const ageData = calculateAge(child.dob);
    const totalDoses = child.vaccinationRecords.length;
    const completedDoses = child.vaccinationRecords.filter(r => r.status === 'ADMINISTERED').length;
    const progressPercent = totalDoses > 0 ? Math.round((completedDoses / totalDoses) * 100) : 0;

    const timeline = child.vaccinationRecords.map(record => formatDueItem(record));

    return sendSuccess(res, 200, 'Child vaccination history retrieved', {
      child: {
        id: child.id,
        name: child.name,
        registrationNumber: child.registrationNumber,
        rchId: child.rchId,
        dob: toDateString(child.dob),
        age: ageData.formattedAge,
        gender: child.gender,
        motherName: child.motherName,
        guardianPhone: child.guardianPhone,
        village: child.village,
        site: child.site?.name,
        progressPercent,
        completedDoses,
        totalDoses
      },
      timeline
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Record Administered Vaccination Dose
 * POST /api/vaccinations/record
 */
export const recordVaccination = async (req, res, next) => {
  try {
    const {
      recordId,
      childId,
      vaccineId,
      sessionId,
      doseGiven,
      administeredDate,
      batchNumber,
      expiryDate,
      coldChainTemp = 4.2,
      administeredBy,
      adverseEvent = false,
      adverseEventDetails,
      remarks
    } = req.body;

    // Validate cold chain range (2°C - 8°C per WHO/MoHFW norms)
    const tempNum = parseFloat(coldChainTemp);
    if (isNaN(tempNum) || tempNum < 2.0 || tempNum > 8.0) {
      return sendError(res, 400, 'Invalid cold chain temperature. Safe storage range must be between 2.0°C and 8.0°C.');
    }

    // Check child existence and authorization
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: { anm: true, site: true }
    });

    if (!child) {
      return sendError(res, 404, 'Child beneficiary not found');
    }

    if (req.user.role === 'ANM' && child.anmId !== req.user.anmId) {
      return sendError(res, 403, 'Access denied. You can only record doses for beneficiaries in your Sub-Centre.');
    }

    // Verify vaccine master exists
    const vaccine = await prisma.vaccineMaster.findUnique({
      where: { id: vaccineId }
    });

    if (!vaccine) {
      return sendError(res, 404, 'Vaccine master antigen not found');
    }

    const adminDateObj = new Date(administeredDate);

    // Execute atomic transaction: record dose, reschedule subsequent doses, update session & portal sync queue
    const result = await prisma.$transaction(async (tx) => {
      let vRecord;

      if (recordId) {
        // Direct record update by ID
        vRecord = await tx.vaccinationRecord.update({
          where: { id: recordId },
          data: {
            doseGiven: doseGiven || vaccine.doseLabel,
            administeredDate: adminDateObj,
            status: 'ADMINISTERED',
            batchNumber: batchNumber.trim(),
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            coldChainTemp: tempNum,
            sessionId: sessionId || null,
            administeredBy: administeredBy || req.user.fullName || 'ANM Officer',
            adverseEvent: !!adverseEvent,
            adverseEventDetails: adverseEvent ? adverseEventDetails : null,
            remarks: remarks || null
          },
          include: { child: { include: { site: true } }, vaccine: true, session: true }
        });
      } else {
        // Find existing scheduled record or upsert
        const existingRecord = await tx.vaccinationRecord.findFirst({
          where: {
            childId,
            vaccineId,
            status: { not: 'ADMINISTERED' }
          }
        });

        if (existingRecord) {
          vRecord = await tx.vaccinationRecord.update({
            where: { id: existingRecord.id },
            data: {
              doseGiven: doseGiven || existingRecord.doseGiven,
              administeredDate: adminDateObj,
              status: 'ADMINISTERED',
              batchNumber: batchNumber.trim(),
              expiryDate: expiryDate ? new Date(expiryDate) : null,
              coldChainTemp: tempNum,
              sessionId: sessionId || null,
              administeredBy: administeredBy || req.user.fullName || 'ANM Officer',
              adverseEvent: !!adverseEvent,
              adverseEventDetails: adverseEvent ? adverseEventDetails : null,
              remarks: remarks || existingRecord.remarks
            },
            include: { child: { include: { site: true } }, vaccine: true, session: true }
          });
        } else {
          // Create new record
          vRecord = await tx.vaccinationRecord.create({
            data: {
              childId,
              vaccineId,
              sessionId: sessionId || null,
              doseGiven: doseGiven || vaccine.doseLabel,
              administeredDate: adminDateObj,
              dueDate: adminDateObj,
              status: 'ADMINISTERED',
              batchNumber: batchNumber.trim(),
              expiryDate: expiryDate ? new Date(expiryDate) : null,
              coldChainTemp: tempNum,
              administeredBy: administeredBy || req.user.fullName || 'ANM Officer',
              adverseEvent: !!adverseEvent,
              adverseEventDetails: adverseEvent ? adverseEventDetails : null,
              remarks: remarks || null
            },
            include: { child: { include: { site: true } }, vaccine: true, session: true }
          });
        }
      }

      // 2. Enforce Approved Minimum Intervals: Reschedule subsequent doses dynamically
      const rescheduledCount = await recalculateSubsequentDoses(childId, vaccine.code, adminDateObj, tx);

      // 3. Increment Session Beneficiaries count if tied to an active session
      if (sessionId) {
        await tx.vaccinationSession.update({
          where: { id: sessionId },
          data: { beneficiariesActual: { increment: 1 } }
        });
      }

      // 4. Queue Portal Pending Entry for automated U-WIN synchronization
      await tx.portalEntry.create({
        data: {
          anmId: child.anmId,
          portal: 'U_WIN',
          recordType: 'CHILD_VACCINE',
          localRecordId: vRecord.id,
          beneficiaryName: child.name,
          entryStatus: 'PENDING',
          pendingReason: 'Awaiting end-of-session U-WIN batch sync'
        }
      });

      // 5. Audit Log entry
      await tx.auditLog.create({
        data: {
          userId: req.user.id,
          action: 'CREATE',
          entityType: 'VaccinationRecord',
          entityId: vRecord.id,
          changes: {
            childName: child.name,
            vaccine: vaccine.name,
            dose: doseGiven,
            batchNumber,
            administeredDate
          }
        }
      });

      return { vRecord, rescheduledCount };
    });

    const formatted = formatDueItem(result.vRecord);

    return sendSuccess(res, 201, `Vaccination successfully recorded for ${child.name}. U-WIN sync queued.`, {
      record: formatted,
      rescheduledSubsequentDoses: result.rescheduledCount
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Available Vaccination Sessions for Session Dropdown
 * GET /api/vaccinations/sessions
 */
export const getVaccinationSessions = async (req, res, next) => {
  try {
    const { siteId } = req.query;

    const sessions = await prisma.vaccinationSession.findMany({
      where: {
        ...(req.user.role === 'ANM' && { anmId: req.user.anmId }),
        ...(siteId && siteId !== 'All' && { siteId }),
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] }
      },
      include: {
        site: true
      },
      orderBy: { sessionDate: 'asc' }
    });

    const formattedSessions = sessions.map(s => ({
      id: s.id,
      sessionDate: toDateString(s.sessionDate),
      sessionType: s.sessionType,
      siteId: s.siteId,
      siteName: s.site?.name || 'Sub-Centre Booth',
      status: s.status,
      startTime: s.startTime,
      endTime: s.endTime,
      beneficiariesTarget: s.beneficiariesTarget,
      beneficiariesActual: s.beneficiariesActual,
      coldChainStatus: s.coldChainStatus || '4.2°C Safe',
      label: `${toDateString(s.sessionDate)} - ${s.site?.name} (${s.status})`
    }));

    return sendSuccess(res, 200, 'Vaccination sessions retrieved', formattedSessions);
  } catch (err) {
    next(err);
  }
};
