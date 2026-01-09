import mongoose from 'mongoose';

const roiHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      // Removed individual index: true
    },
    investmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investment',
      required: true,
      // Removed individual index: true
    },
    amountEarned: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      // Removed individual index: true
    },
    isProcessed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * OPTIMIZED COMPOUND INDEXES
 * These solve the duplicate index warnings while providing 
 * better query performance than single-field indexes.
 */

// Speeds up the ROI Chart for a specific user (sorted by latest date)
roiHistorySchema.index({ userId: 1, date: -1 });

// Speeds up finding ROI history for a specific investment
roiHistorySchema.index({ investmentId: 1 });

// Speeds up Cron job audits to verify which dates are completed
roiHistorySchema.index({ date: 1, isProcessed: 1 });

export default mongoose.model('ROIHistory', roiHistorySchema);