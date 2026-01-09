import mongoose from 'mongoose';

const dailyLogSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true, // Automatically creates a unique index, no need for index: true
    },
    isProcessed: {
      type: Boolean,
      default: false,
    },
    processedAt: {
      type: Date,
    },
    totalROIDistributed: {
      type: Number,
      default: 0,
    },
    totalInvestmentsProcessed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * OPTIMIZED INDEXES
 * Removed duplicate 'date' index. 
 * Kept 'isProcessed' index to help the Cron job find unprocessed logs.
 */
dailyLogSchema.index({ isProcessed: 1 });

export default mongoose.model('DailyLog', dailyLogSchema);