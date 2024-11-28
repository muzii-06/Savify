import React, { useState } from 'react';
import { sellerLogin, sellerRequestOtp } from '../services/authService'; // Add sellerRequestOtp

import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import savifylogo from './Savify logo.png';
import './Auth.css';

const SellerLogin = ({ onAuthChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await sellerRequestOtp({ email });
      alert(response.data.message);
      setOtpSent(true); // Show OTP input field
    } catch (error) {
      alert(`Error requesting OTP: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sellerLogin({ email, password, verificationCode });
      if (response?.data?.token) {
        localStorage.setItem('sellerToken', response.data.token);
        localStorage.setItem('storeName', response.data.storeName);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('sellerImage', response.data.storeImage);

        onAuthChange();
        navigate('/dashboard', { replace: true });
      } else {
        alert('Login Failed: Invalid response');
      }
    } catch (error) {
      alert(`Login Failed: ${error.response?.data?.message || 'Server error'}`);
    }
  };

  return (
    <div className="wrap">
     
      <div className="auth-container">
        <h2>Seller Login</h2>
        <form onSubmit={otpSent ? handleSubmit : handleRequestOtp}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {otpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          )}
          <button type="submit">{otpSent ? 'Login' : 'Request OTP'}</button>
        </form>
        <button onClick={() => navigate('/login')} className="seller-dashboard-button">
          Buyer Account
        </button>
        <Link to="/seller-signup" className="auth-link">
          Don't have a seller account? Sign up
        </Link>
      </div>
      <img className="m-auto d-block" width={'50%'}  src={savifylogo} alt="Logo" />
    </div>
  );
};

export default SellerLogin;
