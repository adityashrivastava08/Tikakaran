import { Router } from 'express';
import { checkHealth } from '../controllers/health.controller.js';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    API and Database Health Status Check
 * @access  Public
 */
router.get('/', checkHealth);

export default router;

