# Frontend - Investment Platform Dashboard

## Tech Stack
- React 18 with Vite
- Tailwind CSS for styling
- TanStack Query for data fetching
- Recharts for charts
- Lucide React for icons

## Features
- Dark mode fintech dashboard
- Glassmorphism UI design
- Real-time stats display
- Investment management
- Referral tree visualization
- ROI growth charts

## Components

### Dashboard
- Stats Grid: Shows total ROI, referral income, balances
- Investment Table: Lists all user investments
- ROI Chart: 30-day ROI growth visualization
- Referral Tree: Nested tree of referrals

### Pages
- Login: User authentication
- Register: New user registration with optional referral code
- Dashboard: Main dashboard with all features

## API Integration
All API calls are made through `src/lib/api.js` which includes:
- Automatic token injection
- Error handling
- Request/response interceptors

## Styling
Uses Tailwind CSS with custom dark theme variables. Glassmorphism effects applied via utility classes.

