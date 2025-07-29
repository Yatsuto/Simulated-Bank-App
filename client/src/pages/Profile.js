import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Profile() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const updateProfile = async e => {
    e.preventDefault();
    try {
      const res = await axios.put(
        'http://localhost:5000/api/bank/update',
        { name, password },
        { headers: { 'x-auth-token': token } }
      );
      toast.success(res.data.msg || 'Profile updated');
      setName('');
      setPassword('');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Update failed');
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    try {
      await axios.delete('http://localhost:5000/api/bank/delete', {
        headers: { 'x-auth-token': token },
      });
      toast.success('Account deleted');
      localStorage.removeItem('token');
      navigate('/register');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <h2>Profile Settings</h2>
      <form onSubmit={updateProfile}>
        <input
          type="text"
          placeholder="New name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Update Profile</button>
      </form>

      <button onClick={deleteAccount} style={{ marginTop: '1rem', color: 'red' }}>
        Delete My Account
      </button>

    </div>
  );
}

export default Profile;
