import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h1>Welcome to the Bank App</h1>
      <p>Please login or register to continue.</p>
      <button onClick={() => navigate('/login')} style={{ marginRight: '1rem' }}>
        Login
      </button>
      <button onClick={() => navigate('/register')}>
        Register
      </button>
    </div>
  );
}

export default Home;
