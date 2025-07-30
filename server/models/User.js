const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// 🔒 Hash the password before saving, only if it was modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);
