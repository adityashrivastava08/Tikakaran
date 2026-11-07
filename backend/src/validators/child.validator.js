import { z } from 'zod';

export const createChildSchema = {
  body: z.object({
    name: z.string().min(2, 'Child name is required'),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'DOB must be in YYYY-MM-DD format'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    birthWeight: z.union([
      z.number(),
      z.string().transform(v => {
        const parsed = parseFloat(v.replace(/[^0-9.]/g, ''));
        return isNaN(parsed) ? undefined : parsed;
      })
    ]).optional(),
    motherName: z.string().min(2, 'Mother name is required'),
    fatherName: z.string().optional().nullable(),
    guardianPhone: z.string().transform(v => v.replace(/\D/g, '').slice(-10)).refine(v => /^[6-9]\d{9}$/.test(v), {
      message: 'Must be a valid 10-digit Indian mobile number'
    }),
    address: z.string().optional().nullable(),
    village: z.string().min(2, 'Village name is required'),
    awcCode: z.string().min(2, 'AWC code is required (e.g. AWC-04)'),
    siteId: z.string().uuid('Site ID must be a valid UUID').optional(),
    rchId: z.string().optional().nullable(),
    isHighRisk: z.boolean().default(false),
    highRiskReason: z.string().optional().nullable()
  })
};

export const updateChildSchema = {
  params: z.object({
    id: z.string().uuid('Child ID must be a valid UUID')
  }),
  body: createChildSchema.body.partial()
};
