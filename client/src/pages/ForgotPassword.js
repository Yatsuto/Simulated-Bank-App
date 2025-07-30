import React, { useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      toast.success(res.data.msg || 'Check your email for reset link');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white max-w-sm mx-auto mt-10 p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Forgot Password</h2>

      <input
        type="email"
        value={email}
        placeholder="Enter your email"
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full border p-2 rounded-md"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Sending reset link...' : 'Send Reset Link'}
      </button>

      <p className="text-sm text-center">
        Remembered your password?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}

export default ForgotPassword;
