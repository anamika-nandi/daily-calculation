import express from 'express';
import {
  getEggStocks,
  getTodayEggStocks,
  getEggStocksByDate,
  getOpeningStock,
  createOrUpdateEggStock,
  updateEggStock,
  deleteEggStock,
  getAllLocationsData
} from '../controllers/eggController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getEggStocks)
  .post(createOrUpdateEggStock);

router.get('/today', getTodayEggStocks);
router.get('/date/:date', getEggStocksByDate);
router.get('/all/:date', getAllLocationsData);
router.get('/opening/:date/:location', getOpeningStock);

router.route('/:id')
  .put(updateEggStock)
  .delete(deleteEggStock);

export default router;
