import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');



  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/bank/me', {
        headers: { 'x-auth-token': token },
      })
      .then(res => {
        setBalance(res.data.balance);
        setTransactions(res.data.transactions.reverse());
      })
      .catch(() => navigate('/login'));
  }, []);

  const handleTransaction = async (type, extra = {}) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/bank/${type}`,
        { amount: parseFloat(amount), ...extra },
        { headers: { 'x-auth-token': token } }
      );
      setBalance(res.data.balance);
      setAmount('');
      setRecipientEmail('');
      fetchUserData(); // re-fetch transactions

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} successful!`);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Transaction failed');
    }
  };

  // Add this:
  const fetchUserData = () => {
    axios
      .get('http://localhost:5000/api/bank/me', {
        headers: { 'x-auth-token': token },
      })
      .then(res => {
        setBalance(res.data.balance);
        setTransactions(res.data.transactions.reverse());
      })
      .catch(() => navigate('/login'));
  };

  // Call on load:
  useEffect(() => {
    fetchUserData();
  }, []);



  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p><strong>Balance:</strong> ${balance.toFixed(2)}</p>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button onClick={() => handleTransaction('deposit')}>Deposit</button>
      <button onClick={() => handleTransaction('withdraw')}>Withdraw</button>

      <h3>Transaction History</h3>
      <ul>
        {transactions.map((t, i) => (
          <li key={i}>
            [{new Date(t.date).toLocaleString()}] {t.type.toUpperCase()} ${t.amount}
          </li>
        ))}
      </ul>

      <br />
      <button onClick={handleLogout}>Logout</button>


      <h3>Transfer Funds</h3>
      <input
        type="email"
        placeholder="Recipient Email"
        value={recipientEmail}
        onChange={e => setRecipientEmail(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button onClick={() => handleTransaction('transfer', { recipientEmail })}>Transfer</button>
    </div>
  );
}

export default Dashboard;
