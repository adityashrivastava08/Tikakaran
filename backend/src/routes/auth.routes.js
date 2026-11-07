import { Router } from 'express';
import { register, login, logout, adminRegisterUser, getMe } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Public self-registration for demo ANM workers
 * @access  Public
 */
router.post('/register', validate(registerSchema), register);

/**
 * @route   POST /api/auth/login
 * @desc    Sign in ANM / Health Worker and receive JWT
 * @access  Public
 */
router.post('/login', validate(loginSchema), login);

/**
 * @route   POST /api/auth/logout
 * @desc    Sign out and record audit log
 * @access  Private (Bearer JWT)
 */
router.post('/logout', authenticate, logout);

/**
 * @route   POST /api/auth/admin/register-user
 * @desc    Authorized administrator registers a health worker with specific role & facility
 * @access  Private (ADMIN or PHC_MOIC)
 */
router.post(
  '/admin/register-user',
  authenticate,
  requireRole('ADMIN', 'PHC_MOIC', 'DISTRICT_OFFICER'),
  adminRegisterUser
);

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user profile & Sub-Centre data
 * @access  Private (Bearer JWT)
 */
router.get('/me', authenticate, getMe);

export default router;
