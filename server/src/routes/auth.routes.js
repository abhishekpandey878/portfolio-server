import { Router } from 'express';
import { getSession, login } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.get('/session', requireAuth, getSession);

export default router;

