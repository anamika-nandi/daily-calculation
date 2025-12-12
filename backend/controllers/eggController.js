import EggStock from '../models/EggStock.js';

// Helper function to normalize date to start of day
const normalizeDate = (dateString) => {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
};

// @desc    Get all egg stock records
// @route   GET /api/eggs
// @access  Private
export const getEggStocks = async (req, res) => {
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

    const records = await EggStock.find(query)
      .sort({ date: -1, location: 1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Get egg stocks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get today's egg stock records
// @route   GET /api/eggs/today
// @access  Private
export const getTodayEggStocks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await EggStock.getByDate(today);

    res.status(200).json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Get today egg stocks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get egg stock records by date
// @route   GET /api/eggs/date/:date
// @access  Private
export const getEggStocksByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const records = await EggStock.getByDate(date);

    res.status(200).json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Get egg stocks by date error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get opening stock (previous day's closing)
// @route   GET /api/eggs/opening/:date/:location
// @access  Private
export const getOpeningStock = async (req, res) => {
  try {
    const { date, location } = req.params;
    const opening = await EggStock.getPreviousClosing(date, location);

    res.status(200).json({
      success: true,
      data: { opening }
    });
  } catch (error) {
    console.error('Get opening stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create or update egg stock record
// @route   POST /api/eggs
// @access  Private
export const createOrUpdateEggStock = async (req, res) => {
  try {
    const { date, location, opening, production, sell, notes } = req.body;

    // Validate required fields
    if (!date || !location) {
      return res.status(400).json({
        success: false,
        message: 'Date and location are required'
      });
    }

    const normalizedDate = normalizeDate(date);

    // Calculate closing
    const closing = (opening || 0) + (production || 0) - (sell || 0);

    if (closing < 0) {
      return res.status(400).json({
        success: false,
        message: 'Closing stock cannot be negative. Please check your values.'
      });
    }

    // Find existing record or create new
    const existingRecord = await EggStock.findOne({
      date: normalizedDate,
      location: location
    });

    let record;

    if (existingRecord) {
      // Update existing record
      existingRecord.opening = opening || 0;
      existingRecord.production = production || 0;
      existingRecord.sell = sell || 0;
      existingRecord.closing = closing;
      existingRecord.notes = notes;
      record = await existingRecord.save();
    } else {
      // Create new record
      record = await EggStock.create({
        date: normalizedDate,
        location,
        opening: opening || 0,
        production: production || 0,
        sell: sell || 0,
        closing,
        notes,
        createdBy: req.user._id
      });
    }

    res.status(existingRecord ? 200 : 201).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Create/Update egg stock error:', error);

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

// @desc    Update egg stock record by ID
// @route   PUT /api/eggs/:id
// @access  Private
export const updateEggStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { opening, production, sell, notes } = req.body;

    const record = await EggStock.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    // Update fields
    if (opening !== undefined) record.opening = opening;
    if (production !== undefined) record.production = production;
    if (sell !== undefined) record.sell = sell;
    if (notes !== undefined) record.notes = notes;

    await record.save();

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Update egg stock error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete egg stock record
// @route   DELETE /api/eggs/:id
// @access  Private
export const deleteEggStock = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await EggStock.findByIdAndDelete(id);

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
    console.error('Delete egg stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all data for all locations for a specific date
// @route   GET /api/eggs/all/:date
// @access  Private
export const getAllLocationsData = async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = normalizeDate(date);
    const previousDate = new Date(targetDate);
    previousDate.setDate(previousDate.getDate() - 1);

    const locations = ['L1', 'L2', 'L3', 'L4'];

    // Get existing records for the date
    const existingRecords = await EggStock.getByDate(targetDate);
    const existingMap = new Map(existingRecords.map(r => [r.location, r]));

    // Get previous day's closing for opening values
    const previousRecords = await EggStock.getByDate(previousDate);
    const previousMap = new Map(previousRecords.map(r => [r.location, r.closing]));

    // Build response with all locations
    const data = locations.map(loc => {
      const existing = existingMap.get(loc);
      const previousClosing = previousMap.get(loc) || 0;

      if (existing) {
        return {
          _id: existing._id,
          location: loc,
          opening: existing.opening,
          production: existing.production,
          sell: existing.sell,
          closing: existing.closing,
          notes: existing.notes,
          hasData: true
        };
      } else {
        return {
          location: loc,
          opening: previousClosing,
          production: 0,
          sell: 0,
          closing: previousClosing,
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
