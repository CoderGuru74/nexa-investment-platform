import React, { useState } from 'react';
import axios from 'axios';

const WithdrawalForm = () => {
  const [withdraw, setWithdraw] = useState({ 
    amount: '', 
    walletAddress: '', 
    balanceType: 'ROI' 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/withdrawals/request', withdraw, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Success: Withdrawal request sent! Your balance has been updated.");
      // Optional: Refresh page to show updated balance
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting withdrawal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h3>Withdraw Funds</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Select Balance Source</label>
          <select 
            className="form-control"
            value={withdraw.balanceType}
            onChange={e => setWithdraw({...withdraw, balanceType: e.target.value})}
          >
            <option value="ROI">ROI Balance</option>
            <option value="REFERRAL">Referral Balance</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Amount ($)</label>
          <input 
            type="number" 
            className="form-control"
            placeholder="Min $10"
            value={withdraw.amount}
            onChange={e => setWithdraw({...withdraw, amount: e.target.value})}
            required
          />
        </div>

        <div className="mb-3">
          <label>Wallet Address (USDT/BTC)</label>
          <input 
            type="text" 
            className="form-control"
            placeholder="Enter your crypto address"
            value={withdraw.walletAddress}
            onChange={e => setWithdraw({...withdraw, walletAddress: e.target.value})}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-100" 
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Submit Withdrawal'}
        </button>
      </form>
    </div>
  );
};

export default WithdrawalForm;