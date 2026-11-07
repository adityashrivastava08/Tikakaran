import { Router } from 'express';
import { getHmisReports, generateHmisReport } from '../controllers/hmis.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { enforceANMOwnership } from '../middleware/anmOwnership.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/reports', getHmisReports);
router.post('/generate', enforceANMOwnership(), generateHmisReport);

export default router;

