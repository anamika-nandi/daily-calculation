import mongoose from 'mongoose';

const LOCATIONS = ['L1', 'L2', 'L3', 'L4', 'C'];

const feedStockSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required'],
    index: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    enum: {
      values: LOCATIONS,
      message: 'Location must be one of: L1, L2, L3, L4, C'
    },
    index: true
  },
  opening: {
    type: Number,
    required: true,
    min: [0, 'Opening stock cannot be negative'],
    default: 0
  },
  received: {
    type: Number,
    required: true,
    min: [0, 'Received cannot be negative'],
    default: 0
  },
  used: {
    type: Number,
    required: true,
    min: [0, 'Used cannot be negative'],
    default: 0
  },
  closing: {
    type: Number,
    required: true,
    min: [0, 'Closing stock cannot be negative']
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index for unique date-location combination
feedStockSchema.index({ date: 1, location: 1 }, { unique: true });

// Calculate closing before save
feedStockSchema.pre('save', function() {
  this.closing = this.opening + this.received - this.used;
  if (this.closing < 0) {
    throw new Error('Closing stock cannot be negative. Check your values.');
  }
});

// Static method to get previous day's closing
feedStockSchema.statics.getPreviousClosing = async function(date, location) {
  const currentDate = new Date(date);
  currentDate.setHours(0, 0, 0, 0);

  const previousDate = new Date(currentDate);
  previousDate.setDate(previousDate.getDate() - 1);

  const record = await this.findOne({
    date: previousDate,
    location: location
  });

  return record ? record.closing : 0;
};

// Static method to get records by date
feedStockSchema.statics.getByDate = async function(date) {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const nextDate = new Date(targetDate);
  nextDate.setDate(nextDate.getDate() + 1);

  return await this.find({
    date: {
      $gte: targetDate,
      $lt: nextDate
    }
  }).sort({ location: 1 });
};

const FeedStock = mongoose.model('FeedStock', feedStockSchema);

export default FeedStock;
