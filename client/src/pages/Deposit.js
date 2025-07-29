import React, { useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

function Deposit() {
  const [amount, setAmount] = useState('');

  const handleDeposit = async () => {
    try {
      await axios.post('/api/bank/deposit', { amount: parseFloat(amount) });
      toast.success('Deposit successful');
      setAmount('');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Deposit failed');
    }
  };

  return (
    <div className="page-container">
      <h2>Deposit Funds</h2>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button onClick={handleDeposit}>Deposit</button>
    </div>
  );
}

export default Deposit;
