import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import zxcvbn from 'zxcvbn';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('Weak');
  const navigate = useNavigate();

  const isValidPassword = password => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(password);
  };

  const getPasswordRules = password => ({
    length: password.length >= 8,
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
    uppercase: /[A-Z]/.test(password),
  });

  const handleSubmit = async e => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!isValidPassword(password)) {
      toast.error('Password must be at least 8 characters long and include at least one number, one uppercase letter, and one special character.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`, {
        password,
      });

      toast.success(res.data.msg || 'Password reset successful');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = e => {
    const val = e.target.value;
    setPassword(val);

    const result = zxcvbn(val);
    const score = result.score;
    const label = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'][score];
    setStrengthScore(score);
    setStrengthLabel(label);
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
        onChange={handlePasswordChange}
        required
        className="w-full border p-2 rounded-md"
      />

      {password && (
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

          {/* ✅ Rule checklist */}
          <div className="text-sm space-y-1 mt-2">
            {Object.entries(getPasswordRules(password)).map(([key, passed]) => (
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
        className={`w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
}

export default ResetPassword;
