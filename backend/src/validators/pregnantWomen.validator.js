import { z } from 'zod';

export const createPregnantWomanSchema = {
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    age: z.number().int().min(14).max(55, 'Age must be between 14 and 55'),
    husbandName: z.string().min(2, 'Husband or Guardian name is required'),
    mobile: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit mobile number'),
    village: z.string().min(2, 'Village is required'),
    awcCode: z.string().min(2, 'AWC code is required'),
    siteId: z.string().uuid('Site ID must be a valid UUID'),
    lmpDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'LMP date must be in YYYY-MM-DD format'),
    eddDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'EDD date must be in YYYY-MM-DD format'),
    gravida: z.number().int().min(1).default(1),
    para: z.number().int().min(0).default(0),
    isHighRisk: z.boolean().default(false),
    highRiskReason: z.string().optional(),
    bloodGroup: z.string().optional(),
    rchId: z.string().optional()
  })
};

export const updatePregnantWomanSchema = {
  params: z.object({
    id: z.string().uuid('Pregnant Woman ID must be a valid UUID')
  }),
  body: createPregnantWomanSchema.body.partial()
};

