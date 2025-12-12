import BirdStock from '../models/BirdStock.js';

// Helper function to normalize date to start of day
const normalizeDate = (dateString) => {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
};

// @desc    Get all bird stock records
// @route   GET /api/birds
// @access  Private
export const getBirdStocks = async (req, res) => {
  try {
    const { startDate, endDate, location } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: normalizeDate(startDate),
        $lte: normalizeDate(endDate)
      };
    }

    if (location) {
      query.location = location;
    }

    const records = await BirdStock.find(query)
      .sort({ date: -1, location: 1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Get bird stocks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get today's bird stock records
// @route   GET /api/birds/today
// @access  Private
export const getTodayBirdStocks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await BirdStock.getByDate(today);

    res.status(200).json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Get today bird stocks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get bird stock records by date
// @route   GET /api/birds/date/:date
// @access  Private
export const getBirdStocksByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const records = await BirdStock.getByDate(date);

    res.status(200).json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Get bird stocks by date error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get previous day's data
// @route   GET /api/birds/previous/:date/:location
// @access  Private
export const getPreviousData = async (req, res) => {
  try {
    const { date, location } = req.params;
    const previousData = await BirdStock.getPreviousData(date, location);

    res.status(200).json({
      success: true,
      data: previousData
    });
  } catch (error) {
    console.error('Get previous data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create or update bird stock record
// @route   POST /api/birds
// @access  Private
export const createOrUpdateBirdStock = async (req, res) => {
  try {
    const { date, location, age, totalBirds, mortality, production, notes } = req.body;

    // Validate required fields
    if (!date || !location) {
      return res.status(400).json({
        success: false,
        message: 'Date and location are required'
      });
    }

    const normalizedDate = normalizeDate(date);

    // Find existing record or create new
    const existingRecord = await BirdStock.findOne({
      date: normalizedDate,
      location: location
    });

    let record;

    if (existingRecord) {
      // Update existing record
      existingRecord.age = age || 0;
      existingRecord.totalBirds = totalBirds || 0;
      existingRecord.mortality = mortality || 0;
      existingRecord.production = production || 0;
      existingRecord.notes = notes;
      record = await existingRecord.save();
    } else {
      // Create new record
      record = await BirdStock.create({
        date: normalizedDate,
        location,
        age: age || 0,
        totalBirds: totalBirds || 0,
        mortality: mortality || 0,
        production: production || 0,
        notes,
        createdBy: req.user._id
      });
    }

    res.status(existingRecord ? 200 : 201).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Create/Update bird stock error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Record for this date and location already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update bird stock record by ID
// @route   PUT /api/birds/:id
// @access  Private
export const updateBirdStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { age, totalBirds, mortality, production, notes } = req.body;

    const record = await BirdStock.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    // Update fields
    if (age !== undefined) record.age = age;
    if (totalBirds !== undefined) record.totalBirds = totalBirds;
    if (mortality !== undefined) record.mortality = mortality;
    if (production !== undefined) record.production = production;
    if (notes !== undefined) record.notes = notes;

    await record.save();

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Update bird stock error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete bird stock record
// @route   DELETE /api/birds/:id
// @access  Private
export const deleteBirdStock = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await BirdStock.findByIdAndDelete(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (error) {
    console.error('Delete bird stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all data for all locations for a specific date
// @route   GET /api/birds/all/:date
// @access  Private
export const getAllLocationsData = async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = normalizeDate(date);
    const previousDate = new Date(targetDate);
    previousDate.setDate(previousDate.getDate() - 1);

    const locations = ['L1', 'L2', 'L3', 'L4', 'C'];

    // Get existing records for the date
    const existingRecords = await BirdStock.getByDate(targetDate);
    const existingMap = new Map(existingRecords.map(r => [r.location, r]));

    // Get previous day's data
    const previousRecords = await BirdStock.getByDate(previousDate);
    const previousMap = new Map(previousRecords.map(r => [r.location, {
      totalBirds: r.totalBirds,
      age: Math.round((r.age + (1/7)) * 100) / 100
    }]));

    // Build response with all locations
    const data = locations.map(loc => {
      const existing = existingMap.get(loc);
      const previousData = previousMap.get(loc) || { totalBirds: 0, age: 0 };

      if (existing) {
        return {
          _id: existing._id,
          location: loc,
          age: existing.age,
          totalBirds: existing.totalBirds,
          mortality: existing.mortality,
          production: existing.production,
          notes: existing.notes,
          hasData: true
        };
      } else {
        return {
          location: loc,
          age: previousData.age,
          totalBirds: previousData.totalBirds,
          mortality: 0,
          production: 0,
          notes: '',
          hasData: false
        };
      }
    });

    res.status(200).json({
      success: true,
      date: targetDate,
      data
    });
  } catch (error) {
    console.error('Get all locations data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
