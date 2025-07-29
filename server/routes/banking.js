const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user balance and transaction history
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// Deposit
router.post('/deposit', auth, async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ msg: 'Invalid amount' });

  const user = await User.findById(req.user.id);
  user.balance += amount;
  user.transactions.push({ type: 'deposit', amount });
  await user.save();

  res.json({ balance: user.balance });
});

// Withdraw
router.post('/withdraw', auth, async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.user.id);

  if (amount <= 0 || amount > user.balance)
    return res.status(400).json({ msg: 'Invalid or insufficient funds' });

  user.balance -= amount;
  user.transactions.push({ type: 'withdraw', amount });
  await user.save();

  res.json({ balance: user.balance });
});

// Transfer funds to another user
router.post('/transfer', auth, async (req, res) => {
  const { recipientEmail, amount } = req.body;

  if (!recipientEmail || amount <= 0) {
    return res.status(400).json({ msg: 'Invalid input' });
  }

  const sender = await User.findById(req.user.id);
  const recipient = await User.findOne({ email: recipientEmail });

  if (!recipient) return res.status(404).json({ msg: 'Recipient not found' });
  if (sender.email === recipientEmail) return res.status(400).json({ msg: 'Cannot transfer to yourself' });
  if (sender.balance < amount) return res.status(400).json({ msg: 'Insufficient funds' });

  // Deduct from sender
  sender.balance -= amount;
  sender.transactions.push({ type: `transfer-to:${recipientEmail}`, amount });

  // Add to recipient
  recipient.balance += amount;
  recipient.transactions.push({ type: `transfer-from:${sender.email}`, amount });

  await sender.save();
  await recipient.save();

  res.json({ balance: sender.balance });
});

// Update name or password
router.put('/update', auth, async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findById(req.user.id);

  if (name) user.name = name;
  if (password) {
    const bcrypt = require('bcryptjs');
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();
  res.json({ msg: 'Profile updated successfully' });
});

// Delete account
router.delete('/delete', auth, async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.json({ msg: 'Account deleted' });
});


module.exports = router;
