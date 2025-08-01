import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Transfer from './pages/Transfer';
import Transactions from './pages/Transactions';
import PrivateRoute from './utils/PrivateRoute';
import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/deposit" element={<PrivateRoute><Deposit /></PrivateRoute>} />
          <Route path="/withdraw" element={<PrivateRoute><Withdraw /></PrivateRoute>} />
          <Route path="/transfer" element={<PrivateRoute><Transfer /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
