import express from 'express';
import {
  getFeedStocks,
  getTodayFeedStocks,
  getFeedStocksByDate,
  getOpeningStock,
  createOrUpdateFeedStock,
  updateFeedStock,
  deleteFeedStock,
  getAllLocationsData
} from '../controllers/feedController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getFeedStocks)
  .post(createOrUpdateFeedStock);

router.get('/today', getTodayFeedStocks);
router.get('/date/:date', getFeedStocksByDate);
router.get('/all/:date', getAllLocationsData);
router.get('/opening/:date/:location', getOpeningStock);

router.route('/:id')
  .put(updateFeedStock)
  .delete(deleteFeedStock);

export default router;
