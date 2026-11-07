import { z } from 'zod';

export const registerSchema = {
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    fullName: z.string().min(2, 'Full name is required'),
    mobile: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
    designation: z.string().default('ANM (Auxiliary Nurse Midwife)'),
    healthCentreCode: z.string().min(2, 'Health Sub-Centre code is required (e.g. SC-49201)'),
    hmisPortalId: z.string().optional(),
    rchPortalId: z.string().optional()
  })
};

export const loginSchema = {
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required')
  })
};

