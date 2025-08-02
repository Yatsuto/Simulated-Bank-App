import React, { useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import zxcvbn from 'zxcvbn';
import { Link } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('Weak');

  const getPasswordRules = (password) => {
    return {
      length: password.length >= 8,
      number: /\d/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
      uppercase: /[A-Z]/.test(password),
    };
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'password') {
      const passwordStrength = zxcvbn(value);
      const score = passwordStrength.score;
      const label = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'][score];
      setStrengthScore(score);
      setStrengthLabel(label);
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return regex.test(email);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate email format
    if (!isValidEmail(form.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!validatePassword(form.password)) {
      toast.error('Password must be at least 8 characters long and include at least one number, one uppercase letter, and one special character.');
      return;
    }

    try {
      setLoading(true);
      const { name, email, password } = form; // ✅ Fix here
      const res = await axios.post('/api/auth/register', { name, email, password });

      toast.success(res.data.msg || 'Registered! Please check your email to verify your account.');
      setForm({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white max-w-sm mx-auto mt-10 p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Create an Account</h2>

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded-md"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded-md"
      />

      <div className="relative">
        <input
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded-md"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-2 text-sm text-blue-600"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* ✅ Show strength only if password has been typed */}
      {form.password && form.password.length > 0 && (
        <div className="mt-2">
          <progress value={strengthScore} max="4" className="w-full h-2"></progress>
          <p
            className={`text-sm mt-1 ${strengthScore < 2
              ? 'text-red-500'
              : strengthScore === 2
                ? 'text-yellow-500'
                : 'text-green-500'
              }`}
          >
            Strength: {strengthLabel}
          </p>

          <div className="text-sm space-y-1 mt-2">
            {Object.entries(getPasswordRules(form.password)).map(([key, passed]) => (
              <p key={key} className={passed ? 'text-green-600' : 'text-red-500'}>
                {passed ? '✅' : '❌'}{' '}
                {{
                  length: 'At least 8 characters',
                  number: 'Includes a number',
                  symbol: 'Includes a symbol',
                  uppercase: 'Includes an uppercase letter',
                }[key]}
              </p>
            ))}
          </div>
        </div>
      )}

      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded-md"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>

      <p className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}

export default Register;
