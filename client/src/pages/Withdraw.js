import React, { useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

function Withdraw() {
  const [amount, setAmount] = useState('');

  const handleWithdraw = async () => {
    try {
      await axios.post('/api/bank/withdraw', { amount: parseFloat(amount) });
      toast.success('Withdrawal successful');
      setAmount('');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Withdrawal failed');
    }
  };

  return (
    <div className="page-container">
      <h2>Withdraw Funds</h2>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button onClick={handleWithdraw}>Withdraw</button>
    </div>
  );
}

export default Withdraw;
