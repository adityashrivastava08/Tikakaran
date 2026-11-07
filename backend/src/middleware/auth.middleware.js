import { verifyToken } from '../utils/jwt.util.js';
import { sendError } from '../utils/response.util.js';
import prisma from '../services/prisma.service.js';

/**
 * Authentication Middleware
 * Validates Bearer JWT token and attaches user & ANM profile to req
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Authentication token missing or invalid format. Please log in.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Fetch user and profile from database if available
    let dbUser = null;
    try {
      dbUser = await prisma.user.findUnique({
        where: { id: decoded.userId || decoded.id },
        include: { anmProfile: true }
      });
    } catch (dbErr) {
      // If DB is offline during initial setup, rely on decoded JWT payload
      console.warn('[Auth Middleware] DB lookup skipped:', dbErr.message);
    }

    if (dbUser && !dbUser.isActive) {
      return sendError(res, 403, 'Your health worker account is deactivated. Contact PHC MOIC.');
    }

    req.user = {
      id: dbUser ? dbUser.id : (decoded.userId || decoded.id),
      email: dbUser ? dbUser.email : decoded.email,
      role: dbUser ? dbUser.role : (decoded.role || 'ANM'),
      anmId: dbUser?.anmProfile?.id || decoded.anmId,
      healthCentreId: dbUser?.anmProfile?.healthCentreId || decoded.healthCentreId
    };

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Role-Based Access Control Middleware
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthenticated. Access denied.');
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, `Unauthorized. Required role: [${roles.join(', ')}].`);
    }

    next();
  };
};

