import { DollarSign, TrendingUp, Users, Wallet } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, gradient }) => {
  return (
    <div className={`glass-dark rounded-lg p-6 ${gradient} relative overflow-hidden`}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-3xl font-bold text-foreground">
          ${typeof value === 'number' ? value.toFixed(2) : '0.00'}
        </h3>
      </div>
    </div>
  );
};

export default function StatsGrid({ stats }) {
  const statsData = [
    {
      title: 'Total ROI Earned',
      value: stats?.totalROI || 0,
      icon: TrendingUp,
      gradient: 'bg-gradient-to-br from-primary/20 to-primary/5',
    },
    {
      title: 'Total Referral Income',
      value: stats?.totalReferral || 0,
      icon: Users,
      gradient: 'bg-gradient-to-br from-green-500/20 to-green-500/5',
    },
    {
      title: 'ROI Balance',
      value: stats?.balances?.roiBalance || 0,
      icon: Wallet,
      gradient: 'bg-gradient-to-br from-blue-500/20 to-blue-500/5',
    },
    {
      title: 'Referral Balance',
      value: stats?.balances?.referralBalance || 0,
      icon: DollarSign,
      gradient: 'bg-gradient-to-br from-purple-500/20 to-purple-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

