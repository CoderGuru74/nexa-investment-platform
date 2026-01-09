import { useQuery } from '@tanstack/react-query';
import api from "../../lib/api"; // This goes up two levels to 'src'
import { Badge } from './Badge';

export default function InvestmentTable({ onSuccess }) {
  const { data, isLoading } = useQuery({
    queryKey: ['investments'],
    queryFn: async () => {
      const response = await api.get('/investments');
      return response.data.data.investments;
    },
  });

  if (isLoading) {
    return <div className="text-muted-foreground">Loading investments...</div>;
  }

  const investments = data || [];

  const getStatusBadge = (status) => {
    const variants = {
      ACTIVE: 'bg-green-500/20 text-green-400',
      COMPLETED: 'bg-blue-500/20 text-blue-400',
      CANCELLED: 'bg-red-500/20 text-red-400',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[status] || ''}`}>
        {status}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (investments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No investments yet. Create your first investment to get started!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plan</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Start Date</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">End Date</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Next Payment</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((investment) => (
            <tr key={investment._id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
              <td className="py-3 px-4 text-foreground font-medium">
                ${investment.amount.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-foreground">{investment.plan}</td>
              <td className="py-3 px-4">{getStatusBadge(investment.status)}</td>
              <td className="py-3 px-4 text-muted-foreground">{formatDate(investment.startDate)}</td>
              <td className="py-3 px-4 text-muted-foreground">{formatDate(investment.endDate)}</td>
              <td className="py-3 px-4 text-muted-foreground">
                {investment.status === 'ACTIVE' ? formatDate(investment.nextPaymentDate) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

