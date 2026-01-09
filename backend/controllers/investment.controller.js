import Investment from '../models/Investment.model.js';
import User from '../models/User.model.js';
import LevelIncome from '../models/LevelIncome.model.js'; // Ensure this model exists
import mongoose from 'mongoose';

/**
 * Create new investment with Instant Referral Bonus
 */
export const createInvestment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, plan } = req.body;
    const userId = req.user._id;

    // 1. Calculate daily ROI based on plan
    const dailyROIRates = {
      Starter: 0.01,  // 1% daily
      Pro: 0.015,    // 1.5% daily
      Premium: 0.02,  // 2% daily
    };

    const dailyROI = dailyROIRates[plan] || 0.01;

    // 2. Fetch user to check for referrer
    const user = await User.findById(userId).session(session);

    // 3. Create the investment
    const investmentArray = await Investment.create(
      [
        {
          userId,
          amount,
          plan,
          dailyROI,
          startDate: new Date(),
          nextPaymentDate: new Date(new Date().setHours(0,0,0,0) + 86400000), // Set for tomorrow
        },
      ],
      { session }
    );

    const investment = investmentArray[0];

    // 4. Update user's total invested balance
    await User.findByIdAndUpdate(
      userId,
      { $inc: { 'balances.totalInvested': amount } },
      { session }
    );

    // 5. --- INSTANT REFERRAL BONUS LOGIC ---
    if (user.referredBy) {
      const bonusPercentage = 0.05; // 5% Direct Commission
      const bonusAmount = amount * bonusPercentage;

      // Update Parent's referral balance
      await User.findByIdAndUpdate(
        user.referredBy,
        { $inc: { 'balances.referralBalance': bonusAmount } },
        { session }
      );

      // Create a record for the Level Income history
      await LevelIncome.create([
        {
          userId: user.referredBy,    // Who gets the money
          fromUserId: userId,        // Who invested
          amount: bonusAmount,
          level: 1,                  // Direct referral
          description: `Direct referral bonus from ${user.name}'s ${plan} investment`,
        }
      ], { session });
    }
    // --- END REFERRAL BONUS LOGIC ---

    await session.commitTransaction();

    const createdInvestment = await Investment.findById(investment._id)
      .populate('userId', 'name email')
      .select('-__v');

    res.status(201).json({
      success: true,
      message: 'Investment created and referral bonus paid!',
      data: {
        investment: createdInvestment,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: 'Error creating investment',
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

/**
 * Get all investments for current user
 */
export const getMyInvestments = async (req, res) => {
  try {
    const userId = req.user._id;
    const investments = await Investment.find({ userId })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      data: {
        investments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching investments',
      error: error.message,
    });
  }
};

/**
 * Get single investment by ID
 */
export const getInvestmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const investment = await Investment.findOne({ _id: id, userId })
      .populate('userId', 'name email')
      .select('-__v');

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found',
      });
    }

    res.json({
      success: true,
      data: {
        investment,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching investment',
      error: error.message,
    });
  }
};