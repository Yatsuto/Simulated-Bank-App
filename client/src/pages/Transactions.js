import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/api/bank/me')
      .then(res => setTransactions(res.data.transactions.reverse()))
      .catch(() => navigate('/login'));
  }, [navigate]);

  return (
    <div className="page-container">
      <h2>Transaction History</h2>
      <ul>
        {transactions.map((t, i) => (
          <li key={i}>
            [{new Date(t.date).toLocaleString()}] {t.type.toUpperCase()} ${t.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transactions;
