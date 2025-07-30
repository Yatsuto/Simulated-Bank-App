import React, { useState } from 'react';
import axios from '../utils/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`/api/auth/reset-password/${token}`, { password });
      toast.success(res.data.msg || 'Password reset successful');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white max-w-sm mx-auto mt-10 p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Reset Password</h2>

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="w-full border p-2 rounded-md"
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
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
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
}

export default ResetPassword;
