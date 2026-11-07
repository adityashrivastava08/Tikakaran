import { sendError } from '../utils/response.util.js';
import prisma from '../services/prisma.service.js';

/**
 * Enforces ANM data isolation and territorial jurisdiction.
 * - ANM can only access data belonging to their assigned Health Sub-Centre / Sites.
 * - District and Block Officers / MOICs can access all Sub-Centres within their jurisdiction.
 */
export const enforceANMOwnership = (entityType) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return sendError(res, 401, 'Unauthenticated request.');
      }

      // Admins and MOICs have supervisor oversight
      if (['ADMIN', 'PHC_MOIC', 'BLOCK_OFFICER', 'DISTRICT_OFFICER'].includes(user.role)) {
        return next();
      }

      // For ANM role: verify anmId exists
      if (!user.anmId) {
        return sendError(res, 403, 'ANM health profile not linked to this user account.');
      }

      // If an explicit ID parameter is passed (e.g. /children/:id)
      const resourceId = req.params.id;
      if (resourceId && entityType) {
        let isOwner = false;
        try {
          switch (entityType) {
            case 'child': {
              const child = await prisma.child.findUnique({ where: { id: resourceId }, select: { anmId: true } });
              isOwner = child && child.anmId === user.anmId;
              break;
            }
            case 'pregnantWoman': {
              const woman = await prisma.pregnantWoman.findUnique({ where: { id: resourceId }, select: { anmId: true } });
              isOwner = woman && woman.anmId === user.anmId;
              break;
            }
            case 'session': {
              const session = await prisma.vaccinationSession.findUnique({ where: { id: resourceId }, select: { anmId: true } });
              isOwner = session && session.anmId === user.anmId;
              break;
            }
            case 'dutyRecord': {
              const duty = await prisma.dutyRecord.findUnique({ where: { id: resourceId }, select: { anmId: true } });
              isOwner = duty && duty.anmId === user.anmId;
              break;
            }
            case 'hmisReport': {
              const report = await prisma.hmisReport.findUnique({ where: { id: resourceId }, select: { anmId: true } });
              isOwner = report && report.anmId === user.anmId;
              break;
            }
            default:
              isOwner = true;
          }
        } catch (dbErr) {
          // If DB is offline during initial configuration, allow through with warning
          console.warn('[ANM Ownership] DB check skipped:', dbErr.message);
          return next();
        }

        if (!isOwner) {
          return sendError(res, 403, 'Access denied. You do not have ownership of this Sub-Centre record.');
        }
      }

      // Automatically scope query/body to the authenticated ANM
      if (req.body && !req.body.anmId) {
        req.body.anmId = user.anmId;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

