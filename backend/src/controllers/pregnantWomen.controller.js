import prisma from '../services/prisma.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export const getPregnantWomen = async (req, res, next) => {
  try {
    const { village, hrp, search, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      ...(req.user.anmId && { anmId: req.user.anmId }),
      ...(village && village !== 'All' && { village }),
      ...(hrp === 'High Risk' && { isHighRisk: true }),
      ...(hrp === 'Normal' && { isHighRisk: false }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { husbandName: { contains: search, mode: 'insensitive' } },
          { mobile: { contains: search } },
          { rchId: { contains: search } },
          { registrationNumber: { contains: search } }
        ]
      })
    };

    const [total, list] = await Promise.all([
      prisma.pregnantWoman.count({ where }),
      prisma.pregnantWoman.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          site: true,
          ancVisits: { orderBy: { visitNumber: 'asc' } },
          tdRecords: { orderBy: { administeredDate: 'asc' } }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return sendSuccess(res, 200, 'Pregnant women register retrieved', list, {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    next(err);
  }
};

export const createPregnantWoman = async (req, res, next) => {
  try {
    const registrationNumber = `PW-${Date.now().toString().slice(-6)}`;
    const woman = await prisma.pregnantWoman.create({
      data: {
        registrationNumber,
        anmId: req.user.anmId,
        ...req.body,
        lmpDate: new Date(req.body.lmpDate),
        eddDate: new Date(req.body.eddDate)
      },
      include: { site: true }
    });

    return sendSuccess(res, 201, 'Pregnant woman registered successfully', woman);
  } catch (err) {
    next(err);
  }
};

export const updatePregnantWoman = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.lmpDate) data.lmpDate = new Date(data.lmpDate);
    if (data.eddDate) data.eddDate = new Date(data.eddDate);

    const woman = await prisma.pregnantWoman.update({
      where: { id: req.params.id },
      data,
      include: { site: true }
    });

    return sendSuccess(res, 200, 'Pregnant woman details updated', woman);
  } catch (err) {
    next(err);
  }
};

export const deletePregnantWoman = async (req, res, next) => {
  try {
    await prisma.pregnantWoman.delete({
      where: { id: req.params.id }
    });

    return sendSuccess(res, 200, 'Pregnant woman record deleted');
  } catch (err) {
    next(err);
  }
};

