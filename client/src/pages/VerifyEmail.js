import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const ranOnce = useRef(false); // <-- prevents double execution

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    const verify = async () => {
      try {
        const res = await axios.get(`/api/auth/verify-email/${token}`);
        setMessage(res.data.msg || '🎉 Your email is now verified!');
        setStatus('success');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setMessage(err.response?.data?.msg || '❌ Email verification failed.');
        setStatus('error');
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {status === 'verifying' && <p>Verifying your email...</p>}
      {status === 'success' && (
        <>
          <h2>✅ {message}</h2>
          <p>Redirecting to login in 3 seconds...</p>
        </>
      )}
      {status === 'error' && (
        <>
          <h2>❌ {message}</h2>
          <button onClick={() => navigate('/')}>Back to Home</button>
        </>
      )}
    </div>
  );
}

export default VerifyEmail;
