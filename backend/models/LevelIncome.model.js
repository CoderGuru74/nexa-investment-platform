import mongoose from 'mongoose';

const levelIncomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      // Removed index: true
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      // Removed index: true
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      // Removed index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      // Removed index: true
    },
  },
  {
    timestamps: true,
  }
);

/**
 * OPTIMIZED INDEXES
 * These replace the individual field indexes to stop terminal warnings.
 */
levelIncomeSchema.index({ userId: 1, timestamp: -1 });
levelIncomeSchema.index({ fromUserId: 1 });
levelIncomeSchema.index({ level: 1 });

export default mongoose.model('LevelIncome', levelIncomeSchema);