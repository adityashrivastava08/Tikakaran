import { Router } from 'express';
import {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  getHealthCentres
} from '../controllers/anmProfile.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

// Health Centres list for assignment
router.get('/health-centres', getHealthCentres);

// ANM Profile CRUD
router.get('/profiles', getProfiles);
router.get('/profiles/:id', getProfileById);
router.post('/profiles', requireRole('ADMIN', 'PHC_MOIC'), createProfile);
router.put('/profiles/:id', updateProfile);
router.delete('/profiles/:id', requireRole('ADMIN'), deleteProfile);

export default router;

