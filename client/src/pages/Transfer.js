import React, { useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

function Transfer() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = async () => {
    try {
      await axios.post('/api/bank/transfer', {
        recipientEmail: email,
        amount: parseFloat(amount),
      });
      toast.success('Transfer successful');
      setEmail('');
      setAmount('');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Transfer failed');
    }
  };

  return (
    <div className="page-container">
      <h2>Transfer Funds</h2>
      <input
        type="email"
        placeholder="Recipient Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button onClick={handleTransfer}>Transfer</button>
    </div>
  );
}

export default Transfer;
