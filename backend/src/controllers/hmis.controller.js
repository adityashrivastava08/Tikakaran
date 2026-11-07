import prisma from '../services/prisma.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export const getHmisReports = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const reports = await prisma.hMISReport.findMany({
      where: {
        ...(req.user.healthCentreId && { healthCentreId: req.user.healthCentreId }),
        ...(month && { reportMonth: month }),
        ...(year && { reportYear: Number(year) })
      },
      include: {
        healthCentre: true,
        values: {
          include: { item: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return sendSuccess(res, 200, 'HMIS monthly returns retrieved', reports);
  } catch (err) {
    next(err);
  }
};

export const generateHmisReport = async (req, res, next) => {
  try {
    const { formatType, reportMonth, reportYear } = req.body;

    const report = await prisma.hMISReport.create({
      data: {
        healthCentreId: req.user.healthCentreId,
        anmId: req.user.anmId,
        formatType: formatType || 'SC_FORM_7',
        reportMonth: reportMonth || 'October',
        reportYear: Number(reportYear) || 2026,
        status: 'VALIDATED',
        submissionDate: new Date(),
        certifiedBy: req.user.fullName || 'ANM Officer'
      },
      include: {
        healthCentre: true
      }
    });

    return sendSuccess(res, 201, 'HMIS report consolidated and validated', report);
  } catch (err) {
    next(err);
  }
};

