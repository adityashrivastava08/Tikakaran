import { Router } from 'express';
import { 
  getVaccineMasters, 
  getDueList, 
  getDueSummary, 
  getChildVaccinationHistory, 
  recordVaccination,
  getVaccinationSessions
} from '../controllers/vaccination.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { recordVaccinationSchema } from '../validators/vaccination.validator.js';

const router = Router();

// All vaccination endpoints require authentication
router.use(authenticate);

// 1. Vaccine Master List
router.get('/vaccines', getVaccineMasters);

// 2. Due List and Summaries
router.get('/due', getDueList);
router.get('/due-summary', getDueSummary);

// 3. Available sessions for dropdown
router.get('/sessions', getVaccinationSessions);

// 4. Beneficiary history
router.get('/history/:childId', getChildVaccinationHistory);

// 5. Administer / Record vaccination dose
router.post('/record', validate(recordVaccinationSchema), recordVaccination);

export default router;
