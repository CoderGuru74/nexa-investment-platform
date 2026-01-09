# Investment Platform - MERN Stack

A high-end Investment Platform with Referral & ROI engine built using MongoDB, Express, React, and Node.js.

## Features

- **User Management**: Registration, login, and authentication with JWT
- **Investment System**: Create investments with different plans (Starter, Pro, Premium)
- **Daily ROI Processing**: Automated daily ROI distribution via cron job
- **Multi-Level Referral System**: 3-level referral commission (5%, 3%, 1%)
- **Dashboard**: Real-time stats, charts, and referral tree visualization
- **Security**: Rate limiting, input validation, and secure authentication

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Node-cron for scheduled tasks
- Joi for validation
- Express Rate Limit

### Frontend
- React 18
- Vite
- Tailwind CSS
- TanStack Query (React Query)
- Recharts for data visualization
- Lucide React for icons

## Project Structure

```
.
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Route controllers
│   ├── routes/          # Express routes
│   ├── middleware/      # Auth, validation, rate limiting
│   ├── services/        # Business logic (FinanceService)
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilities and API client
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/investment-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional, defaults to localhost:5000):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Investments
- `POST /api/investments` - Create new investment
- `GET /api/investments` - Get user's investments
- `GET /api/investments/:id` - Get investment by ID

### Dashboard
- `GET /api/dashboard` - Get aggregated dashboard data
- `GET /api/dashboard/referral-tree` - Get referral tree

## Investment Plans

- **Starter**: 1% daily ROI, 30 days duration
- **Pro**: 1.5% daily ROI, 60 days duration
- **Premium**: 2% daily ROI, 90 days duration

## Referral System

- **Level 1**: 5% commission on downline ROI
- **Level 2**: 3% commission on downline ROI
- **Level 3**: 1% commission on downline ROI

## Daily ROI Processing

The system automatically processes ROI daily at midnight (00:00) using a cron job. The process:
1. Finds all active investments due for payment
2. Distributes ROI to users
3. Triggers referral income distribution
4. Updates investment status and next payment date
5. Uses idempotency checks to prevent duplicate processing

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on login endpoint (5 attempts per 15 minutes)
- Input validation with Joi
- MongoDB transactions for data integrity

## Development Notes

- The ROI cron job runs immediately on startup in development mode
- All API routes (except auth) require authentication
- The dashboard refreshes every 30 seconds automatically
- Referral tree supports up to 5 levels deep

## License

ISC

