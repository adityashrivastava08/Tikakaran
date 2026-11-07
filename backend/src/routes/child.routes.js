import { Router } from 'express';
import { getChildren, getChildById, createChild, updateChild, deleteChild } from '../controllers/child.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { enforceANMOwnership } from '../middleware/anmOwnership.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createChildSchema, updateChildSchema } from '../validators/child.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', getChildren);
router.get('/:id', enforceANMOwnership('child'), getChildById);
router.post('/', validate(createChildSchema), enforceANMOwnership(), createChild);
router.put('/:id', validate(updateChildSchema), enforceANMOwnership('child'), updateChild);
router.delete('/:id', enforceANMOwnership('child'), deleteChild);

export default router;

