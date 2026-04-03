import { Router } from 'express';
import {
  getProfileSection,
  getProfile,
  updateProfileSection
} from '../controllers/profile.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getProfile);
router.get('/sections/:section', getProfileSection);
router.put('/sections/:section', requireAuth, updateProfileSection);

export default router;
