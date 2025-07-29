import React, { useEffect, useState, useCallback } from 'react';
import axios from '../utils/axios';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css'; // Create this CSS file or use inline styles

function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);

  const fetchUserData = useCallback(() => {
    axios
      .get('/api/bank/me')
      .then(res => {
        setBalance(res.data.balance);
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-content">
        <p className="balance">Balance: ${balance.toFixed(2)}</p>

        <div className="dashboard-buttons">
          <Link to="/deposit"><button>Deposit</button></Link>
          <Link to="/withdraw"><button>Withdraw</button></Link>
          <Link to="/transfer"><button>Transfer Funds</button></Link>
          <Link to="/transactions"><button>Transaction History</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
