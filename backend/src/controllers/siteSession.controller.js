import prisma from '../services/prisma.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export const getSites = async (req, res, next) => {
  try {
    const sites = await prisma.site.findMany({
      where: {
        ...(req.user.healthCentreId && { healthCentreId: req.user.healthCentreId })
      },
      include: {
        _count: {
          select: {
            children: true,
            pregnantWomen: true,
            sessions: true
          }
        }
      },
      orderBy: { code: 'asc' }
    });

    return sendSuccess(res, 200, 'Sites list retrieved', sites);
  } catch (err) {
    next(err);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const { date, status } = req.query;
    const sessions = await prisma.vaccinationSession.findMany({
      where: {
        ...(req.user.anmId && { anmId: req.user.anmId }),
        ...(date && { sessionDate: new Date(date) }),
        ...(status && { status })
      },
      include: {
        site: true,
        _count: {
          select: {
            vaccinationRecords: true,
            tdRecords: true
          }
        }
      },
      orderBy: { sessionDate: 'asc' }
    });

    return sendSuccess(res, 200, 'Vaccination sessions retrieved', sessions);
  } catch (err) {
    next(err);
  }
};

export const createSession = async (req, res, next) => {
  try {
    const session = await prisma.vaccinationSession.create({
      data: {
        anmId: req.user.anmId,
        ...req.body,
        sessionDate: new Date(req.body.sessionDate)
      },
      include: { site: true }
    });

    return sendSuccess(res, 201, 'Vaccination session scheduled', session);
  } catch (err) {
    next(err);
  }
};

export const updateSessionStatus = async (req, res, next) => {
  try {
    const { status, cancellationReason } = req.body;
    const session = await prisma.vaccinationSession.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(cancellationReason && { cancellationReason })
      },
      include: { site: true }
    });

    return sendSuccess(res, 200, 'Session status updated', session);
  } catch (err) {
    next(err);
  }
};

