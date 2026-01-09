import { ChevronRight, User, Circle } from 'lucide-react';
import { useState } from 'react';

const TreeNode = ({ node, level = 0 }) => {
  // Direct referrals start expanded, deeper levels start collapsed
  const [expanded, setExpanded] = useState(level < 1);

  if (!node) return null;

  // Check if they are an "Active Investor" (totalInvested > 0)
  const isActive = node.totalInvested > 0;

  return (
    <div className="ml-2">
      <div
        className="group flex items-center gap-3 py-2 px-3 rounded-md hover:bg-secondary/50 transition-all cursor-pointer border border-transparent hover:border-border/50"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Expand Arrow - Only show if they have their own referrals */}
        <div className="w-4 h-4 flex items-center justify-center">
          {node.children && node.children.length > 0 && (
            <ChevronRight
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                expanded ? 'rotate-90' : ''
              }`}
            />
          )}
        </div>

        {/* User Icon with Active Status Indicator */}
        <div className="relative">
          <div className={`p-1.5 rounded-full ${isActive ? 'bg-primary/20' : 'bg-muted'}`}>
            <User className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <Circle 
            className={`w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5 fill-current ${
              isActive ? 'text-green-500' : 'text-gray-500'
            }`} 
          />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">{node.name}</span>
            {isActive && (
              <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded-full font-bold border border-green-500/20">
                ACTIVE
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground truncate">{node.email}</div>
        </div>

        {/* Stats on the right */}
        <div className="text-right hidden sm:block">
          <div className="text-[11px] font-mono text-foreground/70">${node.totalInvested?.toFixed(2) || '0.00'}</div>
          <div className="text-[10px] text-muted-foreground">Invested</div>
        </div>
      </div>

      {/* Render Children (Sub-Referrals) */}
      {expanded && node.children && node.children.length > 0 && (
        <div className="ml-6 border-l border-primary/20 pl-2 mt-1 space-y-1">
          {node.children.map((child, index) => (
            <TreeNode key={child.id || index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function ReferralTree({ tree }) {
  if (!tree) {
    return (
      <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
        No referral tree data available
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2">
      {/* Root Node (The Logged In User) */}
      <div className="flex items-center gap-3 py-3 px-4 rounded-lg bg-primary/5 border border-primary/20 mb-4">
        <div className="p-2 bg-primary/20 rounded-full">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-foreground">{tree.name} (You)</div>
          <div className="text-xs text-muted-foreground">{tree.email}</div>
        </div>
        <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
          LVL 0
        </div>
      </div>

      {/* Referral List */}
      <div className="space-y-1">
        {tree.children && tree.children.length > 0 ? (
          tree.children.map((child, index) => (
            <TreeNode key={child.id || index} node={child} />
          ))
        ) : (
          <div className="text-center py-10 bg-secondary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">No referrals yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-1 px-4">
              Your network is empty. Invite friends to see them appear here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}