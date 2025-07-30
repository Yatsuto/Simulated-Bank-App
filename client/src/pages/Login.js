import React, { useState } from 'react';
import axios from '../utils/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post('/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      toast.success('Login successful!');
      setForm({ email: '', password: '' });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white max-w-sm mx-auto mt-10 p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Welcome Back</h2>

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

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-center text-sm">
        Don’t have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}

export default Login;
