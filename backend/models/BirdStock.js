import mongoose from 'mongoose';

const LOCATIONS = ['L1', 'L2', 'L3', 'L4', 'C'];

const birdStockSchema = new mongoose.Schema({
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
  age: {
    type: Number,
    required: true,
    min: [0, 'Age cannot be negative'],
    default: 0
  },
  totalBirds: {
    type: Number,
    required: true,
    min: [0, 'Total birds cannot be negative'],
    default: 0
  },
  mortality: {
    type: Number,
    required: true,
    min: [0, 'Mortality cannot be negative'],
    default: 0
  },
  production: {
    type: Number,
    required: true,
    min: [0, 'Production cannot be negative'],
    default: 0
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
birdStockSchema.index({ date: 1, location: 1 }, { unique: true });

// Static method to get previous day's data
birdStockSchema.statics.getPreviousData = async function(date, location) {
  const currentDate = new Date(date);
  currentDate.setHours(0, 0, 0, 0);

  const previousDate = new Date(currentDate);
  previousDate.setDate(previousDate.getDate() - 1);

  const record = await this.findOne({
    date: previousDate,
    location: location
  });

  if (record) {
    return {
      totalBirds: record.totalBirds,
      age: Math.round((record.age + (1/7)) * 100) / 100
    };
  }

  return { totalBirds: 0, age: 0 };
};

// Static method to get records by date
birdStockSchema.statics.getByDate = async function(date) {
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

const BirdStock = mongoose.model('BirdStock', birdStockSchema);

export default BirdStock;
