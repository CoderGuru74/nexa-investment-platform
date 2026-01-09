import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import investmentRoutes from './routes/investment.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import withdrawalRoutes from './routes/withdrawal.routes.js'; 
import adminRoutes from './routes/admin.routes.js'; 
import { startROICronJob } from './services/finance.service.js';

dotenv.config();

const app = express();

// --- UPDATED MIDDLEWARE: CORS FOR PRODUCTION ---
const allowedOrigins = [
  'http://localhost:5173', // Local Vite
  'http://localhost:3000', // Local React
  process.env.FRONTEND_URL  // Your Vercel Link (set this in Render Dashboard)
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/withdrawals', withdrawalRoutes); 
app.use('/api/admin', adminRoutes); 

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Investment Platform API is running',
    timestamp: new Date()
  });
});

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error('💥 Global Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // Start ROI cron job
    startROICronJob();
    console.log('✅ ROI Cron Job started');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

export default app;