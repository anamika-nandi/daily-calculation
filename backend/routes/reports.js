import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getDashboardSummary,
  getLocationSummary,
  getSummaryByDate
} from '../controllers/reportController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Dashboard summary (today's data)
router.get('/summary', getDashboardSummary);

// Summary for a specific date
router.get('/summary/:date', getSummaryByDate);

// Location-wise summary for a date
router.get('/locations/:date', getLocationSummary);

export default router;
