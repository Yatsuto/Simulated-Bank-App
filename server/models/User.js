const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  balance: {
    type: Number,
    default: 0,
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date,


  transactions: [
    {
      type: {
        type: String, // 'deposit' or 'withdraw'
      },
      amount: Number,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);
