import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import anmProfileRoutes from './anmProfile.routes.js';
import childRoutes from './child.routes.js';
import pregnantWomenRoutes from './pregnantWomen.routes.js';
import vaccinationRoutes from './vaccination.routes.js';
import siteSessionRoutes from './siteSession.routes.js';
import hmisRoutes from './hmis.routes.js';

const router = Router();

// Mount individual domain route modules
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/anm', anmProfileRoutes);
router.use('/children', childRoutes);
router.use('/pregnant-women', pregnantWomenRoutes);
router.use('/vaccinations', vaccinationRoutes);
router.use('/', siteSessionRoutes); // /sites, /sessions
router.use('/hmis', hmisRoutes);

export default router;
