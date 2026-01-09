import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth'; 
import { Copy, Share2, Wallet, ShieldAlert, History } from 'lucide-react'; 
import { Link } from 'react-router-dom';
import StatsGrid from '../components/dashboard/StatsGrid';
import InvestmentTable from '../components/dashboard/InvestmentTable';
import ReferralTree from '../components/dashboard/ReferralTree';
import ROIChart from '../components/dashboard/ROIChart';
import CreateInvestmentModal from '../components/dashboard/CreateInvestmentModal';
// NEW: Import the Withdrawal History component
import WithdrawalHistory from '../components/dashboard/WithdrawalHistory';

export default function Dashboard() {
  const { user } = useAuth(); 
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/dashboard');
      return response.data.data;
    },
    refetchInterval: 30000, 
  });

  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-foreground animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-destructive">Error loading dashboard</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/withdraw" className="btn bg-secondary text-foreground flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary/80 transition-all">
            <Wallet className="w-4 h-4" />
            Withdraw
          </Link>
          <CreateInvestmentModal onSuccess={refetch} />
        </div>
      </div>

      {/* Stats Summary */}
      <StatsGrid stats={data?.stats} />

      {/* Referral Link Card */}
      <div className="glass-dark rounded-lg p-6 border border-primary/20 bg-primary/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Referral Program
          </h2>
          <span className="text-xs font-mono bg-primary/20 text-primary px-2 py-1 rounded">
            Your Code: {user?.referralCode}
          </span>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            readOnly 
            value={referralLink} 
            className="flex-1 bg-background/50 border border-input rounded-md px-3 py-2 text-sm text-muted-foreground"
          />
          <button onClick={copyLink} className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2">
            <Copy className="w-4 h-4" />
            Copy
          </button>
        </div>
      </div>

      {/* Charts and Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-dark rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">ROI Growth (Last 30 Days)</h2>
          <ROIChart data={data?.roiChartData || []} />
        </div>

        <div className="glass-dark rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Referral Tree</h2>
          <ReferralTree tree={data?.referralTree} />
        </div>
      </div>

      {/* Investments Table */}
      <div className="glass-dark rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">My Investments</h2>
        <InvestmentTable onSuccess={refetch} />
      </div>

      {/* NEW: Withdrawal History Table */}
      <div className="glass-dark rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Withdrawal History
          </h2>
        </div>
        <WithdrawalHistory withdrawals={data?.recentWithdrawals || []} />
      </div>

      {/* Admin Quick Access (Only visible to you) */}
      {user?.email === 'success_test_v1@gmail.com' && (
        <div className="p-4 border border-yellow-500/30 bg-yellow-500/10 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-yellow-500" />
            <span className="text-yellow-500 font-medium">Administrator Access</span>
          </div>
          <div className="flex gap-4">
            <Link to="/admin/withdrawals" className="text-sm underline hover:text-yellow-400">Manage Requests</Link>
            <Link to="/admin/airdrop" className="text-sm underline hover:text-yellow-400">Airdrop Funds</Link>
          </div>
        </div>
      )}
    </div>
  );
}