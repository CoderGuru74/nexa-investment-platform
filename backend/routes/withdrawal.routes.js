import express from 'express';
import { requestWithdrawal, getMyWithdrawals } from '../controllers/withdrawal.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/request', authenticate, requestWithdrawal);
router.get('/my', authenticate, getMyWithdrawals);

export default router;