import FeedStock from '../models/FeedStock.js';

// Helper function to normalize date to start of day
const normalizeDate = (dateString) => {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
};

// @desc    Get all feed stock records
// @route   GET /api/feed
// @access  Private
export const getFeedStocks = async (req, res) => {
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

    const records = await FeedStock.find(query)
      .sort({ date: -1, location: 1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Get feed stocks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get today's feed stock records
// @route   GET /api/feed/today
// @access  Private
export const getTodayFeedStocks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await FeedStock.getByDate(today);

    res.status(200).json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Get today feed stocks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get feed stock records by date
// @route   GET /api/feed/date/:date
// @access  Private
export const getFeedStocksByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const records = await FeedStock.getByDate(date);

    res.status(200).json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Get feed stocks by date error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get opening stock (previous day's closing)
// @route   GET /api/feed/opening/:date/:location
// @access  Private
export const getOpeningStock = async (req, res) => {
  try {
    const { date, location } = req.params;
    const opening = await FeedStock.getPreviousClosing(date, location);

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

// @desc    Create or update feed stock record
// @route   POST /api/feed
// @access  Private
export const createOrUpdateFeedStock = async (req, res) => {
  try {
    const { date, location, opening, received, used, notes } = req.body;

    // Validate required fields
    if (!date || !location) {
      return res.status(400).json({
        success: false,
        message: 'Date and location are required'
      });
    }

    const normalizedDate = normalizeDate(date);

    // Calculate closing
    const closing = (opening || 0) + (received || 0) - (used || 0);

    if (closing < 0) {
      return res.status(400).json({
        success: false,
        message: 'Closing stock cannot be negative. Please check your values.'
      });
    }

    // Find existing record or create new
    const existingRecord = await FeedStock.findOne({
      date: normalizedDate,
      location: location
    });

    let record;

    if (existingRecord) {
      // Update existing record
      existingRecord.opening = opening || 0;
      existingRecord.received = received || 0;
      existingRecord.used = used || 0;
      existingRecord.closing = closing;
      existingRecord.notes = notes;
      record = await existingRecord.save();
    } else {
      // Create new record
      record = await FeedStock.create({
        date: normalizedDate,
        location,
        opening: opening || 0,
        received: received || 0,
        used: used || 0,
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
    console.error('Create/Update feed stock error:', error);

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

// @desc    Update feed stock record by ID
// @route   PUT /api/feed/:id
// @access  Private
export const updateFeedStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { opening, received, used, notes } = req.body;

    const record = await FeedStock.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    // Update fields
    if (opening !== undefined) record.opening = opening;
    if (received !== undefined) record.received = received;
    if (used !== undefined) record.used = used;
    if (notes !== undefined) record.notes = notes;

    await record.save();

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Update feed stock error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete feed stock record
// @route   DELETE /api/feed/:id
// @access  Private
export const deleteFeedStock = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await FeedStock.findByIdAndDelete(id);

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
    console.error('Delete feed stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all data for all locations for a specific date
// @route   GET /api/feed/all/:date
// @access  Private
export const getAllLocationsData = async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = normalizeDate(date);
    const previousDate = new Date(targetDate);
    previousDate.setDate(previousDate.getDate() - 1);

    const locations = ['L1', 'L2', 'L3', 'L4', 'C'];

    // Get existing records for the date
    const existingRecords = await FeedStock.getByDate(targetDate);
    const existingMap = new Map(existingRecords.map(r => [r.location, r]));

    // Get previous day's closing for opening values
    const previousRecords = await FeedStock.getByDate(previousDate);
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
          received: existing.received,
          used: existing.used,
          closing: existing.closing,
          notes: existing.notes,
          hasData: true
        };
      } else {
        return {
          location: loc,
          opening: previousClosing,
          received: 0,
          used: 0,
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
