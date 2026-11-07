import { z } from 'zod';

export const recordVaccinationSchema = {
  body: z.object({
    recordId: z.string().uuid('Record ID must be a valid UUID').optional(),
    childId: z.string().uuid('Child ID must be a valid UUID'),
    vaccineId: z.string().uuid('Vaccine ID must be a valid UUID'),
    sessionId: z.string().uuid('Session ID must be a valid UUID').optional().nullable(),
    doseGiven: z.string().min(1, 'Dose label is required (e.g. Dose 1, Booster)'),
    administeredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    batchNumber: z.string().min(2, 'Vaccine vial batch/lot number is required'),
    expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expiry date must be in YYYY-MM-DD format').optional().nullable(),
    coldChainTemp: z.coerce.number().min(2, 'Cold chain minimum is 2°C').max(8, 'Cold chain maximum is 8°C').default(4.2),
    administeredBy: z.string().optional(),
    adverseEvent: z.boolean().default(false),
    adverseEventDetails: z.string().optional().nullable(),
    remarks: z.string().optional().nullable()
  })
};

export const vaccineMasterQuerySchema = {
  query: z.object({
    targetGroup: z.enum(['CHILD', 'PREGNANT_WOMAN', 'ADOLESCENT']).optional()
  }).optional()
};
