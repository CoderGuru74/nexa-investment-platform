import React, { useState } from 'react';
import axios from 'axios';

const AdminAirdrop = () => {
  const [data, setData] = useState({ 
    email: '', 
    amount: '', 
    balanceType: 'roiBalance' 
  });
  const [loading, setLoading] = useState(false);

  const handleAirdrop = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/admin/airdrop', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      setData({ email: '', amount: '', balanceType: 'roiBalance' }); // Reset form
    } catch (err) {
      alert(err.response?.data?.message || "Error performing airdrop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h3 className="mb-4">Admin God Mode: Airdrop Funds</h3>
      <form onSubmit={handleAirdrop}>
        <div className="mb-3">
          <label>User Email</label>
          <input 
            type="email" 
            className="form-control"
            placeholder="user@example.com"
            value={data.email}
            onChange={e => setData({...data, email: e.target.value})}
            required
          />
        </div>

        <div className="mb-3">
          <label>Amount ($)</label>
          <input 
            type="number" 
            className="form-control"
            placeholder="Enter amount to add"
            value={data.amount}
            onChange={e => setData({...data, amount: e.target.value})}
            required
          />
        </div>

        <div className="mb-3">
          <label>Select Balance to Increase</label>
          <select 
            className="form-control"
            value={data.balanceType}
            onChange={e => setData({...data, balanceType: e.target.value})}
          >
            <option value="roiBalance">ROI Balance</option>
            <option value="referralBalance">Referral Balance</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="btn btn-danger w-100" 
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Execute Airdrop'}
        </button>
      </form>
    </div>
  );
};

// THIS IS THE LINE YOU WERE LIKELY MISSING:
export default AdminAirdrop;