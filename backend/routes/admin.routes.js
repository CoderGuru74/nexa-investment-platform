import express from 'express';
import { airdropBalance, updateWithdrawalStatus, getAllUsers, getPendingWithdrawals } from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// In a real app, you'd add an 'isAdmin' middleware here too!
router.post('/airdrop', authenticate, airdropBalance);
router.post('/withdrawals/update', authenticate, updateWithdrawalStatus);
router.get('/users', authenticate, getAllUsers);
router.get('/withdrawals/pending', authenticate, getPendingWithdrawals);

export default router;