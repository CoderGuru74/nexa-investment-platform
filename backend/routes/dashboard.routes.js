import express from 'express';
import { getDashboardData, getReferralTree } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { apiRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);
router.use(apiRateLimiter);

router.get('/', getDashboardData);
router.get('/referral-tree', getReferralTree);

export default router;

