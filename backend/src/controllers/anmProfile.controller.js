import prisma from '../services/prisma.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

/**
 * List ANM Profiles (Scoped by role)
 * GET /api/anm/profiles
 */
export const getProfiles = async (req, res, next) => {
  try {
    const { healthCentreId, search } = req.query;
    const user = req.user;

    const where = {
      ...(user.role === 'ANM' && { userId: user.id }),
      ...(healthCentreId && { healthCentreId }),
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { mobile: { contains: search } },
          { hmisPortalId: { contains: search } }
        ]
      })
    };

    const profiles = await prisma.aNMProfile.findMany({
      where,
      include: {
        healthCentre: true,
        user: {
          select: { id: true, email: true, role: true, isActive: true, createdAt: true }
        },
        _count: {
          select: {
            children: true,
            pregnantWomen: true,
            sessions: true
          }
        }
      },
      orderBy: { fullName: 'asc' }
    });

    return sendSuccess(res, 200, 'ANM profiles retrieved successfully', profiles);
  } catch (err) {
    next(err);
  }
};

/**
 * Get ANM Profile by ID
 * GET /api/anm/profiles/:id
 */
export const getProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const profile = await prisma.aNMProfile.findUnique({
      where: { id },
      include: {
        healthCentre: {
          include: { sites: true }
        },
        user: {
          select: { id: true, email: true, role: true, isActive: true, createdAt: true }
        },
        _count: {
          select: {
            children: true,
            pregnantWomen: true,
            sessions: true
          }
        }
      }
    });

    if (!profile) {
      return sendError(res, 404, 'ANM profile not found.');
    }

    // Authorization check: ANM can only view their own profile
    if (user.role === 'ANM' && profile.userId !== user.id) {
      return sendError(res, 403, 'Access denied. You can only view your own ANM profile.');
    }

    return sendSuccess(res, 200, 'ANM profile details retrieved', profile);
  } catch (err) {
    next(err);
  }
};

/**
 * Create ANM Profile (Admin / MOIC only)
 * POST /api/anm/profiles
 */
export const createProfile = async (req, res, next) => {
  try {
    const { userId, healthCentreId, fullName, designation, mobile, hmisPortalId, rchPortalId, anmolId } = req.body;

    // Check if user already has an ANM profile
    const existing = await prisma.aNMProfile.findUnique({ where: { userId } });
    if (existing) {
      return sendError(res, 409, 'An ANM profile is already linked to this user account.');
    }

    const profile = await prisma.aNMProfile.create({
      data: {
        userId,
        healthCentreId,
        fullName,
        designation: designation || 'ANM (Auxiliary Nurse Midwife)',
        mobile,
        hmisPortalId,
        rchPortalId,
        anmolId
      },
      include: {
        healthCentre: true,
        user: { select: { id: true, email: true, role: true } }
      }
    });

    return sendSuccess(res, 201, 'ANM profile created successfully', profile);
  } catch (err) {
    next(err);
  }
};

/**
 * Update ANM Profile & Health Centre Assignment
 * PUT /api/anm/profiles/:id
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const { fullName, designation, mobile, healthCentreId, hmisPortalId, rchPortalId, anmolId } = req.body;

    const existingProfile = await prisma.aNMProfile.findUnique({ where: { id } });
    if (!existingProfile) {
      return sendError(res, 404, 'ANM profile not found.');
    }

    // Role check: ANM can only update their own profile; Admin/MOIC can update any
    if (user.role === 'ANM' && existingProfile.userId !== user.id) {
      return sendError(res, 403, 'Access denied. You can only update your own profile.');
    }

    // Only Admin or MOIC can reassign healthCentreId
    const updateData = {
      ...(fullName && { fullName }),
      ...(designation && { designation }),
      ...(mobile && { mobile }),
      ...(hmisPortalId !== undefined && { hmisPortalId }),
      ...(rchPortalId !== undefined && { rchPortalId }),
      ...(anmolId !== undefined && { anmolId })
    };

    if (healthCentreId) {
      if (!['ADMIN', 'PHC_MOIC'].includes(user.role)) {
        return sendError(res, 403, 'Only PHC Incharge or Administrators can reassign Health Sub-Centres.');
      }
      updateData.healthCentreId = healthCentreId;
    }

    const updated = await prisma.aNMProfile.update({
      where: { id },
      data: updateData,
      include: { healthCentre: true }
    });

    return sendSuccess(res, 200, 'ANM profile updated successfully', updated);
  } catch (err) {
    next(err);
  }
};

/**
 * Deactivate / Delete ANM Profile (Admin only)
 * DELETE /api/anm/profiles/:id
 */
export const deleteProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const profile = await prisma.aNMProfile.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!profile) {
      return sendError(res, 404, 'ANM profile not found.');
    }

    // Soft delete / deactivate user account
    await prisma.user.update({
      where: { id: profile.userId },
      data: { isActive: false }
    });

    return sendSuccess(res, 200, 'ANM user account and profile deactivated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * List Health Centres for assignment
 * GET /api/anm/health-centres
 */
export const getHealthCentres = async (req, res, next) => {
  try {
    const centres = await prisma.healthCentre.findMany({
      include: {
        _count: {
          select: { anmProfiles: true, sites: true }
        }
      },
      orderBy: { code: 'asc' }
    });

    return sendSuccess(res, 200, 'Health centres retrieved', centres);
  } catch (err) {
    next(err);
  }
};

