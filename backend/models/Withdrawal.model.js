import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Withdrawal amount is required'],
      min: [1, 'Minimum withdrawal is $1'], // You can adjust this limit
    },
    currency: {
      type: String,
      default: 'USDT', // Or 'USD', 'BTC', etc.
    },
    walletAddress: {
      type: String,
      required: [true, 'Wallet address is required for payment'],
    },
    balanceType: {
      type: String,
      enum: ['ROI', 'REFERRAL'],
      required: true,
      description: 'Which wallet the money is being taken from'
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    transactionHash: {
      type: String, // Filled after you manually pay the user
      default: null,
    },
    adminNotes: {
      type: String,
      default: '',
    }
  },
  {
    timestamps: true,
  }
);

// Indexing for faster admin lookups
withdrawalSchema.index({ userId: 1, status: 1 });

export default mongoose.model('Withdrawal', withdrawalSchema);