import EggStock from '../models/EggStock.js';
import FeedStock from '../models/FeedStock.js';
import BirdStock from '../models/BirdStock.js';

// Helper function to normalize date to start of day
const normalizeDate = (dateString) => {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
};

// @desc    Get dashboard summary
// @route   GET /api/reports/summary
// @access  Private
export const getDashboardSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's egg production
    const eggRecords = await EggStock.find({
      date: { $gte: today, $lt: tomorrow }
    });
    const totalEggProduction = eggRecords.reduce((sum, r) => sum + (r.production || 0), 0);
    const totalEggClosing = eggRecords.reduce((sum, r) => sum + (r.closing || 0), 0);

    // Get today's feed stock
    const feedRecords = await FeedStock.find({
      date: { $gte: today, $lt: tomorrow }
    });
    const totalFeedClosing = feedRecords.reduce((sum, r) => sum + (r.closing || 0), 0);

    // Get today's bird stock
    const birdRecords = await BirdStock.find({
      date: { $gte: today, $lt: tomorrow }
    });
    const totalBirds = birdRecords.reduce((sum, r) => sum + (r.totalBirds || 0), 0);
    const totalMortality = birdRecords.reduce((sum, r) => sum + (r.mortality || 0), 0);
    const totalBirdProduction = birdRecords.reduce((sum, r) => sum + (r.production || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        date: today,
        eggs: {
          production: totalEggProduction,
          closing: totalEggClosing
        },
        feed: {
          closing: totalFeedClosing
        },
        birds: {
          total: totalBirds,
          mortality: totalMortality,
          production: totalBirdProduction
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get location-wise summary for a date
// @route   GET /api/reports/locations/:date
// @access  Private
export const getLocationSummary = async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = normalizeDate(date);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const locations = ['L1', 'L2', 'L3', 'L4', 'C'];
    const eggLocations = ['L1', 'L2', 'L3', 'L4'];

    // Get all records for the date
    const [eggRecords, feedRecords, birdRecords] = await Promise.all([
      EggStock.find({ date: { $gte: targetDate, $lt: nextDate } }),
      FeedStock.find({ date: { $gte: targetDate, $lt: nextDate } }),
      BirdStock.find({ date: { $gte: targetDate, $lt: nextDate } })
    ]);

    // Create maps for quick lookup
    const eggMap = new Map(eggRecords.map(r => [r.location, r]));
    const feedMap = new Map(feedRecords.map(r => [r.location, r]));
    const birdMap = new Map(birdRecords.map(r => [r.location, r]));

    // Build location summary
    const locationData = locations.map(loc => {
      const egg = eggLocations.includes(loc) ? eggMap.get(loc) : null;
      const feed = feedMap.get(loc);
      const bird = birdMap.get(loc);

      return {
        location: loc,
        eggs: egg ? {
          production: egg.production,
          closing: egg.closing,
          hasData: true
        } : { production: 0, closing: 0, hasData: false },
        feed: feed ? {
          closing: feed.closing,
          used: feed.used,
          hasData: true
        } : { closing: 0, used: 0, hasData: false },
        birds: bird ? {
          totalBirds: bird.totalBirds,
          mortality: bird.mortality,
          age: bird.age,
          production: bird.production,
          hasData: true
        } : { totalBirds: 0, mortality: 0, age: 0, production: 0, hasData: false }
      };
    });

    res.status(200).json({
      success: true,
      date: targetDate,
      data: locationData
    });
  } catch (error) {
    console.error('Get location summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get summary for a specific date
// @route   GET /api/reports/summary/:date
// @access  Private
export const getSummaryByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = normalizeDate(date);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Get records for the date
    const [eggRecords, feedRecords, birdRecords] = await Promise.all([
      EggStock.find({ date: { $gte: targetDate, $lt: nextDate } }),
      FeedStock.find({ date: { $gte: targetDate, $lt: nextDate } }),
      BirdStock.find({ date: { $gte: targetDate, $lt: nextDate } })
    ]);

    const totalEggProduction = eggRecords.reduce((sum, r) => sum + (r.production || 0), 0);
    const totalEggClosing = eggRecords.reduce((sum, r) => sum + (r.closing || 0), 0);
    const totalFeedClosing = feedRecords.reduce((sum, r) => sum + (r.closing || 0), 0);
    const totalBirds = birdRecords.reduce((sum, r) => sum + (r.totalBirds || 0), 0);
    const totalMortality = birdRecords.reduce((sum, r) => sum + (r.mortality || 0), 0);
    const totalBirdProduction = birdRecords.reduce((sum, r) => sum + (r.production || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        date: targetDate,
        eggs: {
          production: totalEggProduction,
          closing: totalEggClosing
        },
        feed: {
          closing: totalFeedClosing
        },
        birds: {
          total: totalBirds,
          mortality: totalMortality,
          production: totalBirdProduction
        }
      }
    });
  } catch (error) {
    console.error('Get summary by date error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
