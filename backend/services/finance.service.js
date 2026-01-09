import cron from 'node-cron';
import mongoose from 'mongoose';
import Investment from '../models/Investment.model.js';
import ROIHistory from '../models/ROIHistory.model.js';
import LevelIncome from '../models/LevelIncome.model.js';
import DailyLog from '../models/DailyLog.model.js';
import User from '../models/User.model.js';

class FinanceService {
  // Referral commission percentages for each level
  static REFERRAL_COMMISSIONS = {
    1: 0.05, // 5%
    2: 0.03, // 3%
    3: 0.01, // 1%
  };

  /**
   * Process daily ROI for all active investments
   */
  static async processDailyROI() {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 1. Idempotency Check
      const dailyLog = await DailyLog.findOne({ date: today }).session(session);
      if (dailyLog && dailyLog.isProcessed) {
        console.log(`✅ ROI already processed for ${today.toISOString().split('T')[0]}`);
        await session.abortTransaction();
        return;
      }

      // 2. Find Active Investments
      const activeInvestments = await Investment.find({
        status: 'ACTIVE',
        nextPaymentDate: { $lte: today },
      }).populate('userId').session(session);

      if (activeInvestments.length === 0) {
        await DailyLog.findOneAndUpdate(
          { date: today },
          { isProcessed: true, processedAt: new Date() },
          { upsert: true, new: true }
        ).session(session);
        await session.commitTransaction();
        return;
      }

      let totalROIDistributed = 0;
      let totalInvestmentsProcessed = 0;

      // 3. Process each Investment
      for (const investment of activeInvestments) {
        const roiAmount = investment.amount * (investment.dailyROI || 0);

        // Record ROI History
        const roiHistory = new ROIHistory({
          userId: investment.userId._id,
          investmentId: investment._id,
          amountEarned: roiAmount,
          date: today,
          isProcessed: true,
        });
        await roiHistory.save({ session });

        // Update user ROI balance
        await User.findByIdAndUpdate(
          investment.userId._id,
          { $inc: { 'balances.roiBalance': roiAmount } },
          { session }
        );

        // Update Investment status/date
        const nextPayment = new Date(investment.nextPaymentDate);
        nextPayment.setDate(nextPayment.getDate() + 1);

        if (nextPayment > investment.endDate) {
          investment.status = 'COMPLETED';
          investment.nextPaymentDate = investment.endDate;
        } else {
          investment.nextPaymentDate = nextPayment;
        }
        await investment.save({ session });

        // 4. Distribute Referral Income (The chain reaction)
        await this.distributeReferralIncome(
          investment.userId._id,
          roiAmount,
          session
        );

        totalROIDistributed += roiAmount;
        totalInvestmentsProcessed += 1;
      }

      // 5. Finalize Daily Log
      await DailyLog.findOneAndUpdate(
        { date: today },
        {
          isProcessed: true,
          processedAt: new Date(),
          totalROIDistributed,
          totalInvestmentsProcessed,
        },
        { upsert: true, new: true }
      ).session(session);

      await session.commitTransaction();
      console.log(`✅ Daily ROI: ${totalInvestmentsProcessed} investments processed.`);
    } catch (error) {
      await session.abortTransaction();
      console.error('❌ ROI Processing Error:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Distribute referral income up to 3 levels
   */
  static async distributeReferralIncome(userId, roiAmount, session) {
    try {
      let currentUserId = userId;
      let level = 1;

      while (level <= 3 && currentUserId) {
        const currentUser = await User.findById(currentUserId).session(session);
        if (!currentUser || !currentUser.referredBy) break;

        const referrerId = currentUser.referredBy;
        const commissionRate = this.REFERRAL_COMMISSIONS[level];
        const commissionAmount = roiAmount * commissionRate;

        if (commissionAmount > 0) {
          // Create level income record
          await LevelIncome.create([{
            userId: referrerId,
            fromUserId: currentUserId,
            level,
            amount: commissionAmount,
            timestamp: new Date(),
          }], { session });

          // Update referrer's referral balance
          await User.findByIdAndUpdate(
            referrerId,
            { $inc: { 'balances.referralBalance': commissionAmount } },
            { session }
          );
        }

        currentUserId = referrerId;
        level++;
      }
    } catch (error) {
      console.error('❌ Referral Distribution Error:', error);
    }
  }

  /**
   * Get referral tree recursively (Updated for your Frontend)
   */
  static async getReferralTree(userId, maxDepth = 5, currentDepth = 0) {
    if (currentDepth >= maxDepth) return null;

    const referrals = await User.find({ referredBy: userId })
      .select('name email referralCode balances.totalInvested');

    const children = [];

    for (const referral of referrals) {
      const childTree = await this.getReferralTree(
        referral._id,
        maxDepth,
        currentDepth + 1
      );

      children.push({
        id: referral._id,
        name: referral.name,
        email: referral.email,
        referralCode: referral.referralCode,
        totalInvested: referral.balances?.totalInvested || 0,
        children: childTree ? childTree.children : [], // Match nested component structure
      });
    }

    // On the first call (root), we return the children array directly
    // since the controller wraps it in the root "You" node.
    return children;
  }
}

/**
 * Start the daily ROI cron job
 */
export function startROICronJob() {
  cron.schedule('0 0 * * *', async () => {
    console.log('🔄 Cron: Starting daily ROI...');
    try {
      await FinanceService.processDailyROI();
    } catch (error) {
      console.error('❌ Cron job failed:', error);
    }
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('⚠️ Dev Mode: ROI processing triggered on startup.');
    FinanceService.processDailyROI().catch(console.error);
  }
}

export default FinanceService;