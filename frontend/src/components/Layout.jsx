import { useAuth } from '../hooks/useAuth';
import { LogOut, TrendingUp, Wallet, LayoutDashboard, ShieldCheck, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Layout({ children }) {
  const { logout, user } = useAuth();

  // Check if current user is the admin
  const isAdmin = user?.email === 'success_test_v1@gmail.com';

  return (
    <div className="min-h-screen bg-background">
      <nav className="glass-dark border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Main Nav */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Investment Platform</h1>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-6">
                <Link to="/" className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link to="/withdraw" className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  <Wallet className="w-4 h-4" />
                  Withdraw
                </Link>

                {/* Admin Only Section */}
                {isAdmin && (
                  <div className="flex items-center gap-6 ml-4 pl-4 border-l border-border">
                    <Link to="/admin/withdrawals" className="flex items-center gap-2 text-sm font-medium text-yellow-500 hover:text-yellow-400 transition-colors">
                      <ShieldCheck className="w-4 h-4" />
                      Manage Withdrawals
                    </Link>
                    <Link to="/admin/airdrop" className="flex items-center gap-2 text-sm font-medium text-yellow-500 hover:text-yellow-400 transition-colors">
                      <Coins className="w-4 h-4" />
                      Airdrop
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}