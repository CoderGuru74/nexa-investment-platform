import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Investment amount is required'],
      min: [0, 'Amount must be positive'],
    },
    plan: {
      type: String,
      required: true,
      enum: ['Starter', 'Pro', 'Premium'],
      default: 'Starter',
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      // REMOVED required: true because pre-save hook calculates this
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'],
      default: 'ACTIVE',
    },
    nextPaymentDate: {
      type: Date,
      // REMOVED required: true because pre-save hook calculates this
    },
    dailyROI: {
      type: Number,
      required: true,
      default: 0.01, // 1% daily ROI
    },
  },
  {
    timestamps: true,
  }
);

/**
 * OPTIMIZED COMPOUND INDEXES
 */
investmentSchema.index({ userId: 1, status: 1 });
investmentSchema.index({ status: 1, nextPaymentDate: 1 });

// Calculate end date based on plan before saving
investmentSchema.pre('save', function (next) {
  if (this.isNew) {
    // Set ROI based on plan
    if (this.plan === 'Starter') this.dailyROI = 0.01;
    if (this.plan === 'Pro') this.dailyROI = 0.015;
    if (this.plan === 'Premium') this.dailyROI = 0.02;

    // Calculate End Date
    const days = this.plan === 'Starter' ? 30 : this.plan === 'Pro' ? 60 : 90;
    const end = new Date(this.startDate);
    end.setDate(end.getDate() + days);
    this.endDate = end;
    
    // Set initial nextPaymentDate to tomorrow at midnight
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    this.nextPaymentDate = tomorrow;
  }
  next();
});

export default mongoose.model('Investment', investmentSchema);