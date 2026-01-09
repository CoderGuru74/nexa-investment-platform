import React from 'react';
import { Clock, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

const WithdrawalHistory = ({ withdrawals }) => {
  if (!withdrawals || withdrawals.length === 0) {
    return (
      <div className="text-center py-6 bg-secondary/20 rounded-lg border border-dashed border-border">
        <p className="text-sm text-muted-foreground">No withdrawal history found.</p>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'REJECTED': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle2 className="w-3 h-3" />;
      case 'REJECTED': return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-muted-foreground text-xs uppercase">
            <th className="py-3 px-4 font-medium">Date</th>
            <th className="py-3 px-4 font-medium">Amount</th>
            <th className="py-3 px-4 font-medium">Type</th>
            <th className="py-3 px-4 font-medium">Status</th>
            <th className="py-3 px-4 font-medium">TX Hash</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {withdrawals.map((w) => (
            <tr key={w._id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
              <td className="py-3 px-4 text-foreground/80">
                {new Date(w.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 font-semibold text-foreground">
                ${w.amount.toFixed(2)}
              </td>
              <td className="py-3 px-4">
                <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-foreground/70">
                  {w.balanceType}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(w.status)}`}>
                  {getStatusIcon(w.status)}
                  {w.status}
                </div>
              </td>
              <td className="py-3 px-4">
                {w.transactionHash ? (
                   <span className="text-xs font-mono text-primary flex items-center gap-1 cursor-pointer hover:underline">
                     {w.transactionHash.substring(0, 10)}...
                     <ExternalLink className="w-3 h-3" />
                   </span>
                ) : (
                  <span className="text-muted-foreground/40">---</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WithdrawalHistory;