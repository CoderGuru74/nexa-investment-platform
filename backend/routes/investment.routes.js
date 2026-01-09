import express from 'express';
import {
  createInvestment,
  getMyInvestments,
  getInvestmentById,
} from '../controllers/investment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate, schemas } from '../middleware/validation.middleware.js';
import { apiRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);
router.use(apiRateLimiter);

router.post('/', validate(schemas.createInvestment), createInvestment);
router.get('/', getMyInvestments);
router.get('/:id', getInvestmentById);

export default router;

