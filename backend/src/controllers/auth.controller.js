import bcrypt from 'bcryptjs';
import prisma from '../services/prisma.service.js';
import { signToken } from '../utils/jwt.util.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

/**
 * Register a new ANM / Health Worker User
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, fullName, mobile, designation, healthCentreCode, hmisPortalId, rchPortalId } = req.body;

    // 1. Check if email or mobile already registered
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { anmProfile: { mobile } }
        ]
      }
    });

    if (existingUser) {
      return sendError(res, 409, 'User with this email or mobile number already exists.');
    }

    // 2. Hash password with bcrypt (10 rounds)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Find or create Health Centre
    let healthCentre = await prisma.healthCentre.findUnique({
      where: { code: healthCentreCode }
    });

    if (!healthCentre) {
      healthCentre = await prisma.healthCentre.create({
        data: {
          code: healthCentreCode,
          name: `Sub-Centre ${healthCentreCode}`,
          type: 'SUB_CENTRE',
          block: 'Rampur Block',
          district: 'Jabalpur',
          state: 'Madhya Pradesh',
          phcName: 'Rampur PHC'
        }
      });
    }

    // 4. Create User and ANM Profile transactionally
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: 'ANM',
          isActive: true
        }
      });

      const profile = await tx.aNMProfile.create({
        data: {
          userId: user.id,
          healthCentreId: healthCentre.id,
          fullName,
          designation: designation || 'ANM (Auxiliary Nurse Midwife)',
          mobile,
          hmisPortalId,
          rchPortalId
        }
      });

      return { user, profile };
    });

    // 5. Generate JWT token
    const token = signToken({
      userId: newUser.user.id,
      email: newUser.user.email,
      role: newUser.user.role,
      anmId: newUser.profile.id,
      healthCentreId: healthCentre.id
    });

    return sendSuccess(res, 201, 'ANM user account registered successfully', {
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        role: newUser.user.role,
        fullName: newUser.profile.fullName,
        designation: newUser.profile.designation,
        mobile: newUser.profile.mobile,
        healthCentre: {
          code: healthCentre.code,
          name: healthCentre.name,
          phcName: healthCentre.phcName
        }
      },
      token
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login ANM / Health Worker User
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email with ANM Profile and Health Centre
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        anmProfile: {
          include: { healthCentre: true }
        }
      }
    });

    if (!user) {
      return sendError(res, 401, 'Invalid email or password credentials.');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Account is deactivated. Please contact your Block/PHC administrator.');
    }

    // 2. Compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid email or password credentials.');
    }

    // 3. Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      anmId: user.anmProfile?.id,
      healthCentreId: user.anmProfile?.healthCentreId
    });

    return sendSuccess(res, 200, 'Login successful', {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.anmProfile?.fullName || 'Healthcare Officer',
        designation: user.anmProfile?.designation || user.role,
        mobile: user.anmProfile?.mobile,
        subCentre: user.anmProfile?.healthCentre?.name,
        subCentreCode: user.anmProfile?.healthCentre?.code,
        phcName: user.anmProfile?.healthCentre?.phcName
      },
      token
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Logout User
 * POST /api/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    if (req.user?.id) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          action: 'LOGOUT',
          entityType: 'User',
          entityId: req.user.id,
          ipAddress: req.ip || req.headers['x-forwarded-for']
        }
      }).catch(() => {});
    }

    return sendSuccess(res, 200, 'User logged out successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Register User (Authorized Admin / MOIC only)
 * POST /api/auth/admin/register-user
 */
export const adminRegisterUser = async (req, res, next) => {
  try {
    const { email, password, role = 'ANM', fullName, mobile, designation, healthCentreId, healthCentreCode, hmisPortalId, rchPortalId } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return sendError(res, 409, 'User with this email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let targetCentreId = healthCentreId;
    if (!targetCentreId && healthCentreCode) {
      const hc = await prisma.healthCentre.findUnique({ where: { code: healthCentreCode } });
      if (hc) targetCentreId = hc.id;
    }

    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          role,
          isActive: true
        }
      });

      let profile = null;
      if (fullName && mobile && targetCentreId) {
        profile = await tx.aNMProfile.create({
          data: {
            userId: newUser.id,
            healthCentreId: targetCentreId,
            fullName,
            designation: designation || (role === 'ANM' ? 'Auxiliary Nurse Midwife (ANM)' : role),
            mobile,
            hmisPortalId,
            rchPortalId
          },
          include: { healthCentre: true }
        });
      }

      await tx.auditLog.create({
        data: {
          userId: req.user.id,
          action: 'CREATE',
          entityType: 'User',
          entityId: newUser.id,
          changes: { email, role, fullName, targetCentreId }
        }
      });

      return { user: newUser, profile };
    });

    return sendSuccess(res, 201, 'User account created by administrator successfully', result);
  } catch (err) {
    next(err);
  }
};

/**
 * Get Current Authenticated User Profile
 * GET /api/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        anmProfile: {
          include: {
            healthCentre: {
              include: { sites: true }
            }
          }
        }
      }
    });

    if (!user) {
      return sendError(res, 404, 'User profile not found.');
    }

    return sendSuccess(res, 200, 'Authenticated user profile retrieved', user);
  } catch (err) {
    next(err);
  }
};
