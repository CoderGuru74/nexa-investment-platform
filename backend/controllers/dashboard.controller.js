import User from '../models/User.model.js';
import Investment from '../models/Investment.model.js';
import ROIHistory from '../models/ROIHistory.model.js';
import LevelIncome from '../models/LevelIncome.model.js';
import FinanceService from '../services/finance.service.js';
// NEW: Import the Withdrawal model
import Withdrawal from '../models/Withdrawal.model.js';

/**
 * Get aggregated dashboard data
 */
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Fetch User document first to get LIVE wallet balances and referral info
    const user = await User.findById(userId).select('balances name email referralCode');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 2. Aggregate stats for Total Earned (ROI and Referral)
    const stats = await User.aggregate([
      { $match: { _id: userId } },
      {
        $lookup: {
          from: 'investments',
          localField: '_id',
          foreignField: 'userId',
          as: 'investments',
        },
      },
      {
        $lookup: {
          from: 'roihistories',
          localField: '_id',
          foreignField: 'userId',
          as: 'roiHistory',
        },
      },
      {
        $lookup: {
          from: 'levelincomes',
          localField: '_id',
          foreignField: 'userId',
          as: 'referralIncome',
        },
      },
      {
        $project: {
          totalROI: { $sum: '$roiHistory.amountEarned' },
          totalReferral: { $sum: '$referralIncome.amount' },
          activeInvestments: {
            $size: {
              $filter: {
                input: '$investments',
                as: 'inv',
                cond: { $eq: ['$$inv.status', 'ACTIVE'] },
              },
            },
          },
        },
      },
    ]);

    const userStats = stats[0] || { totalROI: 0, totalReferral: 0, activeInvestments: 0 };

    // 3. Get recent ROI transactions
    const recentROI = await ROIHistory.find({ userId })
      .populate('investmentId', 'plan amount')
      .sort({ date: -1 })
      .limit(10)
      .select('-__v');

    // 4. NEW: Get recent Withdrawal transactions for the new table
    const recentWithdrawals = await Withdrawal.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    // 5. Get recursive referral tree (Max 5 levels)
    const rawTree = await FinanceService.getReferralTree(userId, 5);
    
    // Format the tree root to include the current user
    const referralTree = {
      name: user.name,
      email: user.email,
      referralCode: user.referralCode,
      children: rawTree || []
    };

    // 6. Get ROI chart data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const roiChartData = await ROIHistory.aggregate([
      { $match: { userId, date: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalEarned: { $sum: '$amountEarned' },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          amount: '$totalEarned',
          _id: 0,
        },
      },
    ]);

    // 7. Return Data
    res.json({
      success: true,
      data: {
        stats: {
          totalROI: userStats.totalROI || 0,
          totalReferral: userStats.totalReferral || 0,
          activeInvestments: userStats.activeInvestments || 0,
          balances: {
            roiBalance: user.balances.roiBalance || 0,
            referralBalance: user.balances.referralBalance || 0,
            totalInvested: user.balances.totalInvested || 0
          }
        },
        recentROI,
        recentWithdrawals, // Added to the response
        referralTree,
        roiChartData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message,
    });
  }
};

/**
 * Get referral tree only
 */
export const getReferralTree = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('name email referralCode');
    const rawTree = await FinanceService.getReferralTree(userId, 5);

    res.json({
      success: true,
      data: {
        referralTree: {
          name: user.name,
          email: user.email,
          referralCode: user.referralCode,
          children: rawTree || []
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching referral tree',
      error: error.message,
    });
  }
};