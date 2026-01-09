import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    referralCode: {
      type: String,
      unique: true,
      // No longer required in schema because the pre-save hook handles it
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    balances: {
      roiBalance: {
        type: Number,
        default: 0,
        min: 0,
      },
      referralBalance: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalInvested: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * EXPLICIT INDEXES
 */
userSchema.index({ referredBy: 1 });
userSchema.index({ referralCode: 1 });

/**
 * PRE-SAVE HOOK: Generate Referral Code & Hash Password
 */
userSchema.pre('save', async function (next) {
  // 1. Generate unique referral code for NEW users only
  if (this.isNew && (!this.referralCode || this.referralCode.trim() === "")) {
    let isUnique = false;
    while (!isUnique) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existingUser = await mongoose.model('User').findOne({ referralCode: code });
      if (!existingUser) {
        this.referralCode = code;
        isUnique = true;
      }
    }
  }

  // 2. Hash password if modified
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);