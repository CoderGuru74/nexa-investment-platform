import Withdrawal from '../models/Withdrawal.model.js';
import User from '../models/User.model.js';
import mongoose from 'mongoose';

/**
 * Request a new withdrawal
 */
export const requestWithdrawal = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, walletAddress, balanceType } = req.body;
    const userId = req.user._id;

    // 1. Get the user and check their current balance
    const user = await User.findById(userId).session(session);
    
    // Determine which field to check based on user choice (ROI or Referral)
    const balanceField = balanceType === 'ROI' ? 'roiBalance' : 'referralBalance';
    const currentBalance = user.balances[balanceField];

    if (currentBalance < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient ${balanceType} balance. Your current balance is $${currentBalance}`,
      });
    }

    // 2. Create the withdrawal record (Status: PENDING)
    const withdrawal = await Withdrawal.create(
      [
        {
          userId,
          amount,
          walletAddress,
          balanceType,
          status: 'PENDING',
        },
      ],
      { session }
    );

    // 3. DEDUCT the money from the user's wallet immediately
    // This prevents "double-spending" while the request is pending
    user.balances[balanceField] -= amount;
    await user.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: withdrawal[0],
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: 'Error processing withdrawal',
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

/**
 * Get all withdrawals for the logged-in user
 */
export const getMyWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: withdrawals,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching withdrawals' });
  }
};