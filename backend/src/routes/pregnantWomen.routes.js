import { Router } from 'express';
import { getPregnantWomen, createPregnantWoman, updatePregnantWoman, deletePregnantWoman } from '../controllers/pregnantWomen.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { enforceANMOwnership } from '../middleware/anmOwnership.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPregnantWomanSchema, updatePregnantWomanSchema } from '../validators/pregnantWomen.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', getPregnantWomen);
router.post('/', validate(createPregnantWomanSchema), enforceANMOwnership(), createPregnantWoman);
router.put('/:id', validate(updatePregnantWomanSchema), enforceANMOwnership('pregnantWoman'), updatePregnantWoman);
router.delete('/:id', enforceANMOwnership('pregnantWoman'), deletePregnantWoman);

export default router;

