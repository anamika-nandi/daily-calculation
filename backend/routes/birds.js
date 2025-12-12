import express from 'express';
import {
  getBirdStocks,
  getTodayBirdStocks,
  getBirdStocksByDate,
  getPreviousData,
  createOrUpdateBirdStock,
  updateBirdStock,
  deleteBirdStock,
  getAllLocationsData
} from '../controllers/birdController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getBirdStocks)
  .post(createOrUpdateBirdStock);

router.get('/today', getTodayBirdStocks);
router.get('/date/:date', getBirdStocksByDate);
router.get('/all/:date', getAllLocationsData);
router.get('/previous/:date/:location', getPreviousData);

router.route('/:id')
  .put(updateBirdStock)
  .delete(deleteBirdStock);

export default router;
