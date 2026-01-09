# Backend - Investment Platform API

## Models

### User
- Name, email, password
- Unique referral code (auto-generated)
- Referred by (reference to another user)
- Balances: roiBalance, referralBalance, totalInvested

### Investment
- User reference
- Amount, plan (Starter/Pro/Premium)
- Start date, end date
- Status (ACTIVE/COMPLETED/CANCELLED)
- Next payment date
- Daily ROI rate

### ROIHistory
- User and investment references
- Amount earned
- Date and processed status

### LevelIncome
- User and fromUser references
- Level (1-5)
- Amount earned
- Timestamp

### DailyLog
- Date (unique)
- Processed status
- Total ROI distributed
- Total investments processed

## Services

### FinanceService
- `processDailyROI()`: Processes daily ROI for all active investments
- `distributeReferralIncome()`: Distributes multi-level referral commissions
- `getReferralTree()`: Builds recursive referral tree

## Cron Job

Daily ROI processing runs at 00:00 every day. Uses DailyLog for idempotency.

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/investment-platform
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
NODE_ENV=development
```

