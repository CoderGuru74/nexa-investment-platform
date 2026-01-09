import express from 'express';
import { register, login, getProfile, getReferrerName } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);

// ADD THIS LINE:
router.get('/referrer/:code', getReferrerName);

export default router;