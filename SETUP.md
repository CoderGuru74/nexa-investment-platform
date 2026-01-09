# Quick Setup Guide

## Prerequisites
- Node.js v18+ installed
- MongoDB running (local or Atlas)
- npm or yarn

## Step 1: Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/investment-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

Backend runs on: http://localhost:5000

## Step 2: Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

(Optional) Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

Frontend runs on: http://localhost:3000

## Step 3: Test the Application

1. Open http://localhost:3000
2. Register a new account (or use a referral code if you have one)
3. Login with your credentials
4. Create an investment
5. View your dashboard

## Testing ROI Processing

In development mode, the ROI cron job runs immediately on server startup. To test:
1. Create an investment
2. The ROI will be processed on the next day at midnight
3. Or manually trigger by restarting the backend server (in dev mode)

## MongoDB Connection

### Local MongoDB
```env
MONGODB_URI=mongodb://localhost:27017/investment-platform
```

### MongoDB Atlas
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/investment-platform
```

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify .env file exists and has correct values
- Check if port 5000 is available

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in backend/server.js
- Verify VITE_API_URL in frontend/.env

### ROI not processing
- Check server logs for cron job messages
- Verify investments have status 'ACTIVE'
- Check DailyLog collection for processing status

## Production Deployment

1. Set `NODE_ENV=production` in backend/.env
2. Change `JWT_SECRET` to a strong random string
3. Update `MONGODB_URI` to production database
4. Build frontend: `cd frontend && npm run build`
5. Serve frontend build with a static server (nginx, etc.)

