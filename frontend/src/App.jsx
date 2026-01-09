import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

// Import your components
import WithdrawalForm from './components/WithdrawalForm';
import AdminAirdrop from './components/admin/AdminAirdrop';
import AdminWithdrawalQueue from './components/admin/AdminWithdrawalQueue';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-foreground">Verifying Admin...</div>
    </div>
  );

  // Updated logic to use the user object from our new hook
  const isAdmin = isAuthenticated && user?.email === 'success_test_v1@gmail.com'; 

  return isAdmin ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Main Dashboard */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* User Withdrawal Page */}
        <Route
          path="/withdraw"
          element={
            <PrivateRoute>
              <Layout>
                <div className="max-w-2xl mx-auto p-4">
                  <WithdrawalForm />
                </div>
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Admin Section */}
        <Route
          path="/admin/airdrop"
          element={
            <AdminRoute>
              <Layout>
                <div className="max-w-2xl mx-auto p-4">
                  <AdminAirdrop />
                </div>
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/withdrawals"
          element={
            <AdminRoute>
              <Layout>
                <div className="max-w-4xl mx-auto p-4">
                  <AdminWithdrawalQueue />
                </div>
              </Layout>
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;