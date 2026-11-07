import prisma from '../services/prisma.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

/**
 * List Children with Search, Filters & Pagination
 * GET /api/children
 */
export const getChildren = async (req, res, next) => {
  try {
    const { 
      search, 
      siteId, 
      village, 
      gender, 
      ageGroup, 
      page = 1, 
      limit = 10 
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * take;

    // 1. Calculate Date of Birth ranges based on age group filter
    const now = new Date();
    let dobFilter = undefined;

    if (ageGroup === '0-11m') {
      // Infants: 0 to 11 months old
      const elevenMonthsAgo = new Date();
      elevenMonthsAgo.setMonth(now.getMonth() - 11);
      dobFilter = { gte: elevenMonthsAgo };
    } else if (ageGroup === '12-23m') {
      // Toddlers: 12 to 23 months old
      const twentyThreeMonthsAgo = new Date();
      twentyThreeMonthsAgo.setMonth(now.getMonth() - 23);
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(now.getMonth() - 12);
      dobFilter = { gte: twentyThreeMonthsAgo, lte: twelveMonthsAgo };
    } else if (ageGroup === '2-5y') {
      // Preschool: 2 to 5 years old
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(now.getFullYear() - 5);
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(now.getFullYear() - 2);
      dobFilter = { gte: fiveYearsAgo, lte: twoYearsAgo };
    }

    // 2. Build where clause enforcing ANM-wise access control
    const where = {
      // Role-based access control
      ...(req.user.role === 'ANM' && { anmId: req.user.anmId }),
      
      // Filters
      ...(siteId && siteId !== 'All' && {
        OR: [
          { siteId: siteId },
          { awcCode: siteId }
        ]
      }),
      ...(village && village !== 'All' && { village }),
      ...(gender && gender !== 'All' && { gender }),
      ...(dobFilter && { dob: dobFilter }),

      // Search across name, mother, father, phone, RCH ID, Registration Number
      ...(search && search.trim() && {
        OR: [
          { name: { contains: search.trim(), mode: 'insensitive' } },
          { motherName: { contains: search.trim(), mode: 'insensitive' } },
          { fatherName: { contains: search.trim(), mode: 'insensitive' } },
          { guardianPhone: { contains: search.trim() } },
          { rchId: { contains: search.trim() } },
          { registrationNumber: { contains: search.trim(), mode: 'insensitive' } }
        ]
      })
    };

    // 3. Query total count and children in parallel
    const [total, children] = await Promise.all([
      prisma.child.count({ where }),
      prisma.child.findMany({
        where,
        skip,
        take,
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
            include: { vaccine: true },
            orderBy: { dueDate: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Format calculated age in months for frontend convenience
    const formattedChildren = children.map(child => {
      const dobDate = new Date(child.dob);
      const diffMs = now - dobDate;
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const totalMonths = (totalDays / 30.4375).toFixed(1);

      let ageFormatted = '';
      if (totalMonths < 1) {
        ageFormatted = `${totalDays} Days`;
      } else if (totalMonths < 24) {
        ageFormatted = `${totalMonths} Months`;
      } else {
        const years = (totalMonths / 12).toFixed(1);
        ageFormatted = `${years} Yrs`;
      }

      // Determine next due vaccine
      const nextDue = child.vaccinationRecords.find(v => v.status === 'DUE' || v.status === 'OVERDUE');

      return {
        ...child,
        ageMonths: parseFloat(totalMonths),
        age: ageFormatted,
        dueVaccine: nextDue ? `${nextDue.vaccine.name} (${nextDue.doseGiven})` : 'Fully Immunized',
        dose: nextDue?.doseGiven || 'FIC',
        dueDate: nextDue ? nextDue.dueDate.toISOString().split('T')[0] : 'Completed',
        status: nextDue
          ? (nextDue.dueDate < now ? 'Overdue' : 'Due Today')
          : 'Completed'
      };
    });

    return sendSuccess(res, 200, 'Children register retrieved successfully', formattedChildren, {
      total,
      page: pageNum,
      limit: take,
      totalPages: Math.ceil(total / take) || 1
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Child Profile by ID with Full Vaccination History
 * GET /api/children/:id
 */
export const getChildById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const child = await prisma.child.findUnique({
      where: { id },
      include: {
        site: true,
        anm: {
          select: {
            id: true,
            fullName: true,
            mobile: true,
            designation: true,
            healthCentre: true
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
      return sendError(res, 404, 'Child beneficiary not found.');
    }

    // Role-based ANM data isolation check
    if (req.user.role === 'ANM' && child.anmId !== req.user.anmId) {
      return sendError(res, 403, 'Access denied. You can only view beneficiaries registered under your Sub-Centre.');
    }

    // Calculate age
    const now = new Date();
    const dobDate = new Date(child.dob);
    const totalDays = Math.floor((now - dobDate) / (1000 * 60 * 60 * 24));
    const totalMonths = (totalDays / 30.4375).toFixed(1);

    return sendSuccess(res, 200, 'Child details and vaccination history retrieved', {
      ...child,
      ageMonths: parseFloat(totalMonths),
      age: totalMonths < 24 ? `${totalMonths} Months` : `${(totalMonths / 12).toFixed(1)} Yrs`
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Register New Child with Duplicate Detection & Routine UIP Scheduling
 * POST /api/children
 */
export const createChild = async (req, res, next) => {
  try {
    const {
      name,
      dob,
      gender,
      birthWeight,
      motherName,
      fatherName,
      guardianPhone,
      address,
      village,
      awcCode,
      rchId,
      isHighRisk = false,
      highRiskReason
    } = req.body;

    const dobDate = new Date(dob);

    // 1. DUPLICATE REGISTRATION DETECTION
    // Check A: Unique RCH ID if supplied
    if (rchId && rchId.trim()) {
      const existingRch = await prisma.child.findUnique({
        where: { rchId: rchId.trim() }
      });
      if (existingRch) {
        return sendError(
          res,
          409,
          `Duplicate registration detected: A child is already registered with RCH ID #${rchId} (${existingRch.name}, Registration #${existingRch.registrationNumber}).`
        );
      }
    }

    // Check B: Demographic match (Exact Name + DOB + Mother Name + Guardian Phone)
    const duplicateChild = await prisma.child.findFirst({
      where: {
        name: { equals: name.trim(), mode: 'insensitive' },
        dob: dobDate,
        motherName: { equals: motherName.trim(), mode: 'insensitive' },
        guardianPhone: guardianPhone.trim()
      }
    });

    if (duplicateChild) {
      return sendError(
        res,
        409,
        `Duplicate registration detected: "${name}" born on ${dob} (Mother: ${motherName}) is already registered with Registration #${duplicateChild.registrationNumber}.`
      );
    }

    // 2. Resolve Site ID from awcCode or siteId
    let siteId = req.body.siteId;
    if (!siteId) {
      const matchedSite = await prisma.site.findFirst({
        where: {
          code: awcCode,
          ...(req.user.healthCentreId && { healthCentreId: req.user.healthCentreId })
        }
      });

      if (matchedSite) {
        siteId = matchedSite.id;
      } else {
        // Fallback to any site in the ANM's health facility
        const fallbackSite = await prisma.site.findFirst({
          where: { healthCentreId: req.user.healthCentreId }
        });
        siteId = fallbackSite?.id;
      }
    }

    if (!siteId) {
      return sendError(res, 400, `No matching immunization site found for AWC code "${awcCode}".`);
    }

    // 3. Generate sequential registration number
    const childCount = await prisma.child.count({
      where: { anmId: req.user.anmId }
    });
    const registrationNumber = `CHD-2026-${String(childCount + 1).padStart(4, '0')}`;

    // 4. Fetch UIP routine child vaccines to schedule initial due dates
    const uipVaccines = await prisma.vaccineMaster.findMany({
      where: { targetGroup: 'CHILD', isActive: true },
      orderBy: { recommendedAgeDays: 'asc' }
    });

    // 5. Create child and schedule routine immunization records transactionally
    const newChild = await prisma.$transaction(async (tx) => {
      const createdChild = await tx.child.create({
        data: {
          registrationNumber,
          anmId: req.user.anmId,
          siteId,
          name: name.trim(),
          dob: dobDate,
          gender,
          birthWeight: birthWeight ? parseFloat(birthWeight) : null,
          motherName: motherName.trim(),
          fatherName: fatherName ? fatherName.trim() : null,
          guardianPhone: guardianPhone.trim(),
          address: address ? address.trim() : null,
          village: village.trim(),
          awcCode: awcCode.trim(),
          rchId: rchId && rchId.trim() ? rchId.trim() : null,
          isHighRisk: !!isHighRisk,
          highRiskReason: isHighRisk ? highRiskReason : null
        },
        include: { site: true }
      });

      // Schedule UIP routine immunization doses
      if (uipVaccines.length > 0) {
        const vaccinationRecordsData = uipVaccines.map(vaccine => {
          const dueDate = new Date(dobDate.getTime() + vaccine.recommendedAgeDays * 24 * 60 * 60 * 1000);
          return {
            childId: createdChild.id,
            vaccineId: vaccine.id,
            doseGiven: vaccine.doseLabel,
            dueDate,
            status: 'DUE'
          };
        });

        await tx.vaccinationRecord.createMany({
          data: vaccinationRecordsData
        });
      }

      // Log action in AuditLog
      await tx.auditLog.create({
        data: {
          userId: req.user.id,
          action: 'CREATE',
          entityType: 'Child',
          entityId: createdChild.id,
          changes: { registrationNumber, name, motherName, dob, village }
        }
      });

      return createdChild;
    });

    // Fetch the complete created child with newly generated vaccination records
    const completeChild = await prisma.child.findUnique({
      where: { id: newChild.id },
      include: {
        site: true,
        vaccinationRecords: {
          include: { vaccine: true },
          orderBy: { dueDate: 'asc' }
        }
      }
    });

    return sendSuccess(res, 201, 'Child beneficiary registered and UIP vaccines scheduled successfully', completeChild);
  } catch (err) {
    next(err);
  }
};

/**
 * Edit / Update Child Details
 * PUT /api/children/:id
 */
export const updateChild = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingChild = await prisma.child.findUnique({ where: { id } });
    if (!existingChild) {
      return sendError(res, 404, 'Child beneficiary not found.');
    }

    // Role-based ANM data isolation check
    if (req.user.role === 'ANM' && existingChild.anmId !== req.user.anmId) {
      return sendError(res, 403, 'Access denied. You cannot edit beneficiaries belonging to another Sub-Centre.');
    }

    const {
      name,
      dob,
      gender,
      birthWeight,
      motherName,
      fatherName,
      guardianPhone,
      address,
      village,
      awcCode,
      rchId,
      isHighRisk,
      highRiskReason
    } = req.body;

    // Check duplicate RCH ID if changed
    if (rchId && rchId.trim() && rchId.trim() !== existingChild.rchId) {
      const duplicateRch = await prisma.child.findUnique({
        where: { rchId: rchId.trim() }
      });
      if (duplicateRch) {
        return sendError(
          res,
          409,
          `Duplicate RCH ID: Another child (${duplicateRch.name}) is already registered with #${rchId}.`
        );
      }
    }

    // Resolve site if awcCode changed
    let siteId = req.body.siteId;
    if (!siteId && awcCode && awcCode !== existingChild.awcCode) {
      const matchedSite = await prisma.site.findFirst({
        where: { code: awcCode }
      });
      if (matchedSite) siteId = matchedSite.id;
    }

    const updatedChild = await prisma.child.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(dob && { dob: new Date(dob) }),
        ...(gender && { gender }),
        ...(birthWeight !== undefined && { birthWeight: birthWeight ? parseFloat(birthWeight) : null }),
        ...(motherName && { motherName: motherName.trim() }),
        ...(fatherName !== undefined && { fatherName: fatherName ? fatherName.trim() : null }),
        ...(guardianPhone && { guardianPhone: guardianPhone.trim() }),
        ...(address !== undefined && { address: address ? address.trim() : null }),
        ...(village && { village: village.trim() }),
        ...(awcCode && { awcCode: awcCode.trim() }),
        ...(siteId && { siteId }),
        ...(rchId !== undefined && { rchId: rchId ? rchId.trim() : null }),
        ...(isHighRisk !== undefined && { isHighRisk: !!isHighRisk }),
        ...(highRiskReason !== undefined && { highRiskReason })
      },
      include: {
        site: true,
        vaccinationRecords: {
          include: { vaccine: true },
          orderBy: { dueDate: 'asc' }
        }
      }
    });

    return sendSuccess(res, 200, 'Child beneficiary details updated successfully', updatedChild);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete Child Record
 * DELETE /api/children/:id
 */
export const deleteChild = async (req, res, next) => {
  try {
    const { id } = req.params;

    const child = await prisma.child.findUnique({ where: { id } });
    if (!child) {
      return sendError(res, 404, 'Child beneficiary not found.');
    }

    if (req.user.role === 'ANM' && child.anmId !== req.user.anmId) {
      return sendError(res, 403, 'Access denied. You cannot delete beneficiaries belonging to another Sub-Centre.');
    }

    await prisma.child.delete({ where: { id } });

    return sendSuccess(res, 200, `Child record for "${child.name}" deleted successfully.`);
  } catch (err) {
    next(err);
  }
};
