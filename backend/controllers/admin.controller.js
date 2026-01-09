import User from '../models/User.model.js';
import Withdrawal from '../models/Withdrawal.model.js';
import Investment from '../models/Investment.model.js';
import mongoose from 'mongoose';

/**
 * AIRDROP: Add money to any user's wallet
 */
export const airdropBalance = async (req, res) => {
  try {
    const { email, amount, balanceType } = req.body; // balanceType: 'roiBalance' or 'referralBalance'

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $inc: { [`balances.${balanceType}`]: amount } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: `Successfully added $${amount} to ${balanceType}`,
      newBalance: user.balances[balanceType]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * MANAGE WITHDRAWALS: Approve or Reject
 */
export const updateWithdrawalStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { withdrawalId, status, transactionHash, adminNotes } = req.body;

    const withdrawal = await Withdrawal.findById(withdrawalId).session(session);
    if (!withdrawal) throw new Error('Withdrawal not found');

    if (withdrawal.status !== 'PENDING') {
      throw new Error('This withdrawal has already been processed');
    }

    // If REJECTED, refund the money to the user's balance
    if (status === 'REJECTED') {
      const balanceField = withdrawal.balanceType === 'ROI' ? 'roiBalance' : 'referralBalance';
      await User.findByIdAndUpdate(
        withdrawal.userId,
        { $inc: { [`balances.${balanceField}`]: withdrawal.amount } },
        { session }
      );
    }

    withdrawal.status = status;
    withdrawal.transactionHash = transactionHash;
    withdrawal.adminNotes = adminNotes;
    await withdrawal.save({ session });

    await session.commitTransaction();
    res.json({ success: true, message: `Withdrawal ${status} successfully` });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

/**
 * GET ALL USERS (Admin Overview)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET ALL PENDING WITHDRAWALS
 */
export const getPendingWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ status: 'PENDING' })
      .populate('userId', 'name email')
      .sort({ createdAt: 1 });
    res.json({ success: true, data: withdrawals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};