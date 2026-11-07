import { Router } from 'express';
import { getSites, getSessions, createSession, updateSessionStatus } from '../controllers/siteSession.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { enforceANMOwnership } from '../middleware/anmOwnership.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/sites', getSites);
router.get('/sessions', getSessions);
router.post('/sessions', enforceANMOwnership(), createSession);
router.patch('/sessions/:id/status', enforceANMOwnership('session'), updateSessionStatus);

export default router;

