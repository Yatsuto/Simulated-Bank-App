const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const loginLimiter = require('../middleware/rateLimit');

// ──────────── Register ────────────
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      isVerified: false,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: email,
      subject: 'Verify Your Email',
      html: `
        <p>Thanks for registering! Click the link below to verify your email:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ msg: 'Registered! Please check your email to verify your account.' });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).send('Server error');
  }
});

// ──────────── Login ────────────
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({ msg: 'Please verify your email before logging in.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// ──────────── Forgot Password ────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'No account with that email.' });

    const token = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    user.resetPasswordToken = hashedToken; // store hashed token
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`; // send plain token in URL


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_USERNAME,
      subject: 'Password Reset',
      html: `<p>You requested a password reset</p>
             <p><a href="${resetUrl}">Click here to reset your password</a></p>`,
    });

    res.json({ msg: 'Reset link sent to your email' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ──────────── Verify Email ────────────
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ msg: 'Invalid token' });

    if (user.isVerified) return res.status(400).json({ msg: 'Email already verified' });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ msg: 'Email verified successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: 'Verification link is invalid or expired' });
  }
});

// ──────────── Reset Password ────────────
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('❌ No matching user found — token may be invalid or expired');
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error('Reset error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});



module.exports = router;
