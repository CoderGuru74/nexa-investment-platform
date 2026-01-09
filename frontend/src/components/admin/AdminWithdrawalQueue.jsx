import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminWithdrawalQueue = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/withdrawals/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWithdrawals(res.data.data);
    } catch (err) {
      console.error("Error fetching withdrawals", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, status) => {
    const transactionHash = status === 'APPROVED' ? prompt("Enter Transaction Hash (Optional):") : "";
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/withdrawals/update', 
        { withdrawalId: id, status, transactionHash },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Withdrawal ${status}`);
      fetchWithdrawals(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  if (loading) return <div>Loading Queue...</div>;

  return (
    <div className="card p-4 shadow-sm mt-4">
      <h3>Pending Withdrawals</h3>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>User</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Wallet Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.length === 0 ? (
            <tr><td colSpan="5" className="text-center">No pending requests</td></tr>
          ) : (
            withdrawals.map(w => (
              <tr key={w._id}>
                <td>{w.userId?.email}</td>
                <td>${w.amount}</td>
                <td>{w.balanceType}</td>
                <td style={{fontSize: '12px'}}>{w.walletAddress}</td>
                <td>
                  <button onClick={() => handleUpdate(w._id, 'APPROVED')} className="btn btn-success btn-sm me-2">✅ Tick (Approve)</button>
                  <button onClick={() => handleUpdate(w._id, 'REJECTED')} className="btn btn-danger btn-sm">❌ Cancel (Reject)</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminWithdrawalQueue;